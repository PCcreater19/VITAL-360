
import React, { useState } from 'react';
import { User, Activity, Target, Zap, ChevronRight, Fingerprint, ShieldCheck } from 'lucide-react';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  goal: string;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: 'Other',
    goal: 'Longevity'
  });

  const goals = ['Weight Loss', 'Muscle Gain', 'Longevity', 'Mental Focus', 'Disease Prevention'];
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712] p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="glass w-full max-w-xl rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl relative z-10 animate-fadeIn">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">VITAL <span className="text-blue-500">360</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Neural Identity Protocol</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">Initialize Identity</h2>
                <p className="text-gray-400 text-sm">Please establish your biological profile to calibrate the AI intelligence engine.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      required
                      type="number"
                      placeholder="Age"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                    >
                      {genders.map(g => <option key={g} value={g} className="bg-[#030712]">{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">Health Objective</h2>
                <p className="text-gray-400 text-sm">Targeting your neural focus allows the AI to prioritize relevant physiological markers.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setProfile({ ...profile, goal })}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      profile.goal === goal 
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Target className={`w-5 h-5 ${profile.goal === goal ? 'text-blue-500' : 'text-gray-600'}`} />
                      <span className="font-bold text-sm uppercase tracking-wider">{goal}</span>
                    </div>
                    {profile.goal === goal && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-95 group"
            >
              {step === 1 ? 'Configure Profile' : 'Synchronize Identity'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              AES-256 Biometric Encryption Enabled
            </div>
          </div>
        </form>

        <div className="mt-8 flex justify-center gap-1.5">
          <div className={`h-1 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'}`}></div>
          <div className={`h-1 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
