
import React, { useState, useEffect } from 'react';
import { Brain, Star, TrendingUp, Target, Coffee, Compass, Zap, Activity, Info, Utensils } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PersonalityDevelopment: React.FC = () => {
  const [brainEfficiency, setBrainEfficiency] = useState(88);
  const [aiInsight, setAiInsight] = useState("Initializing neural analysis...");
  const [isLoading, setIsLoading] = useState(true);

  // Simulated daily cognitive energy data
  const cognitiveData = [
    { time: '06:00', level: 60 },
    { time: '09:00', level: 95 },
    { time: '12:00', level: 85 },
    { time: '15:00', level: 70 },
    { time: '18:00', level: 82 },
    { time: '21:00', level: 45 },
  ];

  useEffect(() => {
    const fetchBrainInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate a 2-sentence brain performance forecast for a user with 85% emotional intelligence and a high-magnesium diet. Mention how their diet is specifically boosting their brain efficiency today.',
        });
        setAiInsight(response.text || "Your high magnesium intake is stabilizing neural firing, allowing your strategic thinking to peak 15% higher than your weekly average.");
      } catch (err) {
        setAiInsight("Your optimized diet is currently fueling a high-focus state. Expect peak cognitive resonance for the next 4 hours.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrainInsight();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personality & Brain Intelligence</h2>
          <p className="text-gray-500">Syncing cognitive growth with physiological fuel</p>
        </div>
        <div className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-600/30 flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">LVL 24 Mindset</span>
        </div>
      </div>

      {/* Hero: Brain Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Cognitive Forecast</span>
              </div>
              <h3 className="text-4xl font-black text-white">
                <span className="text-purple-500">{brainEfficiency}%</span> Daily Brain Capacity
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                {isLoading ? "Neural networks calculating..." : aiInsight}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Growth Factor</p>
                  <p className="text-lg font-bold text-white">+12% Resiliency</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Dietary Fuel</p>
                  <p className="text-lg font-bold text-green-400">Omega-Rich</p>
                </div>
              </div>
            </div>

            <div className="w-48 h-48 relative flex items-center justify-center">
               <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse"></div>
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <path 
                    d="M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C70 85, 85 70, 85 50 C85 30, 70 15, 50 15 Z" 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="1" 
                    strokeDasharray="4 2"
                    className="animate-spin-slow"
                    style={{ animationDuration: '20s' }}
                  />
                  <Brain className="w-20 h-20 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-hologram-pulse" />
                  <circle cx="50" cy="50" r="45" stroke="#a855f7" strokeWidth="0.5" fill="none" opacity="0.2" />
               </svg>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 glass p-6 rounded-[2.5rem] border border-white/5">
           <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-300">Energy Timeline</h4>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Predicted Mental Peaks</span>
           </div>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cognitiveData}>
                  <defs>
                    <linearGradient id="colorCognitive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#a855f7" 
                    fillOpacity={1} 
                    fill="url(#colorCognitive)" 
                    strokeWidth={3} 
                    className="animate-data-flow"
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 flex items-center gap-3 p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
              <Info className="w-4 h-4 text-purple-400" />
              <p className="text-[10px] text-gray-400">Current levels are optimized for complex problem solving until 2:00 PM.</p>
           </div>
        </div>
      </div>

      {/* Trait & Skill Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Growth Momentum
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SkillItem name="Emotional Intelligence" level={85} trend="+2.4%" icon={<Coffee className="w-4 h-4 text-blue-400" />} />
              <SkillItem name="Focus & Attention" level={72} trend="+1.1%" icon={<Target className="w-4 h-4 text-red-400" />} />
              <SkillItem name="Communication Flow" level={64} trend="-0.5%" icon={<Brain className="w-4 h-4 text-green-400" />} />
              <SkillItem name="Strategic Thinking" level={91} trend="+4.8%" icon={<Compass className="w-4 h-4 text-purple-400" />} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-purple-500" />
                 </div>
                 <h4 className="font-bold">Today's Cognitive Task</h4>
              </div>
              <p className="text-sm text-gray-400 mb-4">Practice active listening for 15 minutes. Your current focus levels (72%) are ideal for this exercise.</p>
              <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">Complete Goal →</button>
            </div>
            
            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-green-500/10 rounded-lg">
                    <Utensils className="w-5 h-5 text-green-500" />
                 </div>
                 <h4 className="font-bold">Dietary Brain Boost</h4>
              </div>
              <p className="text-sm text-gray-400 mb-4">Your "High Magnesium" diet is currently reducing neural noise. This is boosting your Strategic Thinking by 4%.</p>
              <button className="text-xs font-bold text-green-400 hover:text-green-300 transition-colors">View Nutrition Plan →</button>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-[2.5rem] border border-white/5 h-fit">
          <h3 className="text-xl font-bold mb-6">Trait Evolution</h3>
          <div className="space-y-6">
            <TraitBar label="Openness" percentage={78} color="blue" />
            <TraitBar label="Conscientiousness" percentage={92} color="green" />
            <TraitBar label="Extraversion" percentage={45} color="purple" />
            <TraitBar label="Agreeableness" percentage={82} color="orange" />
            <TraitBar label="Resilience" percentage={88} color="red" />
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-400">
               <Activity className="w-4 h-4" />
               LONG-TERM SHIFT
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "Your profile shows a strong shift towards structured discipline over the last 30 days. This correlates with the 22% increase in consistent morning hydration."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillItem: React.FC<{ name: string, level: number, trend: string, icon: React.ReactNode }> = ({ name, level, trend, icon }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold text-gray-200">{name}</span>
      </div>
      <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${level}%` }}></div>
    </div>
  </div>
);

const TraitBar: React.FC<{ label: string, percentage: number, color: string }> = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs">
      <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">{label}</span>
      <span className="font-bold text-white">{percentage}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default PersonalityDevelopment;
