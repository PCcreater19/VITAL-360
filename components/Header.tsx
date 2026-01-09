
import React from 'react';
import { Bell, Search, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Health Intelligence';
      case 'scanner': return 'AI Bio-Scanning';
      case 'body': return 'Body 360 Analysis';
      case 'recommendations': return 'Wellness & Diet';
      case 'personality': return 'Growth & Mindset';
      case 'checkup': return 'Daily Log';
      default: return 'Vital 360';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{getTitle()}</h1>
        <p className="text-gray-500 mt-1">Real-time physiological insights & AI diagnostics</p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search symptoms or data..." 
            className="bg-transparent border-none focus:ring-0 text-sm text-white w-48 outline-none"
          />
        </div>
        <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">Today</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
