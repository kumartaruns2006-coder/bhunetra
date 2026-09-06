import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertItem, 
  AlertSeverity, 
  AlertType, 
  NotificationState,
  NotificationChannel
} from '../../types/alertNotification';
import { notificationService } from '../../services/notificationService';
import { SimulatedDispatchModal } from './SimulatedDispatchModal';
import { Parcel } from '../../types/parcel';
import { useToast } from '../ui/Toast';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Mail, 
  Smartphone, 
  Check, 
  RotateCcw, 
  ArrowUpRight, 
  ShieldAlert, 
  MapPin, 
  ExternalLink,
  Layers,
  Send,
  AlertOctagon,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AlertsViewProps {
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToMap?: (parcel: Parcel) => void;
  onNavigateToProject?: (projectId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ 
  parcels, 
  onSelectParcel,
  onNavigateToMap,
  onNavigateToProject
}) => {
  const { showToast } = useToast();

  // State from notificationService
  const [alerts, setAlerts] = useState<AlertItem[]>(notificationService.getAllAlerts());

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Alert for simulated dispatch modal
  const [dispatchAlert, setDispatchAlert] = useState<{ alert: AlertItem; channel: NotificationChannel } | null>(null);

  // Subscribe to notification updates
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setAlerts(notificationService.getAllAlerts());
    });
    return unsubscribe;
  }, []);

  // Filter options lists
  const severities: { key: string; label: string; count: number; color: string }[] = [
    { key: 'ALL', label: 'All Alerts', count: alerts.length, color: 'bg-slate-800 text-white' },
    { key: 'CRITICAL', label: 'Critical', count: alerts.filter(a => a.severity === 'CRITICAL' && a.state !== 'RESOLVED').length, color: 'bg-rose-100 text-rose-800' },
    { key: 'HIGH', label: 'High', count: alerts.filter(a => a.severity === 'HIGH' && a.state !== 'RESOLVED').length, color: 'bg-amber-100 text-amber-800' },
    { key: 'MEDIUM', label: 'Medium', count: alerts.filter(a => a.severity === 'MEDIUM' && a.state !== 'RESOLVED').length, color: 'bg-blue-100 text-blue-800' },
    { key: 'INFO', label: 'Info', count: alerts.filter(a => a.severity === 'INFO').length, color: 'bg-emerald-100 text-emerald-800' }
  ];

  const alertTypes: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Types' },
    { key: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { key: 'DELAYED_CASE', label: 'Delayed Case' },
    { key: 'TIMELINE_RISK', label: 'Timeline Risk' },
    { key: 'COMPENSATION_PENDING', label: 'Compensation Pending' },
    { key: 'RR_PENDING', label: 'R&R Pending' },
    { key: 'MISSING_DOCUMENT', label: 'Missing Document' },
    { key: 'FIELD_VERIFICATION_PENDING', label: 'Field Verification Pending' },
    { key: 'MILESTONE_DUE', label: 'Milestone Due' },
    { key: 'DATA_CONFLICT', label: 'Data Conflict' },
    { key: 'HIGH_RISK_PARCEL', label: 'High Risk Parcel' },
    { key: 'HIGH_RISK_PROJECT', label: 'High Risk Project' }
  ];

  // Filtered alert list
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
      const matchType = typeFilter === 'ALL' || a.type === typeFilter;
      const matchState = stateFilter === 'ALL' || a.state === stateFilter;
      const matchSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.khasraNo && a.khasraNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.parcelId && a.parcelId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.reasons.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSeverity && matchType && matchState && matchSearch;
    });
  }, [alerts, severityFilter, typeFilter, stateFilter, searchQuery]);

  // Counts
  const unreadCount = alerts.filter(a => a.state === 'UNREAD').length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.state !== 'RESOLVED').length;
  const resolvedCount = alerts.filter(a => a.state === 'RESOLVED').length;

  // Actions
  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    showToast({
      title: 'Marked as Read',
      message: 'Alert status updated',
      type: 'info'
    });
  };

  const handleMarkAsUnread = (id: string) => {
    notificationService.markAsUnread(id);
    showToast({
      title: 'Marked as Unread',
      message: 'Alert restored to unread queue',
      type: 'info'
    });
  };

  const handleMarkAsResolved = (id: string) => {
    notificationService.markAsResolved(id, 'Authorized Revenue Officer');
    showToast({
      title: 'Alert Resolved',
      message: 'Resolution timestamp and audit record saved',
      type: 'success'
    });
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    showToast({
      title: 'All Alerts Marked as Read',
      message: `${unreadCount} notifications cleared from unread queue`,
      type: 'info'
    });
  };

  const handleViewParcel = (parcelId?: string) => {
    if (!parcelId) return;
    const target = parcels.find(p => p.id === parcelId || p.khasraNo === parcelId);
    if (target) {
      onSelectParcel(target);
    } else if (parcels.length > 0) {
      onSelectParcel(parcels[0]);
    }
  };

  const handleLocateMap = (parcelId?: string) => {
    if (!parcelId || !onNavigateToMap) return;
    const target = parcels.find(p => p.id === parcelId || p.khasraNo === parcelId);
    if (target) {
      onNavigateToMap(target);
    } else if (parcels.length > 0) {
      onNavigateToMap(parcels[0]);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            PART 10 &bull; STATUTORY ALERT & NOTIFICATION CENTER
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Alert & Exception Monitoring Cockpit
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time notifications on corridor bottlenecks, statutory delays, compensation backlogs, and judicial stays
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Check size={13} /> Mark All Read ({unreadCount})
            </button>
          )}

          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Bell size={14} className="text-amber-400" />
            <span>{alerts.length} Total Alerts</span>
            {criticalCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-black">
                {criticalCount} Critical
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Severity KPI Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {severities.map((s) => (
          <button
            key={s.key}
            onClick={() => setSeverityFilter(s.key)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              severityFilter === s.key 
                ? 'ring-2 ring-slate-900 shadow-md bg-white border-slate-900' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{s.label}</span>
              <span className={`w-2 h-2 rounded-full ${
                s.key === 'CRITICAL' ? 'bg-rose-500' :
                s.key === 'HIGH' ? 'bg-amber-500' :
                s.key === 'MEDIUM' ? 'bg-blue-500' :
                s.key === 'INFO' ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{s.count}</div>
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs flex-1 max-w-md">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search alert title, reasons, Khasra, or project code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-slate-900 font-medium outline-none w-full placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <Filter size={13} className="text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              {alertTypes.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'UNREAD', label: `Unread (${unreadCount})` },
              { key: 'READ', label: 'Read' },
              { key: 'RESOLVED', label: `Resolved (${resolvedCount})` }
            ].map(st => (
              <button
                key={st.key}
                onClick={() => setStateFilter(st.key)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  stateFilter === st.key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
              alert.state === 'RESOLVED'
                ? 'border-slate-200 opacity-75 bg-slate-50/50'
                : alert.severity === 'CRITICAL'
                  ? 'border-l-4 border-l-rose-600 border-slate-200'
                  : alert.severity === 'HIGH'
                    ? 'border-l-4 border-l-amber-500 border-slate-200'
                    : alert.severity === 'MEDIUM'
                      ? 'border-l-4 border-l-blue-500 border-slate-200'
                      : 'border-l-4 border-l-emerald-500 border-slate-200'
            }`}
          >
            {/* Top Row: Severity, Type, Project, Date */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Severity Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  alert.severity === 'HIGH' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                  alert.severity === 'MEDIUM' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {alert.severity}
                </span>

                {/* Type Chip */}
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                  {alert.type.replace(/_/g, ' ')}
                </span>

                {/* State Indicator */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  alert.state === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                  alert.state === 'UNREAD' ? 'bg-rose-50 text-rose-700 font-black' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {alert.state}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  Created: {alert.createdAt}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Calendar size={12} className="text-amber-600" />
                  Due: <strong>{alert.dueDate}</strong>
                </span>
              </div>
            </div>

            {/* Middle Section: Title, Delay, Project & Parcel Reference */}
            <div className="py-3 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-black text-slate-900">
                  {alert.title}
                </h3>

                {alert.predictedDelayDays && (
                  <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1">
                    <Clock size={13} className="text-amber-600" />
                    {alert.predictedDelayDays}-Day Predicted Delay
                  </span>
                )}
              </div>

              {/* Project & Parcel Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>
                  Project: <strong className="text-slate-900">{alert.projectName}</strong> ({alert.projectId})
                </span>
                {alert.parcelId && (
                  <>
                    <span>&bull;</span>
                    <span>
                      Parcel: <strong className="text-indigo-700 font-mono">{alert.parcelId}</strong>
                      {alert.khasraNo && <span className="font-semibold text-slate-800"> (Khasra {alert.khasraNo})</span>}
                      {alert.village && <span className="text-slate-500"> &bull; Village {alert.village}</span>}
                    </span>
                  </>
                )}
              </div>

              {/* Reasons List */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-2">
                <div className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Root Causes / Detected Reasons:
                </div>
                <ul className="space-y-1">
                  {alert.reasons.map((reason, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs flex items-start gap-2 text-emerald-950">
                <Sparkles size={15} className="text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-emerald-900">Recommended Statutory Action: </strong>
                  <span>{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Resolved Info if applicable */}
              {alert.state === 'RESOLVED' && alert.resolvedAt && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Resolved on {alert.resolvedAt} by {alert.resolvedBy}</span>
                </div>
              )}
            </div>

            {/* Footer Row: Action Buttons */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-3">
              {/* Left Side: Navigation Buttons (View Project, View Parcel, Locate GIS) */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Button: View Project */}
                <button
                  onClick={() => onNavigateToProject && onNavigateToProject(alert.projectId)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink size={13} /> View Project ({alert.projectId})
                </button>

                {/* Button: View Parcel Digital Twin */}
                {alert.parcelId && (
                  <button
                    onClick={() => handleViewParcel(alert.parcelId)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200"
                  >
                    <ArrowUpRight size={13} /> View Parcel Twin
                  </button>
                )}

                {/* Button: Locate on GIS Map */}
                {alert.parcelId && onNavigateToMap && (
                  <button
                    onClick={() => handleLocateMap(alert.parcelId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin size={13} /> Locate on Map
                  </button>
                )}
              </div>

              {/* Right Side: State Management & Simulated Dispatch */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Simulated Email Button */}
                <button
                  onClick={() => setDispatchAlert({ alert, channel: 'EMAIL' })}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Test simulated email dispatch"
                >
                  <Mail size={13} /> Send Email
                </button>

                {/* Simulated SMS Button */}
                <button
                  onClick={() => setDispatchAlert({ alert, channel: 'SMS' })}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Test simulated SMS dispatch"
                >
                  <Smartphone size={13} /> Send SMS
                </button>

                {/* Mark as Read / Unread */}
                {alert.state === 'UNREAD' ? (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Check size={13} /> Mark Read
                  </button>
                ) : alert.state === 'READ' ? (
                  <button
                    onClick={() => handleMarkAsUnread(alert.id)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={13} /> Mark Unread
                  </button>
                ) : null}

                {/* Resolve Button */}
                {alert.state !== 'RESOLVED' && (
                  <button
                    onClick={() => handleMarkAsResolved(alert.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 size={13} /> Resolve Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
            <div className="font-bold text-slate-900 text-sm">No Alerts Match Selected Filters</div>
            <p className="text-xs text-slate-500">All statutory parameters within normal operational thresholds.</p>
          </div>
        )}
      </div>

      {/* Simulated Dispatch Modal */}
      {dispatchAlert && (
        <SimulatedDispatchModal
          alert={dispatchAlert.alert}
          initialChannel={dispatchAlert.channel}
          onClose={() => setDispatchAlert(null)}
        />
      )}

    </div>
  );
};
