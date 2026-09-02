import React, { useState, useRef, useEffect } from 'react';
import { SafeStayLogo } from './SafeStayLogo';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  AlertTriangle,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Shield,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { activeCount, latestAlert, openPanicModal } = useEmergency();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Active Emergency Alert Ticker Banner */}
      {activeCount > 0 && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-2xl">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              🚨 <strong>ACTIVE SAFETY ALERT:</strong> {latestAlert?.source === 'AI_AUDIO_DETECTION' ? 'Potential Distress Detected by AI' : 'Manual Emergency Trigger'} at {latestAlert?.location || 'Block A – Floor 2'}
            </span>
          </div>
          <button
            onClick={() => navigate('/safety-center')}
            className="text-[11px] font-bold underline hover:text-amber-200 whitespace-nowrap ml-3"
          >
            Review in Safety Center →
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center">
            <SafeStayLogo size="md" showTagline={false} />
          </Link>
        </div>

        {/* Center/Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Student Specific: Highly visible 🚨 EMERGENCY / PANIC button (Section 13) */}
          <button
            id="global-panic-btn"
            onClick={openPanicModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Press in case of physical safety or medical emergency"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>🚨 EMERGENCY / PANIC</span>
          </button>

          {/* Notification Bell (Section 38) */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No notifications yet.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.actionUrl) {
                            setIsNotifOpen(false);
                            navigate(notif.actionUrl);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                          !notif.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span
                            className={`font-semibold ${
                              notif.severity === 'danger'
                                ? 'text-rose-700 font-bold'
                                : notif.severity === 'success'
                                ? 'text-emerald-700'
                                : 'text-slate-900'
                            }`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-snug line-clamp-2">{notif.message}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {notif.category}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown (Section 44) */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
                }
                alt={user?.name || 'User avatar'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{user?.name || 'Soniya Kamireddy'}</div>
                <div className="text-[10px] font-semibold text-teal-700 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-teal-600" />
                  {user?.role || 'ADMIN'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 p-1.5">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Profile & Info
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  System Settings
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
