import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  User,
  Mail,
  Phone,
  BedDouble,
  GraduationCap,
  Shield,
  Heart,
  Calendar,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif] max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          Resident / User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Identity credentials, hostel room affiliation, and registered emergency parent contacts.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500/20 shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">{user?.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold font-mono">
              {user?.role}
            </span>
            <StatusBadge status={user?.status || 'APPROVED'} />
          </div>

          <p className="text-xs text-slate-500">
            SafeStay Smart Hostel Resident ID: <span className="font-mono font-bold text-slate-800">{user?.id}</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {user?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {user?.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Hostel Allocation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-teal-600" />
            Hostel Room Allotment
          </h3>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Allocated Room:</span>
              <span className="font-bold text-slate-900 font-mono">{user?.roomNumber || 'Room A-204'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hostel Block:</span>
              <span className="font-semibold text-slate-800">Block A (Senior Wing)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bed Number:</span>
              <span className="font-semibold text-slate-800">Bed 1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Senior Warden:</span>
              <span className="font-semibold text-slate-800">Ramesh Chandra (+91 98450 12345)</span>
            </div>
          </div>
        </div>

        {/* Emergency & Guardian Contact */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            Registered Emergency Guardian
          </h3>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Guardian Name:</span>
              <span className="font-bold text-slate-900">Sunita Sharma (Mother)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Emergency Phone:</span>
              <span className="font-mono font-bold text-slate-900">+91 98765 43210</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SMS Distress Broadcast:</span>
              <span className="text-emerald-700 font-bold">Enabled (Twilio Gateway)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Residential Address:</span>
              <span className="text-slate-700 text-right">Plot 42, Vasant Vihar, New Delhi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
