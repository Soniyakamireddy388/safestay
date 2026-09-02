import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { StorageEngine } from '../services/storageEngine';
import {
  Settings,
  Sliders,
  Bell,
  Clock,
  Shield,
  Database,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Smartphone,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useNotifications();

  const [aiThreshold, setAiThreshold] = useState<number>(90);
  const [curfewTime, setCurfewTime] = useState<string>('21:30');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(true);
  const [autoAssignWarden, setAutoAssignWarden] = useState<boolean>(true);
  const [emergencySirens, setEmergencySirens] = useState<boolean>(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configuration Saved', 'Hostel operational parameters updated in system.', 'success');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset SafeStay database back to initial seed data? This will clear test entries.')) {
      StorageEngine.resetAll();
      showToast('Database Restored', 'Initial demo seed state restored.', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif] max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          System Settings & Host Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Adjust acoustic detection sensitivity, curfew scheduling, and automated SMS gateway triggers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Acoustic AI Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit',sans-serif]">
            <Cpu className="w-5 h-5 text-teal-600" />
            <h3>Acoustic Intelligence & Distress Calibration</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Distress Classification Threshold</span>
                <span className="text-slate-500 text-[11px]">
                  Audio events scoring above this probability trigger high-priority alerts to Wardens.
                </span>
              </div>
              <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                {aiThreshold}%
              </span>
            </div>

            <input
              type="range"
              min="70"
              max="98"
              value={aiThreshold}
              onChange={(e) => setAiThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
        </div>

        {/* Hostel Curfew & Attendance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit',sans-serif]">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3>Hostel Curfew & Roll-Call Protocols</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Night Curfew Time:</label>
              <input
                type="time"
                value={curfewTime}
                onChange={(e) => setCurfewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Curfew Verification Mode:</label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium">
                <option>Warden Physical Roll-Call + QR Scan</option>
                <option>Biometric Turnstile Ingress Only</option>
                <option>Hybrid Dual-Factor Check</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Twilio SMS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit',sans-serif]">
            <Smartphone className="w-5 h-5 text-amber-600" />
            <h3>Automated Dispatch & Twilio SMS Gateway</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Instant SMS Dispatch to Warden & Guard</span>
                <span className="text-[11px] text-slate-500">Send emergency SMS via Twilio on distress trigger.</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Auto-Assign Resident Complaints</span>
                <span className="text-[11px] text-slate-500">
                  Automatically assign new tickets to Senior Warden Ramesh Chandra.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAssignWarden}
                onChange={(e) => setAutoAssignWarden(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Demo Database (Section 46) */}
      <div className="bg-rose-50/70 p-6 sm:p-8 rounded-3xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold font-['Outfit',sans-serif]">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <h3>Evaluator Demo Seed Management</h3>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Restore SafeStay back to pristine initial demonstration dataset with default mock students, rooms,
          complaints, and distress logs.
        </p>
        <button
          type="button"
          onClick={handleResetDemoData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          Reset All Demo Data
        </button>
      </div>
    </div>
  );
};
