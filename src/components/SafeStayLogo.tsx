import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const SafeStayLogo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon: Shield + House/Roof + Person silhouette + Safety check */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-800 p-1.5 shadow-md shadow-indigo-950/20 flex items-center justify-center text-white ring-1 ring-white/20`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-teal-400"
        >
          {/* Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-teal-400" />
          {/* Roof/House Apex */}
          <path d="M7 11l5-4 5 4" strokeWidth="2.2" className="text-white" />
          {/* Person silhouette */}
          <circle cx="12" cy="11.5" r="1.5" fill="currentColor" className="text-teal-300" />
          <path d="M9.5 16c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" className="text-white" />
          {/* Subtle Checkmark Badge */}
          <path d="M10 18l1.5 1.5 3-3" strokeWidth="2" className="text-emerald-400" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]} font-['Outfit',sans-serif]`}>
            Safe<span className="text-teal-600">Stay</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Network
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500">
            Smart Hostel Management • Safer Living
          </span>
        )}
      </div>
    </div>
  );
};
