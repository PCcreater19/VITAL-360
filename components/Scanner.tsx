
import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Camera, Shield, Zap, AlertCircle, Activity, ChevronRight, Search } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ScannerProps {
  onScanComplete: (data: any) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [scanStage, setScanStage] = useState<'idle' | 'scanning' | 'camera' | 'analyzing'>('idle');
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScan = () => {
    setScanStage('scanning');
    setProgress(0);
  };

  useEffect(() => {
    if (scanStage === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStage('camera');
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [scanStage]);

  useEffect(() => {
    if (scanStage === 'camera' && !cameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        })
        .catch(err => console.error("Camera access denied", err));
    }
  }, [scanStage, cameraActive]);

  const captureAndAnalyze = async () => {
    setScanStage('analyzing');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate a short, professional-sounding medical summary for a biometric scan showing 72 BPM. Mention that the 3D analysis is now ready for deep touch-based diagnostic discovery. Keep it under 40 words.',
      });

      onScanComplete({
        heart: { value: 72, unit: 'BPM', status: 'normal' },
        kidneys: { value: 'Optimal', unit: '', status: 'normal' },
        external: { value: 'No anomalies', unit: '', status: 'normal' },
        bodyScore: 88,
        summary: response.text || "Primary vitals established. Deep-tissue 3D mapping is now active. Please proceed to the touch-scan stage to identify localized anomalies."
      });
    } catch (err) {
      console.error("AI analysis failed", err);
      onScanComplete({
        heart: { value: 72, unit: 'BPM', status: 'normal' },
        kidneys: { value: 'Optimal', unit: '', status: 'normal' },
        external: { value: 'No anomalies', unit: '', status: 'normal' },
        bodyScore: 88,
        summary: "Primary vitals established. Deep-tissue 3D mapping is now active. Please proceed to the touch-scan stage to identify localized anomalies."
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
          <Zap className="w-3 h-3" />
          Quantum Diagnostics
        </div>
        <h2 className="text-4xl font-extrabold text-white leading-tight">
          Detect Internal Anomalies by <span className="gradient-text">Neural Touch</span>
        </h2>
        <p className="text-lg text-gray-400">
          VITAL 360 identifies diseases through atomic-level resonance. Start with a master biometric lock-in, then move to the interactive 3D map for organ-specific detection.
        </p>

        <div className="space-y-4">
           <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 bg-white/5">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                 <Fingerprint className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                 <h4 className="font-bold text-white">1. Master Touch Scan</h4>
                 <p className="text-xs text-gray-500">Establishing physiological baseline via fingerprint resonance.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 ml-auto" />
           </div>
           
           <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5">
              <div className="p-3 bg-purple-600/20 rounded-xl">
                 <Search className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                 <h4 className="font-bold text-white">2. Discovery Mode</h4>
                 <p className="text-xs text-gray-500">Touch individual organs in the 3D model to find hidden issues.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 ml-auto" />
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 glass rounded-[2.5rem] border border-white/10 relative overflow-hidden min-h-[500px]">
        {scanStage === 'idle' && (
          <button 
            onClick={startScan}
            className="group relative flex flex-col items-center gap-6"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 group-hover:bg-blue-500/30 transition-all"></div>
            <div className="w-32 h-32 flex items-center justify-center bg-blue-600 rounded-full border-4 border-blue-400/50 shadow-2xl shadow-blue-500/40 relative z-10 transition-transform group-active:scale-95">
              <Fingerprint className="w-16 h-16 text-white" />
            </div>
            <div className="text-center z-10">
              <p className="text-xl font-bold text-white mb-1">Fingerprint Lock-In</p>
              <p className="text-sm text-gray-400">Hold to synchronize your AI health profile</p>
            </div>
          </button>
        )}

        {scanStage === 'scanning' && (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full" style={{ 
                clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%, ${progress}% 150%, -50% 150%)`,
                transition: 'clip-path 0.1s linear'
              }}></div>
              <Fingerprint className="w-20 h-20 text-blue-500 animate-pulse" />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-blue-500 font-bold uppercase tracking-widest">Master Resonance Sync...</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {scanStage === 'camera' && (
          <div className="flex flex-col items-center gap-6 w-full h-full">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass border border-white/10">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-70" />
              <div className="scan-line"></div>
              <div className="absolute top-4 left-4 bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-[30px] border-black/20"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-tighter">
                Visual Bio-ID Required
              </div>
            </div>
            <button 
              onClick={captureAndAnalyze}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              <Camera className="w-5 h-5" />
              Finalize Calibration
            </button>
          </div>
        )}

        {scanStage === 'analyzing' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Activity className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mt-4">Calibrating Discovery Map...</h3>
            <p className="text-gray-400 max-w-xs">Baseline established. Initializing 360 organ nodes for interactive diagnosis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
