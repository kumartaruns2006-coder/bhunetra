import { Officer } from '../types/officer';

export const mockOfficers: Officer[] = [
  {
    id: 'off-cala-01',
    name: 'Shri Rajeshwar K. Verma, IAS',
    designation: 'Competent Authority for Land Acquisition (CALA) & Additional Collector',
    cadre: 'Bihar Administrative Service / IAS Joint Cadre',
    department: 'Revenue & Land Reforms Dept, Govt. of Bihar',
    jurisdiction: 'Patna Sadar, Phulwari Sharif & Danapur Sub-Divisions',
    role: 'CALA',
    avatarInitials: 'RV',
    badgeColor: 'bg-emerald-800',
    activeProjectIds: ['PRR-PH2-2026', 'NH119D-EXP']
  },
  {
    id: 'off-nhai-01',
    name: 'Er. Sunita Murthy',
    designation: 'Chief General Manager & Project Director',
    cadre: 'Central Engineering Services (Roads)',
    department: 'National Highways Authority of India (NHAI), PIU Patna',
    jurisdiction: 'Bihar Regional Corridor Division',
    role: 'NHAI_PD',
    avatarInitials: 'SM',
    badgeColor: 'bg-blue-900',
    activeProjectIds: ['PRR-PH2-2026', 'NH119D-EXP']
  },
  {
    id: 'off-amin-01',
    name: 'Amitabh Kumar',
    designation: 'Senior Cadastral Surveyor / Circle Amin',
    cadre: 'Revenue Directorate Field Service',
    department: 'Circle Office, Phulwari Sharif & Kanhauli Sector',
    jurisdiction: 'Villages: Kanhauli, Danapur, Bihta, Naubatpur',
    role: 'AMIN',
    avatarInitials: 'AK',
    badgeColor: 'bg-amber-700',
    activeProjectIds: ['PRR-PH2-2026']
  },
  {
    id: 'off-dm-01',
    name: 'Dr. Anand Kishore, IAS',
    designation: 'District Magistrate & Collector',
    cadre: 'Indian Administrative Service (IAS)',
    department: 'Collectorate & District Administration, Patna',
    jurisdiction: 'Patna District, Bihar',
    role: 'DM',
    avatarInitials: 'AK',
    badgeColor: 'bg-slate-900',
    activeProjectIds: ['PRR-PH2-2026', 'NH119D-EXP']
  }
];
