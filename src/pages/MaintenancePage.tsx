import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/apiServices';
import { Complaint, ComplaintStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [tasks, setTasks] = useState<Complaint[]>([]);

  const loadTasks = async () => {
    try {
      const data = await complaintService.getComplaints();
      setTasks(data.filter((c) => ['Electrical', 'Plumbing', 'Cleaning', 'Room'].includes(c.category)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdate = async (id: string, status: ComplaintStatus) => {
    try {
      await complaintService.updateComplaintStatus(id, status);
      showToast('Maintenance Work Order Updated', `Status changed to ${status}.`, 'info');
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Facility Maintenance & Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plumbing, electrical, sanitation, and civil infrastructure service logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {tasks.length} Active Work Orders
          </span>
        </div>
      </div>

      {/* Grid of Work Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-slate-400">#{task.id}</span>
                <StatusBadge status={task.status} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-amber-50 text-amber-700">
                  <Wrench className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-xs text-slate-900">{task.category}</span>
                <span className="text-[10px] text-slate-400 font-medium">• Room {task.roomNumber}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] mb-1">{task.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                <span>Assigned: <strong className="text-slate-800">{task.assignedTo}</strong></span>
                <span>{task.createdAt.split(' ')[0]}</span>
              </div>

              {(user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
                <div className="flex items-center gap-2">
                  {task.status !== 'In Progress' && task.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdate(task.id, 'In Progress')}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors"
                    >
                      Start Work
                    </button>
                  )}
                  {task.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdate(task.id, 'Resolved')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
