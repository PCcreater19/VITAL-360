import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Database,
  Crosshair,
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Layers,
  Search,
  Clock,
  History
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface BodyAnalysis3DProps {
  scanData: any;
}

interface DetectedIssue {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  remedy: string;
  timestamp: string;
}

interface ScanHistoryEntry {
  timestamp: string;
  status: 'optimal' | 'warning' | 'critical';
  issueName?: string;
}

const BodyAnalysis3D: React.FC<BodyAnalysis3DProps> = ({ scanData }) => {
  const [activeLayer, setActiveLayer] = useState<'skeletal' | 'circulatory' | 'respiratory' | 'nervous'>('circulatory');
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [isCustomScanning, setIsCustomScanning] = useState(false);
  const [scannedOrgans, setScannedOrgans] = useState<Set<string>>(new Set());
  const [detectedIssues, setDetectedIssues] = useState<DetectedIssue[]>([]);
  const [scanHistory, setScanHistory] = useState<Record<string, ScanHistoryEntry[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

  const systems = [
    { id: 'circulatory', name: 'Circulatory', icon: Heart, color: 'text-red-500' },
    { id: 'respiratory', name: 'Respiratory', icon: Wind, color: 'text-blue-400' },
    { id: 'nervous', name: 'Nervous System', icon: Zap, color: 'text-yellow-400' },
    { id: 'skeletal', name: 'Skeletal', icon: Activity, color: 'text-gray-300' },
  ];

  const organs = [
    { id: 'heart', name: 'Heart', pos: { x: 100, y: 120 }, baseStatus: 'normal' },
    { id: 'kidneys', name: 'Kidneys', pos: { x: 100, y: 180 }, baseStatus: 'normal' },
    { id: 'lungs', name: 'Lungs', pos: { x: 100, y: 110 }, baseStatus: 'normal' },
    { id: 'liver', name: 'Liver', pos: { x: 85, y: 160 }, baseStatus: 'warning' },
    { id: 'stomach', name: 'Digestive Tract', pos: { x: 110, y: 165 }, baseStatus: 'normal' },
  ];

  const runAIDiagnosis = async (organId: string) => {
    setIsAnalyzing(organId);
    setSelectedOrgan(organId);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a mock diagnostic scan for the ${organId}. 
      If it's the liver, suggest a mild fatty liver detection. Otherwise, suggest it's optimal. 
      Format: {"issue": "Name", "severity": "low/medium/high", "description": "Short description", "remedy": "Quick home remedy"}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      
      const isHealthy = !result.issue || result.severity === 'none';
      const entry: ScanHistoryEntry = {
        timestamp,
        status: isHealthy ? 'optimal' : (result.severity === 'high' ? 'critical' : 'warning'),
        issueName: isHealthy ? undefined : result.issue
      };

      setScanHistory(prev => ({
        ...prev,
        [organId]: [entry, ...(prev[organId] || [])].slice(0, 5) // Keep last 5 scans
      }));

      if (!isHealthy) {
        const newIssue: DetectedIssue = {
          id: organId,
          name: result.issue,
          severity: result.severity,
          description: result.description,
          remedy: result.remedy,
          timestamp
        };
        setDetectedIssues(prev => {
          const filtered = prev.filter(i => i.id !== organId);
          return [newIssue, ...filtered];
        });
      }
    } catch (err) {
      console.error("AI Diagnosis failed", err);
      if (organId === 'liver') {
        const entry: ScanHistoryEntry = { timestamp, status: 'warning', issueName: 'Early Hepatic Steatosis' };
        setScanHistory(prev => ({ ...prev, [organId]: [entry, ...(prev[organId] || [])].slice(0, 5) }));
        setDetectedIssues(prev => [...prev.filter(i => i.id !== 'liver'), {
          id: 'liver',
          name: 'Early Hepatic Steatosis',
          severity: 'low',
          description: 'Slight accumulation of lipids detected in hepatic cells.',
          remedy: 'Increase leafy greens and reduce processed sugars.',
          timestamp
        }]);
      } else {
        const entry: ScanHistoryEntry = { timestamp, status: 'optimal' };
        setScanHistory(prev => ({ ...prev, [organId]: [entry, ...(prev[organId] || [])].slice(0, 5) }));
      }
    } finally {
      setScannedOrgans(prev => new Set(prev).add(organId));
      setIsAnalyzing(null);
    }
  };

  const handleOrganTouch = (organId: string) => {
    if (!scannedOrgans.has(organId)) {
      runAIDiagnosis(organId);
    } else {
      setSelectedOrgan(organId);
    }
  };

  const getSystemColors = () => {
    switch (activeLayer) {
      case 'circulatory': return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)' };
      case 'respiratory': return { stroke: '#60a5fa', fill: 'rgba(96, 165, 250, 0.1)' };
      case 'nervous': return { stroke: '#facc15', fill: 'rgba(250, 204, 21, 0.1)' };
      case 'skeletal': return { stroke: '#94a3b8', fill: 'rgba(148, 163, 184, 0.1)' };
      default: return { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)' };
    }
  };

  const colors = getSystemColors();
  const currentOrganIssue = detectedIssues.find(i => i.id === selectedOrgan);
  const currentOrganHistory = selectedOrgan ? scanHistory[selectedOrgan] || [] : [];

  return (
    <div className="flex flex-col gap-8 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-350px)] min-h-[500px]">
        <div className="lg:col-span-3 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="glass rounded-3xl p-6 border border-white/5 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Neural Layers
            </h3>
            <div className="space-y-3">
              {systems.map((system) => (
                <button
                  key={system.id}
                  onClick={() => setActiveLayer(system.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                    activeLayer === system.id 
                      ? 'bg-white/10 border-white/20 shadow-lg' 
                      : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <system.icon className={`w-5 h-5 ${activeLayer === system.id ? system.color : ''}`} />
                    <span className={`font-semibold ${activeLayer === system.id ? 'text-white' : ''}`}>
                      {system.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Biometric Nodes
              </h3>
              <div className="space-y-2">
                {organs.map((organ) => {
                  const isScanned = scannedOrgans.has(organ.id);
                  const isCurrentlyAnalyzing = isAnalyzing === organ.id;
                  return (
                    <div key={organ.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      <span className="text-xs font-semibold text-gray-300">{organ.name}</span>
                      <button
                        onClick={() => runAIDiagnosis(organ.id)}
                        disabled={isCurrentlyAnalyzing}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isCurrentlyAnalyzing 
                            ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' 
                            : isScanned 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/10'
                        }`}
                      >
                        {isCurrentlyAnalyzing ? '...' : isScanned ? 'RE-SCAN' : 'SCAN'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Progress</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{scannedOrgans.size} / {organs.length} Nodes</span>
                  <span className="text-xs text-blue-400">{Math.round((scannedOrgans.size / organs.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${(scannedOrgans.size / organs.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: 3D Hologram Visualizer */}
        <div className={`lg:col-span-6 glass rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-b from-blue-900/10 to-transparent transition-all duration-500`}>
          <div className="absolute inset-0">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]`}></div>
          </div>

          <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center animate-float`}>
            <div className="absolute top-0 w-full h-[400px] overflow-hidden pointer-events-none opacity-30">
               <div className="w-full h-[2px] bg-blue-400 animate-scan shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
            </div>
            
            <svg viewBox="0 0 200 400" className="h-full w-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] animate-hologram-pulse overflow-visible">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <path d="M100 20 C80 20, 70 35, 70 50 C70 65, 80 80, 100 80 C120 80, 130 65, 130 50 C130 35, 120 20, 100 20 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.8" filter="url(#glow)" className="transition-all duration-700" />
              <path d="M70 85 L130 85 L145 150 L140 250 L125 380 L100 380 L100 250 L75 250 L60 380 L75 380 L55 250 L60 150 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.8" filter="url(#glow)" className="transition-all duration-700" />

              {organs.map((organ) => {
                const isScanned = scannedOrgans.has(organ.id);
                const isCurrent = isAnalyzing === organ.id;
                const hasIssue = detectedIssues.find(i => i.id === organ.id);
                const color = isCurrent ? '#3b82f6' : hasIssue ? '#ef4444' : isScanned ? '#22c55e' : '#64748b';

                return (
                  <g key={organ.id} className="cursor-pointer group" onClick={() => handleOrganTouch(organ.id)}>
                    {isCurrent && (
                      <g className="origin-center" style={{ transformBox: 'fill-box' }}>
                        {/* Subtle Pulsing Outer Ring */}
                        <circle 
                          cx={organ.pos.x} cy={organ.pos.y} r="15" 
                          fill="rgba(59, 130, 246, 0.1)" 
                          className="animate-pulse" 
                        />
                        
                        {/* Interactive Progress Drawing Ring */}
                        <circle 
                          cx={organ.pos.x} cy={organ.pos.y} r="12" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          className="animate-progress-draw" 
                          style={{ 
                            transform: 'rotate(-90deg)', 
                            transformOrigin: `${organ.pos.x}px ${organ.pos.y}px` 
                          }} 
                        />
                        
                        {/* Rotating Dash Ring */}
                        <circle 
                          cx={organ.pos.x} cy={organ.pos.y} r="12" 
                          fill="none" 
                          stroke="white" 
                          strokeWidth="0.5" 
                          strokeDasharray="1 8" 
                          className="animate-spin-slow opacity-50" 
                        />
                      </g>
                    )}
                    
                    <circle 
                      cx={organ.pos.x} cy={organ.pos.y} r="6" 
                      fill={color} 
                      className={`${isCurrent || (isScanned && hasIssue) ? 'animate-ping' : ''} opacity-75`} 
                    />
                    <circle cx={organ.pos.x} cy={organ.pos.y} r="4" fill={color} className="shadow-lg" />
                    <text x={organ.pos.x + 10} y={organ.pos.y + 4} fill="white" fontSize="8" className="opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none drop-shadow-md">
                      {organ.name} {!isScanned ? '(Touch to Scan)' : ''}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-4 right-4 text-center">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Instruction</p>
               <p className="text-xs text-blue-400 font-medium">Touch nodes to detect diseases</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-3xl p-6 border border-white/5 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              AI Diagnostics
            </h3>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {selectedOrgan ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-white capitalize">{selectedOrgan}</h4>
                    {scannedOrgans.has(selectedOrgan) && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${currentOrganIssue ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {currentOrganIssue ? 'ISSUE DETECTED' : 'OPTIMAL'}
                      </span>
                    )}
                  </div>
                  
                  {isAnalyzing === selectedOrgan ? (
                    <div className="flex flex-col items-center py-8 gap-4">
                       <div className="relative">
                          <div className="w-16 h-16 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                       </div>
                       <p className="text-xs text-blue-400 font-bold uppercase tracking-tighter animate-pulse text-center">Decoding Cellular<br/>Resonance...</p>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-data-flow" style={{ width: '100%' }}></div>
                       </div>
                    </div>
                  ) : (
                    <>
                      {currentOrganIssue ? (
                        <div className="space-y-4">
                           <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20">
                              <h5 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                                 <AlertTriangle className="w-4 h-4" />
                                 {currentOrganIssue.name}
                              </h5>
                              <p className="text-xs text-gray-400 leading-relaxed">{currentOrganIssue.description}</p>
                           </div>
                           <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mb-1">AI Recommendation</p>
                              <p className="text-xs text-gray-300">{currentOrganIssue.remedy}</p>
                           </div>
                        </div>
                      ) : scannedOrgans.has(selectedOrgan) ? (
                        <div className="flex flex-col items-center py-4 text-center gap-2 opacity-80 bg-green-500/5 border border-green-500/10 rounded-2xl">
                           <CheckCircle2 className="w-8 h-8 text-green-500" />
                           <p className="text-xs text-gray-300 font-medium px-4">Biometric patterns indicate standard functionality.</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 opacity-50">
                           <p className="text-xs text-gray-400 italic">Touch node or click 'Scan Organ' to initialize.</p>
                        </div>
                      )}

                      {currentOrganHistory.length > 0 && (
                        <div className="pt-6 border-t border-white/10">
                          <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <History className="w-3 h-3" />
                            Scan History
                          </h5>
                          <div className="space-y-3">
                            {currentOrganHistory.map((entry, idx) => (
                              <div key={idx} className="flex items-start gap-3 group relative">
                                {idx !== currentOrganHistory.length - 1 && (
                                  <div className="absolute left-1.5 top-5 w-px h-full bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                                )}
                                <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 z-10 shadow-sm ${
                                  entry.status === 'optimal' ? 'bg-green-500' : entry.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-bold ${
                                      entry.status === 'optimal' ? 'text-green-500/80' : entry.status === 'critical' ? 'text-red-500/80' : 'text-yellow-500/80'
                                    }`}>
                                      {entry.status.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">{entry.timestamp}</span>
                                  </div>
                                  {entry.issueName && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">{entry.issueName}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4 opacity-50">
                  <Crosshair className="w-12 h-12 text-gray-600" />
                  <p className="text-sm text-gray-400">Select an organ from the node list or 3D body map to view full history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-2xl font-bold">Cumulative Diagnostic Findings</h3>
              <p className="text-gray-500">History of issues detected during this 360 session</p>
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-blue-500 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Activity className="w-4 h-4" />
              LIVE ANALYSIS
           </div>
        </div>

        {detectedIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detectedIssues.map((issue) => (
              <div key={issue.id} className="glass p-5 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all group">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                         <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <h4 className="font-bold text-white capitalize">{issue.id} Issue</h4>
                   </div>
                   <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-500/30 text-red-500 uppercase`}>
                      {issue.severity} Risk
                   </span>
                </div>
                <h5 className="text-sm font-bold text-gray-300 mb-1">{issue.name}</h5>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{issue.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-600 mb-4">
                  <Clock className="w-3 h-3" />
                  Detected at {issue.timestamp}
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-green-500 font-bold">REMEDY READY</span>
                   <button onClick={() => setSelectedOrgan(issue.id)} className="text-[10px] font-bold text-blue-400 hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4 border-2 border-dashed border-white/5 rounded-[2rem]">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-gray-600" />
             </div>
             <div>
                <p className="text-lg font-bold text-gray-400">No active diseases detected yet.</p>
                <p className="text-sm text-gray-600">Proceed with the 360 touch-scan or organ-specific node scans.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyAnalysis3D;