
import React, { useState, useEffect } from 'react';
import { AppStage } from './types';
import EarthStage from './components/EarthStage';
import SchoolHub from './components/SchoolHub';
import { Gallery, BlessingGame, RiddleGame } from './components/Features';
import Fireworks from './components/Fireworks';
import { initAudio } from './audioUtils';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.EARTH_ROAM);
  const [transitionOpacity, setTransitionOpacity] = useState(0);

  // Global listener to unlock AudioContext on first interaction
  useEffect(() => {
    const unlockAudio = () => {
        initAudio();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Transition Helper
  const transitionTo = (nextStage: AppStage) => {
    setTransitionOpacity(1); // Fade out
    setTimeout(() => {
      setStage(nextStage);
      setTimeout(() => {
        setTransitionOpacity(0); // Fade in new stage
      }, 100);
    }, 1000);
  };

  const handleEarthComplete = () => {
    // Stage 1 -> Stage 2 (Zoom Transition) -> Stage 3 (School)
    // We simulate the zoom by fading via white/cloud texture in a real app, here simple fade
    setStage(AppStage.TRANSITION_GUANGZHOU);
    // Auto progress from Guangzhou Zoom to School Hub after delay
    setTimeout(() => {
        transitionTo(AppStage.SCHOOL_HUB);
    }, 2500);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      
      {/* --- STAGE RENDERER --- */}
      
      {stage === AppStage.EARTH_ROAM && (
        <EarthStage onComplete={handleEarthComplete} />
      )}

      {stage === AppStage.TRANSITION_GUANGZHOU && (
        <div className="w-full h-full flex items-center justify-center relative bg-blue-900 overflow-hidden">
             {/* Zooming Animation */}
             <div className="absolute inset-0 bg-cover bg-center animate-pulse" 
                  style={{backgroundImage: 'url(https://images.unsplash.com/photo-1536528734268-3bb647890f84?q=80&w=1920)'}}>
             </div>
             <div className="z-10 text-center animate-bounce">
                <h1 className="text-4xl md:text-6xl text-white font-bold drop-shadow-xl">欢迎来到广州</h1>
                <p className="text-xl text-cn-gold mt-4">正在前往 广州思源学校...</p>
             </div>
        </div>
      )}

      {stage === AppStage.SCHOOL_HUB && (
        <SchoolHub 
          onSelect={(feature) => transitionTo(feature as AppStage)} 
          onBack={() => transitionTo(AppStage.EARTH_ROAM)}
        />
      )}

      {stage === AppStage.GALLERY && (
        <Gallery onBack={() => transitionTo(AppStage.SCHOOL_HUB)} />
      )}

      {stage === AppStage.GAME_BLESSINGS && (
        <BlessingGame 
            onBack={() => transitionTo(AppStage.SCHOOL_HUB)} 
            onComplete={() => transitionTo(AppStage.FIREWORKS)}
        />
      )}

      {stage === AppStage.GAME_RIDDLES && (
        <RiddleGame 
            onBack={() => transitionTo(AppStage.SCHOOL_HUB)}
            onComplete={() => transitionTo(AppStage.FIREWORKS)}
        />
      )}

      {stage === AppStage.FIREWORKS && (
        <Fireworks onStop={() => transitionTo(AppStage.SCHOOL_HUB)} />
      )}

      {/* --- GLOBAL OVERLAY TRANSITION --- */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 z-[9999]"
        style={{ opacity: transitionOpacity }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cn-gold text-2xl font-bold animate-pulse">Loading...</span>
        </div>
      </div>
      
    </div>
  );
};

export default App;
