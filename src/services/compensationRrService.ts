import { 
  BeneficiaryRecord, 
  FamilyRrRecord, 
  DistrictRrAnalytics, 
  ProjectRrAnalytics, 
  CompensationRrAlert,
  CompensationKpis,
  RrKpis,
  CompensationWorkflowStep
} from '../types/compensationRr';
import { 
  mockBeneficiaries, 
  mockFamilyRrs, 
  mockDistrictAnalytics, 
  mockProjectAnalytics 
} from '../data/mockCompensationRr';
import { parcelService } from './parcelService';

class CompensationRrService {
  private beneficiaries: BeneficiaryRecord[] = [...mockBeneficiaries];
  private families: FamilyRrRecord[] = [...mockFamilyRrs];
  private districtAnalytics: DistrictRrAnalytics[] = [...mockDistrictAnalytics];
  private projectAnalytics: ProjectRrAnalytics[] = [...mockProjectAnalytics];

  // Get all beneficiaries (optional filter by project or district)
  public getBeneficiaries(projectId?: string, district?: string): BeneficiaryRecord[] {
    return this.beneficiaries.filter(b => {
      if (projectId && b.projectId !== projectId) return false;
      if (district && district !== 'ALL' && b.district !== district) return false;
      return true;
    });
  }

  // Get all families (optional filter by project or district)
  public getFamilies(projectId?: string, district?: string): FamilyRrRecord[] {
    return this.families.filter(f => {
      if (projectId && f.projectId !== projectId) return false;
      if (district && district !== 'ALL' && f.district !== district) return false;
      return true;
    });
  }

  // Calculate Compensation KPIs
  public getCompensationKpis(projectId?: string, district?: string): CompensationKpis {
    const list = this.getBeneficiaries(projectId, district);

    const totalAssessed = list.reduce((acc, item) => acc + item.assessedAmount, 0);
    const totalApproved = list.reduce((acc, item) => acc + item.approvedAmount, 0);
    const totalDisbursed = list.reduce((acc, item) => acc + item.disbursedAmount, 0);
    const totalPending = list.reduce((acc, item) => acc + item.pendingAmount, 0);

    const totalBeneficiaries = list.length;
    const paidBeneficiaries = list.filter(b => b.status === 'PAID').length;
    const pendingBeneficiaries = list.filter(b => b.status === 'PENDING').length;
    const delayedBeneficiaries = list.filter(b => b.status === 'DELAYED').length;

    return {
      totalAssessed,
      totalApproved,
      totalDisbursed,
      totalPending,
      totalBeneficiaries,
      paidBeneficiaries,
      pendingBeneficiaries,
      delayedBeneficiaries
    };
  }

  // Calculate R&R KPIs
  public getRrKpis(projectId?: string, district?: string): RrKpis {
    const list = this.getFamilies(projectId, district);

    const affectedFamilies = list.length;
    const displacedFamilies = list.filter(f => f.isDisplaced).length;
    const rrEligible = list.filter(f => f.rrStatus !== 'NOT_APPLICABLE').length;
    const rrCompleted = list.filter(f => f.rrStatus === 'COMPLETED').length;
    const rrPending = list.filter(f => f.rrStatus !== 'COMPLETED' && f.rrStatus !== 'NOT_APPLICABLE').length;
    
    const progressPercentage = rrEligible > 0 ? Math.round((rrCompleted / rrEligible) * 100) : 0;

    return {
      affectedFamilies,
      displacedFamilies,
      rrEligible,
      rrCompleted,
      rrPending,
      progressPercentage
    };
  }

