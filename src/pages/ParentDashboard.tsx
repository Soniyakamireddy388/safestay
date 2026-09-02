import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  GraduationCap,
  BedDouble,
  CreditCard,
  UserCheck,
  MessageSquareWarning,
  ShieldCheck,
  Utensils,
  Megaphone,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Heart,
  ArrowRight,
} from 'lucide-react';
import {
  complaintService,
  paymentService,
  foodService,
  announcementService,
} from '../services/apiServices';
import { Complaint, Payment, FoodMenuItem, Announcement } from '../types';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeCount } = useEmergency();
  const navigate = useNavigate();

  const [wardPayments, setWardPayments] = useState<Payment[]>([]);
  const [wardComplaints, setWardComplaints] = useState<Complaint[]>([]);
  const [todayMenu, setTodayMenu] = useState<FoodMenuItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchParentData = async () => {
      const studentId = 'STU-2024-089'; // Rahul Sharma
      const [pays, comps, menu, ann] = await Promise.all([
        paymentService.getStudentPayments(studentId),
        complaintService.getStudentComplaints(studentId),
        foodService.getWeeklyMenu(),
        announcementService.getAnnouncements(),
      ]);

      setWardPayments(pays);
      setWardComplaints(comps);
      setTodayMenu(menu.filter((m) => m.day === 'Monday'));
      setAnnouncements(ann);
    };

    fetchParentData();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Parent Welcome Header (Section 22) */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-teal-500/20 text-teal-300">
              <Heart className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-teal-300">
              Parent Guardian Oversight Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Welcome back, {user?.name || 'Sunita Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitoring Ward:{' '}
            <strong className="text-white font-semibold">Rahul Sharma (STU-2024-089)</strong> • Room A-204, Block A
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+919845012345"
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Senior Warden</span>
          </a>
        </div>
      </div>

      {/* Ward Status Overview Cards (Section 22) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <StatCard
          title="Curfew Attendance"
          value="92%"
          icon={UserCheck}
          trend="Present Today"
          trendDirection="up"
          comparisonText="Biometric 9:15 PM"
          onClick={() => navigate('/attendance')}
        />

        {/* Fee Status */}
        <StatCard
          title="Hostel Fee Status"
          value="₹8,500"
          icon={CreditCard}
          trend="Paid"
          trendDirection="up"
          comparisonText="March Dues Cleared"
          onClick={() => navigate('/payments')}
        />

        {/* Open Complaints */}
        <StatCard
          title="Ward Grievances"
          value="2 Tickets"
          icon={MessageSquareWarning}
          trend="In Progress"
          trendDirection="neutral"
          comparisonText="Assigned to Warden"
          onClick={() => navigate('/complaints')}
        />

        {/* Safety */}
        <StatCard
          title="Safety & Security"
          value={activeCount > 0 ? 'ALERT' : 'Normal'}
          icon={ShieldCheck}
          trend={activeCount > 0 ? 'Distress trigger' : 'All Clear'}
          trendDirection={activeCount > 0 ? 'danger' : 'up'}
          comparisonText="Acoustic sensor AS-A204"
          highlight={activeCount > 0}
          onClick={() => navigate('/safety-center')}
        />
      </div>

      {/* Linked Ward Profile Info Card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
            alt="Rahul Sharma"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Rahul Sharma</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Resident
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: <span className="font-mono font-semibold text-slate-700">STU-2024-089</span> • B.Tech CSE (Year 3)
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-teal-600" />
                Room A-204 (Block A)
              </span>
              <span>•</span>
              <span>Warden: Ramesh Chandra</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => navigate('/attendance')}
            className="px-4 py-2 text-xs font-bold text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Attendance Logs
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="px-4 py-2 text-xs font-bold text-teal-700 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
          >
            View Fee Receipts
          </button>
        </div>
      </div>

      {/* Two Column Grid: Meal Plan & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Food Menu for Student */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Today's Cafeteria Meals
                </h3>
                <p className="text-xs text-slate-500">Provided by SafeStay Central Catering</p>
              </div>
              <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Utensils className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-2.5">
              {todayMenu.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{m.mealType}</span>
                    <span className="text-slate-600 text-[11px]">{m.items}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 font-mono">{m.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/food-menu')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center justify-between"
          >
            <span>Full weekly menu & nutritional breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hostel Announcements & Notices */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Hostel Notices & Circulars
                </h3>
                <p className="text-xs text-slate-500">Official bulletins from Warden & Administrator Soniya</p>
              </div>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Megaphone className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-2.5">
              {announcements.slice(0, 3).map((a) => (
                <div key={a.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <span className="text-[10px] text-slate-400">{a.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/announcements')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center justify-between"
          >
            <span>View all past circulars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
