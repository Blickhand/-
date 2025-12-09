import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Hand } from 'lucide-react';

interface EarthStageProps {
  onComplete: () => void;
}

const EarthStage: React.FC<EarthStageProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showLocationBtn, setShowLocationBtn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for animation state to avoid re-renders during loop
  const rotationRef = useRef({ x: 0, y: Math.PI }); // Start roughly facing back
  const targetRef = useRef({ x: 0, y: 0, z: 0, visible: false }); // Screen coords of Guangzhou
  const dragRef = useRef({ startX: 0, startY: 0, lastX: 0, lastY: 0, vx: 0, vy: 0 });
  const requestRef = useRef<number>(0);

  // Constants
  const PARTICLE_COUNT = 600;
  const SPHERE_RADIUS = 140;
  const GUANGZHOU_LAT = 23.1; 
  const GUANGZHOU_LON = 113.2;

  // Generate particles on a sphere
  const particles = useRef<{lat: number, lon: number, x: number, y: number, z: number}[]>([]);

  useEffect(() => {
    // Initialize Particles
    const pts = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden Spiral distribution for even sphere coverage
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Convert to lat/lon for consistent texture mapping feel if needed, 
      // but here we store raw 3D normalized vector
      pts.push({ x: x * SPHERE_RADIUS, y: y * SPHERE_RADIUS, z: z * SPHERE_RADIUS, lat: 0, lon: 0 });
    }
    particles.current = pts;

    // Define Guangzhou Point (Vector math)
    // We treat this as a special particle that is fixed on the sphere surface
    // Simplified placement for "Finding" game mechanics
    // We add a specific "Target" particle manually to the list or track it separately
    // Let's track it separately for specific rendering
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Physics: Inertia
    if (!isDragging) {
      rotationRef.current.y += dragRef.current.vx;
      rotationRef.current.x += dragRef.current.vy;
      dragRef.current.vx *= 0.95;
      dragRef.current.vy *= 0.95;
      
      // Auto slight rotation if stopped
      if (Math.abs(dragRef.current.vx) < 0.001) rotationRef.current.y += 0.002;
    }

    // Math Helpers
    const sinY = Math.sin(rotationRef.current.y);
    const cosY = Math.cos(rotationRef.current.y);
    const sinX = Math.sin(rotationRef.current.x * 0.5); // Clamp pitch slightly
    const cosX = Math.cos(rotationRef.current.x * 0.5);

    // Draw Particles
    ctx.fillStyle = '#60A5FA'; // Blue-400
    
    particles.current.forEach(p => {
      // Rotate Y (Yaw)
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.z * cosY + p.x * sinY;
      
      // Rotate X (Pitch) - minimal pitch allowed for better UX
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.y * sinX;
      
      // Project
      const scale = 400 / (400 - z2); // Perspective
      const x2d = x1 * scale + cx;
      const y2d = y2 * scale + cy;
      const alpha = (z2 + SPHERE_RADIUS) / (2 * SPHERE_RADIUS); // Fade back particles

      if (z2 > -300) { // Clip near plane
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.beginPath();
        ctx.arc(x2d, y2d, scale * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Guangzhou Target
    // Let's assume Guangzhou is at (R, 0, 0) in local space initially for simplicity of "finding"
    // Users rotate the sphere to bring (R,0,0) to front
    const gx = SPHERE_RADIUS; 
    const gy = 0; 
    const gz = 0;

    // Rotate Target
    let tx1 = gx * cosY - gz * sinY;
    let tz1 = gz * cosY + gx * sinY;
    let ty2 = gy * cosX - tz1 * sinX;
    let tz2 = tz1 * cosX + gy * sinX;

    const tScale = 400 / (400 - tz2);
    const tx2d = tx1 * tScale + cx;
    const ty2d = ty2 * tScale + cy;

    // Logic: Is target visible?
    // Visible if z is positive (front of sphere) AND x/y are close to center
    const isFront = tz2 > 50; // In front
    const isCenter = Math.abs(tx2d - cx) < 60 && Math.abs(ty2d - cy) < 60;
    
    if (isFront && isCenter) {
      if (!targetRef.current.visible) {
        targetRef.current.visible = true;
        setShowLocationBtn(true);
      }
    } else {
      if (targetRef.current.visible) {
        targetRef.current.visible = false;
        setShowLocationBtn(false);
      }
    }

    // Draw Target Marker
    if (tz2 > -100) {
        ctx.globalAlpha = 1;
        
        // Pulse Effect ring
        const time = Date.now() / 200;
        const pulse = Math.sin(time) * 5;
        
        ctx.strokeStyle = '#EF4444'; // Red-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tx2d, ty2d, (tScale * 8) + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(tx2d, ty2d, tScale * 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (isFront) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px sans-serif';
            ctx.fillText('广州', tx2d + 15, ty2d + 4);
        }
    }

    requestRef.current = requestAnimationFrame(render);
  }, [isDragging]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [render]);

  // Input Handlers
  const handleStart = (x: number, y: number) => {
    setIsDragging(true);
    dragRef.current.startX = x;
    dragRef.current.startY = y;
    dragRef.current.lastX = x;
    dragRef.current.lastY = y;
    dragRef.current.vx = 0;
    dragRef.current.vy = 0;
  };

  const handleMove = (x: number, y: number) => {
    if (!isDragging) return;
    const dx = x - dragRef.current.lastX;
    const dy = y - dragRef.current.lastY;
    
    rotationRef.current.y += dx * 0.01;
    rotationRef.current.x -= dy * 0.01;
    
    dragRef.current.vx = dx * 0.01;
    dragRef.current.vy = -dy * 0.01;
    dragRef.current.lastX = x;
    dragRef.current.lastY = y;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-blue-950 to-black overflow-hidden flex flex-col items-center justify-center">
      
      {/* HUD Overlay */}
      <div className="absolute top-8 text-center z-10 pointer-events-none">
        <h1 className="text-white text-2xl font-light tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
            地球漫游
        </h1>
        <p className="text-blue-300 text-xs mt-2 tracking-widest animate-pulse">
            滑动屏幕 · 定位广州
        </p>
      </div>

      <div className="relative w-full h-full max-w-[600px] max-h-[600px] flex items-center justify-center">
         <canvas
            ref={canvasRef}
            width={800} // Internal resolution
            height={800}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
         />
      </div>

      {/* Helper Hint Hand */}
      {!isDragging && !showLocationBtn && (
        <div className="absolute bottom-20 opacity-50 animate-bounce pointer-events-none text-white flex flex-col items-center gap-2">
           <Hand className="rotate-12" />
           <span className="text-xs">左右滑动旋转</span>
        </div>
      )}

      {/* Locate Button */}
      {showLocationBtn && (
        <div className="absolute bottom-24 z-30 animate-float">
          <button 
            onClick={onComplete}
            className="group relative bg-gradient-to-r from-red-600 to-red-800 text-white pl-6 pr-8 py-3 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-red-400 flex items-center gap-3 transition-transform active:scale-95 hover:scale-105"
          >
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></span>
            <MapPin className="w-6 h-6 text-yellow-300 fill-current" />
            <div>
                <div className="text-xs text-red-200 font-normal text-left">已锁定坐标</div>
                <div>进入广州思源学校</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default EarthStage;
