export type OfficerRole = 'CALA' | 'NHAI_PD' | 'AMIN' | 'DM';

export interface Officer {
  id: string;
  name: string;
  designation: string;
  cadre: string;
  department: string;
  jurisdiction: string;
  role: OfficerRole;
  avatarInitials: string;
  badgeColor: string;
  activeProjectIds: string[];
}
