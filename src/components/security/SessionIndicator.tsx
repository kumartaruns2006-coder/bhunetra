import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { authService } from '../../services/authService';

export const SessionIndicator: React.FC = () => {
  const session = authService.getSession();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(session.loginTime).getTime()) / 1000);
      const remaining = Math.max(0, session.expiresInSeconds - elapsed);
      setSecondsRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleRenew = () => {
    authService.renewSession();
    setSecondsRemaining(1800);
  };

  if (!session) return null;

  return (
    <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-[11px] text-slate-300">
      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
        <Lock size={11} />
        <span>TLS 256-Bit</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1">
        <span className="text-slate-400">Session:</span>
        <span className="font-mono text-amber-300 font-bold">{timeFormatted}</span>
      </div>
      <button
        onClick={handleRenew}
        title="Renew Session Token"
        className="text-slate-400 hover:text-white p-0.5 hover:bg-slate-700 rounded transition-colors"
      >
        <RefreshCw size={11} />
      </button>
    </div>
  );
};
