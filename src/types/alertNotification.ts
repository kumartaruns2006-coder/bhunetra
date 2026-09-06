export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export type AlertType = 
  | 'PENDING_APPROVAL'
  | 'DELAYED_CASE'
  | 'TIMELINE_RISK'
  | 'COMPENSATION_PENDING'
  | 'RR_PENDING'
  | 'MISSING_DOCUMENT'
  | 'FIELD_VERIFICATION_PENDING'
  | 'MILESTONE_DUE'
  | 'DATA_CONFLICT'
  | 'HIGH_RISK_PARCEL'
  | 'HIGH_RISK_PROJECT';

export type NotificationState = 'UNREAD' | 'READ' | 'RESOLVED';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  type: AlertType;
  projectId: string;
  projectName: string;
  parcelId?: string;
  khasraNo?: string;
  village?: string;
  district?: string;
  createdAt: string;
  dueDate: string;
  predictedDelayDays?: number;
  reasons: string[];
  recommendedAction: string;
  state: NotificationState;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SimulatedNotificationPayload {
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  content: string;
  timestamp: string;
  deliveryStatus: 'QUEUED' | 'SENT' | 'SIMULATED';
  referenceId: string;
}
