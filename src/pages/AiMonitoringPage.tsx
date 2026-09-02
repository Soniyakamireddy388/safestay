import React, { useState } from 'react';
import { aiService } from '../services/apiServices';
import { useEmergency } from '../context/EmergencyContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Sparkles,
  Mic,
  Activity,
  Sliders,
  AlertOctagon,
  CheckCircle2,
  ShieldAlert,
  Volume2,
  RefreshCw,
  Cpu,
  Layers,
  HelpCircle,
  Play,
  Square,
  ShieldCheck,
} from 'lucide-react';

export const AiMonitoringPage: React.FC = () => {
  const { refreshAlerts } = useEmergency();
  const { showToast } = useNotifications();

  const [threshold, setThreshold] = useState<number>(90);
  const [selectedProfile, setSelectedProfile] = useState<string>('scream');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    status: 'SAFE' | 'DANGER';
    distressProbability: number;
    confidence: number;
    soundType: string;
    latency: number;
  } | null>(null);

  const sampleAudios = [
    {
      id: 'scream',
      title: 'Vocal Scream & Sudden Impact',
      soundType: 'Acoustic peak >85dB with scream harmonic frequency profile',
      isDistress: true,
      desc: 'High acoustic energy in 1.2kHz–4kHz range matching human distress patterns.',
    },
    {
      id: 'glass',
      title: 'Glass Shatter & Cry for Help',
      soundType: 'Resonant transient shatter with vocal distress harmonics',
      isDistress: true,
      desc: 'Sharp transient frequency dispersion followed by distress speech harmonics.',
    },
    {
      id: 'conversation',
      title: 'Normal Student Hallway Chat',
      soundType: 'Standard speech formant range 100Hz–3kHz, ambient 45dB',
      isDistress: false,
      desc: 'Regular conversational cadence without panic peak frequency.',
    },
    {
      id: 'door',
      title: 'Door Latch & Normal Footsteps',
      soundType: 'Low-frequency mechanical thuds without vocal distress',
      isDistress: false,
      desc: 'Routine hallway acoustic noise beneath distress threshold.',
    },
  ];

  const handleRunInference = async (audioProfileId: string) => {
    setIsSimulating(true);
    setAnalysisResult(null);

    try {
      const profile = sampleAudios.find((a) => a.id === audioProfileId);
      const res = await aiService.analyzeAudio({
        room: 'A-204',
        location: 'Block A – Floor 2 Corridor (AS-02)',
        isDistressSimulation: profile?.isDistress,
        audioLabel: profile?.soundType,
      });

      setAnalysisResult({
        status: res.status,
        distressProbability: res.distressProbability,
        confidence: res.confidence,
        soundType: res.soundType,
        latency: res.processedLatencyMs,
      });

      if (res.status === 'DANGER') {
        showToast(
          'Potential Distress Event Detected',
          `Distress probability ${res.distressProbability}% exceeds threshold (${threshold}%). Warden notified.`,
          'danger'
        );
        await refreshAlerts();
      } else {
        showToast('Acoustic Environment Normal', `Distress probability ${res.distressProbability}% is safe.`, 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-teal-500/20 text-teal-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-300">
              Acoustic Intelligence Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            AI Safety & Acoustic Distress Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Early detection of potential distress events through MFCC sound energy analysis, noise filtration, and real-time inference.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>4 Corridor Nodes Active</span>
        </div>
      </div>

      {/* Section 25: Neural Pipeline Architecture Visualizer */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Acoustic Distress Detection Pipeline
            </h3>
            <p className="text-xs text-slate-500">FastAPI backend + Librosa feature engineering + Classification model</p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
            Librosa 0.10.1 + Scikit-Learn
          </span>
        </div>

        {/* Pipeline Step Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: '1. Audio Stream',
              desc: 'Corridor Acoustic Nodes (44.1kHz PCM stream)',
              detail: 'Noise Floor ~38dB',
            },
            {
              step: '2. Noise Filtration',
              desc: 'Bandpass Butterworth filter (80Hz–6kHz)',
              detail: 'Attenuates HVAC noise',
            },
            {
              step: '3. Feature Extraction',
              desc: 'MFCC (20 coeff), Pitch F0, RMS Energy & Spectral Flux',
              detail: 'Computed every 250ms',
            },
            {
              step: '4. ML Model Inference',
              desc: 'RandomForest / DNN Distress Classifier',
              detail: 'Outputs Probability 0–100%',
            },
            {
              step: '5. Human Verification',
              desc: 'Threshold &gt;=90% triggers Warden Dispatch',
              detail: 'Ground patrol confirmation',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between ${
                idx === 3
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium'
                  : idx === 4
                  ? 'bg-teal-50/70 border-teal-300 text-teal-950 font-medium'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}
            >
              <div>
                <span className="font-bold block text-slate-900 text-xs mb-1">{item.step}</span>
                <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-400">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sound Simulation & Threshold Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sensitivity & Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Inference Parameters & Sensitivity
            </h3>
            <p className="text-xs text-slate-500">Fine-tune emergency distress trigger threshold</p>
          </div>

          {/* Threshold Slider (Section 25) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Distress Threshold:</span>
              <span className="font-mono font-black text-slate-900 text-sm">{threshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="98"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>70% (High Sensitivity)</span>
              <span>90% (Recommended)</span>
              <span>98% (Conservative)</span>
            </div>
          </div>

          {/* Active Sensor Nodes */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Active Acoustic Corridors:
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Block A – Floor 1 (AS-01)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active (39dB)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Block A – Floor 2 (AS-02)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active (42dB)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Block B – Floor 1 (AS-03)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active (36dB)
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Safety Disclaimer (Section 25) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Important Safety Disclaimer:</strong> AI detection indicates a potential distress event and
              requires human verification. It does not confirm that an emergency has occurred.
            </p>
          </div>
        </div>

        {/* Right: Sound Profiles & Inference Playground (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Test Sound Wave Profiles
            </h3>
            <p className="text-xs text-slate-500">
              Select an acoustic profile to run simulated neural inference against the SafeStay audio pipeline.
            </p>
          </div>

          {/* Sound Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleAudios.map((audio) => (
              <div
                key={audio.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{audio.title}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        audio.isDistress
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {audio.isDistress ? 'DANGER TEST' : 'SAFE BASELINE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{audio.desc}</p>
                </div>

                <button
                  onClick={() => handleRunInference(audio.id)}
                  disabled={isSimulating}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Play className="w-3 h-3 text-teal-300" />
                  <span>Test This Sound</span>
                </button>
              </div>
            ))}
          </div>

          {/* Inference Result Output */}
          {analysisResult && (
            <div
              className={`p-6 rounded-3xl border transition-all ${
                analysisResult.status === 'DANGER'
                  ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300 shadow-md'
                  : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                      analysisResult.status === 'DANGER' ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    {analysisResult.status === 'DANGER' ? (
                      <AlertOctagon className="w-7 h-7 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Inference Status
                    </span>
                    <h4 className="text-xl font-bold text-slate-900">
                      {analysisResult.status === 'DANGER'
                        ? 'POTENTIAL DISTRESS EVENT'
                        : 'ACOUSTIC ENVIRONMENT SAFE'}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900 font-mono font-['Outfit',sans-serif]">
                    {analysisResult.distressProbability}%
                  </span>
                  <span className="block text-[10px] font-bold text-slate-500">Distress Probability</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-white/80 p-3 rounded-2xl border border-slate-200/60 mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="font-bold text-slate-900 font-mono">{analysisResult.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Processing Latency</span>
                  <span className="font-bold text-slate-900 font-mono">{analysisResult.latency} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Acoustic Energy</span>
                  <span className="font-bold text-indigo-700 font-mono">87.4 dB</span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <strong>Acoustic Harmonic Classification:</strong> {analysisResult.soundType}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
