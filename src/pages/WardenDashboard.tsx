import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldAlert,
  Users,
  BedDouble,
  UserCheck,
  MessageSquareWarning,
  Wrench,
  Camera,
  Megaphone,
  Sparkles,
  PhoneCall,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import {
  complaintService,
  emergencyService,
  maintenanceService,
  attendanceService,
  roomService,
} from '../services/apiServices';
import { Complaint, EmergencyAlert, MaintenanceRequest } from '../types';

export const WardenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeCount, latestAlert } = useEmergency();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    const fetchWardenData = async () => {
      const [al, comp, maint] = await Promise.all([
        emergencyService.getAlerts(),
        complaintService.getComplaints(),
        maintenanceService.getRequests(),
      ]);
      setAlerts(al);
      setComplaints(comp);
      setMaintenance(maint);
    };

    fetchWardenData();
  }, []);

  const openComplaints = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed');
  const activeAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Investigating');

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header (Section 23) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-teal-300">
            Field Command & Student Safety
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-['Outfit',sans-serif]">
            Warden Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Officer in Charge: <strong className="text-white">Ramesh Chandra (Senior Warden)</strong> • Block A & Block B
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/safety-center')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Center</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-700 font-bold text-[10px]">
                {activeCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/cctv')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>CCTV Live</span>
          </button>
        </div>
      </div>

      {/* 6 Core Warden KPIs (Section 23) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Hostel Occupancy"
          value="82%"
          icon={BedDouble}
          trend="Block A & B"
          trendDirection="neutral"
          comparisonText="18/22 occupied"
          onClick={() => navigate('/rooms')}
        />
        <StatCard
          title="Students On-Site"
          value="1,284"
          icon={Users}
          trend="Registered"
          trendDirection="up"
          comparisonText="All hostels"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Night Attendance"
          value="92%"
          icon={UserCheck}
          trend="Present"
          trendDirection="up"
          comparisonText="Curfew 9:30 PM"
          onClick={() => navigate('/attendance')}
        />
        <StatCard
          title="Open Complaints"
          value={openComplaints.length}
          icon={MessageSquareWarning}
          trend={openComplaints.length > 0 ? 'Pending action' : 'Clear'}
          trendDirection={openComplaints.length > 2 ? 'down' : 'neutral'}
          comparisonText="Student tickets"
          onClick={() => navigate('/complaints')}
        />
        <StatCard
          title="Maintenance"
          value={maintenance.filter((m) => m.status !== 'Completed').length}
          icon={Wrench}
          trend="Scheduled"
          trendDirection="neutral"
          comparisonText="Electrician/Plumber"
          onClick={() => navigate('/maintenance')}
        />
        <StatCard
          title="Emergency Alerts"
          value={activeCount}
          icon={ShieldAlert}
          trend={activeCount > 0 ? 'DANGER' : 'SECURE'}
          trendDirection={activeCount > 0 ? 'danger' : 'up'}
          comparisonText={activeCount > 0 ? 'Urgent dispatch' : 'No active alerts'}
          highlight={activeCount > 0}
          onClick={() => navigate('/safety-center')}
        />
      </div>

      {/* Quick Management Tools (Section 23) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 font-['Outfit',sans-serif]">
          Warden Management Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            { label: 'Room Allocation', icon: BedDouble, to: '/rooms', color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Student Directory', icon: Users, to: '/users', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Attendance Check', icon: UserCheck, to: '/attendance', color: 'bg-teal-50 text-teal-700' },
            { label: 'Complaints Queue', icon: MessageSquareWarning, to: '/complaints', color: 'bg-amber-50 text-amber-700' },
            { label: 'Maintenance Hub', icon: Wrench, to: '/maintenance', color: 'bg-sky-50 text-sky-700' },
            { label: 'Emergency Alerts', icon: ShieldAlert, to: '/safety-center', color: 'bg-rose-50 text-rose-700 font-bold' },
            { label: 'Announcements', icon: Megaphone, to: '/announcements', color: 'bg-purple-50 text-purple-700' },
            { label: 'CCTV Feeds', icon: Camera, to: '/cctv', color: 'bg-slate-100 text-slate-800' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.to)}
                className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Alerts Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                Active Safety Dispatch Queue
              </h3>
              <p className="text-xs text-slate-500">Live acoustic distress events & manual panic reports</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Auto-Polling (5s)
            </span>
          </div>

          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No active emergencies in Block A or B. Acoustic sensors report normal baseline.
              </div>
            ) : (
              activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-2xl border border-rose-300 bg-rose-50/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
                      <span className="text-xs font-bold text-slate-900">
                        {alt.source === 'AI_AUDIO_DETECTION' ? 'Acoustic Distress Peak' : 'Manual Panic Button'}
                      </span>
                    </div>
                    <StatusBadge status={alt.status} />
                  </div>
                  <p className="text-xs text-slate-700">{alt.details}</p>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Location: {alt.location}</span>
                    <span>Reported: {alt.timestamp}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate('/safety-center')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Inspect & Dispatch Security →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Night Attendance Summary for Warden */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Night Roll-Call
                </h3>
                <p className="text-xs text-slate-500">Block A (Floors 1, 2, 3)</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Today: 94%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600">Total Checked In:</span>
                <span className="font-bold text-slate-900">22 / 24 Students</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600">On Permitted Leave:</span>
                <span className="font-bold text-slate-900">1 Student (Pooja Rao)</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                <span className="font-medium">Unreported / Late:</span>
                <span className="font-bold font-mono">1 Student (Rohit Varma)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/attendance')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center justify-between"
          >
            <span>Open biometric attendance logger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
