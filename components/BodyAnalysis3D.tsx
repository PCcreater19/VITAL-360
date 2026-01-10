import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  Layers, 
  Search, 
  Clock, 
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Crosshair
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
  severityScore: number;
  trend: 'improving' | 'stable' | 'declining' | 'initial';
}

const BodyAnalysis3D: React.FC<BodyAnalysis3DProps> = ({ scanData }) => {
  const [activeLayer, setActiveLayer] = useState<'skeletal' | 'circulatory' | 'respiratory' | 'nervous'>('circulatory');
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [scannedOrgans, setScannedOrgans] = useState<Set<string>>(new Set());
  const [detectedIssues, setDetectedIssues] = useState<DetectedIssue[]>([]);
  const [scanHistory, setScanHistory] = useState<Record<string, ScanHistoryEntry[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'analysis' | 'history'>('analysis');

  const systems = [
    { id: 'circulatory', name: 'Circulatory', icon: Heart, color: 'text-red-500' },
    { id: 'respiratory', name: 'Respiratory', icon: Wind, color: 'text-blue-400' },
    { id: 'nervous', name: 'Nervous System', icon: Zap, color: 'text-yellow-400' },
    { id: 'skeletal', name: 'Skeletal', icon: Activity, color: 'text-gray-300' },
  ];

  const organs = [
    { id: 'heart', name: 'Heart', pos: { x: 100, y: 120 } },
    { id: 'kidneys', name: 'Kidneys', pos: { x: 100, y: 180 } },
    { id: 'lungs', name: 'Lungs', pos: { x: 100, y: 110 } },
    { id: 'liver', name: 'Liver', pos: { x: 85, y: 160 } },
    { id: 'stomach', name: 'Digestive Tract', pos: { x: 110, y: 165 } },
  ];

  const getSeverityScore = (severity: string): number => {
    switch (severity.toLowerCase()) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

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
      const severityScore = getSeverityScore(result.severity || 'none');
      
      const previousEntry = scanHistory[organId]?.[0];
      let trend: ScanHistoryEntry['trend'] = 'initial';
      
      if (previousEntry) {
        if (severityScore < previousEntry.severityScore) trend = 'improving';
        else if (severityScore > previousEntry.severityScore) trend = 'declining';
        else trend = 'stable';
      }

      const entry: ScanHistoryEntry = {
        timestamp,
        status: isHealthy ? 'optimal' : (result.severity === 'high' ? 'critical' : 'warning'),
        issueName: isHealthy ? undefined : result.issue,
        severityScore,
        trend
      };

      setScanHistory(prev => ({
        ...prev,
        [organId]: [entry, ...(prev[organId] || [])].slice(0, 10)
      }));

      if (!isHealthy) {
        setDetectedIssues(prev => {
          const filtered = prev.filter(i => i.id !== organId);
          return [{ id: organId, ...result, timestamp }, ...filtered];
        });
      } else {
        setDetectedIssues(prev => prev.filter(i => i.id !== organId));
      }
    } catch (err) {
      console.error("AI Diagnosis failed", err);
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
      setSidebarMode('analysis');
    }
  };

  const getSystemColors = () => {
    switch (activeLayer) {
      case 'circulatory': return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.08)', aura: 'rgba(239, 68, 68, 0.2)' };
      case 'respiratory': return { stroke: '#60a5fa', fill: 'rgba(96, 165, 250, 0.08)', aura: 'rgba(96, 165, 250, 0.2)' };
      case 'nervous': return { stroke: '#facc15', fill: 'rgba(250, 204, 21, 0.08)', aura: 'rgba(250, 204, 21, 0.2)' };
      case 'skeletal': return { stroke: '#94a3b8', fill: 'rgba(148, 163, 184, 0.08)', aura: 'rgba(148, 163, 184, 0.2)' };
      default: return { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.08)', aura: 'rgba(59, 130, 246, 0.2)' };
    }
  };

  const colors = getSystemColors();
  const currentOrganIssue = detectedIssues.find(i => i.id === selectedOrgan);
  const currentOrganHistory = (selectedOrgan ? (scanHistory[selectedOrgan] || []) : []) as ScanHistoryEntry[];

  const globalHistory = (Object.entries(scanHistory) as [string, ScanHistoryEntry[]][])
    .flatMap(([organId, entries]) => entries.map(e => ({ ...e, organId })))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="flex flex-col gap-8 mt-4 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-350px)] min-h-[600px]">
        {/* Left Sidebar */}
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
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 border ${
                    activeLayer === system.id 
                      ? 'bg-white/10 border-white/20 shadow-xl scale-[1.02] animate-selected-pulse' 
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <system.icon className={`w-5 h-5 transition-all duration-500 ${activeLayer === system.id ? `${system.color} scale-110 drop-shadow-[0_0_8px_currentColor]` : ''}`} />
                    <span className={`font-semibold transition-colors ${activeLayer === system.id ? 'text-white' : ''}`}>
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
                  const isSelected = selectedOrgan === organ.id;
                  const recentTrend = scanHistory[organ.id]?.[0]?.trend;
                  
                  return (
                    <div 
                      key={organ.id} 
                      onClick={() => setSelectedOrgan(organ.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected ? 'bg-blue-600/10 border-blue-500/50 shadow-lg' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>{organ.name}</span>
                        {recentTrend && recentTrend !== 'initial' && recentTrend !== 'stable' && (
                          <div className={recentTrend === 'improving' ? 'text-green-500' : 'text-red-500'}>
                            {recentTrend === 'improving' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          runAIDiagnosis(organ.id);
                        }}
                        disabled={isCurrentlyAnalyzing}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isCurrentlyAnalyzing 
                            ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' 
                            : isScanned 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95'
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
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Diagnostic Yield</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{scannedOrgans.size} / {organs.length} Nodes</span>
                  <span className="text-xs text-blue-400">{Math.round((scannedOrgans.size / organs.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_10px_#3b82f6]" 
                    style={{ width: `${(scannedOrgans.size / organs.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: 3D Hologram Visualizer */}
        <div className="lg:col-span-6 glass rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-b from-blue-900/10 to-transparent transition-all duration-500">
          <div className="absolute inset-0">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse`}></div>
            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          </div>

          <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center animate-float`}>
            <div className="absolute top-0 w-full h-[450px] overflow-hidden pointer-events-none opacity-20">
               <div className="w-full h-[1px] bg-blue-400 animate-scan shadow-[0_0_20px_rgba(96,165,250,1)]"></div>
            </div>
            
            <svg viewBox="0 0 200 400" className="h-full w-auto drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-hologram-pulse overflow-visible select-none">
              <defs>
                <filter id="glow-refined" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Body Skeleton */}
              <path 
                d="M100 20 C80 20, 70 35, 70 50 C70 65, 80 80, 100 80 C120 80, 130 65, 130 50 C130 35, 120 20, 100 20 Z" 
                fill={colors.fill} stroke={colors.stroke} strokeWidth="1" filter="url(#glow-refined)" 
                className="transition-all duration-1000 ease-in-out opacity-60" 
              />
              <path 
                d="M70 85 L130 85 L145 150 L140 250 L125 380 L100 380 L100 250 L75 250 L60 380 L75 380 L55 250 L60 150 Z" 
                fill={colors.fill} stroke={colors.stroke} strokeWidth="1" filter="url(#glow-refined)" 
                className="transition-all duration-1000 ease-in-out opacity-60" 
              />

              {organs.map((organ) => {
                const isScanned = scannedOrgans.has(organ.id);
                const isCurrent = isAnalyzing === organ.id;
                const isSelected = selectedOrgan === organ.id;
                const hasIssue = detectedIssues.find(i => i.id === organ.id);
                const color = isCurrent ? '#3b82f6' : hasIssue ? '#ef4444' : isScanned ? '#22c55e' : '#64748b';

                return (
                  <g 
                    key={organ.id} 
                    className="cursor-pointer group outline-none" 
                    onClick={() => handleOrganTouch(organ.id)}
                    style={{ transformBox: 'fill-box' }}
                  >
                    {/* Magnetic Hit Zone (Invisible but wide) */}
                    <circle 
                      cx={organ.pos.x} cy={organ.pos.y} 
                      r="25" 
                      fill="transparent" 
                    />

                    {/* Aura / Interactive Glow */}
                    <circle 
                      cx={organ.pos.x} cy={organ.pos.y} 
                      r={isSelected || isCurrent ? 28 : 14} 
                      fill={color} 
                      className={`transition-all duration-700 ease-out opacity-0 group-hover:opacity-15 ${isSelected ? 'opacity-25 scale-110' : ''}`}
                    />

                    {/* Issue Aura */}
                    {hasIssue && !isCurrent && (
                      <circle 
                        cx={organ.pos.x} cy={organ.pos.y} r="20" 
                        fill={hasIssue.severity === 'high' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.4)'} 
                        className="animate-pulse" 
                      />
                    )}

                    {/* Progress Ring (Scanning) */}
                    {isCurrent && (
                      <g className="origin-center" style={{ transformBox: 'fill-box' }}>
                        <circle 
                          cx={organ.pos.x} cy={organ.pos.y} r="18" 
                          fill="none" stroke={color} strokeWidth="2.5" 
                          strokeDasharray="1 10" className="animate-spin-slow"
                        />
                        <circle 
                          cx={organ.pos.x} cy={organ.pos.y} r="15" 
                          fill="none" stroke={color} strokeWidth="3" 
                          strokeLinecap="round" className="animate-progress-draw"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                      </g>
                    )}

                    {/* Label (Floating) */}
                    <text 
                      x={organ.pos.x + 14} y={organ.pos.y - 14} 
                      fill="white" fontSize="11" 
                      className={`font-black tracking-tighter transition-all duration-500 pointer-events-none drop-shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 ${isSelected ? 'opacity-100 translate-y-0' : ''}`}
                    >
                      {organ.name}
                    </text>
                    
                    {/* Node Point */}
                    <circle 
                      cx={organ.pos.x} cy={organ.pos.y} 
                      r={isSelected ? 11 : 6.5} 
                      fill={color} 
                      className={`transition-all duration-500 group-hover:scale-125 ${isSelected || isCurrent || (isScanned && hasIssue) ? 'animate-pulse' : ''} opacity-95`} 
                    />
                    <circle 
                      cx={organ.pos.x} cy={organ.pos.y} 
                      r={isSelected ? 7 : 4} 
                      fill={color} 
                      className={`transition-all duration-500 group-hover:scale-125 shadow-[0_0_15px_rgba(255,255,255,0.4)] ${isSelected ? 'stroke-white stroke-[2px]' : ''}`} 
                    />
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-4 right-4 text-center">
               <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black opacity-40">Tactile Interface</p>
               <p className="text-xs text-blue-400 font-bold">Touch nodes for atomic resonance scan</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-3xl p-6 border border-white/5 h-full flex flex-col shadow-2xl">
            <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/5 backdrop-blur-3xl">
              <button 
                onClick={() => setSidebarMode('analysis')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${sidebarMode === 'analysis' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Analysis
              </button>
              <button 
                onClick={() => setSidebarMode('history')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${sidebarMode === 'history' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Timeline
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {sidebarMode === 'analysis' ? (
                selectedOrgan ? (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                      <h4 className="text-xl font-black text-white capitalize tracking-tighter">{selectedOrgan}</h4>
                      {scannedOrgans.has(selectedOrgan) && (
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl ${currentOrganIssue ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-green-500 text-white shadow-lg shadow-green-500/20'}`}>
                          {currentOrganIssue ? 'ISSUE' : 'OPTIMAL'}
                        </span>
                      )}
                    </div>
                    
                    {isAnalyzing === selectedOrgan ? (
                      <div className="flex flex-col items-center py-12 gap-6 glass rounded-2xl border border-blue-500/20 animate-selected-pulse">
                         <div className="relative">
                            <div className="w-24 h-24 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <Activity className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
                         </div>
                         <p className="text-xs text-blue-400 font-black uppercase tracking-widest animate-pulse text-center leading-relaxed">Syncing Neural<br/>Transmitters...</p>
                      </div>
                    ) : (
                      <>
                        {currentOrganIssue ? (
                          <div className="space-y-4">
                             <div className="p-5 bg-red-500/5 rounded-2xl border border-red-500/30 shadow-2xl animate-fadeIn">
                                <h5 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                                   <AlertTriangle className="w-5 h-5" />
                                   {currentOrganIssue.name}
                                </h5>
                                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{currentOrganIssue.description}</p>
                             </div>
                             <div className="p-5 bg-green-500/5 rounded-2xl border border-green-500/30">
                                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mb-2">AI Recovery Strategy</p>
                                <p className="text-xs text-gray-300 font-semibold leading-relaxed">{currentOrganIssue.remedy}</p>
                             </div>
                          </div>
                        ) : scannedOrgans.has(selectedOrgan) ? (
                          <div className="flex flex-col items-center py-10 text-center gap-4 bg-green-500/5 border border-green-500/20 rounded-2xl animate-fadeIn">
                             <div className="p-4 bg-green-500/10 rounded-full shadow-inner">
                               <CheckCircle2 className="w-12 h-12 text-green-500" />
                             </div>
                             <p className="text-xs text-gray-300 font-black px-6 leading-relaxed uppercase tracking-tight">Node Resonance Optimal</p>
                          </div>
                        ) : (
                          <div className="text-center py-12 glass rounded-2xl border border-white/5 opacity-60">
                             <p className="text-xs text-gray-400 italic font-bold">Touch node to calibrate.</p>
                          </div>
                        )}

                        {currentOrganHistory.length > 0 && (
                          <div className="pt-6 border-t border-white/10">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <History className="w-4 h-4" />
                              Historical Trends
                            </h5>
                            <div className="space-y-4">
                              {currentOrganHistory.map((entry, idx) => (
                                <div key={idx} className="flex items-start gap-4 group relative">
                                  {idx !== currentOrganHistory.length - 1 && (
                                    <div className="absolute left-[7px] top-6 w-px h-full bg-white/5 group-hover:bg-white/20 transition-colors"></div>
                                  )}
                                  <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-[#030712] ${
                                    entry.status === 'optimal' ? 'bg-green-500' : entry.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <span className={`text-[10px] font-black tracking-tighter transition-colors ${
                                        entry.status === 'optimal' ? 'text-green-500' : entry.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                                      }`}>
                                        {entry.status.toUpperCase()}
                                      </span>
                                      <span className="text-[10px] text-gray-600 font-mono font-black">{entry.timestamp}</span>
                                    </div>
                                    {entry.issueName && (
                                      <p className="text-[11px] text-gray-500 font-bold">{entry.issueName}</p>
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
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6 opacity-30">
                    <Crosshair className="w-20 h-20 text-gray-600 animate-spin-slow" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">Select biological node<br/>to begin discovery</p>
                  </div>
                )
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <h4 className="text-xs font-black text-white uppercase tracking-tighter flex items-center gap-2 mb-4">
                    <History className="w-4 h-4 text-blue-500" />
                    Global Session Timeline
                  </h4>
                  {globalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {globalHistory.map((entry, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            setSelectedOrgan(entry.organId);
                            setSidebarMode('analysis');
                          }}
                          className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 cursor-pointer group transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{entry.organId} Node</span>
                            <span className="text-[10px] text-gray-600 font-mono">{entry.timestamp}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${entry.status === 'optimal' ? 'text-green-500' : 'text-red-500'}`}>
                              {entry.issueName || 'Optimal Resonance'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-widest">No session logs available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-2xl font-black tracking-tight">Active Pathology Findings</h3>
              <p className="text-gray-500 font-medium">Real-time identification of physiological deviations</p>
           </div>
           <div className="flex items-center gap-2 text-xs font-black text-blue-500 px-5 py-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Activity className="w-4 h-4 animate-pulse" />
              LIVE TELEMETRY
           </div>
        </div>

        {detectedIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detectedIssues.map((issue) => (
              <div 
                key={issue.id} 
                onClick={() => {
                  setSelectedOrgan(issue.id);
                  setSidebarMode('analysis');
                }}
                className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all duration-500 group cursor-pointer hover:scale-[1.03] animate-fadeIn"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
                         <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <h4 className="font-bold text-white capitalize">{issue.id}</h4>
                   </div>
                   <span className={`text-[9px] font-black px-3 py-1 rounded-full border border-red-500/30 text-red-500 uppercase tracking-widest`}>
                      {issue.severity} RISK
                   </span>
                </div>
                <h5 className="text-sm font-bold text-gray-300 mb-2">{issue.name}</h5>
                <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed font-bold">{issue.description}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Protocol Ready</span>
                   <span className="text-[10px] font-black text-blue-400 group-hover:text-white uppercase tracking-widest">Node View →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border-2 border-dashed border-white/5 rounded-[3rem]">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-10 h-10 text-gray-700" />
             </div>
             <div>
                <p className="text-xl font-black text-gray-400 mb-2">Diagnostic Scan: Optimal</p>
                <p className="text-sm text-gray-600 max-w-sm mx-auto font-bold uppercase tracking-tight">No anomalies detected in active buffer.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyAnalysis3D;