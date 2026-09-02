import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  Building,
  BedDouble,
  CheckCircle2,
  Clock,
  MessageSquareWarning,
  CreditCard,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  UserX,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  roomService,
  userService,
  complaintService,
  emergencyService,
  paymentService,
} from '../services/apiServices';
import { User, Room, Complaint, EmergencyAlert } from '../types';
import { useNotifications } from '../context/NotificationContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [studentsCount, setStudentsCount] = useState<number>(20);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [revenueData, setRevenueData] = useState({ totalRevenue: 185000, monthlyRevenue: 76500 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [roomsList, pendingList, complaintList, alertList, revSummary] = await Promise.all([
        roomService.getRooms(),
        userService.getPendingApprovals(),
        complaintService.getComplaints(),
        emergencyService.getAlerts(),
        paymentService.getRevenueSummary(),
      ]);

      setRooms(roomsList);
      setPendingUsers(pendingList);
      setComplaints(complaintList);
      setAlerts(alertList);
      setRevenueData(revSummary);
      setStudentsCount(20 + pendingList.length);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApprove = async (userId: string, name: string) => {
    await userService.approveUser(userId);
    showToast('Registration Approved', `${name}'s account is now active.`, 'success');
    loadDashboardData();
  };

  const handleReject = async (userId: string, name: string) => {
    await userService.rejectUser(userId);
    showToast('Registration Declined', `${name}'s request has been rejected.`, 'warning');
    loadDashboardData();
  };

  // Occupancy metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length;
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'MAINTENANCE').length;

  const pendingApprovalsCount = pendingUsers.length;
  const pendingComplaintsCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress'
  ).length;
  const activeAlertsCount = alerts.filter((a) => a.status === 'New' || a.status === 'Investigating').length;

  // Chart Data: Occupancy Donut (Section 11)
  const occupancyChartData = [
    { name: 'Occupied', value: occupiedRooms || 8, color: '#1e293b' },
    { name: 'Available', value: availableRooms || 5, color: '#0d9488' },
    { name: 'Maintenance', value: maintenanceRooms || 1, color: '#f59e0b' },
  ];

  // Chart Data: Monthly Revenue (Bar/Line chart) (Section 11)
  const monthlyRevenueData = [
    { month: 'Oct 25', revenue: 68000, target: 65000 },
    { month: 'Nov 25', revenue: 72500, target: 70000 },
    { month: 'Dec 25', revenue: 70000, target: 70000 },
    { month: 'Jan 26', revenue: 78500, target: 75000 },
    { month: 'Feb 26', revenue: 85000, target: 80000 },
    { month: 'Mar 26', revenue: 92000, target: 85000 },
  ];

  // Chart Data: Complaints Grouped (Section 11)
  const complaintsChartData = [
    { category: 'Electrical', submitted: 2, inProgress: 1, resolved: 5 },
    { category: 'Plumbing', submitted: 1, inProgress: 1, resolved: 4 },
    { category: 'Internet', submitted: 0, inProgress: 1, resolved: 6 },
    { category: 'Cleaning', submitted: 1, inProgress: 0, resolved: 8 },
    { category: 'Food', submitted: 0, inProgress: 1, resolved: 3 },
  ];

  // Chart Data: Weekly Attendance (Section 11)
  const attendanceWeeklyData = [
    { day: 'Mon', present: 94, late: 4, absent: 2 },
    { day: 'Tue', present: 96, late: 3, absent: 1 },
    { day: 'Wed', present: 92, late: 5, absent: 3 },
    { day: 'Thu', present: 95, late: 3, absent: 2 },
    { day: 'Fri', present: 91, late: 6, absent: 3 },
    { day: 'Sat', present: 88, late: 8, absent: 4 },
    { day: 'Sun', present: 93, late: 4, absent: 3 },
  ];

  // Chart Data: Emergency Alerts Grouped (Section 11)
  const emergencyChartData = [
    { name: 'AI Acoustic', count: alerts.filter((a) => a.source === 'AI_AUDIO_DETECTION').length || 2, color: '#6366f1' },
    { name: 'Manual Panic', count: alerts.filter((a) => a.source === 'MANUAL_PANIC').length || 1, color: '#e11d48' },
    { name: 'False Alarms', count: alerts.filter((a) => a.status === 'False Alarm').length || 1, color: '#f59e0b' },
    { name: 'Resolved', count: alerts.filter((a) => a.status === 'Resolved').length || 1, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header (Section 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-teal-300">
            SafeStay Command Central • Super Administrator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-['Outfit',sans-serif]">
            Good morning, Soniya 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Here’s what’s happening across SafeStay today. Systems are operational and acoustic monitoring is active.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate('/safety-center')}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Safety Center</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px]">
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/ai-monitoring')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>AI Acoustic Hub</span>
          </button>
        </div>
      </div>

      {/* Top 8 KPI Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Students */}
        <StatCard
          id="stat-students"
          title="Total Students"
          value="1,284"
          icon={Users}
          trend="↑ 8.4%"
          trendDirection="up"
          comparisonText="this month"
          onClick={() => navigate('/users')}
        />

        {/* 2. Total Rooms */}
        <StatCard
          id="stat-total-rooms"
          title="Total Rooms"
          value={totalRooms || 30}
          icon={Building}
          trend="Block A & B"
          trendDirection="neutral"
          comparisonText="3 floors each"
          onClick={() => navigate('/rooms')}
        />

        {/* 3. Occupied Rooms */}
        <StatCard
          id="stat-occupied-rooms"
          title="Occupied Rooms"
          value={occupiedRooms}
          icon={BedDouble}
          trend="64.2%"
          trendDirection="up"
          comparisonText="occupancy rate"
          onClick={() => navigate('/rooms')}
        />

        {/* 4. Available Rooms */}
        <StatCard
          id="stat-available-rooms"
          title="Available Rooms"
          value={availableRooms}
          icon={CheckCircle2}
          trend="Vacant beds"
          trendDirection="up"
          comparisonText="ready to book"
          onClick={() => navigate('/rooms')}
        />

        {/* 5. Pending Approvals */}
        <StatCard
          id="stat-pending-approvals"
          title="Pending Approvals"
          value={pendingApprovalsCount}
          icon={Clock}
          trend={pendingApprovalsCount > 0 ? 'Requires Action' : 'All clear'}
          trendDirection={pendingApprovalsCount > 0 ? 'down' : 'up'}
          comparisonText="student/parent signups"
          highlight={pendingApprovalsCount > 0}
          onClick={() => navigate('/users')}
        />

        {/* 6. Pending Complaints */}
        <StatCard
          id="stat-pending-complaints"
          title="Pending Complaints"
          value={pendingComplaintsCount}
          icon={MessageSquareWarning}
          trend={pendingComplaintsCount > 0 ? `${pendingComplaintsCount} open` : 'None'}
          trendDirection={pendingComplaintsCount > 3 ? 'down' : 'neutral'}
          comparisonText="warden queue"
          onClick={() => navigate('/complaints')}
        />

        {/* 7. Total Revenue */}
        <StatCard
          id="stat-total-revenue"
          title="Total Revenue"
          value={`₹${revenueData.totalRevenue.toLocaleString('en-IN')}`}
          icon={CreditCard}
          trend="↑ 12.1%"
          trendDirection="up"
          comparisonText="vs last semester"
          onClick={() => navigate('/payments')}
        />

        {/* 8. Active Emergency Alerts */}
        <StatCard
          id="stat-emergency-alerts"
          title="Active Emergency Alerts"
          value={activeAlertsCount}
          icon={ShieldAlert}
          trend={activeAlertsCount > 0 ? 'POTENTIAL DANGER' : 'SECURE'}
          trendDirection={activeAlertsCount > 0 ? 'danger' : 'up'}
          comparisonText={activeAlertsCount > 0 ? 'Acoustic / Panic alert' : 'Corridors normal'}
          highlight={activeAlertsCount > 0}
          onClick={() => navigate('/safety-center')}
        />
      </div>

      {/* Section 11: ADMIN ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Occupancy Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                Hostel Occupancy Analytics
              </h3>
              <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Live Status
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Distribution of beds across Block A & Block B</p>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {occupancyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} Rooms`, 'Count']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  {rooms.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Rooms</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs">
            {occupancyChartData.map((item) => (
              <div key={item.name} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block truncate">{item.name}</span>
                <span className="font-bold text-slate-900 text-sm font-['Outfit',sans-serif]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Monthly Fee Collection & Projections
                </h3>
                <p className="text-xs text-slate-500">Revenue trend in INR (₹) compared to target collection</p>
              </div>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                Current: ₹{revenueData.monthlyRevenue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="revenue" name="Collected Revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Target Billing" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Analytics: Complaints, Attendance, Emergency Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Grouped Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Complaints by Category
            </h3>
            <span className="text-xs font-semibold text-slate-500">Resolved vs Open</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Tracking student grievances and warden response rate</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsChartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={65} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" stackId="a" />
                <Bar dataKey="submitted" name="Submitted" fill="#f43f5e" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Night Curfew Attendance
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              92.4% Avg
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Biometric roll-call consistency for past 7 days</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceWeeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Line type="monotone" dataKey="present" name="% Present" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Alert Sources */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Safety Alerts Breakdown
            </h3>
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              AI vs Manual
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Acoustic detections, panic triggers & resolutions</p>

          <div className="space-y-3 mt-4">
            {emergencyChartData.map((item) => (
              <div key={item.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                </div>
                <span className="text-sm font-black font-mono text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/safety-center')}
            className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
          >
            <span>Open Safety Incident Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 37: PENDING REGISTRATION APPROVALS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Pending Registration Approvals
              </h3>
              {pendingApprovalsCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingApprovalsCount} Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              All student and parent registrations require Super Administrator sign-off before login access is granted.
            </p>
          </div>

          <button
            onClick={() => navigate('/users')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Users →</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Applicant Name</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Contact Email & Phone</th>
                <th className="py-3.5 px-6">Reference ID</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No pending registration applications. All accounts are up-to-date!
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-700">
                      {u.studentId || u.wardId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status="Pending" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(u.id, u.name)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(u.id, u.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
