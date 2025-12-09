import React from 'react';
import { Camera, Gamepad2, Sparkles, MapPin, Gift, HelpCircle } from 'lucide-react';
import { IMAGES } from '../constants';

interface HubProps {
  onSelect: (feature: 'GALLERY' | 'GAME_BLESSINGS' | 'GAME_RIDDLES' | 'FIREWORKS') => void;
  onBack: () => void;
}

const SchoolHub: React.FC<HubProps> = ({ onSelect, onBack }) => {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-900">
      {/* Background with Zoom Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms]"
        style={{ backgroundImage: `url(${IMAGES.SCHOOL_BG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
        <button onClick={onBack} className="flex items-center text-white/80 hover:text-white gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm transition active:scale-95">
          <MapPin size={18} />
          <span className="text-sm">返回地球</span>
        </button>
        
        <div className="text-right pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg tracking-wider">广州思源学校</h1>
          <p className="text-cn-gold font-light mt-1 text-lg">迎新年·贺新春</p>
        </div>
      </div>

      {/* Main Actions - Bottom Sticky */}
      <div className="absolute bottom-0 w-full p-6 md:p-12 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          {/* Action 1: Gallery */}
          <button 
            onClick={() => onSelect('GALLERY')}
            className="group relative h-32 md:h-48 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl overflow-hidden shadow-lg border-2 border-red-700/50 hover:border-cn-gold transition-all active:scale-95"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')] opacity-20"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 group-hover:-translate-y-2 transition-transform">
                <Camera size={40} className="text-cn-gold" />
                <span className="text-xl font-bold text-white">校园风采</span>
             </div>
          </button>

          {/* Action 2: Games - Split into two distinct buttons for reliability */}
           <div className="flex flex-col gap-3 h-32 md:h-48">
             <button 
                onClick={() => onSelect('GAME_BLESSINGS')} 
                className="flex-1 bg-gradient-to-r from-cn-gold to-yellow-600 rounded-2xl shadow-lg border-2 border-yellow-400/50 flex items-center justify-center gap-3 active:scale-95 transition-transform"
             >
                <Gift className="text-red-900" size={24} />
                <span className="text-red-900 font-bold text-lg">新年集六福</span>
             </button>
             
             <button 
                onClick={() => onSelect('GAME_RIDDLES')} 
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg border-2 border-orange-400/50 flex items-center justify-center gap-3 active:scale-95 transition-transform"
             >
                <HelpCircle className="text-white" size={24} />
                <span className="text-white font-bold text-lg">趣味猜灯谜</span>
             </button>
           </div>

          {/* Action 3: Fireworks */}
          <button 
            onClick={() => onSelect('FIREWORKS')}
            className="group relative h-32 md:h-48 bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl overflow-hidden shadow-lg border-2 border-purple-500/50 hover:border-cn-gold transition-all active:scale-95"
          >
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 group-hover:-translate-y-2 transition-transform">
                <Sparkles size={40} className="text-cyan-400 animate-pulse" />
                <span className="text-xl font-bold text-white">新年烟花秀</span>
             </div>
          </button>

        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 animate-float opacity-80 pointer-events-none">
        <div className="w-16 h-20 bg-red-600 rounded-lg shadow-xl border-t-8 border-black flex items-center justify-center">
             <div className="text-cn-gold text-4xl font-serif">福</div>
        </div>
        <div className="w-1 h-10 bg-yellow-600 mx-auto"></div>
        <div className="w-4 h-12 bg-red-600 mx-auto rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default SchoolHub;