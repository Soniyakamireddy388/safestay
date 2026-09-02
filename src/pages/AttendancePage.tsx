import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/apiServices';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Search,
  Filter,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-02');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadAttendance = async () => {
    try {
      const data = await attendanceService.getRecords();
      setRecords(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleMarkAttendance = async (studentId: string, status: AttendanceStatus) => {
    try {
      await attendanceService.markAttendance(studentId, status, selectedDate);
      showToast('Attendance Recorded', `Status updated to ${status}.`, 'success');
      loadAttendance();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = records.filter((r) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return r.studentName.toLowerCase().includes(q) || r.roomNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Night Curfew Attendance & Roll-Call
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daily 9:30 PM hostel curfew tracking with parent notification and biometric verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            Attendance Rate: 92.4%
          </span>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Total Roll-Call</span>
          <span className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">{records.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Block A & B Residents</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block uppercase">Present in Room</span>
          <span className="text-2xl font-bold text-emerald-800 font-['Outfit',sans-serif]">{presentCount}</span>
          <span className="text-[11px] text-emerald-600 block mt-1">Cleared before 9:30 PM</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 block uppercase">Late Arrivals</span>
          <span className="text-2xl font-bold text-amber-800 font-['Outfit',sans-serif]">{lateCount}</span>
          <span className="text-[11px] text-amber-600 block mt-1">Parent SMS dispatched</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 block uppercase">Unaccounted / Absent</span>
          <span className="text-2xl font-bold text-rose-800 font-['Outfit',sans-serif]">{absentCount}</span>
          <span className="text-[11px] text-rose-600 block mt-1">Warden physical check</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-slate-500">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Roll Number</th>
                <th className="py-3.5 px-6">Room Number</th>
                <th className="py-3.5 px-6">Check-in Time</th>
                <th className="py-3.5 px-6">Verification Method</th>
                <th className="py-3.5 px-6">Status</th>
                {(user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
                  <th className="py-3.5 px-6 text-right">Quick Mark Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">{record.studentName}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-600">{record.studentId}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{record.roomNumber}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{record.time}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {record.verifiedBy}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={record.status} />
                  </td>
                  {(user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'Present')}
                          className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px]"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'Late')}
                          className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px]"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'Absent')}
                          className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px]"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
