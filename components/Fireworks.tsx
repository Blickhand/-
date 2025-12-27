
import React, { useEffect, useRef } from 'react';
import { AUDIO } from '../constants';
import { playExplosionSound, initAudio } from '../audioUtils';

const Fireworks: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);
  
  // Time-based animation refs
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  // Play Random CNY BGM
  useEffect(() => {
    initAudio();
    const playlist = AUDIO.CNY_PLAYLIST;
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];
    const audio = new Audio(randomTrack);
    audio.loop = true;
    audio.volume = 0.5;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => console.log("BGM autoplay prevented"));
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial time
    lastTimeRef.current = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Physics Constants
    const FPS_BASE = 60; 
    
    // Vibrant Color Palettes
    const PALETTES = [
      ['#FFD700', '#FFA500', '#FFFFFF'], // Luxury Gold
      ['#D7000F', '#FF4500', '#FFD700'], // Classic Red & Gold
      ['#00FFFF', '#7FFFD4', '#FFFFFF'], // Cyber Cyan
      ['#FF00FF', '#9400D3', '#DA70D6'], // Electric Purple
      ['#FF4500', '#32CD32', '#1E90FF'], // Rainbow Mix
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      decayRate: number;
      size: number;
      flicker: boolean;
      
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        // EXPLOSIVE POWER: Faster initial speed for a bigger "POP"
        const speed = (Math.random() * 25 + 10) * FPS_BASE; 
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 2 + 1; // Varied size
        this.flicker = Math.random() > 0.4; // 60% chance to flicker
        
        // FASTER DECAY: Disappear quicker as requested
        this.decayRate = (Math.random() * 1.4 + 0.8); 
      }

      update(dt: number) {
        // STRONG DRAG: Air resistance makes them stop moving outwards quickly
        const friction = Math.pow(0.88, dt * FPS_BASE); 
        
        this.vx *= friction;
        this.vy *= friction;
        
        // HEAVIER GRAVITY: Pulls them down elegantly after the burst
        this.vy += 300 * dt; 

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.alpha -= this.decayRate * dt;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        
        // Flicker Effect: Randomly adjust opacity for twinkling look
        let drawAlpha = this.alpha;
        if (this.flicker && Math.random() > 0.8) {
            drawAlpha = this.alpha * 0.5;
        }

        ctx.globalAlpha = Math.max(0, drawAlpha);
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createExplosion = (x: number, y: number) => {
      playExplosionSound();
      
      const particleCount = 180; 
      // Pick a random palette
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      
      for (let i = 0; i < particleCount; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        particlesRef.current.push(new Particle(x, y, color));
      }
    };

    const animate = () => {
      const now = performance.now();
      let dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Clamp dt
      dt = Math.min(dt, 0.1);

      // 1. Draw Background (Trails)
      ctx.globalCompositeOperation = 'source-over';
      // Use darker fade for crisper, shorter trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 2. Draw Particles with Additive Blending (Glow)
      ctx.globalCompositeOperation = 'lighter';

      spawnTimerRef.current += dt;
      // Spawn Rate
      if (spawnTimerRef.current > 0.5) { 
        if (Math.random() > 0.2) {
             const ex = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
             const ey = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.1);
             createExplosion(ex, ey);
             spawnTimerRef.current = 0;
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update(dt);
        p.draw(ctx);
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleInteract = (e: MouseEvent | TouchEvent) => {
      initAudio();
      let x, y;
      if ('touches' in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }
      createExplosion(x, y);
    };

    canvas.addEventListener('mousedown', handleInteract);
    canvas.addEventListener('touchstart', handleInteract);
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleInteract);
      canvas.removeEventListener('touchstart', handleInteract);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair touch-none" />
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none select-none z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-500 animate-pulse drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}>
          新年快乐
        </h1>
        <p className="text-white/80 mt-2 text-lg drop-shadow-md">点击屏幕绽放多彩烟花</p>
      </div>
      <button 
        onClick={onStop}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/20 backdrop-blur-md transition-all press-effect z-50"
      >
        返回主页
      </button>
    </div>
  );
};

export default Fireworks;
