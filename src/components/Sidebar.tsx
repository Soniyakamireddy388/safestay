import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  CalendarCheck,
  CreditCard,
  MessageSquareWarning,
  Wrench,
  UserCheck,
  Utensils,
  Shirt,
  Megaphone,
  Bell,
  ShieldAlert,
  Sparkles,
  Camera,
  History,
  Settings,
  LogOut,
  User,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { activeCount } = useEmergency();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const role = user?.role || 'ADMIN';

  // Navigation Items per Role
  const getNavSections = () => {
    if (role === 'ADMIN') {
      return [
        {
          title: 'Overview',
          items: [
            { label: 'Admin Dashboard', to: '/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Safety & Security',
          items: [
            {
              label: 'Safety Center',
              to: '/safety-center',
              icon: ShieldAlert,
              badge: activeCount > 0 ? `${activeCount} ALERT` : undefined,
              badgeType: 'danger',
            },
            { label: 'AI Safety Monitoring', to: '/ai-monitoring', icon: Sparkles },
            { label: 'CCTV Monitoring', to: '/cctv', icon: Camera },
          ],
        },
        {
          title: 'Hostel Management',
          items: [
            { label: 'User Directory', to: '/users', icon: Users },
            { label: 'Rooms & Beds', to: '/rooms', icon: BedDouble },
            { label: 'Room Bookings', to: '/bookings', icon: CalendarCheck },
            { label: 'Finance & Payments', to: '/payments', icon: CreditCard },
          ],
        },
        {
          title: 'Operations',
          items: [
            { label: 'Complaints', to: '/complaints', icon: MessageSquareWarning },
            { label: 'Maintenance', to: '/maintenance', icon: Wrench },
            { label: 'Attendance', to: '/attendance', icon: UserCheck },
            { label: 'Food Menu', to: '/food-menu', icon: Utensils },
            { label: 'Laundry', to: '/laundry', icon: Shirt },
          ],
        },
        {
          title: 'Communication & Logs',
          items: [
            { label: 'Announcements', to: '/announcements', icon: Megaphone },
            { label: 'Audit Logs', to: '/audit-logs', icon: History },
            { label: 'System Settings', to: '/settings', icon: Settings },
          ],
        },
      ];
    }

    if (role === 'WARDEN') {
      return [
        {
          title: 'Command Center',
          items: [
            { label: 'Warden Command', to: '/dashboard', icon: LayoutDashboard },
            {
              label: 'Emergency Alerts',
              to: '/safety-center',
              icon: ShieldAlert,
              badge: activeCount > 0 ? `${activeCount}` : undefined,
              badgeType: 'danger',
            },
            { label: 'CCTV Feeds', to: '/cctv', icon: Camera },
          ],
        },
        {
          title: 'Student Operations',
          items: [
            { label: 'Students & Rooms', to: '/users', icon: Users },
            { label: 'Room Allocation', to: '/rooms', icon: BedDouble },
            { label: 'Night Attendance', to: '/attendance', icon: UserCheck },
            { label: 'Complaints Queue', to: '/complaints', icon: MessageSquareWarning },
            { label: 'Maintenance', to: '/maintenance', icon: Wrench },
          ],
        },
        {
          title: 'Services',
          items: [
            { label: 'Food Menu', to: '/food-menu', icon: Utensils },
            { label: 'Laundry Tracking', to: '/laundry', icon: Shirt },
            { label: 'Broadcast Notice', to: '/announcements', icon: Megaphone },
          ],
        },
      ];
    }

    if (role === 'STUDENT') {
      return [
        {
          title: 'Student Portal',
          items: [
            { label: 'Student Dashboard', to: '/dashboard', icon: LayoutDashboard },
            {
              label: '🚨 Safety Center',
              to: '/safety-center',
              icon: ShieldAlert,
              badge: activeCount > 0 ? 'Active' : undefined,
              badgeType: 'danger',
            },
            { label: 'Explore Rooms', to: '/rooms', icon: BedDouble },
            { label: 'Fee Payments', to: '/payments', icon: CreditCard },
          ],
        },
        {
          title: 'Daily Living',
          items: [
            { label: 'My Complaints', to: '/complaints', icon: MessageSquareWarning },
            { label: 'Maintenance', to: '/maintenance', icon: Wrench },
            { label: 'My Attendance', to: '/attendance', icon: UserCheck },
            { label: 'Weekly Food Menu', to: '/food-menu', icon: Utensils },
            { label: 'Laundry Status', to: '/laundry', icon: Shirt },
            { label: 'Announcements', to: '/announcements', icon: Megaphone },
          ],
        },
      ];
    }

    // PARENT ROLE
    return [
      {
        title: 'Parent Monitoring',
        items: [
          { label: 'Ward Overview', to: '/dashboard', icon: LayoutDashboard },
          { label: 'Safety & Emergency', to: '/safety-center', icon: ShieldAlert },
          { label: 'Attendance Records', to: '/attendance', icon: UserCheck },
          { label: 'Fee Receipts', to: '/payments', icon: CreditCard },
          { label: 'Grievance Status', to: '/complaints', icon: MessageSquareWarning },
          { label: 'Hostel Food Menu', to: '/food-menu', icon: Utensils },
          { label: 'Announcements', to: '/announcements', icon: Megaphone },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation scroll area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            item.badgeType === 'danger'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Section 44: Sidebar User Profile Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
                }
                alt={user?.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div className="overflow-hidden leading-tight">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Soniya Kamireddy'}
                </p>
                <p className="text-[10px] font-semibold text-teal-700 truncate">
                  {user?.role === 'ADMIN' ? 'Super Administrator' : user?.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <NavLink
                to="/profile"
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                title="Profile"
              >
                <User className="w-4 h-4" />
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
