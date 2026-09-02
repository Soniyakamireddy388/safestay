import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmergencyAlert, AlertStatus } from '../types';
import { emergencyService } from '../services/apiServices';

interface EmergencyContextType {
  alerts: EmergencyAlert[];
  activeCount: number;
  latestAlert: EmergencyAlert | null;
  isPanicModalOpen: boolean;
  openPanicModal: () => void;
  closePanicModal: () => void;
  triggerManualPanic: (studentDetails?: {
    studentName?: string;
    studentId?: string;
    studentPhone?: string;
    room?: string;
    location?: string;
    hostelBlock?: string;
  }) => Promise<EmergencyAlert>;
  triggerAiAlert: (data: {
    location: string;
    room: string;
    hostelBlock: string;
    distressProbability: number;
    confidence: number;
    soundType: string;
    notes?: string;
  }) => Promise<EmergencyAlert>;
  updateAlertStatus: (id: string, status: AlertStatus, notes?: string, acknowledgedBy?: string) => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState<boolean>(false);
  const [latestAlert, setLatestAlert] = useState<EmergencyAlert | null>(null);

  const refreshAlerts = useCallback(async () => {
    const list = await emergencyService.getAlerts();
    setAlerts(list);
    const active = list.filter((a) => a.status === 'New' || a.status === 'Investigating');
    if (active.length > 0) {
      setLatestAlert(active[0]);
    }
  }, []);

  useEffect(() => {
    refreshAlerts();
    const interval = setInterval(refreshAlerts, 5000);
    return () => clearInterval(interval);
  }, [refreshAlerts]);

  const openPanicModal = () => setIsPanicModalOpen(true);
  const closePanicModal = () => setIsPanicModalOpen(false);

  const playEmergencyAudioTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 alert tone
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  };

  const triggerManualPanic = async (studentDetails?: {
    studentName?: string;
    studentId?: string;
    studentPhone?: string;
    room?: string;
    location?: string;
    hostelBlock?: string;
  }) => {
    const newAlert = await emergencyService.triggerManualPanic({
      studentName: studentDetails?.studentName || 'Rahul Sharma',
      studentId: studentDetails?.studentId || 'STU-2024-089',
      studentPhone: studentDetails?.studentPhone || '+91 91234 56780',
      room: studentDetails?.room || 'A-204',
      location: studentDetails?.location || 'Block A – Room A-204',
      hostelBlock: studentDetails?.hostelBlock || 'Block A',
    });
    playEmergencyAudioTone();
    await refreshAlerts();
    return newAlert;
  };

  const triggerAiAlert = async (data: {
    location: string;
    room: string;
    hostelBlock: string;
    distressProbability: number;
    confidence: number;
    soundType: string;
    notes?: string;
  }) => {
    const newAlert = await emergencyService.triggerAiAlert(data);
    playEmergencyAudioTone();
    await refreshAlerts();
    return newAlert;
  };

  const updateAlertStatus = async (id: string, status: AlertStatus, notes?: string, acknowledgedBy?: string) => {
    await emergencyService.updateAlertStatus(id, status, notes, acknowledgedBy);
    await refreshAlerts();
  };

  const activeCount = alerts.filter((a) => a.status === 'New' || a.status === 'Investigating').length;

  return (
    <EmergencyContext.Provider
      value={{
        alerts,
        activeCount,
        latestAlert,
        isPanicModalOpen,
        openPanicModal,
        closePanicModal,
        triggerManualPanic,
        triggerAiAlert,
        updateAlertStatus,
        refreshAlerts,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within an EmergencyProvider');
  return context;
};
