import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Camera, Shield, Zap, AlertCircle, Activity, ChevronRight, Search, RefreshCw, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ScannerProps {
  onScanComplete: (data: any) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [scanStage, setScanStage] = useState<'idle' | 'scanning' | 'camera' | 'analyzing'>('idle');
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
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

  const requestCameraAccess = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error("Camera access denied", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDismissedError') {
        setPermissionError("Camera access was dismissed or blocked. Vital 360 requires visual bio-identification to proceed.");
      } else {
        setPermissionError("Could not access camera. Please ensure it is not being used by another application.");
      }
    }
  };

  useEffect(() => {
    if (scanStage === 'camera' && !cameraActive && !permissionError) {
      requestCameraAccess();
    }
  }, [scanStage, cameraActive, permissionError]);

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
           <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 bg-white/5 hover:border-blue-500/30 transition-all group">
              <div className="p-3 bg-blue-600/20 rounded-xl group-hover:scale-110 transition-transform">
                 <Fingerprint className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                 <h4 className="font-bold text-white">1. Master Touch Scan</h4>
                 <p className="text-xs text-gray-500">Establishing physiological baseline via fingerprint resonance.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 ml-auto group-hover:translate-x-1 transition-transform" />
           </div>
           
           <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="p-3 bg-purple-600/20 rounded-xl group-hover:scale-110 transition-transform">
                 <Search className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                 <h4 className="font-bold text-white">2. Discovery Mode</h4>
                 <p className="text-xs text-gray-500">Touch individual organs in the 3D model to find hidden issues.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 ml-auto group-hover:translate-x-1 transition-transform" />
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 glass rounded-[2.5rem] border border-white/10 relative overflow-hidden min-h-[500px]">
        {scanStage === 'idle' && (
          <button 
            onClick={startScan}
            className="group relative flex flex-col items-center gap-8"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full scale-150 animate-pulse"></div>
            <div className="w-40 h-40 flex items-center justify-center bg-blue-600 rounded-full border-4 border-blue-400/50 shadow-2xl shadow-blue-500/40 relative z-10 transition-all group-hover:scale-105 group-active:scale-95 animate-selected-pulse">
              <Fingerprint className="w-20 h-20 text-white animate-pulse" />
            </div>
            <div className="text-center z-10">
              <p className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Initialize Lock-In</p>
              <p className="text-sm text-gray-400 font-medium">Establish your AI health resonance profile</p>
            </div>
          </button>
        )}

        {scanStage === 'scanning' && (
          <div className="flex flex-col items-center gap-10 w-full animate-fadeIn">
            <div className="w-56 h-56 rounded-full border-4 border-white/5 flex items-center justify-center relative bg-white/5">
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-selected-pulse" style={{ 
                clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%, ${progress}% 150%, -50% 150%)`,
                transition: 'clip-path 0.1s linear'
              }}></div>
              <Fingerprint className="w-24 h-24 text-blue-500 animate-pulse" />
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-[10px] mb-3">
                <span className="text-blue-500 font-black uppercase tracking-[0.2em] animate-pulse">Neural Resonance Syncing...</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {scanStage === 'camera' && (
          <div className="flex flex-col items-center gap-8 w-full h-full animate-fadeIn">
            {permissionError ? (
              <div className="flex flex-col items-center text-center p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] max-w-sm animate-fadeIn">
                <div className="p-4 bg-red-500/10 rounded-full mb-6">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">Camera Access Required</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  {permissionError}
                </p>
                <button 
                  onClick={requestCameraAccess}
                  className="flex items-center gap-3 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 animate-selected-pulse"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <p className="mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  If blocked, please check your browser settings
                </p>
              </div>
            ) : (
              <>
                <div className="relative w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden glass border border-blue-500/30 shadow-2xl animate-selected-pulse">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
                  <div className="scan-line shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                  <div className="absolute top-6 left-6 bg-red-500 w-3 h-3 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none"></div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/80 backdrop-blur-xl rounded-full text-xs text-white font-black uppercase tracking-widest border border-white/10 shadow-2xl">
                    Visual Bio-ID Required
                  </div>
                </div>
                {cameraActive && (
                  <button 
                    onClick={captureAndAnalyze}
                    className="flex items-center gap-3 px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all shadow-xl active:scale-95 animate-selected-pulse"
                  >
                    <Camera className="w-6 h-6" />
                    Finalize Calibration
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {scanStage === 'analyzing' && (
          <div className="flex flex-col items-center gap-6 text-center animate-fadeIn">
            <div className="relative">
              <div className="w-28 h-28 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
              <Activity className="absolute inset-0 m-auto w-12 h-12 text-blue-500 animate-pulse" />
              <div className="absolute inset-0 animate-selected-pulse rounded-full opacity-30"></div>
            </div>
            <h3 className="text-3xl font-black mt-4 uppercase tracking-tighter">Calibrating Discovery Map...</h3>
            <p className="text-gray-400 max-w-xs font-medium leading-relaxed">Baseline established. Initializing 360 organ nodes for deep-touch diagnosis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;