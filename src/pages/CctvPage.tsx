import React, { useState, useEffect } from 'react';
import { Camera, ShieldCheck, Activity, Maximize2, RefreshCw, AlertTriangle } from 'lucide-react';

export const CctvPage: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [selectedCam, setSelectedCam] = useState<string>('CAM-01');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    updateTime();
    const interval = setInterval(updateTime, 200);
    return () => clearInterval(interval);
  }, []);

  const cameras = [
    {
      id: 'CAM-01',
      name: 'Main Entrance & Security Gate',
      zone: 'Perimeter Checkpoint',
      fps: '30 FPS',
      resolution: '1080p FHD',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop&q=80',
      motion: 'Vehicle in Gate Lane',
    },
    {
      id: 'CAM-02',
      name: 'Block A Ground Floor Lobby',
      zone: 'Turnstiles & Reception',
      fps: '30 FPS',
      resolution: '1080p FHD',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
      motion: 'Normal Resident Footfall',
    },
    {
      id: 'CAM-03',
      name: 'Block A 2nd Floor Corridor',
      zone: 'Acoustic Sensor AS-02 Vicinity',
      fps: '30 FPS',
      resolution: '1080p FHD',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      motion: 'No Anomaly Detected',
    },
    {
      id: 'CAM-04',
      name: 'Central Cafeteria & Dining Hall',
      zone: 'Meal Area',
      fps: '30 FPS',
      resolution: '1080p FHD',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      motion: 'Dining Shift Active',
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            CCTV Surveillance Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulated high-definition surveillance feeds with timestamp overlay and motion recognition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            LIVE RTSP FEED • {timeStr}
          </span>
        </div>
      </div>

      {/* 4 Camera Feeds Grid (Section 30) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cameras.map((cam) => (
          <div
            key={cam.id}
            onClick={() => setSelectedCam(cam.id)}
            className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative group cursor-pointer"
          >
            {/* Camera Video Simulation Canvas */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={cam.image}
                alt={cam.name}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500 filter contrast-125 grayscale-[30%]"
              />

              {/* Scanline & Grid Effect */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

              {/* Top Camera HUD Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold tracking-wider">{cam.id} • REC</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] text-teal-400 border border-white/10">
                  {timeStr}
                </div>
              </div>

              {/* Center Motion Detection Bounding Box Simulation */}
              <div className="absolute inset-x-12 inset-y-16 border border-teal-400/50 rounded-lg pointer-events-none">
                <span className="absolute -top-2.5 left-2 bg-teal-900/90 text-teal-300 text-[9px] font-mono px-1 rounded border border-teal-500/40 uppercase">
                  MOTION TARGET • AI 98.4%
                </span>
              </div>

              {/* Bottom Watermark Overlay (Section 30: DEMO STREAM WATERMARK) */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                <div className="leading-tight">
                  <div className="font-bold text-sm tracking-wide text-white">{cam.name}</div>
                  <div className="text-[10px] text-slate-400">{cam.zone}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider">
                    DEMO STREAM
                  </span>
                  <span className="text-[10px] text-slate-400">{cam.fps}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>Motion: {cam.motion}</span>
              </span>
              <span className="text-teal-400 font-mono text-[11px] font-semibold">{cam.resolution}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
