/**
 * BhuNetra Unified Database Client
 * Bridges local client-side state with centralized Cloud PostgreSQL / Supabase
 */

export interface DatabaseConfig {
  cloudEnabled: boolean;
  provider: 'SUPABASE' | 'POSTGRES_REST' | 'LOCAL';
  endpointUrl?: string;
  apiKey?: string;
  connected: boolean;
}

class DatabaseClient {
  private config: DatabaseConfig;

  constructor() {
    const env = (import.meta as any).env || {};
    const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const apiUrl = env.VITE_API_URL;

    if (supabaseUrl && supabaseKey) {
      this.config = {
        cloudEnabled: true,
        provider: 'SUPABASE',
        endpointUrl: supabaseUrl,
        apiKey: supabaseKey,
        connected: true
      };
    } else if (apiUrl) {
      this.config = {
        cloudEnabled: true,
        provider: 'POSTGRES_REST',
        endpointUrl: apiUrl,
        connected: true
      };
    } else {
      this.config = {
        cloudEnabled: false,
        provider: 'LOCAL',
        connected: true
      };
    }
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  public isCloudConnected(): boolean {
    return this.config.cloudEnabled;
  }

  /**
   * Universal fetch method with fallback to local storage
   */
  public async query<T>(tableName: string, defaultData: T[]): Promise<T[]> {
    if (!this.config.cloudEnabled || !this.config.endpointUrl) {
      // Fallback: Read from LocalStorage or default mock
      try {
        const local = localStorage.getItem(`BHUNETRA_DB_${tableName.toUpperCase()}`);
        if (local) return JSON.parse(local);
      } catch (e) {
        console.warn(`Local database read error for ${tableName}:`, e);
      }
      return defaultData;
    }

    try {
      const key = this.config.apiKey || '';
      const response = await fetch(`${this.config.endpointUrl}/rest/v1/${tableName}?select=*`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      console.warn(`Cloud query failed for ${tableName}, falling back to local:`, err);
      return defaultData;
    }
  }

  /**
   * Persist record across local and cloud
   */
  public async upsert<T extends { id: string | number }>(tableName: string, record: T): Promise<void> {
    // 1. Always update local storage for zero-latency UI
    try {
      const key = `BHUNETRA_DB_${tableName.toUpperCase()}`;
      const existingStr = localStorage.getItem(key);
      let existing: T[] = existingStr ? JSON.parse(existingStr) : [];
      const index = existing.findIndex(item => item.id === record.id);
      if (index >= 0) {
        existing[index] = record;
      } else {
        existing.push(record);
      }
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn(`Failed local upsert for ${tableName}:`, e);
    }

    // 2. If cloud is connected, push to cloud
    if (this.config.cloudEnabled && this.config.endpointUrl) {
      try {
        const key = this.config.apiKey || '';
        await fetch(`${this.config.endpointUrl}/rest/v1/${tableName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
            'apikey': key,
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify(record)
        });
      } catch (err) {
        console.warn(`Cloud upsert sync delayed for ${tableName}:`, err);
      }
    }
  }
}

export const dbClient = new DatabaseClient();
