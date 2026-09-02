import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { UserRole } from '../types';
import { Shield, GraduationCap, Users, UserCheck, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react';
import { systemService } from '../services/apiServices';

interface DemoRoleSwitcherProps {
  onOpenAiTester?: () => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onOpenAiTester }) => {
  const { user, switchDemoRole } = useAuth();
  const { openPanicModal, activeCount } = useEmergency();

  const handleResetData = () => {
    if (window.confirm('Reset all demo records back to initial seeded state?')) {
      systemService.resetDemoData();
      window.location.reload();
    }
  };

  const roles: { role: UserRole; name: string; title: string; icon: typeof Shield }[] = [
    { role: 'ADMIN', name: 'Soniya Kamireddy', title: 'Super Admin', icon: Shield },
    { role: 'STUDENT', name: 'Rahul Sharma', title: 'Student (A-204)', icon: GraduationCap },
    { role: 'PARENT', name: 'Sunita Sharma', title: 'Parent', icon: Users },
    { role: 'WARDEN', name: 'Ramesh Chandra', title: 'Senior Warden', icon: UserCheck },
  ];

  return (
    <aside aria-label="Demo role switcher" className="bg-slate-900 text-white border-b border-slate-800 text-xs px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-bold text-[11px] uppercase tracking-wider text-teal-400">
            B.Tech Project Presentation Mode:
          </span>
        </div>

        {/* Role Quick Switch Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map((item) => {
            const Icon = item.icon;
            const isActive = user?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => switchDemoRole(item.role)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all text-xs ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm ring-1 ring-teal-300'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
                title={`Switch to ${item.name} (${item.title})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({item.role})</span>
              </button>
            );
          })}
        </div>

        {/* Utilities: AI Simulation + Student Panic + Reset */}
        <div className="flex items-center gap-2">
          {onOpenAiTester && (
            <button
              onClick={onOpenAiTester}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 font-semibold transition-colors text-xs"
              title="Test AI Acoustic Distress Inference"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Simulate AI Distress</span>
            </button>
          )}

          <button
            onClick={openPanicModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-sm shadow-rose-600/40 animate-pulse"
            title="Trigger Student Emergency Panic Alert"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>🚨 Test Panic</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-700 font-extrabold text-[10px]">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={handleResetData}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset All Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
