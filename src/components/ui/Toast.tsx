import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 flex items-start gap-3 text-xs animate-in slide-in-from-bottom-2 duration-150"
          >
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />}
            {(!toast.type || toast.type === 'info') && <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />}

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="font-bold text-white text-xs">{toast.title}</div>
              {toast.message && <div className="text-slate-300 text-[11px] leading-relaxed">{toast.message}</div>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
