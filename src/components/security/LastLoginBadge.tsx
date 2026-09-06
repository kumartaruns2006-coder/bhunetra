import React from 'react';
import { User } from '../../types/auth';
import { Clock, Globe } from 'lucide-react';

interface LastLoginBadgeProps {
  user: User;
  className?: string;
}

export const LastLoginBadge: React.FC<LastLoginBadgeProps> = ({ user, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-[11px] text-slate-400 ${className}`}>
      <span className="flex items-center gap-1">
        <Clock size={11} className="text-slate-500" />
        <span>Last login: <strong className="text-slate-300">{user.lastLogin.timestamp}</strong></span>
      </span>
      <span className="text-slate-600 hidden md:inline">&bull;</span>
      <span className="hidden md:flex items-center gap-1">
        <Globe size={11} className="text-slate-500" />
        <span className="font-mono text-slate-300">IP: {user.lastLogin.ipAddress}</span>
      </span>
    </div>
  );
};
