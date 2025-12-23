
import React, { useEffect, useRef } from 'react';
import { AUDIO } from '../constants';
import { playExplosionSound, initAudio } from '../audioUtils';

const Fireworks: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      decay: number;
      
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 20 + 5; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.decay = Math.random() * 0.007 + 0.003; 
      }

      update() {
        this.vx *= 0.95;
        this.vy *= 0.95; 
        this.vy += 0.04; 
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      if (Math.random() < 0.05) { 
        createExplosion(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
      }
      particlesRef.current.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    const createExplosion = (x: number, y: number) => {
      playExplosionSound();
      const particleCount = 200; 
      const style = Math.random();
      let getColor: () => string;
      if (style > 0.7) {
        getColor = () => `hsl(${Math.random() * 360}, 100%, 60%)`;
      } else if (style > 0.4) {
         const hue = Math.random() * 360;
         getColor = () => Math.random() > 0.8 ? '#FFFFFF' : `hsl(${hue}, 100%, ${50 + Math.random() * 30}%)`;
      } else {
         const hue = Math.random() * 360;
         const offset = Math.random() * 60 + 30;
         getColor = () => {
             const r = Math.random();
             if (r > 0.66) return `hsl(${hue}, 100%, 60%)`;
             if (r > 0.33) return `hsl(${(hue + offset) % 360}, 100%, 60%)`;
             return `hsl(${(hue - offset + 360) % 360}, 100%, 60%)`;
         };
      }
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(x, y, getColor()));
      }
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
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none select-none">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-500 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          新年快乐
        </h1>
        <p className="text-white/70 mt-2 text-lg">点击屏幕绽放多彩烟花</p>
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
