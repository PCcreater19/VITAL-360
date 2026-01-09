
import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, ChevronRight, MessageSquare, Plus } from 'lucide-react';
import AudioTranscriber from './AudioTranscriber';

const DailyCheckup: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "7 AM Biometric Touch Scan", completed: true },
    { id: 2, text: "Hydration Goal: 2.5L", completed: false },
    { id: 3, text: "Morning Yoga (Sun Salutations)", completed: true },
    { id: 4, text: "Nutrition: High Protein Lunch", completed: false },
    { id: 5, text: "15 Min Focus Meditation", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      <div className="lg:col-span-8 space-y-6">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Daily Protocol</h3>
            <button className="p-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${
                  task.completed ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500" />
                  )}
                  <span className={`font-semibold ${task.completed ? 'text-white line-through opacity-50' : 'text-gray-200'}`}>
                    {task.text}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-500 ${task.completed ? 'opacity-0' : 'opacity-100'}`} />
              </div>
            ))}
          </div>
        </div>

        <AudioTranscriber />

        <div className="glass p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-bold">Chat with AI Doctor</h4>
              <p className="text-sm text-gray-500">Ask about symptoms or adjustments to your protocol</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-bold transition-all">
            Open Chat
          </button>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="glass p-6 rounded-[2rem] border border-white/5">
          <h4 className="font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            Monthly Consistency
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  i < 15 ? 'bg-blue-600 text-white' : i === 15 ? 'bg-white/20 text-white animate-pulse' : 'bg-white/5 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-2xl">
            <p className="text-xs text-gray-500 mb-1">Current Streak</p>
            <p className="text-2xl font-extrabold">15 Days</p>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border border-white/5 bg-gradient-to-br from-red-600/10 to-transparent">
          <h4 className="font-bold mb-2">Checkup Alert</h4>
          <p className="text-sm text-gray-400 mb-4">
            You missed your evening hydration log. Optimal metabolism requires 500ml of water before 10 PM.
          </p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-red-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckup;
