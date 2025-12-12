
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Camera, Gift, HelpCircle } from 'lucide-react';
import { GALLERY_ITEMS, GAME_COLORS, RIDDLES, AUDIO } from '../constants';
import { 
  playCollectSound, 
  playCorrectSound, 
  playWrongSound, 
  playWinSound, 
  initAudio 
} from '../audioUtils';

// --- Shared Helper: Back Button ---
export const BackButton: React.FC<{ onClick: () => void, color?: string }> = ({ onClick, color = "text-white" }) => (
  <button 
    onClick={onClick} 
    className={`absolute top-6 left-6 z-[60] p-3 ${color} bg-black/30 rounded-full backdrop-blur-md border border-white/10 shadow-xl active:scale-90 transition hover:bg-black/50`}
  >
    <ChevronLeft size={32} />
  </button>
);

// --- Shared Helper: Background Music ---
// Now supports a single URL string OR an array of URLs for random selection
const useBackgroundMusic = (source: string | string[], volume = 0.3) => {
  // Select track once on mount (or if source changes)
  const url = useMemo(() => {
    if (Array.isArray(source)) {
        if (source.length === 0) return '';
        // Randomly pick one
        const randomIndex = Math.floor(Math.random() * source.length);
        return source[randomIndex];
    }
    return source;
  }, [source]);

  useEffect(() => {
    if (!url) return;

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.log("Autoplay blocked. Interaction needed.", e);
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url, volume]);
};

