import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, CheckCircle, X } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

export const PanicModal: React.FC = () => {
  const { isPanicModalOpen, closePanicModal, triggerManualPanic } = useEmergency();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const [confirmedAlertId, setConfirmedAlertId] = useState<string>('');

  if (!isPanicModalOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const alert = await triggerManualPanic({
        studentName: user?.name || 'Rahul Sharma',
        studentId: user?.studentId || 'STU-2024-089',
        studentPhone: user?.phone || '+91 91234 56780',
        room: user?.roomNumber || 'A-204',
        location: `Block A – Room ${user?.roomNumber || 'A-204'}`,
        hostelBlock: user?.hostelBlock || 'Block A',
      });
      setConfirmedAlertId(alert.id);
      setHasTriggered(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasTriggered(false);
    closePanicModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
        {/* Top Emergency Red Accent Bar */}
        <div className="h-2.5 w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 animate-pulse" />

        <div className="p-6 md:p-8">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!hasTriggered ? (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShieldAlert className="w-9 h-9 animate-bounce" />
              </div>

              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Hostel Emergency Response System
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 font-['Outfit',sans-serif]">
                  Are you sure you want to send an emergency alert?
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Activating this button sends an immediate distress signal to the Senior Warden, Security Command
                  Station, and Super Administrator Soniya Kamireddy. An automated SMS notification is dispatched.
                </p>
              </div>

              {/* Student & Location Preview */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dispatching Student:</span>
                  <span className="font-semibold text-slate-900">{user?.name || 'Rahul Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-semibold font-mono text-slate-900">{user?.studentId || 'STU-2024-089'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designated Room:</span>
                  <span className="font-semibold text-rose-700">{user?.roomNumber || 'A-204'} (Block A)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sensor / Camera Node:</span>
                  <span className="font-semibold text-slate-900">CAM-04 (2nd Floor Corridor)</span>
                </div>
              </div>

              {/* Warning note */}
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  False panic triggers waste emergency staff bandwidth and may incur disciplinary review. Only press in case
                  of physical danger, medical emergency, or security threat.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-lg shadow-rose-600/30 text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Broadcasting Alert...</span>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>Confirm Emergency Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">Alert Dispatched!</h3>
              <p className="text-xs font-mono text-slate-500 mt-1">Alert ID: #{confirmedAlertId}</p>
              <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
                Warden Ramesh Chandra and Campus Guard Station have been notified with high priority. Help is on the way to{' '}
                <strong className="text-slate-900">Room {user?.roomNumber || 'A-204'}</strong>.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">Immediate Safety Protocols:</p>
                <ul className="text-xs text-rose-800 space-y-1.5 list-disc list-inside">
                  <li>Lock room latch securely if inside room</li>
                  <li>Do not leave the room unless fire or physical danger compels</li>
                  <li>Keep phone line clear for Warden call back</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <PhoneCall className="w-4 h-4" />
                  Warden Direct: +91 98450 12345
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <PhoneCall className="w-4 h-4" />
                  Campus Control: 100 / 112
                </span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors text-sm"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
