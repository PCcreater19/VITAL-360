
import React from 'react';
import { Leaf, Utensils, Wind, Clock, Thermometer, ShieldCheck } from 'lucide-react';

const Recommendations: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personalized Wellness</h2>
          <p className="text-gray-500">AI-curated treatments and nutritional protocols</p>
        </div>
        <div className="px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Natural Path First</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Home Remedies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-green-500" />
            <h3 className="font-bold">Home Remedies</h3>
          </div>
          <RemedyCard 
            title="Ginger & Turmeric Infusion"
            reason="Based on digestive signals"
            benefit="Anti-inflammatory & Digestive Aid"
            reliefTime="2-4 hours"
          />
          <RemedyCard 
            title="Eucalyptus Inhalation"
            reason="Respiratory optimization"
            benefit="Clears sinus & lung passages"
            reliefTime="15 minutes"
          />
        </div>

        {/* Nutrition & Diet */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold">Nutrition & Diet</h3>
          </div>
          <DietCard 
            title="High Magnesium Protocol"
            items={["Spinach", "Pumpkin Seeds", "Dark Chocolate"]}
            target="Muscle recovery & Sleep quality"
          />
          <DietCard 
            title="Alkaline Evening Meal"
            items={["Roasted Cauliflower", "Quinoa", "Avocado"]}
            target="Acid reflux prevention"
          />
        </div>

        {/* Physical & Mind */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold">Yoga & Meditation</h3>
          </div>
          <YogaCard 
            title="Pranayama (Breathwork)"
            duration="10 mins"
            intensity="Low"
            focus="Vagus nerve stimulation"
          />
          <YogaCard 
            title="Surya Namaskar"
            duration="15 mins"
            intensity="Moderate"
            focus="Total body mobility"
          />
        </div>
      </div>

      <div className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-2">AI Doctor Consultation</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Based on your latest scan, our AI predicts a full recovery from recent fatigue patterns within <span className="text-white font-bold">48 hours</span> if the Magnesium protocol is followed alongside 8 hours of sleep.
            </p>
            <button className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all">
              Generate Detailed Report
            </button>
          </div>
          <div className="md:w-1/3 flex justify-center">
             <div className="relative">
                <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-2xl absolute inset-0"></div>
                <img src="https://picsum.photos/seed/doc/200/200" className="w-24 h-24 rounded-2xl relative z-10 border border-white/10 rotate-3" alt="AI Doc" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RemedyCard: React.FC<{ title: string, reason: string, benefit: string, reliefTime: string }> = ({ title, reason, benefit, reliefTime }) => (
  <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{title}</h4>
      <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
        <Clock className="w-3 h-3" />
        {reliefTime}
      </div>
    </div>
    <p className="text-xs text-gray-500 italic mb-3">{reason}</p>
    <p className="text-xs text-gray-300 leading-relaxed">{benefit}</p>
  </div>
);

const DietCard: React.FC<{ title: string, items: string[], target: string }> = ({ title, items, target }) => (
  <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <h4 className="font-bold text-white mb-3">{title}</h4>
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map(item => (
        <span key={item} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-lg">{item}</span>
      ))}
    </div>
    <div className="flex items-center gap-2 text-[10px] text-orange-500 font-bold uppercase tracking-wider">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
      Target: {target}
    </div>
  </div>
);

const YogaCard: React.FC<{ title: string, duration: string, intensity: string, focus: string }> = ({ title, duration, intensity, focus }) => (
  <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-bold text-white">{title}</h4>
      <span className="text-[10px] text-gray-500">{duration}</span>
    </div>
    <div className="flex items-center gap-4 text-xs">
      <div>
        <p className="text-gray-500 text-[10px] uppercase">Intensity</p>
        <p className="font-bold text-blue-400">{intensity}</p>
      </div>
      <div className="h-8 w-px bg-white/10"></div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase">Focus</p>
        <p className="font-bold">{focus}</p>
      </div>
    </div>
  </div>
);

export default Recommendations;
