
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  ShieldCheck, 
  Brain, 
  Heart, 
  Stethoscope, 
  LayoutDashboard, 
  Settings, 
  Camera, 
  Fingerprint, 
  Utensils, 
  Dumbbell,
  Wind,
  Layers
} from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Recommendations from './components/Recommendations';
import PersonalityDevelopment from './components/PersonalityDevelopment';
import DailyCheckup from './components/DailyCheckup';
import BodyAnalysis3D from './components/BodyAnalysis3D';
import Onboarding from './components/Onboarding';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  goal: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanComplete, setScanComplete] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const navigation = [
    { id: 'dashboard', name: 'Health 360', icon: LayoutDashboard },
    { id: 'scanner', name: 'Biometric Scan', icon: Fingerprint },
    { id: 'body', name: 'Body Analysis', icon: Layers },
    { id: 'recommendations', name: 'Remedies & Diet', icon: Utensils },
    { id: 'personality', name: 'Growth', icon: Brain },
    { id: 'checkup', name: 'Daily Check', icon: Stethoscope },
  ];

  if (!userProfile) {
    return <Onboarding onComplete={(profile) => setUserProfile(profile)} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen animate-fadeIn">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col glass border-r border-white/10 p-6 fixed h-full z-50">
        <div className="flex items-center gap-2 mb-10">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">VITAL <span className="text-blue-500">360</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 animate-selected-pulse' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4">
            <img src={`https://picsum.photos/seed/${userProfile.name}/100/100`} className="w-10 h-10 rounded-full border border-white/20" alt="Profile" />
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[120px]">{userProfile.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{userProfile.goal}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/10 p-2 rounded-lg border border-green-500/10">
            <ShieldCheck className="w-4 h-4" />
            <span>AI PRIVACY SECURED</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <Header activeTab={activeTab} />
        
        <div className="mt-6 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard scanData={scanData} />}
          {activeTab === 'scanner' && (
            <Scanner 
              onScanComplete={(data) => {
                setScanData(data);
                setScanComplete(true);
                setActiveTab('body'); // Navigate to body analysis after scan
              }} 
            />
          )}
          {activeTab === 'body' && <BodyAnalysis3D scanData={scanData} />}
          {activeTab === 'recommendations' && <Recommendations />}
          {activeTab === 'personality' && <PersonalityDevelopment />}
          {activeTab === 'checkup' && <DailyCheckup />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-50 flex justify-around p-4">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-blue-500 bg-blue-500/10 animate-selected-pulse' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
