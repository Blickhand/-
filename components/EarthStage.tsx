
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Hand } from 'lucide-react';

interface EarthStageProps {
  onComplete: () => void;
}

// --- Quaternion Math Helpers ---
type Quat = [number, number, number, number]; // w, x, y, z
const IDENTITY_QUAT: Quat = [1, 0, 0, 0];

const multiplyQuats = (q1: Quat, q2: Quat): Quat => {
  const [w1, x1, y1, z1] = q1;
  const [w2, x2, y2, z2] = q2;
  // Standard Hamilton product
  return [
    w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
    w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
    w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2
  ];
};

const normalizeQuat = (q: Quat): Quat => {
  const len = Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
  if (len < 0.000001) return IDENTITY_QUAT;
  return [q[0]/len, q[1]/len, q[2]/len, q[3]/len];
};

const quatFromAxisAngle = (axis: [number, number, number], angle: number): Quat => {
  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);
  return [
    Math.cos(halfAngle),
    axis[0] * s,
    axis[1] * s,
    axis[2] * s
  ];
};

const getRotationMatrix = (q: Quat) => {
  const [w, x, y, z] = q;
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;

  return [
    1 - (yy + zz), xy - wz, xz + wy,
    xy + wz, 1 - (xx + zz), yz - wx,
    xz - wy, yz + wx, 1 - (xx + yy)
  ];
};