  // Advance Compensation Workflow (Assessment -> Approval -> Disbursement -> Confirmation)
  public async advanceWorkflowStep(
    beneficiaryId: string, 
    targetStep: CompensationWorkflowStep,
    officerName: string = 'CALA'
  ): Promise<BeneficiaryRecord> {
    const index = this.beneficiaries.findIndex(b => b.id === beneficiaryId);
    if (index === -1) throw new Error(`Beneficiary not found: ${beneficiaryId}`);

    const item = { ...this.beneficiaries[index] };

    if (targetStep === 'APPROVAL') {
      item.approvedAmount = item.assessedAmount;
      item.workflowStep = 'DISBURSEMENT';
      item.status = 'PENDING';
      item.awardDate = new Date().toISOString().split('T')[0];
      try {
        await parcelService.sanctionCompensation(item.parcelId, officerName);
      } catch (e) {
        console.warn('Parcel not found in active project cache, proceeding with synthetic state', e);
      }
    } else if (targetStep === 'DISBURSEMENT') {
      item.disbursedAmount = item.approvedAmount || item.assessedAmount;
      item.pendingAmount = 0;
      item.workflowStep = 'CONFIRMATION';
      item.status = 'PAID';
      item.utrReference = `PFMS-BR-${Date.now().toString().slice(-8)}`;
      item.disbursementDate = new Date().toISOString().split('T')[0];
      item.delayDays = 0;
      try {
        await parcelService.disburseDirectBenefit(item.parcelId, officerName);
      } catch (e) {
        console.warn('Parcel not found in active project cache, proceeding with synthetic state', e);
      }
    } else if (targetStep === 'CONFIRMATION') {
      item.workflowStep = 'CONFIRMATION';
      item.status = 'PAID';
    }

    this.beneficiaries[index] = item;
    return item;
  }

  // Allot Homestead Plot for Displaced Family
  public allotHomesteadPlot(familyId: string, plotNo: string, colony: string): FamilyRrRecord {
    const index = this.families.findIndex(f => f.id === familyId);
    if (index === -1) throw new Error(`Family record not found: ${familyId}`);

    const fam = { ...this.families[index] };
    fam.homesteadPlotAllotted = true;
    fam.homesteadPlotNo = plotNo;
    fam.resettlementColony = colony;
    fam.pendingAction = 'Disburse second tranche of subsistence allowance';
    fam.rrStatus = 'IN_PROGRESS';
    this.families[index] = fam;
    return fam;
  }

  // Disburse Subsistence Allowance
  public disburseSubsistence(familyId: string, monthsToAdd: number): FamilyRrRecord {
    const index = this.families.findIndex(f => f.id === familyId);
    if (index === -1) throw new Error(`Family record not found: ${familyId}`);

    const fam = { ...this.families[index] };
    fam.subsistencePaidMonths = Math.min(12, fam.subsistencePaidMonths + monthsToAdd);
    if (fam.subsistencePaidMonths >= 12 && (!fam.isDisplaced || fam.homesteadPlotAllotted)) {
      fam.rrStatus = 'COMPLETED';
      fam.pendingAction = 'All R&R entitlements fulfilled & certified';
    } else {
      fam.pendingAction = `Disbursed ${fam.subsistencePaidMonths}/12 months subsistence allowance`;
    }
    this.families[index] = fam;
    return fam;
  }

  // Verify Gram Sabha Status
  public verifyFamilyStatus(familyId: string, status: 'VERIFIED' | 'REJECTED'): FamilyRrRecord {
    const index = this.families.findIndex(f => f.id === familyId);
    if (index === -1) throw new Error(`Family record not found: ${familyId}`);

    const fam = { ...this.families[index] };
    fam.verification = status;
    if (status === 'VERIFIED') {
      fam.pendingAction = fam.isDisplaced ? 'Allot Homestead Plot at Resettlement Colony' : 'Issue R&R Entitlement Card';
      fam.rrStatus = 'IN_PROGRESS';
    } else {
      fam.pendingAction = 'Objection raised during Gram Sabha scrutiny';
      fam.rrStatus = 'NOT_APPLICABLE';
    }
    this.families[index] = fam;
    return fam;
  }

  // Get District Analytics
  public getDistrictAnalytics(): DistrictRrAnalytics[] {
    return this.districtAnalytics;
  }

  // Get Project Analytics
  public getProjectAnalytics(): ProjectRrAnalytics[] {
    return this.projectAnalytics;
  }

