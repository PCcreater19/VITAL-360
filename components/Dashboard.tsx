
import React from 'react';
import { Heart, Activity, Droplets, User, ShieldAlert, Thermometer, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '08:00', heart: 65, stress: 20 },
  { name: '10:00', heart: 72, stress: 45 },
  { name: '12:00', heart: 85, stress: 30 },
  { name: '14:00', heart: 78, stress: 60 },
  { name: '16:00', heart: 74, stress: 40 },
  { name: '18:00', heart: 70, stress: 25 },
];

const Dashboard: React.FC<{ scanData: any }> = ({ scanData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
      {/* Left Column: Metrics */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            icon={<Heart className="text-red-500" />} 
            label="Heart Rate" 
            value={scanData?.heart?.value || 72} 
            unit="BPM" 
            status="Stable"
            color="red"
          />
          <MetricCard 
            icon={<Activity className="text-blue-500" />} 
            label="Kidney Function" 
            value={scanData?.kidneys?.value || '98%'} 
            unit="" 
            status="Healthy"
            color="blue"
          />
          <MetricCard 
            icon={<Droplets className="text-cyan-500" />} 
            label="Hydration" 
            value="2.4" 
            unit="L" 
            status="Good"
            color="cyan"
          />
        </div>

        {/* Vital Graph */}
        <div className="glass rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Biometric Trends</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Heart
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Stress
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="heart" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHeart)" strokeWidth={3} />
                <Area type="monotone" dataKey="stress" stroke="#a855f7" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Analysis */}
        <div className="glass rounded-[2rem] p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            AI Pathology Analysis
          </h3>
          <div className="space-y-4">
            <AnalysisItem 
              organ="Lungs" 
              status="Normal" 
              detail="No signs of congestion or respiratory distress." 
              score={94} 
            />
            <AnalysisItem 
              organ="Skin (External)" 
              status="Normal" 
              detail="Surface-level analysis via camera shows no UV damage or malignant moles." 
              score={98} 
            />
            <AnalysisItem 
              organ="Liver" 
              status="Observation" 
              detail="Slightly elevated fat-processing signals. Monitor diet." 
              score={82} 
            />
          </div>
        </div>
      </div>

      {/* Right Column: 3D Model Placeholder */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass rounded-[2rem] p-6 border border-white/5 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/50 via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">3D Neural Map Active</span>
            </div>

            {/* Stylized Human SVG Placeholder */}
            <svg viewBox="0 0 200 400" className="w-48 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <path 
                d="M100 20 C80 20, 70 35, 70 50 C70 65, 80 80, 100 80 C120 80, 130 65, 130 50 C130 35, 120 20, 100 20 Z" 
                fill="#1e293b" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
              />
              <path 
                d="M70 85 L130 85 L145 150 L140 250 L125 380 L100 380 L100 250 L75 250 L60 380 L75 380 L55 250 L60 150 Z" 
                fill="#1e293b" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
              />
              {/* Hotspots */}
              <circle cx="100" cy="120" r="6" fill="#ef4444" className="animate-ping" />
              <circle cx="100" cy="120" r="4" fill="#ef4444" />
              <circle cx="85" cy="180" r="4" fill="#3b82f6" />
              <circle cx="115" cy="180" r="4" fill="#3b82f6" />
            </svg>

            <div className="mt-8 grid grid-cols-2 gap-2 w-full">
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bio Score</p>
                <p className="text-xl font-bold">{scanData?.bodyScore || 85}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Metabolic</p>
                <p className="text-xl font-bold">Optimal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6 border border-white/5 bg-gradient-to-br from-blue-600/20 to-transparent">
          <h4 className="font-bold mb-2">Privacy Assurance</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Your health data is decentralized and stored in your private local enclave. No biometric signals are transmitted to central servers.
          </p>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase cursor-pointer hover:underline">
            Learn Responsibility & Ethics →
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, unit: string, status: string, color: string }> = ({ 
  icon, label, value, unit, status, color 
}) => (
  <div className="glass rounded-3xl p-5 border border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 bg-white/5 rounded-xl`}>{icon}</div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-${color}-500/10 text-${color}-500`}>
        {status}
      </span>
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  </div>
);

const AnalysisItem: React.FC<{ organ: string, status: string, detail: string, score: number }> = ({ organ, status, detail, score }) => (
  <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors">
    <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl text-xs font-bold shrink-0">
      {score}%
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h5 className="font-bold text-sm">{organ}</h5>
        <span className={`text-[10px] font-bold ${status === 'Normal' ? 'text-green-500' : 'text-yellow-500'}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
  </div>
);

export default Dashboard;
