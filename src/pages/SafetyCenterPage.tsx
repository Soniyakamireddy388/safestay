import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from '../components/StatusBadge';
import { EmergencyAlert, EmergencyAlertStatus } from '../types';
import { emergencyService } from '../services/apiServices';
import {
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  CheckCircle,
  AlertOctagon,
  MessageSquare,
  Volume2,
  Clock,
  User,
  ShieldCheck,
  RefreshCw,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export const SafetyCenterPage: React.FC = () => {
  const { alerts, refreshAlerts, activeCount, openPanicModal } = useEmergency();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, [alerts]);

  const handleUpdateStatus = async (alertId: string, status: EmergencyAlertStatus) => {
    try {
      const updated = await emergencyService.updateAlertStatus(alertId, status);
      showToast('Incident Updated', `Alert #${alertId} updated to ${status}`, 'info');
      await refreshAlerts();
      setSelectedAlert(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchSecurity = (alert: EmergencyAlert) => {
    showToast(
      'Security Patrol Dispatched',
      `Campus Guard Unit Alpha has been alerted and is en route to ${alert.location}.`,
      'danger'
    );
  };

  const filtered = alerts.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-rose-500/20 text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-300">
              SafeStay Incident & Distress Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Emergency Safety Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time triage of acoustic distress anomalies, manual panic transmissions, and SMS notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openPanicModal}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>🚨 Trigger Panic Test</span>
          </button>
        </div>
      </div>

      {/* Workflow Diagram Banner (Section 27) */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
          SafeStay Emergency Response Protocol (Section 27):
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">1. Detection</span>
            <span className="text-[11px] text-slate-500">Acoustic Scream / Panic Button</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">2. Generation</span>
            <span className="text-[11px] text-slate-500">Alert Record in SafeStay DB</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-rose-900 block mb-1">3. Broadcast</span>
            <span className="text-[11px] text-rose-700">Audio Tone + Red UI Banner</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">4. SMS Dispatch</span>
            <span className="text-[11px] text-slate-500">Twilio SMS to Warden</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">5. Ground Check</span>
            <span className="text-[11px] text-slate-500">Physical Warden / Guard Visit</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900 block mb-1">6. Resolution</span>
            <span className="text-[11px] text-emerald-700">Resolved or False Alarm</span>
          </div>
        </div>
      </div>

      {/* Filter & Counter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Incidents:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Incidents</option>
            <option value="New">New / Active</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="False Alarm">False Alarm</option>
          </select>
        </div>

        <span className="font-semibold text-slate-600">
          Active Alerts: <strong className="text-rose-600">{activeCount}</strong>
        </span>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Alerts Feed (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto">
          {filtered.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;
            const isAi = alert.source === 'AI_AUDIO_DETECTION';
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-rose-400 ring-2 ring-rose-200 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isAi ? (
                      <span className="p-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-bold text-xs text-slate-900">
                      {isAi ? 'Acoustic Distress AI' : 'Manual Panic'}
                    </span>
                  </div>

                  <StatusBadge status={alert.status} />
                </div>

                <p className="text-xs text-slate-700 font-medium line-clamp-2">{alert.details}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{alert.location}</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Incident Command Inspector (Right 7 cols) (Section 24) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {selectedAlert ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Incident Ref #{selectedAlert.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedAlert.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedAlert.severity} Severity
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {selectedAlert.source === 'AI_AUDIO_DETECTION'
                      ? 'AI Acoustic Distress Detection Event'
                      : 'Emergency Manual Panic Button Broadcast'}
                  </h2>
                </div>

                <StatusBadge status={selectedAlert.status} size="md" />
              </div>

              {/* Location & Time Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Location Node:</span>
                  <span className="font-bold text-slate-900">{selectedAlert.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Designated Room:</span>
                  <span className="font-bold text-slate-900">{selectedAlert.room || 'Corridor AS-02'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="font-semibold text-slate-700">{selectedAlert.timestamp}</span>
                </div>
              </div>

              {/* Student Details if Manual Panic */}
              {selectedAlert.studentName && (
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-1 text-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                    Transmitting Resident Information:
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <strong className="text-slate-900">{selectedAlert.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Roll / ID:</span>
                    <span className="font-mono text-slate-900">{selectedAlert.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Number:</span>
                    <span className="font-bold text-slate-900">{selectedAlert.studentPhone}</span>
                  </div>
                </div>
              )}

              {/* AI Acoustic Metadata if AI Alert */}
              {selectedAlert.confidence && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Acoustic Neural Classification
                    </span>
                    <span className="font-bold font-mono text-indigo-700 text-sm">
                      {selectedAlert.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-indigo-900">{selectedAlert.details}</p>
                </div>
              )}

              {/* SMS Notification Status (Section 27) */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    Automated Twilio SMS Gateway:
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    DISPATCHED
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Message sent to Warden Ramesh Chandra (+91 98450 12345) & Campus Security Alpha Team.
                </p>
              </div>

              {/* Action Buttons (Section 24) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Incident Management Actions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDispatchSecurity(selectedAlert)}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Dispatch Security Guard</span>
                  </button>

                  <a
                    href="tel:+919845012345"
                    className="py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-indigo-600" />
                    <span>Call Warden Ramesh Chandra</span>
                  </a>

                  <button
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Verified & Resolved</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'False Alarm')}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>Mark as False Alarm</span>
                  </button>
                </div>
              </div>

              {/* Disclaimer (Section 25) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                <strong>Safety Disclaimer:</strong> AI detection indicates a potential distress event and requires
                human verification. It does not confirm that an emergency has occurred.
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">Select an alert to inspect.</div>
          )}
        </div>
      </div>
    </div>
  );
};
