import { 
  AlertItem, 
  NotificationChannel, 
  SimulatedNotificationPayload, 
  AlertSeverity,
  AlertType
} from '../types/alertNotification';
import { mockAlerts } from '../data/mockAlerts';

// Extensible provider interface allowing future external notification APIs (e.g. CDAC SMS, AWS SES, Twilio)
export interface INotificationProvider {
  channel: NotificationChannel;
  send: (alert: AlertItem, recipient: string) => Promise<SimulatedNotificationPayload>;
}

class NotificationService {
  private alerts: AlertItem[] = [...mockAlerts];
  private listeners: (() => void)[] = [];
  private providers: Map<NotificationChannel, INotificationProvider> = new Map();

  constructor() {
    this.registerDefaultSimulatedProviders();
  }

  // Subscribe to changes (for TopBar bell badge & Alerts page sync)
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l());
  }

  public getAllAlerts(): AlertItem[] {
    return [...this.alerts];
  }

  public getUnreadCount(): number {
    return this.alerts.filter(a => a.state === 'UNREAD').length;
  }

  public getCriticalCount(): number {
    return this.alerts.filter(a => a.severity === 'CRITICAL' && a.state !== 'RESOLVED').length;
  }

  public markAsRead(id: string): void {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1 && this.alerts[index].state === 'UNREAD') {
      this.alerts[index] = { ...this.alerts[index], state: 'READ' };
      this.notifyListeners();
    }
  }

  public markAsUnread(id: string): void {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts[index] = { ...this.alerts[index], state: 'UNREAD' };
      this.notifyListeners();
    }
  }

  public markAsResolved(id: string, officerName: string = 'Authorized Revenue Officer'): void {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts[index] = { 
        ...this.alerts[index], 
        state: 'RESOLVED',
        resolvedAt: new Date().toLocaleString('en-IN'),
        resolvedBy: officerName
      };
      this.notifyListeners();
    }
  }

  public resolveAlertsForParcel(parcelId: string, alertType?: AlertType): void {
    let changed = false;
    this.alerts = this.alerts.map(a => {
      const matchParcel = a.parcelId === parcelId || a.khasraNo === parcelId || (parcelId.includes('125') && (a.parcelId?.includes('125') || a.khasraNo?.includes('125')));
      const matchType = !alertType || a.type === alertType;
      if (matchParcel && matchType && a.state !== 'RESOLVED') {
        changed = true;
        return {
          ...a,
          state: 'RESOLVED',
          resolvedAt: new Date().toLocaleString('en-IN'),
          resolvedBy: 'Amin & Field Survey Wing'
        };
      }
      // If updating corridor delay alert ALT-PRR-001
      if (a.id === 'ALT-PRR-001' && parcelId.includes('125')) {
        changed = true;
        return {
          ...a,
          predictedDelayDays: 24,
          reasons: a.reasons.map(r => r.includes('Field verification backlog') ? 'Field verification on K-125/2 completed & verified on ground' : r)
        };
      }
      return a;
    });

    if (changed) {
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.alerts = this.alerts.map(a => a.state === 'UNREAD' ? { ...a, state: 'READ' } : a);
    this.notifyListeners();
  }

  public registerProvider(channel: NotificationChannel, provider: INotificationProvider): void {
    this.providers.set(channel, provider);
  }

  public async dispatchNotification(
    channel: NotificationChannel, 
    alert: AlertItem, 
    recipient: string
  ): Promise<SimulatedNotificationPayload> {
    const provider = this.providers.get(channel);
    if (provider) {
      return await provider.send(alert, recipient);
    }

    return this.createSimulatedPayload(channel, alert, recipient);
  }

  private registerDefaultSimulatedProviders(): void {
    // 1. In-App Provider
    this.providers.set('IN_APP', {
      channel: 'IN_APP',
      send: async (alert, recipient) => this.createSimulatedPayload('IN_APP', alert, recipient)
    });

    // 2. Simulated Email Provider (e.g. ready for future SMTP / SendGrid / AWS SES)
    this.providers.set('EMAIL', {
      channel: 'EMAIL',
      send: async (alert, recipient) => this.createSimulatedPayload('EMAIL', alert, recipient)
    });

    // 3. Simulated SMS Provider (e.g. ready for future CDAC / NIC SMS Gateway)
    this.providers.set('SMS', {
      channel: 'SMS',
      send: async (alert, recipient) => this.createSimulatedPayload('SMS', alert, recipient)
    });
  }

  private createSimulatedPayload(
    channel: NotificationChannel, 
    alert: AlertItem, 
    recipient: string
  ): SimulatedNotificationPayload {
    const refId = `DISPATCH-${channel}-${Date.now()}`;
    const timestamp = new Date().toLocaleString('en-IN');

    if (channel === 'EMAIL') {
      return {
        channel: 'EMAIL',
        recipient,
        subject: `[BhuNetra Statutory Alert: ${alert.severity}] ${alert.title} - ${alert.projectId}`,
        content: `Official Statutory Notification Issued by BhuNetra Land Acquisition Platform.\n\nProject: ${alert.projectName} (${alert.projectId})\nParcel: ${alert.parcelId ? `Khasra ${alert.khasraNo} (${alert.parcelId})` : 'Corridor Wide'}\nSeverity: ${alert.severity}\nType: ${alert.type}\nDue Date: ${alert.dueDate}\n\nReasons:\n${alert.reasons.map(r => `• ${r}`).join('\n')}\n\nRecommended Action:\n${alert.recommendedAction}\n\nReference: ${refId} (National Informatics Centre)`,
        timestamp,
        deliveryStatus: 'SIMULATED',
        referenceId: refId
      };
    }

    if (channel === 'SMS') {
      return {
        channel: 'SMS',
        recipient,
        content: `Govt of Bihar / MoRTH: [${alert.severity}] Alert on ${alert.projectId}${alert.parcelId ? ` Plot ${alert.khasraNo}` : ''}. ${alert.title}. Action req: ${alert.recommendedAction.slice(0, 75)}... - BhuNetra`,
        timestamp,
        deliveryStatus: 'SIMULATED',
        referenceId: refId
      };
    }

    return {
      channel: 'IN_APP',
      recipient: 'All Corridor Officers',
      content: `[${alert.severity}] ${alert.title} - ${alert.recommendedAction}`,
      timestamp,
      deliveryStatus: 'SIMULATED',
      referenceId: refId
    };
  }
}

export const notificationService = new NotificationService();
