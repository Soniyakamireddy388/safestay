import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/apiServices';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  MessageSquareWarning,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Building,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // New Complaint Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [description, setDescription] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>(user?.roomNumber || 'A-204');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data);
      if (data.length > 0 && !activeComplaint) {
        setActiveComplaint(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await complaintService.createComplaint({
        studentId: user?.studentId || 'STU-2024-089',
        studentName: user?.name || 'Rahul Sharma',
        roomNumber,
        category,
        urgency,
        title,
        description,
      });

      showToast('Grievance Logged', `Complaint #${created.id} has been submitted to Warden.`, 'success');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      loadComplaints();
      setActiveComplaint(created);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: ComplaintStatus) => {
    try {
      const updated = await complaintService.updateComplaintStatus(
        complaintId,
        newStatus,
        `Status updated to ${newStatus} by ${user?.name || 'Warden'}`
      );
      showToast('Status Updated', `Ticket #${complaintId} marked as ${newStatus}`, 'info');
      loadComplaints();
      setActiveComplaint(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = complaints.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    return true;
  });

  const timelineSteps: ComplaintStatus[] = [
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
  ];

  const getStepIndex = (status: ComplaintStatus) => {
    return timelineSteps.indexOf(status);
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Grievances & Complaints Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end transparent grievance tracking with verified timeline steps and warden assignment.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Raise New Complaint</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-500">Filters:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Food">Food</option>
            <option value="Internet">Internet</option>
            <option value="Room">Room</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {timelineSteps.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filtered.length} of {complaints.length} grievances
        </span>
      </div>

      {/* Main Split Screen: Tickets List on Left (5 cols), Detailed Timeline on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Complaints List (Left) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3 max-h-[750px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No complaints matching filter.</div>
          ) : (
            filtered.map((comp) => {
              const isSelected = activeComplaint?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setActiveComplaint(comp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-200/60 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">#{comp.id}</span>
                    <StatusBadge status={comp.status} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{comp.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{comp.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-700">{comp.category}</span>
                    <span>Room {comp.roomNumber}</span>
                    <span>{comp.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Complaint Detail & Vertical Timeline (Right) (Section 16) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {activeComplaint ? (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Ticket Ref #{activeComplaint.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {activeComplaint.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Urgency: {activeComplaint.urgency}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {activeComplaint.title}
                  </h2>
                </div>

                <StatusBadge status={activeComplaint.status} size="md" />
              </div>

              {/* Student Metadata Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Lodge By:</span>
                  <span className="font-bold text-slate-900">{activeComplaint.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Room Number:</span>
                  <span className="font-bold text-slate-900">{activeComplaint.roomNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Officer:</span>
                  <span className="font-bold text-indigo-700">{activeComplaint.assignedTo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Logged Date:</span>
                  <span className="font-semibold text-slate-700">{activeComplaint.createdAt}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Student Grievance Statement:
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {activeComplaint.description}
                </div>
              </div>

              {/* Section 16: Visual Vertical Step Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Lifecycle Progress Timeline:
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineSteps.map((stepName, index) => {
                    const activeIndex = getStepIndex(activeComplaint.status);
                    const isPassed = index <= activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                      <div key={stepName} className="relative flex items-start gap-3.5">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isCurrent
                              ? 'bg-indigo-600 border-indigo-200 ring-4 ring-indigo-100'
                              : isPassed
                              ? 'bg-emerald-600 border-emerald-200 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isPassed && !isCurrent && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-indigo-700 font-extrabold' : isPassed ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {stepName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stepName === 'Submitted'
                              ? 'Initial grievance received by SafeStay dispatch system'
                              : stepName === 'Under Review'
                              ? 'Warden Ramesh Chandra reviewed issue details'
                              : stepName === 'Assigned'
                              ? `Assigned to ${activeComplaint.assignedTo}`
                              : stepName === 'In Progress'
                              ? 'Technician on-site fixing reported problem'
                              : stepName === 'Resolved'
                              ? 'Work completed and verified by student signature'
                              : 'Ticket officially archived in system'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warden / Admin Actions (Advance Status) */}
              {(user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
                <div className="pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Warden Command Actions:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(activeComplaint.id, 'Under Review')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Set Under Review
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(activeComplaint.id, 'Assigned')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Set Assigned
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(activeComplaint.id, 'In Progress')}
                      className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-800"
                    >
                      Set In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(activeComplaint.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(activeComplaint.id, 'Closed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                    >
                      Close Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">Select a grievance to view details.</div>
          )}
        </div>
      </div>

      {/* New Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Student Grievance Service
                </span>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif]">Lodge Hostel Complaint</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grievance Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Food">Food</option>
                    <option value="Internet">Internet</option>
                    <option value="Room">Room</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room / Location:</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken study lamp power socket in A-204"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Explanation:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain when the problem occurred and what needs fixing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Logging Ticket...' : 'Submit to Warden Queue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
