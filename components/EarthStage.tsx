
import { MapPin, Hand } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface EarthStageProps {
  onComplete: () => void;
}

const EarthStage: React.FC<EarthStageProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showLocationBtn, setShowLocationBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // References for cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>(0);
  const markerRef = useRef<THREE.Object3D | null>(null);

  // Interaction State
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const momentum = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 }); // Current rotation Euler angles

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog for depth (Space darkness)
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18; // Distance from Earth
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Light reflecting off the "dark" side (rim light)
    const rimLight = new THREE.SpotLight(0x0044ff, 2);
    rimLight.position.set(-5, 0, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // --- 3. Earth Group ---
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // --- LOADING MANAGER FIX ---
    const loadManager = new THREE.LoadingManager();
    loadManager.onLoad = () => {
      console.log("All textures loaded");
      setIsLoading(false);
    };
    loadManager.onError = (url) => {
      console.error('There was an error loading ' + url);
      // Fallback: stop loading anyway so app isn't stuck
      setIsLoading(false);
    };

    // Fallback timeout in case textures hang
    setTimeout(() => setIsLoading(false), 5000);

    // Pass manager to loader!
    const textureLoader = new THREE.TextureLoader(loadManager);

    // --- 4. The Earth Sphere ---
    const earthGeo = new THREE.SphereGeometry(5, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
      specularMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
      normalMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
      specular: new THREE.Color(0x333333),
      shininess: 15
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    // --- 5. Cloud Layer ---
    const cloudGeo = new THREE.SphereGeometry(5.05, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    cloudsRef.current = clouds;
    earthGroup.add(clouds);

    // --- 6. Atmosphere Glow (Sprite) ---
    const spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(generateGlowTexture()),
      color: 0x44aaff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const glowSprite = new THREE.Sprite(spriteMaterial);
    glowSprite.scale.set(12, 12, 1);
    scene.add(glowSprite); 

    // --- 7. Starfield Background ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const posArray = new Float32Array(starCount * 3);
    for(let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100; // Spread stars
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);


    // --- 8. Marker for Guangzhou (Invisible Logic) ---
    // Correct Coords: 23.1 N, 113.2 E
    const lat = 23.1;
    const lon = 113.2;
    
    // Accurate Sphere Position Calculation
    const calcPosFromLatLon = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180); // +180 is the standard offset for this texture mapping
      
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      
      return new THREE.Vector3(x, y, z);
    };

    const markerPos = calcPosFromLatLon(lat, lon, 5.0);
    
    // Invisible object to track position for logic
    const targetObject = new THREE.Object3D();
    targetObject.position.copy(markerPos);
    earthGroup.add(targetObject);
    markerRef.current = targetObject;

    // --- Initial Rotation to FACE Guangzhou ---
    targetRotation.current.x = 1.3; // Calibrated to show China
    targetRotation.current.y = 0.4; // Tilt down to show North Hemisphere
    earthGroup.rotation.y = targetRotation.current.x;
    earthGroup.rotation.x = targetRotation.current.y;


    // --- 9. Animation Loop ---
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Cloud Rotation (Independent)
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += 0.0003;
      }

      // Momentum & Inertia
      if (!isDragging.current) {
        momentum.current.x *= 0.95; // Decay
        momentum.current.y *= 0.95;
        
        targetRotation.current.x += momentum.current.x;
        targetRotation.current.y += momentum.current.y;
      }

      // Apply Rotation
      // Clamp Tilt (Latitude)
      targetRotation.current.y = Math.max(-1, Math.min(1, targetRotation.current.y));

      earthGroup.rotation.y = targetRotation.current.x;
      earthGroup.rotation.x = targetRotation.current.y;

      // Check Marker Visibility
      if (markerRef.current && cameraRef.current) {
        // Is it facing us?
        const vToMarker = markerRef.current.position.clone().applyQuaternion(earthGroup.quaternion).normalize();
        const vToCam = camera.position.clone().normalize();
        const dot = vToMarker.dot(vToCam);

        // dot > 0.85 means it's roughly center
        if (dot > 0.85) {
            setShowLocationBtn(true);
        } else {
            setShowLocationBtn(false);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- 10. Event Listeners ---
    const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);


  // Input Handlers
  const onDown = (clientX: number, clientY: number) => {
    isDragging.current = true;
    previousMousePosition.current = { x: clientX, y: clientY };
    momentum.current = { x: 0, y: 0 };
  };

  const onMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    
    const deltaX = clientX - previousMousePosition.current.x;
    const deltaY = clientY - previousMousePosition.current.y;
    
    previousMousePosition.current = { x: clientX, y: clientY };

    // Sensitivity
    const speed = 0.005;
    
    // Update Rotation directly
    targetRotation.current.x += deltaX * speed;
    targetRotation.current.y += deltaY * speed;

    // Save momentum
    momentum.current = { x: deltaX * speed, y: deltaY * speed };
  };

  const onUp = () => {
    isDragging.current = false;
  };

  // Canvas Texture Generator for Glow
  function generateGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(60, 160, 255, 1)'); // Blue center
        gradient.addColorStop(0.3, 'rgba(60, 160, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
    }
    return canvas;
  }

  return (
    <div 
        ref={mountRef} 
        className="relative w-full h-full bg-black cursor-move overflow-hidden"
        onMouseDown={e => onDown(e.clientX, e.clientY)}
        onMouseMove={e => onMove(e.clientX, e.clientY)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={e => onDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => onMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onUp}
    >
      {/* Loading Overlay */}
      {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-500">
              <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-cn-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="text-white text-sm tracking-widest animate-pulse">卫星数据加载中...</div>
              </div>
          </div>
      )}

      {/* UI Overlay */}
      <div className="absolute top-10 w-full text-center pointer-events-none z-10">
        <h2 className="text-white/80 text-xl tracking-[0.3em] font-light drop-shadow-lg">转动地球 寻找广州</h2>
        <div className="mt-4 flex justify-center opacity-60">
            <Hand className="text-white w-6 h-6 animate-pulse" />
        </div>
      </div>

      {showLocationBtn && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in duration-500">
             <button 
                onClick={onComplete}
                className="group relative flex flex-col items-center press-effect"
             >
                {/* Pulsing Target Ring */}
                <div className="absolute w-full h-full -z-10 animate-ping rounded-full border-2 border-red-500 opacity-50"></div>
                
                <div className="w-20 h-20 rounded-full border-2 border-white/50 bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.6)] group-hover:scale-110 transition-transform cursor-pointer">
                    <MapPin size={32} className="text-white fill-current" />
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-1">
                    <div className="bg-black/70 text-white px-6 py-2 rounded-full border border-white/10 backdrop-blur-md font-bold text-lg tracking-widest shadow-2xl">
                        📍 广东·广州
                    </div>
                    <div className="text-cn-gold text-sm font-medium animate-pulse drop-shadow-md">
                        点击降落至校园
                    </div>
                </div>
             </button>
         </div>
      )}
    </div>
  );
};

export default EarthStage;
