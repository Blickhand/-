
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Camera, Gift, HelpCircle, Play, Pause } from 'lucide-react';
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
const useBackgroundMusic = (source: string | string[], volume = 0.3) => {
  const url = useMemo(() => {
    if (Array.isArray(source)) {
        if (source.length === 0) return '';
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
  const [themeIdx, setThemeIdx] = useState(0); 
  const [imageIdx, setImageIdx] = useState(0); 
  const [showInfo, setShowInfo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play state
  const touchStart = useRef<{x: number, y: number} | null>(null);

  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.2);

  const currentTheme = GALLERY_ITEMS[themeIdx];
  const currentImage = currentTheme.images[imageIdx];
  const totalImages = currentTheme.images.length;

  // --- Auto Play Logic ---
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
        interval = window.setInterval(() => {
            setImageIdx(prev => (prev + 1) % totalImages);
        }, 3000); // Change slide every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalImages]);

  // --- Preload Next Image Logic (For smooth transitions with large galleries) ---
  useEffect(() => {
    const nextIdx = (imageIdx + 1) % totalImages;
    const img = new Image();
    img.src = currentTheme.images[nextIdx];
  }, [imageIdx, currentTheme, totalImages]);


  const nextTheme = () => {
      setThemeIdx(p => (p + 1) % GALLERY_ITEMS.length);
      setImageIdx(0);
      setIsPlaying(false); // Pause on manual interaction
  };
  const prevTheme = () => {
      setThemeIdx(p => (p - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
      setImageIdx(0);
      setIsPlaying(false);
  };

  const nextImage = () => {
      setImageIdx(p => (p + 1) % totalImages);
      setIsPlaying(false);
  };
  const prevImage = () => {
      setImageIdx(p => (p - 1 + totalImages) % totalImages);
      setIsPlaying(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const threshold = 50;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
            if (dx > 0) prevTheme(); else nextTheme();
        }
    } else {
        if (Math.abs(dy) > threshold) {
            if (dy > 0) prevImage(); else nextImage();
        }
    }
    touchStart.current = null;
  };

  return (
    <div 
        className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
    >
      <BackButton onClick={onBack} />
      
      {/* Play/Pause Button */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-6 right-6 z-[60] p-3 text-white bg-black/30 rounded-full backdrop-blur-md border border-white/10 shadow-xl active:scale-90 transition hover:bg-black/50"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>

      <div 
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${currentImage})` }}
      />

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full max-w-5xl aspect-video md:aspect-[16/9] p-4 z-10">
             <div className="relative w-full h-full group">
                <div 
                className="w-full h-full bg-contain bg-center bg-no-repeat rounded-xl shadow-2xl transition-all duration-500 cursor-pointer"
                style={{ backgroundImage: `url(${currentImage})` }}
                onClick={() => setShowInfo(!showInfo)}
                />
                
                <div className={`absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-6 rounded-b-xl transition-all duration-300 ${showInfo ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    <h2 className="text-2xl font-bold text-cn-gold mb-1 flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        {currentTheme.title} 
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-normal ml-2">
                            {imageIdx + 1} / {totalImages}
                        </span>
                        {isPlaying && <span className="text-xs text-green-400 animate-pulse ml-auto">▶ 自动播放中</span>}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">{currentTheme.description}</p>
                </div>
            </div>

            <button 
                onClick={prevTheme} 
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-cn-gold hover:bg-black/50 rounded-full transition group z-20"
            >
                <ChevronLeft size={48} className="drop-shadow-lg" />
            </button>
            <button 
                onClick={nextTheme} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-cn-gold hover:bg-black/50 rounded-full transition group z-20"
            >
                <ChevronRight size={48} className="drop-shadow-lg" />
            </button>

            <div className="absolute right-4 md:right-[-4rem] top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none md:pointer-events-auto">
                 <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full flex flex-col gap-2 pointer-events-auto">
                    <button onClick={prevImage} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition">
                        <ChevronUp size={24} />
                    </button>
                    <div className="text-xs text-white/50 font-mono text-center py-1 border-y border-white/10">
                        {imageIdx + 1}<br/>|<br/>{totalImages}
                    </div>
                    <button onClick={nextImage} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition">
                        <ChevronDown size={24} />
                    </button>
                 </div>
            </div>
        </div>

        <div className="absolute bottom-10 flex gap-2 z-20">
          {GALLERY_ITEMS.map((_, i) => (
            <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === themeIdx ? 'bg-cn-gold w-8' : 'bg-white/30 w-4'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Component 2: Blessing Game (Lucky Bag Rain) ---

// Updated LuckyBagSVG to match the provided 3D style
// Features: Cloud/pouch shape, gold rope border, tassels, red knot, unicorn mascot
const LuckyBagSVG: React.FC<{ color: string, text?: string }> = ({ color, text = "福" }) => {
  // Unique ID for gradients
  const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  const gradId = `grad-${id}`;
  const ropeGradId = `rope-${id}`;

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0px 8px 6px rgba(0,0,0,0.4))' }}>
      <defs>
        {/* 3D Body Gradient */}
        <radialGradient id={gradId} cx="30%" cy="30%" r="80%">
          <stop offset="0%" stopColor={color} style={{ filter: 'brightness(1.4)' }} />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={color} style={{ filter: 'brightness(0.6)' }} />
        </radialGradient>
        {/* Gold Rope Gradient */}
        <linearGradient id={ropeGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FDB931" />
          <stop offset="75%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* --- SIDE HANDLES & TASSELS (Background Layer) --- */}
      
      {/* Red Rings */}
      <circle cx="20" cy="100" r="12" fill="#D7000F" stroke="#990000" strokeWidth="2" />
      <circle cx="180" cy="100" r="12" fill="#D7000F" stroke="#990000" strokeWidth="2" />

      {/* Left Tassel */}
      <g stroke="url(#ropeGradId)" strokeWidth="2">
          <line x1="20" y1="110" x2="20" y2="150" stroke="#DAA520" strokeWidth="3" />
          <circle cx="20" cy="150" r="4" fill="#DAA520" stroke="none" />
          {/* Tassel threads */}
          <path d="M20 150 L 15 190 M 20 150 L 20 190 M 20 150 L 25 190" stroke="#DAA520" strokeWidth="1.5" />
      </g>
      {/* Right Tassel */}
      <g stroke="url(#ropeGradId)" strokeWidth="2">
          <line x1="180" y1="110" x2="180" y2="150" stroke="#DAA520" strokeWidth="3" />
          <circle cx="180" cy="150" r="4" fill="#DAA520" stroke="none" />
          <path d="M180 150 L 175 190 M 180 150 L 180 190 M 180 150 L 185 190" stroke="#DAA520" strokeWidth="1.5" />
      </g>

      {/* --- MAIN BAG BODY --- */}
      {/* Cloud-like Shape */}
      <path
        d="M40 70 Q 20 70 20 110 Q 20 160 100 170 Q 180 160 180 110 Q 180 70 160 70 Q 100 80 40 70 Z"
        fill={`url(#${gradId})`}
      />
      
      {/* Gold Rope Border (Dashed) */}
      <path
        d="M40 70 Q 20 70 20 110 Q 20 160 100 170 Q 180 160 180 110 Q 180 70 160 70 Q 100 80 40 70 Z"
        fill="none"
        stroke={`url(#${ropeGradId})`}
        strokeWidth="3.5"
        strokeDasharray="4 2"
        strokeLinecap="round"
      />

      {/* --- TOP RUFFLES --- */}
      <path
        d="M50 70 Q 40 30 50 25 Q 100 10 150 25 Q 160 30 150 70"
        fill={`url(#${gradId})`}
      />
      
      {/* Neck Rope Tie */}
      <path d="M45 68 Q 100 80 155 68" stroke={`url(#${ropeGradId})`} strokeWidth="5" fill="none" />
      
      {/* Top Red Loop */}
      <path d="M90 20 Q 100 -5 110 20" stroke="#D7000F" strokeWidth="6" fill="none" />
      <circle cx="100" cy="22" r="6" fill="#D7000F" />


      {/* --- TEXT --- */}
      {/* 3D Text Effect */}
      <text
        x="100"
        y="125"
        textAnchor="middle"
        fontSize={text.length > 2 ? "40" : "50"}
        fontWeight="900"
        fill="white"
        style={{
             fontFamily: '"Ma Shan Zheng", "STKaiti", serif',
             filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.2))'
        }}
      >
        {text}
      </text>

      {/* --- BOTTOM KNOT & TASSEL --- */}
      {/* Red Chinese Knot shape */}
      <path 
        d="M85 170 Q 75 185 90 195 Q 100 205 110 195 Q 125 185 115 170" 
        stroke="#D7000F" 
        strokeWidth="8" 
        fill="none" 
        strokeLinecap="round"
      />
      {/* Gold Bottom Tassel */}
      <g transform="translate(100, 195)">
          <rect x="-3" y="0" width="6" height="6" fill="#D7000F" /> {/* Knot center */}
          <path d="M0 5 L 0 35" stroke="#DAA520" strokeWidth="4" />
          {/* Fanned tassel */}
          <path d="M0 35 L -8 50 M 0 35 L -3 50 M 0 35 L 3 50 M 0 35 L 8 50" stroke="#DAA520" strokeWidth="2" />
      </g>

      {/* --- MASCOT (Unicorn) --- */}
      {/* Positioned bottom center overlaying knot */}
      <g transform="translate(100, 160) scale(0.65)">
          {/* Outline/Shadow */}
          <circle cx="0" cy="0" r="27" fill="rgba(0,0,0,0.2)" />
          
          {/* Head */}
          <circle cx="0" cy="0" r="25" fill="#FFF" stroke="#FFF" strokeWidth="2" />
          
          {/* Snout */}
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="#FFE4E1" />
          <circle cx="-6" cy="10" r="1.5" fill="#333" opacity="0.4" />
          <circle cx="6" cy="10" r="1.5" fill="#333" opacity="0.4" />
          
          {/* Eyes */}
          <circle cx="-10" cy="-4" r="3.5" fill="#000" />
          <circle cx="-8.5" cy="-5.5" r="1.2" fill="#FFF" /> {/* glint */}
          
          <circle cx="10" cy="-4" r="3.5" fill="#000" />
          <circle cx="11.5" cy="-5.5" r="1.2" fill="#FFF" /> {/* glint */}
          
          {/* Cheeks */}
          <circle cx="-16" cy="4" r="3" fill="#FFB6C1" opacity="0.6" />
          <circle cx="16" cy="4" r="3" fill="#FFB6C1" opacity="0.6" />

          {/* Horn */}
          <path d="M0 -22 L -4 -42 L 4 -42 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <path d="M-3 -35 L 3 -33 M -2 -28 L 2 -26" stroke="#DAA520" strokeWidth="1" />

          {/* Ears */}
          <path d="M-20 -5 Q -28 -15 -18 -20 L -15 -10 Z" fill="#FFF" />
          <path d="M20 -5 Q 28 -15 18 -20 L 15 -10 Z" fill="#FFF" />
          
          {/* Mane (Rainbow) */}
          <path d="M18 -18 Q 30 -10 25 15" stroke="#FF69B4" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M22 -12 Q 32 -5 28 12" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Bell/Necklace */}
          <path d="M-10 20 Q 0 28 10 20" stroke="#FFD700" strokeWidth="2" fill="none" />
          <circle cx="0" cy="24" r="3" fill="#FFD700" stroke="#DAA520" />
      </g>

    </svg>
  );
};

const BLESSING_TEXTS = ["友善福", "喜乐福", "健康福", "学业福", "圆满福", "好运福"];

interface FallingBag {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  text: string; // Added text property
}

export const BlessingGame: React.FC<{ onBack: () => void, onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [gameWon, setGameWon] = useState(false);
  const [collectedMap, setCollectedMap] = useState<Record<string, boolean>>({}); 
  const [, setTick] = useState(0); 

  const bagsRef = useRef<FallingBag[]>([]);
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  
  const collectedMapRef = useRef(collectedMap);
  collectedMapRef.current = collectedMap;

  const targetColors = useMemo(() => {
    const shuffled = [...GAME_COLORS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.4);

  useEffect(() => {
    initAudio();
    
    const animate = (time: number) => {
      if (gameWon) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      if (time - lastSpawnRef.current > 300) { 
        lastSpawnRef.current = time;
        
        let spawnColor;
        const currentCollected = collectedMapRef.current;
        const neededColors = targetColors.filter(c => !currentCollected[c]);
        
        if (neededColors.length > 0 && Math.random() < 0.4) {
             spawnColor = neededColors[Math.floor(Math.random() * neededColors.length)];
        } else {
             spawnColor = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
        }
        
        // Pick a random blessing text
        const randomText = BLESSING_TEXTS[Math.floor(Math.random() * BLESSING_TEXTS.length)];

        bagsRef.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * (w - 80) + 10, 
          y: -240, // Start higher up to account for larger svg
          speed: Math.random() * 6 + 5, // Increased speed significantly (range 5-11)
          color: spawnColor,
          text: randomText
        });
      }

      bagsRef.current.forEach(bag => {
        bag.y += bag.speed;
      });

      const cleanupThreshold = Math.max(h, 800) * 4;
      bagsRef.current = bagsRef.current.filter(b => b.y < cleanupThreshold);

      setTick(t => t + 1); 
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameWon, targetColors]);

  const handleBagClick = (bagId: number, bagColor: string, e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    initAudio();

    if (targetColors.includes(bagColor) && !collectedMap[bagColor]) {
        playCollectSound();
        if (navigator.vibrate) navigator.vibrate(50);
        bagsRef.current = bagsRef.current.filter(b => b.id !== bagId);
        
        setCollectedMap(prev => {
            const newState = { ...prev, [bagColor]: true };
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
        playWrongSound();
        bagsRef.current = bagsRef.current.filter(b => b.id !== bagId);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden touch-none select-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 to-slate-900 pointer-events-none"></div>

      <BackButton onClick={onBack} />
      
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

      <div className="relative w-full h-full z-10">
        {bagsRef.current.map(bag => (
            <div
                key={bag.id}
                className="absolute w-24 h-28 md:w-32 md:h-36 active:scale-90 transition-transform cursor-pointer"
                style={{ 
                    transform: `translate3d(${bag.x}px, ${bag.y}px, 0)`,
                    zIndex: Math.floor(bag.y) 
                }}
                onMouseDown={(e) => handleBagClick(bag.id, bag.color, e)}
                onTouchStart={(e) => handleBagClick(bag.id, bag.color, e)}
            >
                <LuckyBagSVG color={bag.color} text={bag.text} />
            </div>
        ))}
      </div>
      
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

  // Randomly select 5 riddles from the pool on mount
  const activeRiddles = useMemo(() => {
    // Shuffle and pick 5
    const shuffled = [...RIDDLES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, []);

  useBackgroundMusic(AUDIO.CNY_PLAYLIST, 0.4);
  
  useEffect(() => { initAudio(); }, []);

  const riddle = activeRiddles[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    initAudio();
    setSelectedOption(idx);
    
    const isCorrect = idx === riddle.correctIndex;
    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(); 
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
      playWrongSound();
    }

    setTimeout(() => {
      if (currentIdx < activeRiddles.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        playWinSound(); 
        setIsFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-cn-red-dark flex flex-col overflow-hidden">
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
       
       <BackButton onClick={onBack} />

       <div className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 py-20">
            <div className="z-10 bg-white/95 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[50vh]">
                <div className="bg-cn-red p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full"></div>
                    <h2 className="text-xl md:text-2xl font-bold text-white relative z-10 flex items-center justify-center gap-2">
                        🏮 思源灯谜会 <span className="text-sm bg-black/20 px-3 py-1 rounded-full font-mono">{currentIdx + 1}/{activeRiddles.length}</span>
                    </h2>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
                    <div className="w-full bg-red-50 p-6 rounded-xl border-l-4 border-cn-red mb-8 shadow-sm">
                        <p className="text-xl md:text-2xl text-gray-800 font-medium text-center leading-relaxed font-serif">
                        "{riddle.question}"
                        </p>
                    </div>

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

       {isFinished && (
         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full mx-4 shadow-2xl scale-100 animate-in zoom-in-95 border-4 border-cn-red relative overflow-hidden">
               {/* Winning Threshold: 4 out of 5 */}
               {score >= 4 && (
                   <div className="absolute -top-4 -right-4 w-24 h-24 bg-cn-gold/20 rounded-full blur-xl"></div>
               )}

               <h3 className="text-3xl font-bold text-cn-red mb-2">挑战结束</h3>
               
               {score >= 4 ? (
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
                   你答对了 <span className="text-cn-red font-bold text-3xl mx-1">{score}</span> / {activeRiddles.length} 题
               </p>
               
               <button onClick={onComplete} className="w-full py-4 bg-cn-red text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 active:scale-95 transition">
                 {score >= 4 ? "领取烟花大奖" : "领取新年烟花"}
               </button>
            </div>
         </div>
       )}
    </div>
  );
};
