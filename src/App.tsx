import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoRoleSwitcher } from './components/DemoRoleSwitcher';
import { PanicModal } from './components/PanicModal';
import { AiDistressTesterModal } from './components/AiDistressTesterModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { WardenDashboard } from './pages/WardenDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { RoomsPage } from './pages/RoomsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { AiMonitoringPage } from './pages/AiMonitoringPage';
import { CctvPage } from './pages/CctvPage';
import { AttendancePage } from './pages/AttendancePage';
import { FoodMenuPage } from './pages/FoodMenuPage';
import { LaundryPage } from './pages/LaundryPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast notifications floating viewport
 */
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200 ${
            t.type === 'danger'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : t.type === 'success'
              ? 'bg-emerald-950/95 text-white border-emerald-800'
              : t.type === 'warning'
              ? 'bg-amber-950/95 text-white border-amber-800'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {t.type === 'danger' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : t.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            <h5 className="font-bold text-sm leading-tight">{t.title}</h5>
            <p className="mt-0.5 text-slate-300 leading-snug">{t.message}</p>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * Main Authenticated App Layout Shell with Sidebar, Navbar, and Modals
 */
const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isPanicModalOpen, closePanicModal } = useEmergency();
  const [isAiTesterOpen, setIsAiTesterOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Evaluator Role Switcher Bar */}
      <DemoRoleSwitcher onOpenAiDistress={() => setIsAiTesterOpen(true)} />

      {/* Primary Navigation Bar */}
      <Navbar onOpenAiDistress={() => setIsAiTesterOpen(true)} />

      {/* Main Two-Column Structure: Sidebar (fixed/desktop) + Scrollable Main Content */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar onOpenAiDistress={() => setIsAiTesterOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <PanicModal isOpen={isPanicModalOpen} onClose={closePanicModal} />
      <AiDistressTesterModal isOpen={isAiTesterOpen} onClose={() => setIsAiTesterOpen(false)} />
      <ToastContainer />
    </div>
  );
};

/**
 * Role-Based Dashboard Auto-Redirect
 */
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'WARDEN':
      return <Navigate to="/warden" replace />;
    case 'STUDENT':
      return <Navigate to="/student" replace />;
    case 'PARENT':
      return <Navigate to="/parent" replace />;
    default:
      return <Navigate to="/student" replace />;
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmergencyProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected Authenticated App Layout */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/warden" element={<WardenDashboard />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/safety-center" element={<SafetyCenterPage />} />
                <Route path="/ai-monitoring" element={<AiMonitoringPage />} />
                <Route path="/cctv" element={<CctvPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/food-menu" element={<FoodMenuPage />} />
                <Route path="/laundry" element={<LaundryPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </EmergencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