  // Get Categorized Alerts (linking back to parcel & project)
  public getAlerts(projectId?: string, district?: string): CompensationRrAlert[] {
    const beneficiaries = this.getBeneficiaries(projectId, district);
    const families = this.getFamilies(projectId, district);
    const alerts: CompensationRrAlert[] = [];

    // 1. COMPENSATION_PENDING Alerts
    beneficiaries
      .filter(b => b.status === 'PENDING' && b.workflowStep === 'APPROVAL')
      .forEach(b => {
        alerts.push({
          id: `alt-comp-pen-${b.id}`,
          type: 'COMPENSATION_PENDING',
          title: `Section 3G Sanction Awaiting: Khasra ${b.khasraNo}`,
          description: `Assessment complete for ₹${(b.assessedAmount / 10000000).toFixed(2)} Cr. CALA statutory sanction pending.`,
          parcelId: b.parcelId,
          khasraNo: b.khasraNo,
          projectId: b.projectId,
          projectName: b.projectName,
          district: b.district,
          amount: b.assessedAmount,
          severity: 'HIGH',
          timestamp: '2 hours ago',
          suggestedAction: 'Execute CALA Sanction Order'
        });
      });

    // 2. COMPENSATION_DELAYED Alerts
    beneficiaries
      .filter(b => b.status === 'DELAYED')
      .forEach(b => {
        alerts.push({
          id: `alt-comp-del-${b.id}`,
          type: 'COMPENSATION_DELAYED',
          title: `Disbursement Delayed (${b.delayDays || 30} days): Khasra ${b.khasraNo}`,
          description: `Sanctioned amount ₹${(b.approvedAmount / 10000000).toFixed(2)} Cr awaiting PFMS bank transfer for over a month.`,
          parcelId: b.parcelId,
          khasraNo: b.khasraNo,
          projectId: b.projectId,
          projectName: b.projectName,
          district: b.district,
          amount: b.approvedAmount,
          daysOverdue: b.delayDays || 30,
          severity: 'CRITICAL',
          timestamp: '1 day ago',
          suggestedAction: 'Expedite SBI Escrow PFMS Electronic Transfer'
        });
      });

    // 3. RR_PENDING Alerts
    families
      .filter(f => f.isDisplaced && !f.homesteadPlotAllotted)
      .forEach(f => {
        alerts.push({
          id: `alt-rr-pen-${f.id}`,
          type: 'RR_PENDING',
          title: `Displaced Family Alternate Homestead Pending: Khasra ${f.khasraNo}`,
          description: `Displaced family (${f.headOfFamily}, ${f.affectedPersonsCount} persons) requires 50 Sq.m homestead plot allotment under RFCTLARR Schedule II.`,
          parcelId: f.parcelId,
          khasraNo: f.khasraNo,
          projectId: f.projectId,
          projectName: f.projectName,
          district: f.district,
          severity: 'HIGH',
          timestamp: '3 hours ago',
          suggestedAction: 'Allot Plot at Model Resettlement Colony'
        });
      });

    // 4. VERIFICATION_PENDING Alerts
    families
      .filter(f => f.verification === 'PENDING_HEARING')
      .forEach(f => {
        alerts.push({
          id: `alt-ver-pen-${f.id}`,
          type: 'VERIFICATION_PENDING',
          title: `Gram Sabha Verification Pending: Khasra ${f.khasraNo}`,
          description: `Affected family claim for ${f.headOfFamily} (${f.village}) pending Gram Sabha resolution & Amin joint survey validation.`,
          parcelId: f.parcelId,
          khasraNo: f.khasraNo,
          projectId: f.projectId,
          projectName: f.projectName,
          district: f.district,
          severity: 'MEDIUM',
          timestamp: 'Yesterday',
          suggestedAction: 'Convene Revenue Gram Sabha Hearing'
        });
      });

    return alerts;
  }
}

export const compensationRrService = new CompensationRrService();
