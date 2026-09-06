import React, { useState } from 'react';
import { Parcel, FieldVerificationRecord } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { 
  ClipboardCheck, 
  Camera, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Compass,
  FileSignature
} from 'lucide-react';

interface FieldVerificationModalProps {
  parcel: Parcel;
  currentOfficer: Officer;
  onClose: () => void;
  onSaveVerification: (parcelId: string, record: FieldVerificationRecord) => Promise<void>;
}

export const FieldVerificationModal: React.FC<FieldVerificationModalProps> = ({
  parcel,
  currentOfficer,
  onClose,
  onSaveVerification
}) => {
  const [aminName, setAminName] = useState<string>(
    currentOfficer.role === 'AMIN' ? currentOfficer.name : 'Amitabh Kumar (Senior Amin)'
  );
  const [aminBadgeNo, setAminBadgeNo] = useState<string>('REV-AMIN-8492');
  const [gpsLatitude, setGpsLatitude] = useState<number>(parcel.coordinates[0]);
  const [gpsLongitude, setGpsLongitude] = useState<number>(parcel.coordinates[1]);
  const [boundaryDeviation, setBoundaryDeviation] = useState<number>(0.8);

  const [selectedStructures, setSelectedStructures] = useState<string[]>([
    'Brick pump house with electric tube-well',
    'Northern boundary brick wall'
  ]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Wheat (Rabi Season)']);
  const [encroachmentDetected, setEncroachmentDetected] = useState<boolean>(false);
  const [encroachmentDetails, setEncroachmentDetails] = useState<string>('');
  const [officerRemarks, setOfficerRemarks] = useState<string>(
    'DGPS rover survey conducted in presence of Raiyat. Pegging marks fixed along 60m RoW boundary.'
  );
  const [simulatedPhotos, setSimulatedPhotos] = useState<Array<{ url: string; caption: string; compassHeading: string; timestamp: string }>>([
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      caption: 'Pegging point & ground boundary check',
      compassHeading: 'North 18° East',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const toggleStructure = (item: string) => {
    setSelectedStructures(prev => 
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const toggleCrop = (item: string) => {
    setSelectedCrops(prev => 
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleAddPhoto = () => {
    const dummyImages = [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ];
    const newPhoto = {
      url: dummyImages[simulatedPhotos.length % dummyImages.length],
      caption: `Field snapshot #${simulatedPhotos.length + 1} - Corridor Peg Inspection`,
      compassHeading: `Bearing ${(simulatedPhotos.length * 75 + 40) % 360}°`,
      timestamp: new Date().toLocaleTimeString()
    };
    setSimulatedPhotos([...simulatedPhotos, newPhoto]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const record: FieldVerificationRecord = {
      id: `fv-${Date.now()}`,
      inspectionDate: new Date().toISOString().split('T')[0],
      aminName,
      aminBadgeNo,
      gpsLatitude,
      gpsLongitude,
      boundaryDeviationMeters: boundaryDeviation,
      structuresFound: selectedStructures,
      standingCrops: selectedCrops,
      encroachmentDetected,
      encroachmentDetails: encroachmentDetected ? encroachmentDetails : undefined,
      photos: simulatedPhotos,
      officerRemarks,
      signatureVerified: true
    };

    try {
      await onSaveVerification(parcel.id, record);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gov-navy text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <ClipboardCheck size={16} />
              Amin Field Ground-Truth Verification Mode
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Field Inspection: Khasra {parcel.khasraNo} ({parcel.village})
            </h3>
            <p className="text-xs text-slate-300">
              Raiyat: {parcel.primaryOwnerName} &bull; Acq Area: {parcel.acquisitionAreaHectares} Ha
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 text-base font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* GPS Rover Accuracy Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin size={15} className="text-gov-navy" />
                Live DGPS Rover Sync (WGS84 Coordinates)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                DGPS Fixed (Accuracy ± 15mm)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Rover Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={gpsLatitude}
                  onChange={(e) => setGpsLatitude(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-medium focus:ring-1 focus:ring-gov-navy"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Rover Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={gpsLongitude}
                  onChange={(e) => setGpsLongitude(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-medium focus:ring-1 focus:ring-gov-navy"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Peg Deviation (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={boundaryDeviation}
                  onChange={(e) => setBoundaryDeviation(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-medium focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>
          </div>

          {/* Physical Inventory Checklist */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">
              Physical Structures Observed Within 60m RoW Buffer:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Brick pump house with electric tube-well',
                'Northern boundary brick wall',
                'Temporary GI sheet commercial shed',
                'Pakka residential dwelling',
                'Religious idol / chabutra',
                'Open irrigation borewell'
              ].map((item) => {
                const checked = selectedStructures.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleStructure(item)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      checked 
                        ? 'bg-blue-50 border-blue-300 text-gov-navy font-semibold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item}</span>
                    {checked && <CheckCircle2 size={14} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Encroachment Switch */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-amber-700" />
                  Flag Ground Encroachment or Unauthorized Construction?
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Triggers immediate AI risk escalation and Section 3E summary eviction notice
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEncroachmentDetected(!encroachmentDetected)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  encroachmentDetected ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  encroachmentDetected ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            {encroachmentDetected && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label className="text-slate-700 font-semibold block mb-1">
                  Encroachment Specifics & Ground Observation:
                </label>
                <textarea
                  rows={2}
                  value={encroachmentDetails}
                  onChange={(e) => setEncroachmentDetails(e.target.value)}
                  placeholder="e.g. Unauthorised tin shed constructed on northern boundary post-3A notification..."
                  className="w-full p-2 bg-white border border-red-300 rounded text-xs focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}
          </div>

          {/* Photographic Evidence Simulation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Camera size={15} className="text-gov-navy" />
                Geo-Tagged Photographic Evidence ({simulatedPhotos.length})
              </label>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700 flex items-center gap-1 text-[11px]"
              >
                + Capture / Upload Geo-Photo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {simulatedPhotos.map((p, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden flex items-center gap-2 p-2 bg-slate-50">
                  <img src={p.url} alt="Field photo" className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-800 block truncate">{p.caption}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{p.compassHeading} &bull; {p.timestamp}</span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle2 size={10} /> EXIF Geo-Tagged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amin Remarks & Digital Sign-off */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Field Surveyor Official Remarks:
            </label>
            <textarea
              rows={2}
              value={officerRemarks}
              onChange={(e) => setOfficerRemarks(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gov-navy"
            />
          </div>

          {/* Amin Signature Block */}
          <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-2">
              <FileSignature size={18} className="text-gov-navy" />
              <div>
                <span className="font-bold text-slate-900 block">{aminName}</span>
                <span className="text-[10px] text-slate-500">Badge: {aminBadgeNo} &bull; Circle Office Phulwari Sharif</span>
              </div>
            </div>
            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} /> Digital Token Attached
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white rounded-lg font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 size={15} className="text-amber-400" />
              {submitting ? 'Updating Parcel Digital Twin...' : 'Submit Field Verification Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