// --- Component 1: Gallery ---
export const Gallery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  // Play random CNY music, slightly lower volume for gallery
  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.2);

  const next = () => setIdx(p => (p + 1) % GALLERY_ITEMS.length);
  const prev = () => setIdx(p => (p - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <BackButton onClick={onBack} />
      
      {/* Background Blur Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
        style={{ backgroundImage: `url(${GALLERY_ITEMS[idx].url})` }}
      />

      {/* Main Image Container */}
      <div className="relative w-full max-w-5xl aspect-video md:aspect-[16/9] flex flex-col items-center justify-center p-4 z-10">
        
        <div className="relative w-full h-full group">
            {/* Image */}
            <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat rounded-xl shadow-2xl transition-all duration-500"
            style={{ backgroundImage: `url(${GALLERY_ITEMS[idx].url})` }}
            onClick={() => setShowInfo(!showInfo)}
            />
            
            {/* Info Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-6 rounded-b-xl transition-all duration-300 ${showInfo ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                <h2 className="text-2xl font-bold text-cn-gold mb-1 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    {GALLERY_ITEMS[idx].title}
                </h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">{GALLERY_ITEMS[idx].description}</p>
            </div>
        </div>

        {/* Navigation Arrows */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-cn-gold hover:bg-black/50 rounded-full transition"><ChevronLeft size={48} /></button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-cn-gold hover:bg-black/50 rounded-full transition"><ChevronRight size={48} /></button>
        
        {/* Indicators */}
        <div className="absolute -bottom-10 flex gap-2">
          {GALLERY_ITEMS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-cn-gold w-8' : 'bg-white/30 w-4'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Component 2: Blessing Game (Lucky Bag Rain) ---
// SVG for the Lucky Bag
const LuckyBagSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}>
    {/* Rope Tie */}
    <path d="M30 35 L70 35 L65 25 L35 25 Z" fill="#FFD700" />
    <circle cx="50" cy="35" r="8" fill="#FFD700" stroke="#B45309" strokeWidth="2" />
    
    {/* Bag Body */}
    <path 
      d="M30 35 Q10 120 50 120 Q90 120 70 35 Z" 
      fill={color} 
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
    />
    {/* Bag Top Flap */}
    <path d="M35 25 Q50 5 65 25 Z" fill={color} opacity="0.8" />
    
    {/* Fu Character (Simplified representation) */}
    <rect x="40" y="60" width="20" height="20" rx="2" fill="rgba(255,255,255,0.9)" transform="rotate(45 50 70)" />
    <text x="50" y="78" fill={color} fontSize="14" fontWeight="bold" textAnchor="middle">福</text>
  </svg>
);

interface FallingBag {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
}

export const BlessingGame: React.FC<{ onBack: () => void, onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [gameWon, setGameWon] = useState(false);
  const [collectedMap, setCollectedMap] = useState<Record<string, boolean>>({}); // Tracks if a color is collected
  const [, setTick] = useState(0); // Force render loop

  const bagsRef = useRef<FallingBag[]>([]);
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  
  // Use a ref for collectedMap to access it inside the animation loop without adding it to dependencies
  // This prevents the effect from restarting (and potentially causing glitches) on every click.
  const collectedMapRef = useRef(collectedMap);
  collectedMapRef.current = collectedMap;

  // Initialize Target Colors (6 distinct random colors)
  const targetColors = useMemo(() => {
    const shuffled = [...GAME_COLORS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  // Use Random CNY Music
  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.4);

  useEffect(() => {
    initAudio();
    const spawnRate = 500; // spawn every 500ms roughly, adjusted in loop
    
    const animate = (time: number) => {
      if (gameWon) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Spawn Logic
      if (time - lastSpawnRef.current > 300) { // Spawn interval
        lastSpawnRef.current = time;
        
        // Strategy: 40% chance to spawn a NEEDED color, 60% random
        let spawnColor;
        // Use ref to check current state
        const currentCollected = collectedMapRef.current;
        const neededColors = targetColors.filter(c => !currentCollected[c]);
        
        if (neededColors.length > 0 && Math.random() < 0.4) {
             spawnColor = neededColors[Math.floor(Math.random() * neededColors.length)];
        } else {
             spawnColor = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
        }

        bagsRef.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * (w - 80) + 10, // keep within screen width
          y: -150, // Start slightly higher up
          speed: Math.random() * 3 + 2, // Falling speed
          color: spawnColor
        });
      }

      // 2. Update Physics
      bagsRef.current.forEach(bag => {
        bag.y += bag.speed;
      });

      // 3. Cleanup off-screen
      // FIX: Greatly increased cleanup threshold (4x screen height) as requested 
      // to strictly prevent items from disappearing mid-screen.
      const cleanupThreshold = Math.max(h, 800) * 4;
      bagsRef.current = bagsRef.current.filter(b => b.y < cleanupThreshold);

      setTick(t => t + 1); // Trigger render
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // Remove collectedMap from dependencies to stabilize loop
  }, [gameWon, targetColors]);

  // Handle Bag Click
  const handleBagClick = (bagId: number, bagColor: string, e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    initAudio();

    // Check if this bag is one of the targets AND not yet collected
    if (targetColors.includes(bagColor) && !collectedMap[bagColor]) {
        // SUCCESS
        playCollectSound();
        if (navigator.vibrate) navigator.vibrate(50);
        
        // Remove bag immediately
        bagsRef.current = bagsRef.current.filter(b => b.id !== bagId);
        
        // Update State
        setCollectedMap(prev => {
            const newState = { ...prev, [bagColor]: true };
            // Check win condition
            const allCollected = targetColors.every(c => newState[c]);
            if (allCollected) {
                setTimeout(() => {
                    playWinSound();
                    setGameWon(true);
                }, 500);
            }
            return newState;
        });

    } else {
        // WRONG BAG (Distractor or already collected)
        playWrongSound();
        // Visual feedback could be added (shake), but simple removal/ignore is fine
        // Let's remove it to give feedback that click registered
        bagsRef.current = bagsRef.current.filter(b => b.id !== bagId);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden touch-none select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 to-slate-900 pointer-events-none"></div>

      <BackButton onClick={onBack} />
      
      {/* --- PROGRESS HUD (Top Right) --- */}
      <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-2">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
            <div className="text-white text-xs mb-1 font-bold text-center tracking-widest">目标色卡</div>
            <div className="flex gap-2">
                {targetColors.map((color, idx) => {
                    const isCollected = collectedMap[color];
                    return (
                        <div 
                            key={idx}
                            className={`w-8 h-10 md:w-10 md:h-12 rounded-lg border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden ${isCollected ? 'scale-110 shadow-[0_0_10px_currentColor]' : 'scale-100'}`}
                            style={{ 
                                borderColor: color,
                                backgroundColor: isCollected ? color : 'rgba(255,255,255,0.1)'
                            }}
                        >
                            {isCollected && <span className="text-white font-bold text-xs animate-in zoom-in">福</span>}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* --- GAME AREA (Falling Bags) --- */}
      <div className="relative w-full h-full z-10">
        {bagsRef.current.map(bag => (
            <div
                key={bag.id}
                className="absolute w-20 h-24 md:w-24 md:h-28 active:scale-90 transition-transform cursor-pointer"
                style={{ 
                    transform: `translate3d(${bag.x}px, ${bag.y}px, 0)`,
                    zIndex: Math.floor(bag.y) // simple z-sorting
                }}
                onMouseDown={(e) => handleBagClick(bag.id, bag.color, e)}
                onTouchStart={(e) => handleBagClick(bag.id, bag.color, e)}
            >
                <LuckyBagSVG color={bag.color} />
            </div>
        ))}
      </div>
      
      {/* --- WIN MODAL --- */}
      {gameWon && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="bg-gradient-to-b from-red-600 to-red-800 p-1 rounded-3xl shadow-2xl max-w-sm w-full mx-6 transform scale-100 animate-in zoom-in-95">
               <div className="bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] bg-red-700 rounded-[22px] p-8 text-center border-2 border-cn-gold">
                    <div className="w-20 h-20 bg-cn-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                        <Gift className="text-red-700 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl text-white font-bold mb-2">思源新年·福满盈</h1>
                    <div className="w-full h-0.5 bg-red-900/30 my-4"></div>
                    <p className="text-red-100 text-lg mb-8 leading-relaxed">
                        祝各位同学新年快乐<br/>学业进步，逐光前行！
                    </p>
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-xl"
                    >
                        开启烟花庆典
                    </button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Component 3: Riddle Game ---
export const RiddleGame: React.FC<{ onBack: () => void, onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Use Random CNY Music
  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.4);
  
  // Ensure audio is ready
  useEffect(() => { initAudio(); }, []);

  const riddle = RIDDLES[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    initAudio();
    setSelectedOption(idx);
    
    const isCorrect = idx === riddle.correctIndex;
    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(); // Synthesized SFX
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
      playWrongSound(); // Synthesized SFX
    }

    setTimeout(() => {
      if (currentIdx < RIDDLES.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        playWinSound(); // Synthesized SFX
        setIsFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-cn-red-dark flex flex-col overflow-hidden">
       {/* Scrolling container for accessibility on small screens */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
       
       <BackButton onClick={onBack} />

       <div className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 py-20">
            <div className="z-10 bg-white/95 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[50vh]">
                {/* Header */}
                <div className="bg-cn-red p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full"></div>
                    <h2 className="text-xl md:text-2xl font-bold text-white relative z-10 flex items-center justify-center gap-2">
                        🏮 思源灯谜会 <span className="text-sm bg-black/20 px-3 py-1 rounded-full font-mono">{currentIdx + 1}/{RIDDLES.length}</span>
                    </h2>
                </div>

                {/* Question */}
                <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
                    <div className="w-full bg-red-50 p-6 rounded-xl border-l-4 border-cn-red mb-8 shadow-sm">
                        <p className="text-xl md:text-2xl text-gray-800 font-medium text-center leading-relaxed font-serif">
                        "{riddle.question}"
                        </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-3 w-full">
                    {riddle.options.map((opt, idx) => {
                        let statusClass = "border-gray-200 text-gray-700 hover:bg-red-50";
                        if (selectedOption !== null) {
                            if (idx === riddle.correctIndex) statusClass = "bg-green-100 border-green-500 text-green-700 font-bold shadow-md transform scale-[1.02]";
                            else if (selectedOption === idx) statusClass = "bg-red-100 border-red-500 text-red-700";
                            else statusClass = "opacity-40 border-gray-100 grayscale";
                        }

                        return (
                            <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`p-4 text-lg rounded-xl border-2 transition-all duration-300 active:scale-98 text-left px-6 flex justify-between items-center ${statusClass}`}
                            >
                            <span className="flex-1">{["A", "B", "C", "D"][idx]}. {opt}</span>
                            {selectedOption !== null && idx === riddle.correctIndex && <span className="text-green-600 font-bold animate-pulse">✓</span>}
                            {selectedOption === idx && idx !== riddle.correctIndex && <span className="text-red-600 font-bold">✗</span>}
                            </button>
                        );
                    })}
                    </div>
                </div>
            </div>
       </div>

       {/* Completion Modal */}
       {isFinished && (
         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full mx-4 shadow-2xl scale-100 animate-in zoom-in-95 border-4 border-cn-red relative overflow-hidden">
               {/* Decorative background stamp if won */}
               {score >= 3 && (
                   <div className="absolute -top-4 -right-4 w-24 h-24 bg-cn-gold/20 rounded-full blur-xl"></div>
               )}

               <h3 className="text-3xl font-bold text-cn-red mb-2">挑战结束</h3>
               
               {score >= 3 ? (
                   <div className="my-4 animate-bounce">
                       <div className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-red-900 font-black text-xl px-6 py-2 rounded-full shadow-lg border-2 border-red-600 transform -rotate-2">
                           🏮 灯谜小能手 🏮
                       </div>
                       <div className="text-6xl mt-2">🏆</div>
                   </div>
               ) : (
                   <div className="text-6xl mb-4 animate-bounce">💪</div>
               )}

               <p className="text-gray-600 text-lg mb-6">
                   你答对了 <span className="text-cn-red font-bold text-3xl mx-1">{score}</span> / {RIDDLES.length} 题
               </p>
               
               <button onClick={onComplete} className="w-full py-4 bg-cn-red text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 active:scale-95 transition">
                 {score >= 3 ? "领取烟花大奖" : "领取新年烟花"}
               </button>
            </div>
         </div>
       )}
    </div>
  );
};
