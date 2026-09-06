import React from 'react';
import { Parcel } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { ProjectCorridor } from '../../types/project';
import { Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SanctionOrderModalProps {
  parcel: Parcel;
  project: ProjectCorridor;
  officer: Officer;
  onClose: () => void;
}

export const SanctionOrderModal: React.FC<SanctionOrderModalProps> = ({
  parcel,
  project,
  officer,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <ShieldCheck size={16} />
            Official Statutory Sanction Decree Preview &bull; Section 3G
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-light text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer size={13} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-sm font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Official Government Document */}
        <div className="p-8 space-y-6 text-slate-900 font-serif max-h-[80vh] overflow-y-auto print:p-0 print:max-h-none">
          {/* Official Emblem & Header */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-700">
              GOVERNMENT OF BIHAR &bull; REVENUE & LAND REFORMS DEPARTMENT
            </div>
            <div className="text-sm font-sans font-bold text-slate-800">
              OFFICE OF THE COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
            </div>
            <div className="text-xs font-sans text-slate-600">
              Sub-Divisional Officer / Additional Collector &bull; Patna District
            </div>
            <h1 className="text-base font-bold uppercase tracking-wide pt-2 underline">
              FORM 7: FORMAL AWARD & SANCTION OF COMPENSATION UNDER SECTION 3G
            </h1>
            <div className="text-[11px] font-sans text-slate-500 font-mono">
              Order No: CALA/PAT/PRR-PH2/3G/2026-{parcel.khasraNo.replace('/', '-')} &bull; Date: {todayStr}
            </div>
          </div>

          {/* Recital */}
          <div className="text-xs leading-relaxed text-slate-800 text-justify space-y-3 font-sans">
            <p>
              WHEREAS, in exercise of the powers conferred by Section 3A of the National Highways Act, 1956 (48 of 1956), the Central Government caused a notification to be published in the Gazette of India declaring its intention to acquire the land specified in the Schedule below for the public purpose of building, maintenance, and expansion of <strong>{project.name}</strong>;
            </p>
            <p>
              AND WHEREAS, the declaration of acquisition under Section 3D has been published, and the land specified below has vested absolutely in the Central Government free from all encumbrances;
            </p>
            <p>
              NOW THEREFORE, I, <strong>{officer.name}</strong>, Competent Authority for Land Acquisition, having duly conducted the inquiry and determined compensation in accordance with the First Schedule of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act, 2013), do hereby make and pronounce the Award as follows:
            </p>
          </div>

          {/* Land Schedule Table */}
          <div className="border border-slate-800 text-xs font-sans">
            <div className="bg-slate-100 p-2 font-bold border-b border-slate-800 text-center uppercase tracking-wider">
              Schedule of Acquired Land & Valuation
            </div>
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50 w-1/3">1. Revenue Village / Tehsil</td>
                  <td className="p-2">{parcel.village}, Tehsil {parcel.tehsil}, District Patna</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">2. Cadastral Survey / Khasra No</td>
                  <td className="p-2 font-mono font-bold">{parcel.khasraNo} (Khata No: {parcel.khataNo})</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">3. Recorded Raiyat / Title Holder</td>
                  <td className="p-2 font-bold">{parcel.primaryOwnerName}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">4. Area Acquired for RoW</td>
                  <td className="p-2 font-mono">{parcel.acquisitionAreaHectares} Hectares ({parcel.acquisitionAreaSqM.toLocaleString()} sq.m)</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">5. Base Land Value (Circle Rate × Multiplier)</td>
                  <td className="p-2 font-mono">₹{parcel.compensation.baseLandValue.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">6. 100% Solatium (RFCTLARR Sec 30(1))</td>
                  <td className="p-2 font-mono font-semibold">₹{parcel.compensation.solatium100Percent.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">7. Additional Statutory Interest (12% p.a.)</td>
                  <td className="p-2 font-mono">₹{parcel.compensation.additionalInterest12Percent.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-semibold bg-slate-50">8. Structure & Standing Trees Value</td>
                  <td className="p-2 font-mono">₹{(parcel.compensation.structureValuation + parcel.compensation.treesAndCropValuation).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="p-2.5 text-sm uppercase">Total Compensation Sanctioned</td>
                  <td className="p-2.5 text-sm font-mono text-emerald-800">
                    ₹{parcel.compensation.totalAwardAmount.toLocaleString('en-IN')}
                    <span className="block text-xs font-normal text-slate-600">
                      (Rupees {(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Crores only)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Directive & Bank Escrow Statement */}
          <div className="text-xs leading-relaxed text-slate-800 text-justify space-y-2 font-sans">
            <p>
              It is directed that the aforesaid sum of <strong>₹{parcel.compensation.totalAwardAmount.toLocaleString('en-IN')}</strong> be deposited in the Competent Authority Escrow Account at State Bank of India, Patna Collectorate Branch, and disbursed directly to the verified bank account of the Raiyat under Section 3H(1) via Public Financial Management System (PFMS).
            </p>
            <p>
              Possession of the aforementioned land shall be taken by NHAI under Section 3E upon deposit of compensation.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-8 flex items-end justify-between text-xs font-sans">
            <div className="space-y-1">
              <div className="w-20 h-20 border-2 border-slate-300 flex items-center justify-center p-1 bg-slate-50 font-mono text-[9px] text-center text-slate-500">
                [QR Verify Hash: SHA256:{parcel.id.slice(-6)}]
              </div>
              <span className="text-[10px] text-slate-500 block">Digitally Certified by BhuNetra GovTech</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-800 pb-1 font-bold text-slate-900 font-sans">
                {officer.name}
              </div>
              <div className="font-semibold text-slate-700">Competent Authority for Land Acquisition (CALA)</div>
              <div className="text-[11px] text-slate-500">Additional Collector / SDM, Patna</div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 size={12} /> DSC Signature Validated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
