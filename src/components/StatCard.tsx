import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral' | 'danger';
  comparisonText?: string;
  badge?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  comparisonText,
  badge,
  highlight = false,
  onClick,
}) => {
  const trendColors = {
    up: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
    down: 'text-rose-700 bg-rose-50 border-rose-200/60',
    neutral: 'text-slate-600 bg-slate-100 border-slate-200/60',
    danger: 'text-rose-700 bg-rose-100 border-rose-300 font-bold animate-pulse',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-2xl p-5 transition-all duration-200 border ${
        highlight
          ? 'bg-gradient-to-br from-rose-50/90 via-white to-orange-50/60 border-rose-300 shadow-sm hover:shadow-md ring-2 ring-rose-200/60'
          : 'bg-white border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">{value}</h3>
        </div>
        <div
          className={`p-2.5 rounded-xl border ${
            highlight
              ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-600/30'
              : 'bg-slate-100 text-slate-700 border-slate-200/70'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || comparisonText || badge) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {trend && (
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${trendColors[trendDirection]}`}>
                {trend}
              </span>
            )}
            {comparisonText && <span className="text-slate-500 font-medium">{comparisonText}</span>}
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
