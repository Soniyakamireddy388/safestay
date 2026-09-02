import React, { useState, useEffect } from 'react';
import { auditService } from '../services/apiServices';
import { AuditLog } from '../types';
import { Shield, Search, Filter, History, CheckCircle2, Lock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadLogs = async () => {
      const data = await auditService.getLogs();
      setLogs(data);
    };
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Security Audit Trail & System Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable system event ledger tracking emergency actions, financial settlements, and access grants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            Append-Only Secure Log
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by actor, action type, or details..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-medium focus:outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Actor</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Event Details</th>
                <th className="py-3.5 px-6">IP Address</th>
                <th className="py-3.5 px-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 font-sans">{log.actor}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-sans font-bold">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-indigo-700 font-sans">{log.action}</td>
                  <td className="py-3.5 px-6 text-slate-700 font-sans">{log.details}</td>
                  <td className="py-3.5 px-6 text-slate-400">{log.ipAddress}</td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Audited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
