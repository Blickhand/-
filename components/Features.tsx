import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, Gift } from 'lucide-react';
import { GALLERY_ITEMS, BLESSING_TYPES, RIDDLES } from '../constants';
import { BlessingCard } from '../types';

// --- Shared Helper: Back Button ---
export const BackButton: React.FC<{ onClick: () => void, color?: string }> = ({ onClick, color = "text-white" }) => (
  <button 
    onClick={onClick} 
    className={`absolute top-6 left-6 z-[60] p-3 ${color} bg-black/30 rounded-full backdrop-blur-md border border-white/10 shadow-xl active:scale-90 transition hover:bg-black/50`}
  >
    <ChevronLeft size={32} />
  </button>
);

// --- Component 1: Gallery ---
export const Gallery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

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

// --- Component 2: Blessing Game ---
export const BlessingGame: React.FC<{ onBack: () => void, onComplete: () => void }> = ({ onBack, onComplete }) => {
  const cardsRef = useRef<BlessingCard[]>([]);
  const requestRef = useRef<number>(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [, setTick] = useState(0); // Force re-render

  useEffect(() => {
    // Initialize Cards immediately on mount
    const safeZoneTop = 80;
    const safeZoneBottom = 100;
    const width = window.innerWidth;
    const height = window.innerHeight;

    cardsRef.current = BLESSING_TYPES.map((type, i) => ({
      id: i,
      name: type.name,
      color: type.color,
      x: Math.random() * (width - 120) + 10,
      y: Math.random() * (height - safeZoneTop - safeZoneBottom) + safeZoneTop,
      speedX: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()),
      speedY: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()),
      collected: false
    }));
    
    // Force first render to show cards
    setTick(1);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let changed = false;

      cardsRef.current.forEach(card => {
        if (card.collected) return;
        
        card.x += card.speedX;
        card.y += card.speedY;

        // Bounce Walls (Keep fully inside screen)
        // Card size roughly 96px width, 128px height
        if (card.x <= 0 || card.x >= w - 96) {
            card.speedX *= -1;
            card.x = Math.max(0, Math.min(card.x, w - 96));
        }
        if (card.y <= 80 || card.y >= h - 140) {
            card.speedY *= -1;
            card.y = Math.max(80, Math.min(card.y, h - 140));
        }
        changed = true;
      });

      if (changed && !gameWon) {
        setTick(t => t + 1);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameWon]);

  const handleCollect = (id: number) => {
    const card = cardsRef.current.find(c => c.id === id);
    if (card && !card.collected) {
        card.collected = true;
        setCollectedCount(prev => {
            const newCount = prev + 1;
            if (newCount === BLESSING_TYPES.length) {
                setTimeout(() => setGameWon(true), 500); // Slight delay for effect
            }
            return newCount;
        });
        // Feedback vibration if supported
        if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden touch-none select-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-slate-900 pointer-events-none"></div>

      <BackButton onClick={onBack} />
      
      {/* Score Header */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full border border-cn-gold/50 shadow-lg">
        <Gift className={`text-cn-gold ${collectedCount > 0 ? 'animate-bounce' : ''}`} size={20} />
        <span className="text-white font-bold text-lg">
             已集福卡: <span className="text-cn-gold text-2xl">{collectedCount}</span> / {BLESSING_TYPES.length}
        </span>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-full z-10">
        {cardsRef.current.map(card => {
            if (card.collected) return null;
            return (
                <div
                    key={card.id}
                    style={{ transform: `translate3d(${card.x}px, ${card.y}px, 0)` }}
                    className={`absolute w-24 h-32 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-yellow-200/50 flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer will-change-transform ${card.color}`}
                    onClick={(e) => { e.stopPropagation(); handleCollect(card.id); }}
                    onTouchStart={(e) => { e.stopPropagation(); handleCollect(card.id); }}
                >
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2 shadow-inner pointer-events-none">
                        <span className="text-3xl font-serif text-white pointer-events-none">福</span>
                    </div>
                    <span className="text-white font-bold tracking-widest pointer-events-none">{card.name}</span>
                </div>
            );
        })}
      </div>
      
      {/* Win Modal */}
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

  const riddle = RIDDLES[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    const isCorrect = idx === riddle.correctIndex;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentIdx < RIDDLES.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        // End of game
      }
    }, 1500);
  };

  const isFinished = selectedOption !== null && currentIdx === RIDDLES.length - 1;

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
       {isFinished && feedback && (
         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full mx-4 shadow-2xl scale-100 animate-in zoom-in-95 border-4 border-cn-red">
               <h3 className="text-3xl font-bold text-cn-red mb-2">挑战结束</h3>
               <div className="text-6xl mb-4 animate-bounce">🎉</div>
               <p className="text-gray-600 text-lg mb-6">
                   你答对了 <span className="text-cn-red font-bold text-3xl mx-1">{score + (feedback === 'correct' ? 1 : 0)}</span> / {RIDDLES.length} 题
               </p>
               
               <button onClick={onComplete} className="w-full py-4 bg-cn-red text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 active:scale-95 transition">
                 领取新年烟花
               </button>
            </div>
         </div>
       )}
    </div>
  );
};