import React, { useState } from 'react';
import { AlertItem, NotificationChannel, SimulatedNotificationPayload } from '../../types/alertNotification';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../ui/Toast';
import { 
  Mail, 
  Smartphone, 
  Bell, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  Lock
} from 'lucide-react';

interface SimulatedDispatchModalProps {
  alert: AlertItem;
  initialChannel?: NotificationChannel;
  onClose: () => void;
}

export const SimulatedDispatchModal: React.FC<SimulatedDispatchModalProps> = ({
  alert,
  initialChannel = 'EMAIL',
  onClose
}) => {
  const { showToast } = useToast();
  const [activeChannel, setActiveChannel] = useState<NotificationChannel>(initialChannel);
  const [emailRecipient, setEmailRecipient] = useState<string>('cala.patna@bihar.gov.in');
  const [smsRecipient, setSmsRecipient] = useState<string>('+91 94310 88421');
  const [dispatchResult, setDispatchResult] = useState<SimulatedNotificationPayload | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendDispatch = async () => {
    setIsSending(true);
    const target = activeChannel === 'EMAIL' ? emailRecipient : smsRecipient;

    try {
      const result = await notificationService.dispatchNotification(activeChannel, alert, target);
      setDispatchResult(result);
      showToast({
        title: `Simulated ${activeChannel} Dispatched`,
        message: `Notification logged with ref ${result.referenceId}. No real SMS/Email sent.`,
        type: 'success'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col my-auto font-sans">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <ShieldCheck size={14} />
              Simulated Multi-Channel Notification Dispatcher
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Dispatch Alert: {alert.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Testing sandbox for statutory automated alerts (API architecture ready)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => { setActiveChannel('EMAIL'); setDispatchResult(null); }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeChannel === 'EMAIL'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail size={14} className={activeChannel === 'EMAIL' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Email Notification</span>
          </button>

          <button
            onClick={() => { setActiveChannel('SMS'); setDispatchResult(null); }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeChannel === 'SMS'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone size={14} className={activeChannel === 'SMS' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>SMS Notification (DLT)</span>
          </button>

          <button
            onClick={() => { setActiveChannel('IN_APP'); setDispatchResult(null); }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeChannel === 'IN_APP'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell size={14} className={activeChannel === 'IN_APP' ? 'text-purple-600' : 'text-slate-400'} />
            <span>In-App Broadcast</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* EMAIL CHANNEL VIEW */}
          {activeChannel === 'EMAIL' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 w-24">Recipient Email:</span>
                <input
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              {/* Simulated Government Official Email Preview */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-slate-50">
                <div className="bg-slate-900 text-white p-3 flex items-center justify-between text-xs border-b border-slate-800">
                  <div className="font-bold tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    NIC GOVERNMENT MAIL ENGINE &bull; BHUNETRA
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ENCRYPTED (TLS 1.3)</span>
                </div>

                <div className="p-4 bg-white text-slate-800 text-xs space-y-3 font-sans">
                  <div className="border-b border-slate-100 pb-2">
                    <div className="text-[11px] text-slate-500">From: <strong className="text-slate-700">alerts-noreply@bhunetra.gov.in</strong></div>
                    <div className="text-[11px] text-slate-500">Subject: <strong className="text-slate-900">[{alert.severity}] {alert.title} &bull; {alert.projectId}</strong></div>
                  </div>

                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold">
                    Statutory Notice: Immediate Administrative Action Required before {alert.dueDate}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div><strong>Project:</strong> {alert.projectName} ({alert.projectId})</div>
                    {alert.parcelId && <div><strong>Parcel:</strong> Khasra {alert.khasraNo} ({alert.parcelId}), Village {alert.village}</div>}
                    <div><strong>Alert Severity:</strong> <span className="font-bold text-rose-700">{alert.severity}</span></div>
                  </div>

                  <div>
                    <strong className="text-xs text-slate-900 block mb-1">Detected Root Causes:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {alert.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-slate-100 rounded-lg text-[11px]">
                    <strong>Recommended Statutory Action:</strong>
                    <div className="text-slate-800 mt-0.5">{alert.recommendedAction}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Digital Seal: MoRTH-BHUNETRA-SEC-9</span>
                    <span>No personal data transmitted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SMS CHANNEL VIEW */}
          {activeChannel === 'SMS' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 w-24">Mobile Number:</span>
                <input
                  type="text"
                  value={smsRecipient}
                  onChange={(e) => setSmsRecipient(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Simulated Mobile Device Preview */}
              <div className="w-72 sm:w-80 mx-auto bg-slate-900 p-3 rounded-3xl shadow-xl border-4 border-slate-800 text-white">
                <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3"></div>
                <div className="text-center text-[10px] text-slate-400 font-bold tracking-wider mb-2">
                  SENDER: VK-BHUNTR (TRAI DLT)
                </div>

                <div className="bg-slate-800/90 p-3 rounded-2xl text-slate-100 text-[11px] leading-relaxed font-sans shadow-inner border border-slate-700">
                  <span className="font-bold text-amber-300">[Govt of Bihar / MoRTH]</span> Alert on {alert.projectId}{alert.parcelId ? ` Plot ${alert.khasraNo}` : ''}. {alert.title}. Action: {alert.recommendedAction.slice(0, 65)}... Ref: #REV{Date.now().toString().slice(-4)} - BhuNetra
                  <div className="text-right text-[9px] text-slate-400 mt-1.5 font-mono">
                    Just now &bull; Delivered
                  </div>
                </div>

                <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-4"></div>
              </div>
            </div>
          )}

          {/* IN-APP CHANNEL VIEW */}
          {activeChannel === 'IN_APP' && (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Bell size={15} /> Real-Time In-App Alert Broadcast
                </div>
                <p className="text-purple-900">
                  Broadcasts immediate high-priority banner and badge to all logged-in officers assigned to corridor {alert.projectId}.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs text-xs space-y-1">
                <div className="text-slate-500 font-semibold">Broadcast Payload:</div>
                <div className="font-bold text-slate-900">[{alert.severity}] {alert.title}</div>
                <div className="text-[11px] text-slate-600">{alert.recommendedAction}</div>
              </div>
            </div>
          )}

          {/* Simulated Disclaimer Banner */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
            <Lock size={13} className="text-slate-400 shrink-0" />
            <span>
              <strong>Simulation Sandbox:</strong> Previews the notification payload without connecting real third-party SMS/email gateways. Architecture allows pluggable real notification providers.
            </span>
          </div>

          {/* Dispatch Confirmation Card */}
          {dispatchResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1 animate-in zoom-in-95">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Simulated {dispatchResult.channel} Notification Generated Successfully
              </div>
              <div className="text-[11px] text-emerald-800 font-mono">
                Ref ID: {dispatchResult.referenceId} &bull; Timestamp: {dispatchResult.timestamp}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Channel: <strong className="text-slate-800">{activeChannel}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleSendDispatch}
              disabled={isSending}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send size={13} />
              {isSending ? 'Simulating...' : `Simulate ${activeChannel} Dispatch`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
