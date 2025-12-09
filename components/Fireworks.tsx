import React, { useEffect, useRef } from 'react';

const Fireworks: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // Gravity
        this.alpha -= 0.01; // Fade
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Animation Loop
    const animate = () => {
      // Trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn random auto fireworks
      if (Math.random() < 0.05) {
        createExplosion(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
      }

      // Update particles
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
      const colors = ['#FFD700', '#FF0000', '#FFA500', '#FFFFFF', '#00FF00'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(new Particle(x, y, color));
      }
    };

    // Interaction
    const handleInteract = (e: MouseEvent | TouchEvent) => {
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
      
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cn-gold to-white animate-pulse">
          新年快乐
        </h1>
        <p className="text-white/70 mt-2">点击屏幕燃放烟花</p>
      </div>

      <button 
        onClick={onStop}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/20 transition backdrop-blur-md"
      >
        返回主页
      </button>
    </div>
  );
};

export default Fireworks;