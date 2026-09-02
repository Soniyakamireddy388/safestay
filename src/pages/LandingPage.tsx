import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SafeStayLogo } from '../components/SafeStayLogo';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import {
  Shield,
  Sparkles,
  Users,
  CreditCard,
  MessageSquareWarning,
  UserCheck,
  Camera,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building,
  Activity,
  HeartHandshake,
  Layers,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const { openPanicModal } = useEmergency();
  const navigate = useNavigate();

  const handleDemoLaunch = async (role: 'ADMIN' | 'STUDENT' | 'WARDEN' | 'PARENT') => {
    await switchDemoRole(role);
    navigate('/dashboard');
  };

  const featureCards = [
    {
      icon: Sparkles,
      title: 'AI Acoustic Distress Detection',
      description:
        'Acoustic intelligence analyzing sound energy, pitch & MFCC coefficients in corridors to flag potential screams or impact distress.',
      tag: 'Innovation',
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Panic Network',
      description:
        'Two-step authenticated student panic button broadcasting immediate alerts to Wardens, Security, and Admin with SMS notifications.',
      tag: 'Critical Safety',
    },
    {
      icon: Building,
      title: 'Room Booking & Allocation',
      description:
        'Interactive room marketplace with real-time double-booking prevention, bed inventory, and automated room occupancy tracking.',
      tag: 'Operations',
    },
    {
      icon: CreditCard,
      title: 'Hostel Fee Payments',
      description:
        'Transparent fee billing with automated receipt vouchers, payment history, and revenue analytics for hostel management.',
      tag: 'Finance',
    },
    {
      icon: MessageSquareWarning,
      title: 'Grievance Resolution Timeline',
      description:
        'End-to-end complaint system tracking electrical, plumbing, Wi-Fi, and food issues from submission to warden verification.',
      tag: 'Student Living',
    },
    {
      icon: UserCheck,
      title: 'Smart Night Attendance',
      description:
        'Daily curfew and roll-call monitoring with real-time verification and automated attendance summary for parents.',
      tag: 'Parent Monitoring',
    },
    {
      icon: Camera,
      title: 'CCTV Surveillance Prototype',
      description:
        'Simulated multi-angle camera feeds covering entrance, lobby, perimeter gate, and corridor security checkpoints.',
      tag: 'Security',
    },
    {
      icon: HeartHandshake,
      title: 'Food Menu & Laundry Services',
      description:
        'Weekly rotating 4-meal nutritious cafeteria schedule and visual laundry tracking from submission to pickup.',
      tag: 'Hostel Amenities',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <SafeStayLogo size="lg" showTagline={true} />

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Sign In / Register
            </Link>
            <button
              onClick={() => handleDemoLaunch('ADMIN')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/20 transition-all hover:scale-[1.02]"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>B.Tech Project Demonstration Platform</span>
              <span className="text-teal-400">•</span>
              <span className="font-mono text-[11px]">Super Admin: Soniya Kamireddy</span>
            </div>

            {/* Core Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif] leading-[1.15]">
              Smart Hostel Management.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-teal-600 to-emerald-600">
                Safer Student Living.
              </span>
            </h1>

            {/* Secondary Tagline */}
            <p className="mt-4 text-base sm:text-lg font-semibold uppercase tracking-widest text-teal-700 font-mono">
              Manage • Monitor • Connect • Protect
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              SafeStay brings students, parents, wardens, and administrators together in one intelligent centralized
              platform featuring acoustic distress intelligence, automated room booking, and rapid emergency response.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => handleDemoLaunch('ADMIN')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Experience as Admin (Soniya)</span>
              </button>

              <button
                onClick={() => handleDemoLaunch('STUDENT')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs flex items-center gap-2 transition-all hover:border-slate-400"
              >
                <span>Student View (Room A-204)</span>
              </button>

              <button
                onClick={openPanicModal}
                className="px-5 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border border-rose-200 shadow-2xs flex items-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>🚨 Test Emergency Panic</span>
              </button>
            </div>

            {/* Quick 1-click Role Selector Card */}
            <div className="mt-12 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Quick Evaluator Persona Switcher:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs">
                <button
                  onClick={() => handleDemoLaunch('ADMIN')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <span className="font-bold block text-slate-900">Soniya K.</span>
                  <span className="text-[10px] text-indigo-700 font-medium">Super Admin</span>
                </button>
                <button
                  onClick={() => handleDemoLaunch('WARDEN')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <span className="font-bold block text-slate-900">Ramesh C.</span>
                  <span className="text-[10px] text-teal-700 font-medium">Senior Warden</span>
                </button>
                <button
                  onClick={() => handleDemoLaunch('STUDENT')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <span className="font-bold block text-slate-900">Rahul S.</span>
                  <span className="text-[10px] text-sky-700 font-medium">Student (A-204)</span>
                </button>
                <button
                  onClick={() => handleDemoLaunch('PARENT')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <span className="font-bold block text-slate-900">Sunita S.</span>
                  <span className="text-[10px] text-amber-700 font-medium">Ward Parent</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B.Tech Demonstration Overview: Problem, Solution, Innovation, Impact (Section 51) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 font-mono">
              Academic & Demonstration Matrix
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 font-['Outfit',sans-serif]">
              Why SafeStay is Built for Modern Hostels
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs mb-3">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">The Problem</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hostel operations are fragmented across WhatsApp groups, paper registers, unverified night curfews, and
                delayed responses during critical student distress events.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">The Solution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SafeStay centralizes hostel operations into a unified platform with role-based dashboards for Students,
                Parents, Wardens, and Administrators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200">
              <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs mb-3">
                03
              </span>
              <h3 className="text-base font-bold text-teal-950 mb-2">The Innovation</h3>
              <p className="text-xs text-teal-800 leading-relaxed">
                Acoustic intelligence for early detection of potential distress events using MFCC sound feature extraction
                paired with high-priority manual panic broadcast.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">The Impact</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students stay protected, parents have real-time visibility into attendance and safety, wardens respond
                faster, and management maintains complete audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (Section 43) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 font-mono">
              Comprehensive Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2 font-['Outfit',sans-serif]">
              End-to-End Hostel Ecosystem
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Engineered with full-stack REST services, database persistence, and safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 hover:border-slate-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700">
                    <span>Explore module →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 font-mono">
            Presentation-Ready SaaS Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 font-['Outfit',sans-serif]">
            Experience the Future of Hostel Management
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            SafeStay is fully prepared for university evaluations, technical vivas, and real campus deployments. Explore
            with seeded accounts or register a new user today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleDemoLaunch('ADMIN')}
              className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
            >
              Start Super Admin Tour (Soniya Kamireddy)
            </button>
            <Link
              to="/auth"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              Open Login & Registration
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SafeStayLogo size="sm" />
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            <span>SafeStay – Smart Hostel Management Network • B.Tech Project Demonstration</span>
            <span className="block text-[11px] text-slate-600 mt-0.5">
              Supervised Administrator: Soniya Kamireddy • React + Express + MySQL + Python AI Architecture
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