const EarthStage: React.FC<EarthStageProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showLocationBtn, setShowLocationBtn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for Quaternion Rotation
  // Guangzhou is at 113E. In this coordinate system, Z+ (front) is 90E.
  // To face 113E, we need to rotate approx 23 degrees.
  // Rotate Y axis by -23 deg (clockwise) to bring 113 to center.
  const quatRef = useRef<Quat>(quatFromAxisAngle([0, 1, 0], -23 * (Math.PI / 180)));
  
  // Physics State
  const dragRef = useRef({ 
    startX: 0, 
    startY: 0,
    isDown: false,
    lastX: 0,
    lastY: 0,
    momentumX: 0, // Angular velocity around Y axis (screen x)
    momentumY: 0, // Angular velocity around X axis (screen y)
  });
  
  const requestRef = useRef<number>(0);

  // Configuration
  const PARTICLE_COUNT = 8500; // High Density
  const SPHERE_RADIUS = 280;   // Large Scale
  
  // Guangzhou Coordinates (23.1N, 113.2E)
  // Converted to Spherical (Radius = 1 for logic)
  // y = sin(lat), x = cos(lat)cos(theta), z = cos(lat)sin(theta)
  // Note: atan2(z, x) maps to longitude. 
  // If x axis is 0 deg, z axis is 90 deg.
  const phi = (90 - 23.1) * (Math.PI / 180);
  const theta = (113.2) * (Math.PI / 180); // No offset needed
  
  // Actual 3D point of Guangzhou on the unit sphere (before rotation)
  const targetBase = {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta)
  };

  const particles = useRef<{x: number, y: number, z: number, isLand: boolean}[]>([]);

  // --- Map Generation Logic ---
  const isInLandMass = (lat: number, lon: number): boolean => {
    const inRect = (minLat: number, maxLat: number, minLon: number, maxLon: number) => 
       lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;

    // --- ASIA (High Detail for Guangzhou Context) ---
    // Mainland China/Asia Block
    if (inRect(15, 55, 70, 135)) {
        // Cut out Indian Ocean
        if (lat < 25 && lon < 90 && lon > 60 && lat > 10) return true; // India
        if (lat < 25 && lon < 80) return false;

        // Cut out South China Sea (Curve)
        // Accurate coastline: Guangzhou (23.1) is Land, Sea starts just below
        if (lat < 22.5 && lon > 108) return false; 
        
        // Cut out Yellow Sea / East China Sea
        if (lat > 30 && lat < 40 && lon > 122) return false;
        
        return true;
    }
    
    // Taiwan
    if (inRect(21.5, 25.5, 119.5, 122.5)) return true;
    // Hainan
    if (inRect(18, 20.5, 108, 111.5)) return true;
    // Japan
    if (inRect(30, 46, 129, 146)) return true;
    // Philippines
    if (inRect(5, 19, 116, 127)) return true;
    // Indonesia/Malaysia
    if (inRect(-10, 7, 95, 142)) return true;

    // --- OTHER CONTINENTS (Simplified) ---
    // Europe
    if (inRect(36, 70, -10, 40)) return true;
    if (inRect(50, 60, -10, 2)) return true; // UK
    // Africa
    if (inRect(-35, 37, -18, 52)) {
         if (lat < 12 && lon > 51) return false; // Horn
         return true;
    }
    if (inRect(-26, -12, 43, 51)) return true; // Madagascar
    // Americas
    if (inRect(-56, 13, -82, -34)) return true; // South
    if (inRect(15, 72, -130, -55)) { // North
        if (inRect(50, 70, -95, -75)) return false; // Hudson
        return true;
    }
    // Australia
    if (inRect(-40, -10, 112, 154)) return true;

    return false;
  };

  const initParticles = () => {
    const pts = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci Sphere Algorithm for even distribution
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = 2 * Math.PI * i / goldenRatio;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Convert to Lat/Lon for Map Mapping
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);
      
      const isLand = isInLandMass(lat, lon);
      
      pts.push({ x, y, z, isLand });
    }
    particles.current = pts;
  };

  useEffect(() => {
    initParticles();
    
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

    const animate = () => {
      // 1. Physics & Momentum
      if (!dragRef.current.isDown) {
         // Apply momentum damping
         dragRef.current.momentumX *= 0.95;
         dragRef.current.momentumY *= 0.95;

         // If there is significant momentum, rotate
         if (Math.abs(dragRef.current.momentumX) > 0.001 || Math.abs(dragRef.current.momentumY) > 0.001) {
             // Rotate around Screen Y axis (Horizontal movement)
             const qx = quatFromAxisAngle([0, 1, 0], dragRef.current.momentumX);
             // Rotate around Screen X axis (Vertical movement)
             const qy = quatFromAxisAngle([1, 0, 0], dragRef.current.momentumY);
             
             // Combine rotations: New = Y_rot * X_rot * Old
             let nextQuat = multiplyQuats(qx, quatRef.current);
             nextQuat = multiplyQuats(qy, nextQuat);
             quatRef.current = normalizeQuat(nextQuat);
         } else {
             // Auto-rotate very slowly if idle
             const autoRot = quatFromAxisAngle([0, 1, 0], 0.002);
             quatRef.current = normalizeQuat(multiplyQuats(autoRot, quatRef.current));
         }
      }

      // 2. Clear
      ctx.fillStyle = '#020617'; // Slate 950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 3. Transform & Draw
      const m = getRotationMatrix(quatRef.current);
      
      // Draw Particles
      // Sort by Z for simple depth handling (painters algorithm)
      // Note: Full sorting 8500 points every frame is heavy, but usually fine on modern devices.
      // Optimization: Only draw if z > -radius/2 (cull back)
      
      // Pre-calculate transformed points
      const projected = [];
      const pLen = particles.current.length;
      
      for(let i=0; i<pLen; i++) {
          const p = particles.current[i];
          // Matrix Multiply
          const rx = m[0]*p.x + m[1]*p.y + m[2]*p.z;
          const ry = m[3]*p.x + m[4]*p.y + m[5]*p.z;
          const rz = m[6]*p.x + m[7]*p.y + m[8]*p.z;

          if (rz > -0.5) { // Simple culling
              // Perspective projection
              const scale = 300 / (300 + (SPHERE_RADIUS - rz * SPHERE_RADIUS)); // Fake depth scale
              const alpha = (rz + 1) / 2; // Fade out back
              
              projected.push({
                  x: cx + rx * SPHERE_RADIUS,
                  y: cy - ry * SPHERE_RADIUS, // Flip Y for screen coords
                  z: rz,
                  alpha: alpha,
                  isLand: p.isLand
              });
          }
      }

      // Draw loop
      projected.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = p.isLand 
            ? `rgba(16, 185, 129, ${p.alpha})` // Emerald 500
            : `rgba(30, 58, 138, ${p.alpha * 0.6})`; // Blue 900
          
          const size = p.isLand ? 1.8 : 1.2;
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
      });

      // 4. Draw Guangzhou Target
      // Transform target base
      const tx = m[0]*targetBase.x + m[1]*targetBase.y + m[2]*targetBase.z;
      const ty = m[3]*targetBase.x + m[4]*targetBase.y + m[5]*targetBase.z;
      const tz = m[6]*targetBase.x + m[7]*targetBase.y + m[8]*targetBase.z;
      
      // Check if target is visible (Front facing and somewhat centered)
      if (tz > 0.4) {
          const screenX = cx + tx * SPHERE_RADIUS;
          const screenY = cy - ty * SPHERE_RADIUS;
          
          // Draw Beacon
          ctx.beginPath();
          ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700'; // Gold
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#FF0000';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Pulse Ring
          const pulse = (Date.now() % 1000) / 1000;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 6 + pulse * 20, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 215, 0, ${1 - pulse})`;
          ctx.stroke();

          // Check if centered for UI trigger
          // Distance from center of screen < 80px
          const dist = Math.sqrt(Math.pow(screenX - cx, 2) + Math.pow(screenY - cy, 2));
          if (dist < 80) {
              setShowLocationBtn(true);
          } else {
              setShowLocationBtn(false);
          }
      } else {
          setShowLocationBtn(false);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', resize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // --- Interaction Handlers ---
  const handleStart = (x: number, y: number) => {
    setIsDragging(true);
    dragRef.current.isDown = true;
    dragRef.current.startX = x;
    dragRef.current.startY = y;
    dragRef.current.lastX = x;
    dragRef.current.lastY = y;
    dragRef.current.momentumX = 0;
    dragRef.current.momentumY = 0;
  };

  const handleMove = (x: number, y: number) => {
    if (!dragRef.current.isDown) return;

    const dx = x - dragRef.current.lastX;
    const dy = y - dragRef.current.lastY;

    // SENSITIVITY
    const speed = 0.005;

    // Trackball Logic:
    // Dragging Right (dx > 0) -> Rotate around +Y axis
    const qx = quatFromAxisAngle([0, 1, 0], dx * speed);
    
    // Dragging Down (dy > 0) -> Surface should move DOWN
    // This requires rotating Front -> Bottom, which is positive rotation around X axis (Thumb Right).
    // Previous was -dy * speed, which inverted control.
    const qy = quatFromAxisAngle([1, 0, 0], dy * speed); 

    // Apply Screen Space rotation: New = Q_delta * Old
    let nextQuat = multiplyQuats(qx, quatRef.current);
    nextQuat = multiplyQuats(qy, nextQuat);
    
    quatRef.current = normalizeQuat(nextQuat);

    // Save momentum
    dragRef.current.momentumX = dx * speed;
    dragRef.current.momentumY = dy * speed;
    
    dragRef.current.lastX = x;
    dragRef.current.lastY = y;
  };

  const handleEnd = () => {
    setIsDragging(false);
    dragRef.current.isDown = false;
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden cursor-move">
      <canvas 
        ref={canvasRef}
        className="block touch-none"
        onMouseDown={e => handleStart(e.clientX, e.clientY)}
        onMouseMove={e => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      />

      {/* UI Overlay */}
      <div className="absolute top-10 w-full text-center pointer-events-none">
        <h2 className="text-white/60 text-lg tracking-[0.2em] animate-pulse">滑动地球 寻找广州</h2>
        <div className="mt-2 flex justify-center opacity-50">
            <Hand className="text-white w-6 h-6 animate-bounce" />
        </div>
      </div>

      {showLocationBtn && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
             <button 
                onClick={onComplete}
                className="group relative flex flex-col items-center animate-in zoom-in duration-300"
             >
                <div className="w-24 h-24 rounded-full border-4 border-cn-gold bg-cn-red/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.6)] group-active:scale-95 transition-transform">
                    <MapPin size={40} className="text-white fill-current" />
                </div>
                <div className="mt-4 bg-black/60 text-white px-6 py-2 rounded-full border border-white/20 backdrop-blur-md font-bold text-lg tracking-wider">
                    已定位 广东·广州
                </div>
                <div className="mt-2 text-cn-gold text-sm font-medium animate-pulse">
                    点击进入思源学校
                </div>
             </button>
         </div>
      )}
    </div>
  );
};

export default EarthStage;
