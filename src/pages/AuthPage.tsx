import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SafeStayLogo } from '../components/SafeStayLogo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, switchDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState<string>('soniya@safestay.in');
  const [loginPassword, setLoginPassword] = useState<string>('admin123');
  const [loginRole, setLoginRole] = useState<UserRole>('ADMIN');

  // Register Form
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('STUDENT');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regStudentId, setRegStudentId] = useState<string>('');
  const [regWardId, setRegWardId] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login(loginEmail, loginRole);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Authentication failed.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
        studentId: regRole === 'STUDENT' ? regStudentId : undefined,
        wardId: regRole === 'PARENT' ? regWardId : undefined,
      });

      setSuccessMsg(
        'Registration submitted successfully! Your account status is PENDING APPROVAL by Administrator Soniya Kamireddy. You can log in once approved.'
      );
      // Clear form
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegStudentId('');
      setRegWardId('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Registration failed.');
      }
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    await switchDemoRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Left Side: SafeStay Branding & Hostel Illustration Artwork (Section 8) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <SafeStayLogo size="lg" className="brightness-125 text-white" />
            </Link>
            <p className="text-xs text-teal-300 font-mono mt-3 uppercase tracking-wider font-semibold">
              Manage • Monitor • Connect • Protect
            </p>
          </div>

          {/* Center Graphic: Modern Hostel & Safety Architecture */}
          <div className="my-8 relative z-10">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Acoustic Distress AI</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Real-time sound classification with instant warden notification.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Double-Booking Guard</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Automated bed inventory preventing duplicate room occupancy.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Centralized Role Access</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Dedicated portals for Students, Parents, Wardens, and Admins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Demo Banner */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-[11px] text-slate-400">
              Primary Administrator: <strong className="text-white">Soniya Kamireddy</strong>
            </p>
            <p className="text-[10px] text-teal-400 font-mono mt-0.5">B.Tech Full-Stack + AI Demonstration</p>
          </div>
        </div>

        {/* Right Side: Login / Register Card (Section 8) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Tab Selector */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`text-sm font-bold pb-2 -mb-4 transition-colors border-b-2 ${
                    isLoginTab
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In to SafeStay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`text-sm font-bold pb-2 -mb-4 transition-colors border-b-2 ${
                    !isLoginTab
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  New Registration
                </button>
              </div>

              <span className="text-[11px] font-semibold text-slate-400">Secure JWT Session</span>
            </div>

            {/* Error & Success Toasts */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN TAB */}
            {isLoginTab ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Select Your Role:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['ADMIN', 'WARDEN', 'STUDENT', 'PARENT'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setLoginRole(r);
                          if (r === 'ADMIN') {
                            setLoginEmail('soniya@safestay.in');
                          } else if (r === 'WARDEN') {
                            setLoginEmail('ramesh.warden@safestay.in');
                          } else if (r === 'STUDENT') {
                            setLoginEmail('rahul.sharma@student.edu');
                          } else {
                            setLoginEmail('sunita.sharma@parents.in');
                          }
                        }}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                          loginRole === r
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address / Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="name@safestay.in"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Sign In as {loginRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* REGISTRATION TAB (Section 8) */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        placeholder="e.g. Arjun Nambiar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="PARENT">Parent</option>
                      <option value="WARDEN">Warden</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        placeholder="arjun@student.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        placeholder="+91 93456 78901"
                      />
                    </div>
                  </div>
                </div>

                {regRole === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll / ID</label>
                    <input
                      type="text"
                      required
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="e.g. STU-2025-142"
                    />
                  </div>
                )}

                {regRole === 'PARENT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ward's Student ID</label>
                    <input
                      type="text"
                      required
                      value={regWardId}
                      onChange={(e) => setRegWardId(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="e.g. STU-2024-089"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Policy Notice:</strong> New student and parent registrations require Super Administrator approval.
                  Status will be marked <strong>PENDING APPROVAL</strong> until verified.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Registration</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Demo Logins for Evaluator Ease (Section 36) */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Instant 1-Click Demo Logins:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block truncate">Soniya K.</span>
                <span className="text-[10px] text-teal-700">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('WARDEN')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block truncate">Ramesh C.</span>
                <span className="text-[10px] text-indigo-700">Warden</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block truncate">Rahul S.</span>
                <span className="text-[10px] text-sky-700">Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('PARENT')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block truncate">Sunita S.</span>
                <span className="text-[10px] text-amber-700">Parent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
