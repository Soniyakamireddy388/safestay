import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  BedDouble,
  CreditCard,
  UserCheck,
  MessageSquareWarning,
  Wrench,
  AlertTriangle,
  CalendarCheck,
  Utensils,
  Shirt,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import {
  complaintService,
  paymentService,
  foodService,
  laundryService,
  roomService,
} from '../services/apiServices';
import { Complaint, Payment, FoodMenuItem, LaundryOrder, Room } from '../types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { openPanicModal, activeCount } = useEmergency();
  const navigate = useNavigate();

  const [studentComplaints, setStudentComplaints] = useState<Complaint[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [todayMenu, setTodayMenu] = useState<FoodMenuItem[]>([]);
  const [activeLaundry, setActiveLaundry] = useState<LaundryOrder[]>([]);
  const [allocatedRoom, setAllocatedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = user?.studentId || 'STU-2024-089';
      const [comps, pays, menu, laundry, rooms] = await Promise.all([
        complaintService.getStudentComplaints(studentId),
        paymentService.getStudentPayments(studentId),
        foodService.getWeeklyMenu(),
        laundryService.getStudentOrders(studentId),
        roomService.getRooms(),
      ]);

      setStudentComplaints(comps);
      setRecentPayments(pays);
      setTodayMenu(menu.filter((m) => m.day === 'Monday'));
      setActiveLaundry(laundry);

      const found = rooms.find((r) => r.roomNumber === (user?.roomNumber || 'A-204'));
      if (found) setAllocatedRoom(found);
    };

    fetchStudentData();
  }, [user]);

  const openComplaintsCount = studentComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Student Welcome Header (Section 13) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-teal-300">
            Student Residency Portal • Block A (Room A-204)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-['Outfit',sans-serif]">
            Welcome back, {user?.name || 'Rahul Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Roll No: <strong className="text-white font-mono">{user?.studentId || 'STU-2024-089'}</strong> • Computer Science & Eng.
          </p>
        </div>

        {/* Highly Visible 🚨 EMERGENCY / PANIC Button (Section 13) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            id="student-panic-banner-btn"
            onClick={openPanicModal}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/35 transition-all hover:scale-[1.03] active:scale-[0.98] border border-rose-400/40 animate-pulse"
          >
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <span>🚨 EMERGENCY / PANIC</span>
          </button>
        </div>
      </div>

      {/* Quick Info KPI Cards (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Current Room */}
        <StatCard
          title="Current Room"
          value={user?.roomNumber || 'A-204'}
          icon={BedDouble}
          trend="Block A"
          trendDirection="neutral"
          comparisonText="Double Sharing • AC"
          onClick={() => navigate('/rooms')}
        />

        {/* Monthly Fee */}
        <StatCard
          title="Monthly Fee"
          value="₹8,500"
          icon={CreditCard}
          trend="Paid"
          trendDirection="up"
          comparisonText="Due: 5th of month"
          onClick={() => navigate('/payments')}
        />

        {/* Attendance */}
        <StatCard
          title="Attendance"
          value="92%"
          icon={UserCheck}
          trend="Present"
          trendDirection="up"
          comparisonText="Curfew 9:30 PM"
          onClick={() => navigate('/attendance')}
        />

        {/* Open Complaints */}
        <StatCard
          title="Open Complaints"
          value={openComplaintsCount || 2}
          icon={MessageSquareWarning}
          trend={openComplaintsCount > 0 ? 'Under review' : 'None'}
          trendDirection={openComplaintsCount > 0 ? 'neutral' : 'up'}
          comparisonText="Warden assigned"
          onClick={() => navigate('/complaints')}
        />

        {/* Maintenance Requests */}
        <StatCard
          title="Maintenance"
          value="1"
          icon={Wrench}
          trend="In progress"
          trendDirection="neutral"
          comparisonText="AC filter cleaning"
          onClick={() => navigate('/maintenance')}
        />
      </div>

      {/* Quick Actions Shortcuts Grid (Section 13) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 font-['Outfit',sans-serif]">
          Quick Hostel Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            { label: 'Book Room', icon: CalendarCheck, to: '/rooms', color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Pay Fees', icon: CreditCard, to: '/payments', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Raise Complaint', icon: MessageSquareWarning, to: '/complaints', color: 'bg-amber-50 text-amber-700' },
            { label: 'Maintenance', icon: Wrench, to: '/maintenance', color: 'bg-sky-50 text-sky-700' },
            { label: 'Attendance', icon: UserCheck, to: '/attendance', color: 'bg-teal-50 text-teal-700' },
            { label: 'Food Menu', icon: Utensils, to: '/food-menu', color: 'bg-orange-50 text-orange-700' },
            { label: 'Laundry', icon: Shirt, to: '/laundry', color: 'bg-violet-50 text-violet-700' },
            { label: 'Emergency', icon: AlertTriangle, action: openPanicModal, color: 'bg-rose-100 text-rose-700 font-bold' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return item.to ? (
              <button
                key={idx}
                onClick={() => navigate(item.to!)}
                className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </button>
            ) : (
              <button
                key={idx}
                onClick={item.action}
                className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50/50 hover:bg-rose-100/70 transition-all flex flex-col items-center justify-center gap-2 group ring-1 ring-rose-200"
              >
                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-rose-700">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Grid: Room Details + Today's Cafeteria Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room & Roommate Info */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Allocated Space</span>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Room {user?.roomNumber || 'A-204'} • Block A
                </h3>
              </div>
              <StatusBadge status="Occupied" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Room Type</span>
                <span className="font-bold text-slate-900">Double Sharing (AC)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Floor & Wing</span>
                <span className="font-bold text-slate-900">2nd Floor • North Wing</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Roommate</span>
                <span className="font-bold text-slate-900">Vikram Patil (STU-090)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Acoustic Sensor</span>
                <span className="font-bold text-teal-700">AS-A204 (Active)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Warden Ramesh Chandra: +91 98450 12345</span>
              </div>
              <a href="tel:+919845012345" className="font-bold underline text-indigo-700 text-[11px]">
                Call Warden
              </a>
            </div>
          </div>

          <button
            onClick={() => navigate('/rooms')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center justify-between"
          >
            <span>View all room details & amenities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Today's Food Menu Preview (Section 19) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cafeteria Schedule</span>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Today's Meals (Monday)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                Pure Veg & Non-Veg Available
              </span>
            </div>

            <div className="space-y-2.5">
              {todayMenu.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{item.mealType}</span>
                    <span className="text-slate-600 text-[11px]">{item.items}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-slate-400 text-[10px] block">{item.time}</span>
                    <span className="text-[10px] font-semibold text-emerald-700">{item.dietary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/food-menu')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center justify-between"
          >
            <span>Check weekly Monday–Sunday food schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Complaints & Laundry Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Complaints */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              My Active Grievances & Complaints
            </h3>
            <button
              onClick={() => navigate('/complaints')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              + Raise New Ticket
            </button>
          </div>

          <div className="space-y-3">
            {studentComplaints.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                onClick={() => navigate('/complaints')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{comp.title}</span>
                  <StatusBadge status={comp.status} />
                </div>
                <p className="text-slate-500 line-clamp-1">{comp.description}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Category: {comp.category}</span>
                  <span>Assigned to: {comp.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laundry Order Pipeline (Section 20) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                Hostel Laundry Status
              </h3>
              <button
                onClick={() => navigate('/laundry')}
                className="text-xs font-bold text-violet-700 hover:text-violet-800"
              >
                New Drop-off
              </button>
            </div>

            {activeLaundry.length > 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">{activeLaundry[0].tokenNumber}</span>
                  <StatusBadge status={activeLaundry[0].status} />
                </div>
                <div className="text-xs text-slate-600">
                  <div>Bag: {activeLaundry[0].itemCount} garments (Clothes, Bed linen)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Estimated Ready: {activeLaundry[0].estimatedReady}
                  </div>
                </div>

                {/* Visual Step Progress */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span className="text-emerald-700">Submitted</span>
                    <span className="text-indigo-700">Washing</span>
                    <span>Ready</span>
                    <span>Collected</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-1/2 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">No active laundry batches.</div>
            )}
          </div>

          <button
            onClick={() => navigate('/laundry')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center justify-between"
          >
            <span>View complete laundry history</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
