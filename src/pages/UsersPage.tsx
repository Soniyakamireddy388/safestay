import React, { useState, useEffect } from 'react';
import { userService } from '../services/apiServices';
import { User, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  GraduationCap,
  Heart,
  ShieldAlert,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await userService.approveUser(userId);
      showToast('Account Approved', 'Resident registration approved and active.', 'success');
      loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await userService.rejectUser(userId);
      showToast('Registration Rejected', 'Applicant account flagged.', 'info');
      loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    if (selectedRole !== 'ALL' && u.role !== selectedRole) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.studentId && u.studentId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return Shield;
      case 'WARDEN':
        return ShieldAlert;
      case 'PARENT':
        return Heart;
      default:
        return GraduationCap;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Hostel Residents & Staff Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Role-based user records, pending resident approvals, and room association.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {users.length} Total Users Registered
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Administrators</option>
            <option value="WARDEN">Wardens</option>
            <option value="STUDENT">Students</option>
            <option value="PARENT">Parents</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">User / Resident</th>
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Room / Identifier</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const RoleIcon = getRoleIcon(u.role);
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-800 text-[11px]">
                        <RoleIcon className="w-3 h-3 text-slate-500" />
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 font-mono">
                      {u.roomNumber ? `Room ${u.roomNumber}` : u.studentId || 'N/A'}
                    </td>

                    <td className="py-3.5 px-6 text-slate-600">{u.phone}</td>

                    <td className="py-3.5 px-6">
                      <StatusBadge status={u.status} />
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      {u.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Verified Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
