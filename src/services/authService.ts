import { User, UserRole, NavModuleId, AuthSession } from '../types/auth';
import { mockUsers } from '../data/mockUsers';

const AUTH_STORAGE_KEY = 'BHUNETRA_AUTH_SESSION';
const DEFAULT_SESSION_DURATION = 1800; // 30 minutes

class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        // Check if session has expired
        const elapsed = (Date.now() - new Date(session.loginTime).getTime()) / 1000;
        if (elapsed < session.expiresInSeconds) {
          this.currentSession = session;
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          this.currentSession = null;
        }
      }
    } catch {
      this.currentSession = null;
    }
  }

  private saveSession(session: AuthSession) {
    this.currentSession = session;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session to localStorage', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const user = this.getCurrentUser();
    this.listeners.forEach(l => l(user));
  }

  public getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public async loginWithCredentials(
    officerIdOrEmail: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Artificial delay for authentic GovTech feel
    await new Promise(res => setTimeout(res, 400));

    const trimmed = officerIdOrEmail.trim().toLowerCase();
    const user = mockUsers.find(
      u => u.email.toLowerCase() === trimmed || u.officerId.toLowerCase() === trimmed
    );

    if (!user) {
      // Default to National Admin if generic demo test
      const fallback = mockUsers[0];
      const session: AuthSession = {
        token: `NIC-GOV-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        user: fallback,
        loginTime: new Date().toISOString(),
        expiresInSeconds: DEFAULT_SESSION_DURATION,
        encryptionStandard: 'AES-256-GCM / NICNET TLS 1.3'
      };
      this.saveSession(session);
      return { success: true, user: fallback };
    }

    const session: AuthSession = {
      token: `NIC-GOV-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      user: {
        ...user,
        lastLogin: {
          timestamp: 'Just now (Verified Session)',
          ipAddress: user.lastLogin.ipAddress,
          network: user.lastLogin.network,
          authMethod: 'PASSWORD'
        }
      },
      loginTime: new Date().toISOString(),
      expiresInSeconds: DEFAULT_SESSION_DURATION,
      encryptionStandard: 'AES-256-GCM / NICNET TLS 1.3'
    };

    this.saveSession(session);
    return { success: true, user: session.user };
  }

  public async loginWithDemoRole(role: UserRole): Promise<User> {
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    const session: AuthSession = {
      token: `NIC-DEMO-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      user: {
        ...user,
        lastLogin: {
          timestamp: 'Just now (Demo Mode)',
          ipAddress: user.lastLogin.ipAddress,
          network: user.lastLogin.network,
          authMethod: 'DEMO_TOKEN'
        }
      },
      loginTime: new Date().toISOString(),
      expiresInSeconds: DEFAULT_SESSION_DURATION,
      encryptionStandard: 'AES-256-GCM / NICNET TLS 1.3'
    };

    this.saveSession(session);
    return session.user;
  }

  public async loginWithDemoUser(userId: string): Promise<User> {
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    const session: AuthSession = {
      token: `NIC-DEMO-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      user: {
        ...user,
        lastLogin: {
          timestamp: 'Just now (Verified Session)',
          ipAddress: user.lastLogin.ipAddress,
          network: user.lastLogin.network,
          authMethod: 'DEMO_TOKEN'
        }
      },
      loginTime: new Date().toISOString(),
      expiresInSeconds: DEFAULT_SESSION_DURATION,
      encryptionStandard: 'AES-256-GCM / NICNET TLS 1.3'
    };

    this.saveSession(session);
    return session.user;
  }

  public async loginWithSSO(provider: 'JAN_PARICHAY'): Promise<User> {
    // Simulated Jan Parichay (MeriPehchan) National SSO
    const user = mockUsers[0]; // National Admin
    const session: AuthSession = {
      token: `MERIPEHCHAN-SAML-${Date.now()}-AUTH`,
      user: {
        ...user,
        lastLogin: {
          timestamp: 'Just now (Jan Parichay SSO)',
          ipAddress: '10.24.1.1',
          network: 'National Single Sign-On Gateway (MeriPehchan)',
          authMethod: 'JAN_PARICHAY_SSO'
        }
      },
      loginTime: new Date().toISOString(),
      expiresInSeconds: DEFAULT_SESSION_DURATION,
      encryptionStandard: 'SHA-512 / XML-DSig National SAML 2.0'
    };

    this.saveSession(session);
    return session.user;
  }

  public logout(): void {
    this.currentSession = null;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
    this.notifyListeners();
  }

  public hasAccess(moduleId: NavModuleId, user?: User | null): boolean {
    const activeUser = user !== undefined ? user : this.getCurrentUser();
    if (!activeUser) return false;
    return activeUser.allowedModules.includes(moduleId);
  }

  public renewSession(): void {
    if (this.currentSession) {
      this.currentSession.loginTime = new Date().toISOString();
      this.saveSession(this.currentSession);
    }
  }

  public getAllDemoUsers(): User[] {
    return [...mockUsers];
  }
}

export const authService = new AuthService();
