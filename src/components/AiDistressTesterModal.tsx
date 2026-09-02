import React, { useState } from 'react';
import { Sparkles, Mic, Activity, AlertOctagon, CheckCircle2, X, RefreshCw, Volume2, ShieldCheck } from 'lucide-react';
import { aiService } from '../services/apiServices';
import { useEmergency } from '../context/EmergencyContext';

interface AiDistressTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoom?: string;
  defaultLocation?: string;
}

export const AiDistressTesterModal: React.FC<AiDistressTesterModalProps> = ({
  isOpen,
  onClose,
  defaultRoom = 'A-204',
  defaultLocation = 'Block A – Floor 2 Corridor',
}) => {
  const { refreshAlerts } = useEmergency();
  const [selectedScenario, setSelectedScenario] = useState<string>('scream');
  const [room, setRoom] = useState<string>(defaultRoom);
  const [location, setLocation] = useState<string>(defaultLocation);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: 'SAFE' | 'DANGER';
    distressProbability: number;
    confidence: number;
    detectedAt: string;
    soundType: string;
    processedLatencyMs: number;
  } | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scream',
      label: 'High-Pitch Scream & Sudden Impact',
      soundType: 'Acoustic peak >85dB with scream harmonic frequency profile',
      isDistress: true,
      typicalDistress: '92% - 96%',
    },
    {
      id: 'glass',
      label: 'Glass Break Followed by Distress Call',
      soundType: 'Resonant transient shatter with vocal distress harmonics',
      isDistress: true,
      typicalDistress: '90% - 94%',
    },
    {
      id: 'chat',
      label: 'Casual Student Conversation & Ambient Music',
      soundType: 'Standard speech formant range 100Hz–3kHz, ambient 45dB',
      isDistress: false,
      typicalDistress: '10% - 16%',
    },
    {
      id: 'footsteps',
      label: 'Corridor Footsteps & Door Latch Click',
      soundType: 'Low-frequency mechanical thuds without vocal distress',
      isDistress: false,
      typicalDistress: '5% - 12%',
    },
  ];

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      const active = scenarios.find((s) => s.id === selectedScenario);
      const res = await aiService.analyzeAudio({
        room,
        location,
        isDistressSimulation: active?.isDistress,
        audioLabel: active?.soundType,
      });

      setResult({
        status: res.status,
        distressProbability: res.distressProbability,
        confidence: res.confidence,
        detectedAt: res.detectedAt,
        soundType: res.soundType,
        processedLatencyMs: res.processedLatencyMs,
      });

      if (res.status === 'DANGER') {
        await refreshAlerts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 p-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-300 font-mono">
              FastAPI + Librosa Acoustic Service Simulation
            </span>
          </div>
          <h3 className="text-2xl font-bold font-['Outfit',sans-serif]">Acoustic Distress AI Analyzer</h3>
          <p className="text-xs text-slate-300 mt-1">
            Test acoustic intelligence pipeline for early detection of potential student distress events.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Pipeline Diagram */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Neural Processing Pipeline:
            </p>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 gap-1 overflow-x-auto pb-1">
              <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap">
                1. Audio Input
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap">
                2. Noise Filter
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap">
                3. MFCC & Pitch
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg shadow-2xs whitespace-nowrap">
                4. ML Classifier
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-1 bg-teal-50 border border-teal-200 text-teal-700 font-bold rounded-lg shadow-2xs whitespace-nowrap">
                5. Human Verify
              </span>
            </div>
          </div>

          {/* Scenario Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Acoustic Sound Profile:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedScenario === sc.id
                      ? sc.isDistress
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-teal-50/80 border-teal-400 ring-2 ring-teal-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      {sc.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        sc.isDistress ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sc.isDistress ? 'DANGER TRIGGER' : 'SAFE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{sc.soundType}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Expected: {sc.typicalDistress}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Room Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Room Node:</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Corridor Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-900 to-teal-800 hover:from-slate-800 hover:to-teal-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing MFCC Coefficients & Classifying...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-300" />
                <span>Run Acoustic AI Inference Simulation</span>
              </>
            )}
          </button>

          {/* Result Output */}
          {result && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                result.status === 'DANGER'
                  ? 'bg-gradient-to-br from-rose-50 via-white to-orange-50 border-rose-300'
                  : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.status === 'DANGER' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {result.status === 'DANGER' ? (
                      <AlertOctagon className="w-6 h-6 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Inference Outcome
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {result.status === 'DANGER' ? 'Potential Distress Event' : 'Acoustic Environment Normal'}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 font-mono font-['Outfit',sans-serif]">
                    {result.distressProbability}%
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">Distress Probability</span>
                </div>
              </div>

              {/* Acoustic Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs text-slate-700 p-3 rounded-xl bg-white/80 border border-slate-200/60 mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Model Confidence</span>
                  <span className="font-semibold text-slate-900 font-mono">{result.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Latency</span>
                  <span className="font-semibold text-slate-900 font-mono">{result.processedLatencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Acoustic Sensor</span>
                  <span className="font-semibold text-indigo-700 font-mono">AS-{room}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 mb-2">
                <strong className="text-slate-800">Classified Spectral Pattern:</strong> {result.soundType}
              </div>

              {result.status === 'DANGER' && (
                <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2">
                  <span className="font-medium">
                    Threshold (&gt;=90%) reached! Emergency alert has been broadcast to Warden Command Center.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Mandatory Safety Disclaimer (Section 25) */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
            <p>
              <strong>Important Safety Disclaimer:</strong> AI detection indicates a potential distress event and
              requires human verification. It does not confirm that an emergency has occurred. Always deploy physical staff
              for ground verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
