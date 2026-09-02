import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', showDot = true }) => {
  const norm = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  // Green / Success
  if (
    norm === 'paid' ||
    norm === 'available' ||
    norm === 'present' ||
    norm === 'resolved' ||
    norm === 'closed' ||
    norm === 'approved' ||
    norm === 'completed' ||
    norm === 'safe' ||
    norm === 'online'
  ) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotColor = 'bg-emerald-500';
  }
  // Yellow / Orange / Pending
  else if (
    norm === 'pending' ||
    norm === 'under review' ||
    norm === 'submitted' ||
    norm === 'in progress' ||
    norm === 'assigned' ||
    norm === 'late' ||
    norm === 'washing' ||
    norm === 'demo mode' ||
    norm === 'demo stream'
  ) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500';
  }
  // Red / Emergency / Danger
  else if (
    norm === 'new' ||
    norm === 'danger' ||
    norm === 'urgent' ||
    norm === 'high' ||
    norm === 'critical' ||
    norm === 'emergency' ||
    norm === 'absent' ||
    norm === 'overdue' ||
    norm === 'failed' ||
    norm === 'rejected' ||
    norm === 'offline' ||
    norm === 'investigating'
  ) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
    dotColor = 'bg-rose-500 animate-pulse';
  }
  // Blue / Info
  else if (
    norm === 'ready' ||
    norm === 'collected' ||
    norm === 'occupied' ||
    norm === 'on leave' ||
    norm === 'false alarm'
  ) {
    colorClasses = 'bg-sky-50 text-sky-800 border-sky-200/80';
    dotColor = 'bg-sky-500';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap tracking-wide ${sizeClasses} ${colorClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      {status}
    </span>
  );
};
