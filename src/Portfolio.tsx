// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  ArrowUpRight,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MousePointer2,
  Play,
  Send,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Orbit,
  LayoutGrid,
  ShoppingBag,
  Film,
  Music,
  CheckSquare,
  Calculator as CalcIcon,
  Gamepad2,
  ArrowUp,
  Briefcase,
  ShieldCheck,
  Zap,
  Eye
} from 'lucide-react';

// ==========================================
// SOUND EFFECTS SYNTHESIZER (WEB AUDIO API)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) this.playPing(520, 0.08);
    return this.enabled;
  }

  playPing(freq = 440, duration = 0.06) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors on restricted devices
    }
  }
}

const soundFX = new SoundEngine();

// ==========================================
// PORTFOLIO DATA
// ==========================================
const TECH_STACK = [
  {
    id: 'html5',
    name: 'HTML5',
    category: 'Core Architecture',
    level: 'Semantic & Accessible',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.35)',
    description: 'Semantic markup, SEO-first structure, WAI-ARIA accessibility standards, and modern DOM APIs.',
     renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 3l1.5 15L12 21l6.5-3L20 3H4z" stroke="#f97316" />
        <path d="M16 7H8l.5 4.5h7l-.5 4.5-3 1-3-1-.2-2" stroke="#fdba74" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'css3',
    name: 'CSS3',
    category: 'Visual Styling & Motion',
    level: 'Fluid Layouts & Keyframes',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
    description: 'Custom properties, CSS Grid/Flexbox architecture, glassmorphism, 3D transforms, and hardware-accelerated animations.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 3l1.5 15L12 21l6.5-3L20 3H4z" stroke="#38bdf8" />
        <path d="M8 7h8l-.5 4.5H9.5l.3 3.5 2.2.7 2.2-.7.3-2.5" stroke="#bae6fd" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Interactive Logic',
    level: 'ES6+ & Async Engine',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.35)',
    description: 'Modern ES6+ syntax, closures, asynchronous state orchestration, DOM manipulation, and performance optimization.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#facc15" />
        <path d="M10 10v5a2 2 0 01-2 2M14 14.5c.5 1 1.5 1.5 2.5 1.5 1.2 0 2-.7 2-1.6 0-2-4-1.5-4-3.4 0-.9.8-1.5 2-1.5 1 0 1.8.4 2.2 1.2" stroke="#fef08a" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'UI Engineering',
    level: 'Component Architecture',
    color: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.4)',
    description: 'Custom Hooks, declarative state patterns, virtual DOM optimization, reusable design systems, and SPA architecture.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2.2" fill="#22d3ee" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#22d3ee" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" stroke="#67e8f9" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" stroke="#a5f3fc" />
      </svg>
    )
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Design Tokens',
    level: 'Utility-First Systems',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.35)',
    description: 'Rapid responsive prototyping, dark-mode design systems, bespoke micro-interactions, and zero-runtime CSS bundles.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C13.38 10.84 14.5 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.16 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.38 16.84 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.16 9.5 12 7 12z" stroke="#22d3ee" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'Responsive Grid',
    level: 'Enterprise UI Speed',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.35)',
    description: 'Cross-browser responsive grid systems, accessible modal/navigation primitives, and rapid UI scaffolding.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="4" stroke="#8b5cf6" />
        <path d="M9 8h4a2 2 0 010 4H9V8zm0 4h4.5a2 2 0 010 4H9v-4z" stroke="#c4b5fd" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Version Control',
    level: 'Branching & History',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.35)',
    description: 'Distributed version control, clean atomic commits, feature branching workflows, and conflict resolution.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="6" cy="6" r="2" stroke="#f43f5e" />
        <circle cx="18" cy="12" r="2" stroke="#fda4af" />
        <circle cx="6" cy="18" r="2" stroke="#f43f5e" />
        <path d="M6 8v8M8 6h4a4 4 0 014 4v0" stroke="#fb7185" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Collaboration',
    level: 'Code Review & CI/CD',
    color: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.3)',
    description: 'Pull request workflows, open-source repository management, documentation standards, and collaborative deployment.',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="#f8fafc" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 18c-4.51 2-5-2-7-2" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const PROJECTS = [
  {
    number: '01',
    id: 'ecommerce',
    title: 'E-Commerce Website',
    category: 'Web Application',
    subtitle: 'Next-Gen Luxury Tech Storefront',
    description:
      'Built a responsive e-commerce website using HTML, CSS, and JavaScript with interactive features and a mobile-friendly design.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'REST API'],
    accent: '#38bdf8',
    secondaryAccent: '#2563eb',
    icon: ShoppingBag,
    highlights: [
      'Dynamic multi-criteria product filtering & instant search',
      'Persistent cart state with real-time subtotal & quantity controls',
      'Seamless responsive checkout UI and quick-view product configurator'
    ],
    github:"https://github.com/devWaleedX/EcommerceWebsite.git",
    Live : 'https://ecommerce-website-git-main-devwaleedx.vercel.app/'
  },
  {
    number: '02',
    id: 'expense',
    title: 'Expense Tracker',
    category: 'Finance Dashboard',
    subtitle: 'Real-Time Personal Finance & Analytics',
    description:
      'Real-time personal finance dashboard with income/expense categorization, dynamic balance calculations, and visual spending analytics.',
    tags: ['React.js', 'JavaScript', 'Tailwind CSS', 'LocalStorage'],
    accent: '#10b981',
    secondaryAccent: '#059669',
    icon: Layers,
    highlights: [
      'Instant net balance, total income, and expense breakdown calculations',
      'Add and delete categorized transactions with persistent state',
      'Visual cash-flow ratio bar and real-time spending telemetry'
    ],
    github: 'https://github.com/devWaleedX/Expense-Tracker.git',
    Live : 'https://expense-tracker-xi-rose-25.vercel.app/'
  },
  {
    number: '03',
    id: 'weather',
    title: 'Weather API App',
    category: 'REST API App',
    subtitle: 'Live Meteorological Forecasting Engine',
    description:
      'Live meteorological forecasting web app displaying real-time temperature, humidity, wind metrics, and dynamic atmospheric conditions.',
    tags: ['HTML5', 'REST API', 'JavaScript', 'CSS3'],
    accent: '#8b5cf6',
    secondaryAccent: '#6d28d9',
    icon: Globe,
    highlights: [
      'Instant city switching (Jhelum, Islamabad, Lahore, London, Tokyo)',
      'Real-time temperature unit conversion (°C / °F) with humidity & wind telemetry',
      '5-day atmospheric forecast strip with dynamic condition badges'
    ],
    github: 'https://github.com/devWaleedX/Weather-App.git',
    Live : 'https://weather-91apggn9n-devwaleedx.vercel.app/'
  },
  {
    number: '04',
    id: 'currency',
    title: 'Currency Converter',
    category: 'FinTech Utility',
    subtitle: 'Multi-Currency Foreign Exchange Calculator',
    description:
      'Multi-currency foreign exchange calculator with instant rate conversion, currency swap controls, and historical trend indicators.',
    tags: ['React.js', 'Exchange Rate API', 'Tailwind CSS', 'JavaScript'],
    accent: '#f59e0b',
    secondaryAccent: '#d97706',
    icon: Zap,
    highlights: [
      'Real-time multi-currency conversion across USD, PKR, EUR, GBP, and AED',
      'One-click bi-directional currency swap with instant rate recalculation',
      'Live exchange rate ticker and historical trend indicator'
    ],
    github: 'https://github.com/devWaleedX/Currency-Converter.git',
    Live : 'https://currency-converter-kappa-umber.vercel.app'
  }
];

const EXPERIENCES = [
  {
    id: 'devhub',
    company: 'Developer Hub Corporation',
    role: 'Front-End Development Intern',
    location: 'Remote / Pakistan',
    badge: 'Engineering Internship',
    accent: '#38bdf8',
    summary:
      'Focused on translating modern design specifications into responsive, accessible, and high-performance front-end interfaces using React.js and modern CSS architecture.',
    responsibilities: [
      'Engineered reusable, modular React components and responsive layouts utilizing HTML5, CSS3, Tailwind CSS, and modern JavaScript (ES6+).',
      'Translated complex UI/UX wireframes into pixel-accurate interactive experiences with smooth micro-interactions and cross-browser compatibility.',
      'Collaborated within structured Git and GitHub workflows, participating in clean code reviews, branch management, and UI debugging.'
    ],
    skills: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Responsive UI', 'Git & GitHub']
  },
  {
    id: 'neveraam',
    company: 'EcomVa',
    role: 'Front-End Development Intern',
    location: 'Pakistan',
    badge: 'Front-End Internship',
    accent: '#8b5cf6',
    summary:
      'Contributed to front-end web development, focusing on responsive user interfaces, interactive features, and clean design.',
    responsibilities: [
      'Developed responsive web pages using HTML5, CSS3, JavaScript, React.js, and Bootstrap.',
      'Implemented interactive UI components, form handling, and mobile-friendly layouts.',
      'Improved website usability, code organization, and cross-device responsiveness through practical development tasks.'
    ],
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'UI Polish', 'React Js', 'Tailwind CSS']
  }
];

// ==========================================
// THREE.JS INTERACTIVE HERO & BACKGROUND SCENE
// ==========================================
function ThreeHeroCanvas({ scrollProgress }) {
  const mountRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (e) {
      return;
    }

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 5, 28);
    blueLight.position.set(5, 4, 6);
    scene.add(blueLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 5, 28);
    violetLight.position.set(-6, -4, 5);
    scene.add(violetLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 2);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // Master Group
    const mainGroup = new THREE.Group();
    const isDesktop = window.innerWidth >= 1024;
    mainGroup.position.x = isDesktop ? 2.4 : 0;
    scene.add(mainGroup);

    // 1. Metallic Chrome Torus Knot Core
    const knotGeo = new THREE.TorusKnotGeometry(1.25, 0.36, 180, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.92,
      roughness: 0.14
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    mainGroup.add(knotMesh);

    // 2. Wireframe Geodesic Cage
    const cageGeo = new THREE.IcosahedronGeometry(2.25, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainGroup.add(cageMesh);

    // 3. Dual Gyroscope Rings
    const ring1Geo = new THREE.TorusGeometry(2.85, 0.018, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.45
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.3, 0.012, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    mainGroup.add(ring2);

    // 4. Floating Geometric Shards
    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2
    });

    const shardsData = [];
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / 18) * Math.PI * 2;
      const radius = 3.1 + Math.random() * 2.2;
      const yOffset = (Math.random() - 0.5) * 4.5;
      mesh.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );
      const scale = 0.5 + Math.random() * 1.1;
      mesh.scale.set(scale, scale, scale);
      shardsGroup.add(mesh);
      shardsData.push({
        mesh,
        speed: 0.005 + Math.random() * 0.01,
        angle,
        radius,
        yOffset
      });
    }
    mainGroup.add(shardsGroup);

    // 5. Starfield Particle Dust
    const particlesCount = 650;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 28;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.035,
      transparent: true,
      opacity: 0.55
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mainGroup.position.x = window.innerWidth >= 1024 ? 2.4 : 0;
    };
    window.addEventListener('resize', handleResize);

    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate Core Sculpture
      knotMesh.rotation.x = elapsed * 0.35 + targetY * 0.45;
      knotMesh.rotation.y = elapsed * 0.45 + targetX * 0.45;

      // Counter-rotate Cage
      cageMesh.rotation.x = -elapsed * 0.18 + targetY * 0.25;
      cageMesh.rotation.y = -elapsed * 0.24 + targetX * 0.25;

      // Gyroscope Rings
      ring1.rotation.z = elapsed * 0.3;
      ring2.rotation.x = elapsed * 0.25;

      // Floating Shards Orbit
      shardsData.forEach((s, idx) => {
        s.mesh.rotation.x += 0.015;
        s.mesh.rotation.y += 0.02;
        s.mesh.position.y = s.yOffset + Math.sin(elapsed * 1.5 + idx) * 0.25;
      });

      // Scroll-Driven Camera & Group Transform
      const s = scrollRef.current;
      mainGroup.position.y = Math.sin(elapsed * 0.9) * 0.15 - s * 2.2;
      mainGroup.rotation.z = s * 1.2;

      particleSystem.rotation.y = elapsed * 0.03 + targetX * 0.08;
      particleSystem.rotation.x = targetY * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: Math.max(0.22, 1 - scrollProgress * 0.65) }}
    />
  );
}

// ==========================================
// REUSABLE 3D PERSPECTIVE TILT CARD
// ==========================================
function Tilt3DCard({ children, className = '', glowColor = 'rgba(56, 189, 248, 0.25)', intensity = 12 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    glowX: 50,
    glowY: 50,
    isHovered: false
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setStyle({
      transform: `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`,
      glowX: (x / rect.width) * 100,
      glowY: (y / rect.height) * 100,
      isHovered: true
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glowX: 50,
      glowY: 50,
      isHovered: false
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => soundFX.playPing(660, 0.04)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transition: style.isHovered ? 'transform 80ms ease-out' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
        style={{
          opacity: style.isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${style.glowX}% ${style.glowY}%, ${glowColor}, transparent 70%)`
        }}
      />
      {children}
    </div>
  );
}

// ==========================================
// MAGNETIC BUTTON COMPONENT
// ==========================================

type MagneticButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  target?: string;
};

function MagneticButton({ children, onClick, href, className = '', target }: MagneticButtonProps) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.26;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.26;
    setOffset({ x, y });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const content = (
    <span
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseEnter={() => soundFX.playPing(780, 0.05)}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 ? 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 60ms linear'
      }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  );
}

// ==========================================
// CUSTOM INTERACTIVE MOCKUP PREVIEWS FOR ALL 4 PROJECTS
// ==========================================
function ProjectVisualMockup({ project, isInteractive = false }) {
  // 01 — E-Commerce States
  const [cartCount, setCartCount] = useState(2);
  const [selectedColor, setSelectedColor] = useState('#38bdf8');

  // 02 — Expense Tracker States
  const [transactions, setTransactions] = useState([
    { id: 1, label: 'Freelance React UI', amount: 1250, type: 'income' },
    { id: 2, label: 'Cloud Hosting & Domain', amount: -140, type: 'expense' },
    { id: 3, label: 'UI Design Assets', amount: -85, type: 'expense' }
  ]);
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');

  // 03 — Weather API App States
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  // 04 — Currency Converter States
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');

  // 01 — E-Commerce Mockup
  if (project.id === 'ecommerce') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#070b19] via-[#0b1329] to-[#05070f] p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/90">AERO//STORE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 hidden sm:inline">Context API Cart</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCartCount((c) => c + 1);
                soundFX.playPing(720, 0.05);
              }}
              className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-semibold flex items-center gap-1.5 hover:bg-sky-500/30 transition"
            >
              <ShoppingBag className="w-3 h-3" /> Cart ({cartCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 my-auto py-3 items-center">
          <div className="col-span-5 flex flex-col items-center justify-center relative">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center border border-white/15 shadow-2xl transition-all duration-300"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${selectedColor}44, rgba(15,23,42,0.9))`
              }}
            >
              <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
                <path
                  d="M16 36V30C16 20.0589 23.1634 12 32 12C40.8366 12 48 20.0589 48 30V36"
                  stroke={selectedColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect x="12" y="33" width="8" height="15" rx="4" fill={selectedColor} />
                <rect x="44" y="33" width="8" height="15" rx="4" fill={selectedColor} />
              </svg>
            </div>
          </div>

          <div className="col-span-7 space-y-2">
            <div className="inline-block px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[9px] font-mono uppercase tracking-wider">
              Spatial Audio Edition
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white leading-tight">Wireless Headphones</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-lg font-extrabold text-sky-400">$349.00</span>
              <span className="text-[10px] text-slate-500 line-through">$420.00</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {['#38bdf8', '#8b5cf6', '#f43f5e'].map((clr) => (
                <button
                  key={clr}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(clr);
                  }}
                  className={`w-4 h-4 rounded-full border ${
                    selectedColor === clr ? 'scale-125 border-white' : 'border-transparent opacity-60'
                  } transition`}
                  style={{ backgroundColor: clr }}
                  aria-label="Select product color"
                />
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCartCount((c) => c + 1);
                  soundFX.playPing(880, 0.06);
                }}
                className="ml-auto px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] transition"
              >
                + Add to Bag
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2">
          <span>Subtotal: ${(cartCount * 349).toLocaleString()}</span>
          <span className="text-emerald-400 font-mono">● Instant Checkout Ready</span>
        </div>
      </div>
    );
  }

  // 02 — Expense Tracker Mockup
  if (project.id === 'expense') {
    const totalIncome = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpense;
    const expenseRatio = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;

    const addSampleTransaction = (label, val, e) => {
      e.stopPropagation();
      soundFX.playPing(val > 0 ? 820 : 540, 0.05);
      setTransactions((prev) => [
        { id: Date.now(), label, amount: val, type: val > 0 ? 'income' : 'expense' },
        ...prev.slice(0, 3)
      ]);
    };

    const removeTransaction = (id, e) => {
      e.stopPropagation();
      soundFX.playPing(480, 0.04);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    };

    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#051c14] via-[#071312] to-[#05060a] p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">FINFLOW // LEDGER</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Net: ${balance.toLocaleString()}
          </span>
        </div>

        {/* Income vs Expense Summary Cards */}
        <div className="grid grid-cols-2 gap-2.5 my-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <div className="text-[9px] font-mono uppercase text-emerald-300/80">INCOME</div>
            <div className="text-sm sm:text-base font-black text-emerald-400">+${totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
            <div className="text-[9px] font-mono uppercase text-rose-300/80">EXPENSE ({expenseRatio}%)</div>
            <div className="text-sm sm:text-base font-black text-rose-400">-${totalExpense.toLocaleString()}</div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-1.5 my-auto overflow-hidden">
          {transactions.slice(0, 3).map((t) => (
            <div
              key={t.id}
              onClick={(e) => removeTransaction(t.id, e)}
              title="Click to remove transaction"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 cursor-pointer transition text-xs"
            >
              <span className="text-slate-200 truncate pr-2">{t.label}</span>
              <span className={`font-mono font-bold shrink-0 ${t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.amount > 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Controls */}
        {isInteractive ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const num = parseFloat(txAmount);
              if (!txTitle.trim() || isNaN(num) || num === 0) return;
              soundFX.playPing(760, 0.06);
              setTransactions((prev) => [
                { id: Date.now(), label: txTitle.trim(), amount: num, type: num > 0 ? 'income' : 'expense' },
                ...prev
              ]);
              setTxTitle('');
              setTxAmount('');
            }}
            className="flex gap-1.5 pt-2 border-t border-white/10"
          >
            <input
              type="text"
              value={txTitle}
              onChange={(e) => setTxTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Title (e.g. Salary)"
              className="flex-1 min-w-0 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-400"
            />
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="+200 / -50"
              className="w-24 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0"
            >
              Add
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              onClick={(e) => addSampleTransaction('Client Milestone', 450, e)}
              className="flex-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition"
            >
              + $450 Income
            </button>
            <button
              onClick={(e) => addSampleTransaction('Server Bill', -65, e)}
              className="flex-1 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold transition"
            >
              - $65 Expense
            </button>
          </div>
        )}
      </div>
    );
  }

  // 03 — Weather API App Mockup
  if (project.id === 'weather') {
    const cities = [
      {
        name: 'Jhelum, PK',
        tempC: 28,
        condition: 'Clear Sky',
        humidity: '44%',
        wind: '14 km/h',
        icon: '☀️',
        forecast: [
          { d: 'Mon', t: 29, i: '☀️' },
          { d: 'Tue', t: 27, i: '⛅' },
          { d: 'Wed', t: 25, i: '🌧️' },
          { d: 'Thu', t: 28, i: '☀️' }
        ]
      },
      {
        name: 'Islamabad, PK',
        tempC: 24,
        condition: 'Partly Cloudy',
        humidity: '58%',
        wind: '18 km/h',
        icon: '⛅',
        forecast: [
          { d: 'Mon', t: 24, i: '⛅' },
          { d: 'Tue', t: 22, i: '🌧️' },
          { d: 'Wed', t: 23, i: '⛅' },
          { d: 'Thu', t: 26, i: '☀️' }
        ]
      },
      {
        name: 'London, UK',
        tempC: 15,
        condition: 'Light Rain',
        humidity: '78%',
        wind: '22 km/h',
        icon: '🌧️',
        forecast: [
          { d: 'Mon', t: 15, i: '🌧️' },
          { d: 'Tue', t: 16, i: '⛅' },
          { d: 'Wed', t: 14, i: '🌧️' },
          { d: 'Thu', t: 17, i: '⛅' }
        ]
      },
      {
        name: 'Tokyo, JP',
        tempC: 21,
        condition: 'Breezy Neon',
        humidity: '62%',
        wind: '19 km/h',
        icon: '🌙',
        forecast: [
          { d: 'Mon', t: 21, i: '🌙' },
          { d: 'Tue', t: 23, i: '☀️' },
          { d: 'Wed', t: 20, i: '⛅' },
          { d: 'Thu', t: 22, i: '☀️' }
        ]
      }
    ];

    const city = cities[selectedCityIndex];
    const displayTemp = useFahrenheit ? Math.round((city.tempC * 9) / 5 + 32) : city.tempC;

    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#130d2e] via-[#0c0a20] to-[#05050b] p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-violet-300">ATMOS // WEATHER API</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUseFahrenheit((f) => !f);
              soundFX.playPing(680, 0.04);
            }}
            className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/40 text-violet-200 text-[10px] font-mono font-bold hover:bg-violet-500/35 transition"
          >
            Unit: °{useFahrenheit ? 'F' : 'C'}
          </button>
        </div>

        <div className="flex items-center justify-between my-auto py-2">
          <div>
            <div className="text-xs font-mono text-violet-300 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {city.name}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
              {displayTemp}°{useFahrenheit ? 'F' : 'C'}
            </div>
            <div className="text-[11px] text-slate-300">{city.condition}</div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-3xl sm:text-4xl">{city.icon}</div>
            <div className="text-[10px] font-mono text-slate-400">Humidity: {city.humidity}</div>
            <div className="text-[10px] font-mono text-slate-400">Wind: {city.wind}</div>
          </div>
        </div>

        {/* City Switcher Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10">
          {cities.map((c, idx) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCityIndex(idx);
                soundFX.playPing(620 + idx * 50, 0.04);
              }}
              className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold truncate border transition ${
                idx === selectedCityIndex
                  ? 'bg-violet-500/30 border-violet-400 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {c.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 04 — Currency Converter Mockup
  const ratesToUSD = {
    USD: 1,
    PKR: 278.5,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67
  };

  const convertedValue = ((Number(amount) || 0) / ratesToUSD[fromCurrency]) * ratesToUSD[toCurrency];
  const unitRate = (1 / ratesToUSD[fromCurrency]) * ratesToUSD[toCurrency];

  const handleSwapCurrencies = (e) => {
    e.stopPropagation();
    soundFX.playPing(780, 0.06);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#211505] via-[#130d05] to-[#060609] p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">FX // CURRENCY ENGINE</span>
        </div>
        <span className="text-[10px] font-mono text-amber-300/80">
          1 {fromCurrency} = {unitRate.toFixed(2)} {toCurrency}
        </span>
      </div>

      <div className="my-auto space-y-2.5 py-2">
        <div className="grid grid-cols-12 gap-2 items-center bg-black/45 border border-amber-500/25 rounded-xl p-2.5">
          <div className="col-span-7">
            <div className="text-[9px] font-mono text-slate-400 uppercase">AMOUNT ({fromCurrency})</div>
            <input
              type="number"
              value={amount}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-white focus:outline-none"
            />
          </div>
          <div className="col-span-5 flex justify-end">
            <select
              value={fromCurrency}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-amber-500/20 border border-amber-400/40 text-amber-200 rounded-lg px-2 py-1 text-xs font-mono font-bold focus:outline-none"
            >
              {Object.keys(ratesToUSD).map((cur) => (
                <option key={cur} value={cur} className="bg-slate-900 text-white">
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 items-center bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5">
          <div className="col-span-7">
            <div className="text-[9px] font-mono text-amber-300/80 uppercase">CONVERTED ({toCurrency})</div>
            <div className="text-base sm:text-lg font-mono font-black text-amber-300 truncate">
              {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="col-span-5 flex justify-end">
            <select
              value={toCurrency}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-amber-500/20 border border-amber-400/40 text-amber-200 rounded-lg px-2 py-1 text-xs font-mono font-bold focus:outline-none"
            >
              {Object.keys(ratesToUSD).map((cur) => (
                <option key={cur} value={cur} className="bg-slate-900 text-white">
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        <div className="flex gap-1.5">
          {[50, 100, 500].map((preset) => (
            <button
              key={preset}
              onClick={(e) => {
                e.stopPropagation();
                setAmount(preset);
                soundFX.playPing(650, 0.04);
              }}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-slate-300 transition"
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          onClick={handleSwapCurrencies}
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] font-mono transition"
        >
          ⇄ Swap Pair
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN PORTFOLIO APPLICATION
// ==========================================
export default function App() {
  // Loading screen state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Navigation & Scroll state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom Cursor State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Tech Stack View Mode ('grid' | 'orbit')
  const [techViewMode, setTechViewMode] = useState('grid');
  const [activeTech, setActiveTech] = useState(TECH_STACK[3]); // Default React.js
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Selected Work Filter & Interactive Modal
  const [workFilter, setWorkFilter] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState<any>(null);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [formError, setFormError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // 1. High-Tech Loading Sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 350);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 14) + 6);
      });
    }, 85);
    return () => clearInterval(interval);
  }, []);

  // 2. Orbit Rotation Loop for 3D Orbit View
  useEffect(() => {
    if (techViewMode !== 'orbit') return;
    let frameId;
    const step = () => {
      setOrbitAngle((a) => (a + 0.28) % 360);
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [techViewMode]);

  // 3. Scroll Progress & Section Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, scrollTop / window.innerHeight) : 0;
      setScrollProgress(progress);

      const sections = ['hero', 'about', 'tech', 'work', 'experience', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.42 && rect.bottom >= 180) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Custom Magnetic Cursor Tracker
  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isClickable =
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a'));
      setCursorHover(Boolean(isClickable));
    };
    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProjects = useMemo(() => {
    if (workFilter === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === workFilter);
  }, [workFilter]);

  const handleCopyEmail = () => {
    const emailPlaceholder = 'waleedhassan95712@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailPlaceholder).catch(() => {});
    }
    setCopiedEmail(true);
    soundFX.playPing(880, 0.08);
    setTimeout(() => setCopiedEmail(false), 2600);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormError('');
  if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
    setFormError('Please fill in your name, email address, and project message.');
    return;
  }
  if (!formData.email.includes('@')) {
    setFormError('Please provide a valid email address.');
    return;
  }
  setFormStatus('sending');
  soundFX.playPing(620, 0.08);

  try {
    const res = await fetch('https://formspree.io/f/xbggnzrn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormStatus('sent');
      soundFX.playPing(960, 0.12);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setFormStatus('idle');
      setFormError('Something went wrong. Please try again or email me directly.');
    }
  } catch {
    setFormStatus('idle');
    setFormError('Network error. Please try again or email me directly.');
  }
};

  return (
    <div className="min-h-screen bg-[#030305] text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans overflow-x-hidden relative">
      {/* ==========================================
          HIGH-TECH INITIAL LOADING SCREEN
      ========================================== */}
      {!isLoaded && (
        <div
          className={`fixed inset-0 z-[100] bg-[#030305] flex flex-col justify-between p-6 sm:p-12 transition-opacity duration-700 ${
            loadingProgress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
                WALEED HASSAN // ARGON 3D ENGINE
              </span>
            </div>
            <span className="text-xs font-mono text-sky-400">WEBGL 2.0 INITIALIZING</span>
          </div>

          <div className="my-auto max-w-xl">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-violet-400 mb-3">
              CREATIVE FRONT-END EXPERIENCE
            </div>
            <div className="text-5xl sm:text-8xl font-black tracking-tighter text-white font-mono">
              {loadingProgress}%
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[11px] font-mono text-slate-500">
              <span>COMPILING SHADERS & GEOMETRY</span>
              <span>JHELUM, PK // GLOBAL</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>PORTFOLIO EDITION</span>
            <span>REACT.JS • THREE.JS • TAILWIND</span>
          </div>
        </div>
      )}

      {/* ==========================================
          CUSTOM GLOWING MAGNETIC CURSOR (DESKTOP)
      ========================================== */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[90] hidden lg:block transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${cursorPos.x - (cursorHover ? 24 : 12)}px, ${cursorPos.y - (cursorHover ? 24 : 12)}px, 0)`
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 flex items-center justify-center ${
            cursorHover
              ? 'w-12 h-12 border-sky-400 bg-sky-400/15 scale-110 shadow-[0_0_25px_rgba(56,189,248,0.5)]'
              : 'w-6 h-6 border-white/40 bg-white/5'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${cursorHover ? 'bg-sky-300' : 'bg-white'}`} />
        </div>
      </div>

      {/* ==========================================
          FIXED THREE.JS INTERACTIVE 3D SCENE
      ========================================== */}
      <ThreeHeroCanvas scrollProgress={scrollProgress} />

      {/* Subtle Ambient Background Radial Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* ==========================================
          FLOATING GLASSMORPHIC HEADER NAVIGATION
      ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#07070c]/75 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-violet-600 p-[1px] shadow-[0_0_20px_rgba(56,189,248,0.35)]">
              <div className="w-full h-full bg-[#050508] rounded-[11px] flex items-center justify-center font-black text-sm tracking-tighter text-white group-hover:bg-transparent transition">
                WH
              </div>
            </div>
            <div>
              <span className="block text-xs font-black tracking-[0.2em] text-white">WALEED HASSAN</span>
              <span className="block text-[10px] font-mono text-sky-400">FRONT-END • REACT.JS</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1">
            {[
              { id: 'hero', label: 'Index' },
              { id: 'about', label: 'About' },
              { id: 'tech', label: 'Tech Stack' },
              { id: 'work', label: 'Selected Work' },
              { id: 'experience', label: 'Experience' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => soundFX.playPing(560, 0.03)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Sound Synthesizer Toggle + CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSoundEnabled(soundFX.toggle())}
              title={soundEnabled ? 'Mute UI Audio FX' : 'Enable UI Audio FX'}
              className={`p-2.5 rounded-xl border text-xs transition ${
                soundEnabled
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              aria-label="Toggle UI Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <MagneticButton
              onClick={() => scrollToSection('contact')}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-sky-300 transition shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            >
              Let's Talk
            </MagneticButton>

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-[#0a0a12]/95 backdrop-blur-2xl border border-white/10 p-4 flex flex-col gap-2 shadow-2xl">
            {[
              { id: 'hero', label: '00 // Hero' },
              { id: 'about', label: '01 // About Me' },
              { id: 'tech', label: '02 // Tech Stack' },
              { id: 'work', label: '03 // Selected Work' },
              { id: 'experience', label: '04 // Experience' },
              { id: 'contact', label: '05 // Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-sky-500/20 text-sm font-mono text-slate-200 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ==========================================
          02. HERO EXPERIENCE SECTION
      ========================================== */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Typography & CTAs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-sky-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-sky-300 font-semibold">
                CREATIVE FRONT-END DEVELOPER
              </span>
            </div>

            {/* Huge Display Name */}
            <div className="space-y-1">
              <h1 className="text-6xl sm:text-8xl xl:text-[108px] font-black tracking-tighter leading-[0.88] uppercase">
                <span className="block bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  WALEED
                </span>
                <span className="block bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  HASSAN.
                </span>
              </h1>
            </div>

            {/* Main Heading */}
            <h2 className="text-xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
              "I BUILD DIGITAL EXPERIENCES THAT{' '}
              <span className="underline decoration-sky-400/60 decoration-2 underline-offset-8 text-sky-300">
                MOVE PEOPLE.
              </span>
              "
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-lg text-slate-300/90 max-w-xl leading-relaxed font-normal">
              Transforming ideas into beautiful, interactive and high-performance digital experiences through modern front-end technologies.
            </p>

            {/* Premium Magnetic CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <MagneticButton
                onClick={() => scrollToSection('work')}
                className="group relative px-7 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-600 text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-[0_0_40px_rgba(56,189,248,0.4)] hover:shadow-[0_0_55px_rgba(56,189,248,0.65)] transition-all"
              >
                <span className="flex items-center gap-2.5">
                  EXPLORE MY WORK
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => scrollToSection('contact')}
                className="px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 backdrop-blur-xl text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all"
              >
                <span className="flex items-center gap-2.5">
                  LET'S TALK
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </span>
              </MagneticButton>
            </div>

            {/* Quick Telemetry Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg border-t border-white/10">
              <div>
                <div className="text-xs font-mono text-slate-400">SPECIALIZATION</div>
                <div className="text-sm font-bold text-white mt-0.5">React.js & UI Motion</div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">BASE LOCATION</div>
                <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" /> Jhelum, PK
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">ARCHITECTURE</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Responsive • 60FPS</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Floating HUD Card over the 3D Sculpture */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center pointer-events-auto">
            <Tilt3DCard className="w-full max-w-sm rounded-3xl bg-[#090b14]/65 backdrop-blur-2xl border border-white/15 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.75)]">
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300">
                      INTERACTIVE 3D CORE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    MOVE CURSOR
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">CURRENT FOCUS</div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Crafting high-impact web interfaces where clean React component architecture meets tactile 3D aesthetics.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-[10px] font-mono text-sky-400 uppercase">CORE ENGINE</div>
                    <div className="text-sm font-bold text-white mt-0.5">React.js + ES6+</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="text-[10px] font-mono text-violet-400 uppercase">DESIGN SYSTEM</div>
                    <div className="text-sm font-bold text-white mt-0.5">Tailwind + CSS3</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href="https://github.com/devWaleedX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-sky-400 transition"
                  >
                    <Github className="w-4 h-4" /> github.com/devWaleedX
                  </a>
                  <a
                    href="https://linkedin.com/in/waleedhassan-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-sky-400 hover:underline"
                  >
                    LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* ==========================================
          03. ABOUT ME SECTION (EDITORIAL SPLIT-SCREEN)
      ========================================== */}
      <section id="about" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Oversized Editorial Index & Visual Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest">
              01 // ABOUT ME
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white">
              ARCHITECTING THE MODERN{' '}
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                FRONT-END.
              </span>
            </h2>

            <Tilt3DCard className="rounded-3xl bg-gradient-to-br from-[#0c1020]/90 via-[#090a12]/90 to-[#050509]/90 border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      WH
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Waleed Hassan</h3>
                      <p className="text-xs font-mono text-sky-400">Front-End & React.js Developer</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                    AVAILABLE
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="text-slate-500">// developer_profile.json</div>
                  <div>
                    <span className="text-sky-400">"origin"</span>: <span className="text-emerald-300">"Jhelum, Pakistan"</span>,
                  </div>
                  <div>
                    <span className="text-sky-400">"coreStack"</span>:{' '}
                    <span className="text-amber-300">["HTML5", "CSS3", "JavaScript", "React.js"]</span>,
                  </div>
                  <div>
                    <span className="text-sky-400">"mindset"</span>:{' '}
                    <span className="text-violet-300">"Continuous Growth & Creative Execution"</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <MapPin className="w-4 h-4 text-sky-400 mb-1.5" />
                    <div className="text-xs text-slate-400">Location</div>
                    <div className="text-sm font-bold text-white">Jhelum, Pakistan</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <Code2 className="w-4 h-4 text-violet-400 mb-1.5" />
                    <div className="text-xs text-slate-400">Focus</div>
                    <div className="text-sm font-bold text-white">Interactive Web UI</div>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </div>

          {/* Right Column: Editorial Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-8 lg:pl-8">
            <div className="space-y-6 rounded-3xl bg-white/[0.02] border border-white/10 p-7 sm:p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
                "I'm Waleed Hassan, a passionate Front-End Developer from Jhelum, Pakistan. I specialize in building modern, responsive and interactive web interfaces using HTML, CSS, JavaScript and React.js."
              </p>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                I enjoy transforming creative concepts into functional digital experiences and continuously improving my development skills.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <Layers className="w-5 h-5 text-sky-400 mb-2" />
                  <h4 className="text-sm font-bold text-white">Component Clarity</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Clean, reusable React components structured for maintainability and scale.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <Sparkles className="w-5 h-5 text-violet-400 mb-2" />
                  <h4 className="text-sm font-bold text-white">Interactive Motion</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Tactile micro-interactions, smooth transitions, and responsive layouts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <Zap className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-sm font-bold text-white">Modern Standards</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Semantic HTML5, utility-first Tailwind CSS, and modern ES6+ JavaScript.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          04. INTERACTIVE 3D TECH STACK SECTION
      ========================================== */}
      <section id="tech" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-widest">
              02 // TECH STACK & CAPABILITIES
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white">
              INTERACTIVE{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                ARSENAL.
              </span>
            </h2>
          </div>

          {/* Interactive View Mode Switcher: 3D Cards vs 3D Orbit */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start">
            <button
              onClick={() => {
                setTechViewMode('grid');
                soundFX.playPing(640, 0.05);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                techViewMode === 'grid'
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> 3D Tilt Cards
            </button>
            <button
              onClick={() => {
                setTechViewMode('orbit');
                soundFX.playPing(740, 0.05);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                techViewMode === 'orbit'
                  ? 'bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" /> 3D Orbit System
            </button>
          </div>
        </div>

        {techViewMode === 'grid' ? (
          /* 3D TILT CARDS GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TECH_STACK.map((tech, idx) => (
              <Tilt3DCard
                key={tech.id}
                glowColor={tech.glow}
                intensity={14}
                className="group rounded-3xl bg-[#080a12]/80 border border-white/10 hover:border-white/25 p-6 backdrop-blur-xl transition-colors"
              >
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${tech.glow}, rgba(15,23,42,0.6))`
                      }}
                    >
                      {tech.renderIcon()}
                    </div>
                    <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: tech.color }}>
                      {tech.category}
                    </div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tech.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>{tech.level}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tech.color, boxShadow: `0 0 12px ${tech.color}` }}
                    />
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        ) : (
          /* INTERACTIVE 3D ORBIT SYSTEM VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-[#070911]/85 border border-white/10 p-6 sm:p-10 backdrop-blur-2xl">
            <div className="lg:col-span-7 relative h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden">
              {/* Orbit Rings */}
              <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-sky-400/25 absolute animate-pulse" />
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-violet-400/15 absolute" />

              {/* Center Core */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-600/20 border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(56,189,248,0.3)] z-10">
                <Cpu className="w-7 h-7 text-sky-400 mb-1" />
                <span className="text-[10px] font-mono font-bold text-white tracking-wider">CORE STACK</span>
              </div>

              {/* Orbiting Nodes */}
              {TECH_STACK.map((tech, index) => {
                const angleDeg = orbitAngle + index * (360 / TECH_STACK.length);
                const angleRad = (angleDeg * Math.PI) / 180;
                const radiusX = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 165;
                const radiusY = typeof window !== 'undefined' && window.innerWidth < 640 ? 105 : 135;
                const x = Math.cos(angleRad) * radiusX;
                const y = Math.sin(angleRad) * radiusY;
                const isSelected = activeTech.id === tech.id;

                return (
                  <button
                    key={tech.id}
                    onClick={() => {
                      setActiveTech(tech);
                      soundFX.playPing(720, 0.06);
                    }}
                    style={{
                      transform: `translate3d(${x}px, ${y}px, 0)`
                    }}
                    className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-sky-400 scale-125 z-20 shadow-[0_0_30px_rgba(56,189,248,0.5)]'
                        : 'bg-[#0b0e1a]/90 border-white/15 hover:border-white/40 z-10'
                    }`}
                  >
                    <div className="scale-75">{tech.renderIcon()}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tech Inspector Panel */}
            <div className="lg:col-span-5 space-y-5 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: activeTech.color }}>
                  {activeTech.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 text-[10px] font-mono">
                  CLICK ANY NODE
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {activeTech.renderIcon()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{activeTech.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{activeTech.level}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{activeTech.description}</p>
              <div className="pt-2 flex flex-wrap gap-2">
                {TECH_STACK.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTech(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono border transition ${
                      activeTech.id === t.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==========================================
          05. SELECTED WORK GALLERY SECTION
      ========================================== */}
      <section id="work" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest">
              03 // SELECTED WORK (01 — 04)
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white">
              FEATURED{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                PROJECTS.
              </span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl">
            {['All', 'Web Application', 'Finance Dashboard', 'REST API App', 'FinTech Utility'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setWorkFilter(cat);
                    soundFX.playPing(600, 0.04);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    workFilter === cat
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Tilt3DCard
              key={project.id}
              intensity={8}
              glowColor={`${project.accent}33`}
              className="group rounded-3xl bg-[#080a13]/90 border border-white/10 hover:border-white/25 overflow-hidden flex flex-col justify-between backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Interactive Live Mockup Canvas */}
                <div className="relative h-64 sm:h-72 w-full border-b border-white/10 overflow-hidden">
                  <ProjectVisualMockup project={project} />
                  <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white">
                    {project.number} // INTERACTIVE PREVIEW
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono uppercase tracking-widest font-semibold"
                        style={{ color: project.accent }}
                      >
                        {project.number} — {project.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{project.subtitle}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-sky-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="space-y-5">
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons: Live Preview (Opens Interactive Sandbox Modal) & GitHub */}
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-3">
                      <a
                        onClick={() => {
                          setActiveProjectModal(project);
                          soundFX.playPing(820, 0.07);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                      >
                        <Eye className="w-4 h-4" /> Live Preview
                      </a>
                      

                      <a
                        href= {project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundFX.playPing(680, 0.05)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-xs uppercase tracking-wider transition"
                      >
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE LIVE PREVIEW MODAL DRAWER
      ========================================== */}
      {activeProjectModal && (
        <div
          className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-3xl bg-[#090c17] border border-white/20 shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
                  {activeProjectModal.number}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{activeProjectModal.title}</h3>
                  <p className="text-xs text-slate-400">Interactive Live Sandbox & Architecture Breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/15 shadow-inner">
                <ProjectVisualMockup project={activeProjectModal} isInteractive={true} />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  KEY ENGINEERING HIGHLIGHTS
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{activeProjectModal.description}</p>

                <ul className="space-y-2.5">
                  {activeProjectModal.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 flex flex-wrap gap-2">
                  {activeProjectModal.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <a
                    href= {activeProjectModal.Live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-sky-300 transition"
                  >
                     Go Live
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          06. EXPERIENCE TIMELINE SECTION
      ========================================== */}
      <section id="experience" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-widest">
            04 // PROFESSIONAL EXPERIENCE
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white">
            CAREER{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              TIMELINE.
            </span>
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-10 border-l border-white/15 space-y-12">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Glowing Timeline Node */}
              <div
                className="absolute -left-[33px] sm:-left-[49px] top-2 w-4 h-4 rounded-full border-2 border-white transition-transform duration-300 group-hover:scale-125"
                style={{
                  backgroundColor: exp.accent,
                  boxShadow: `0 0 20px ${exp.accent}`
                }}
              />

              <Tilt3DCard
                intensity={6}
                glowColor={`${exp.accent}26`}
                className="rounded-3xl bg-[#080a14]/85 border border-white/10 hover:border-white/25 p-6 sm:p-9 backdrop-blur-xl"
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: exp.accent }}>
                          0{idx + 1} // {exp.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">{exp.company}</h3>
                      <p className="text-base sm:text-lg font-semibold text-sky-300 mt-0.5">{exp.role}</p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 self-start">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                      <span>Front-End Engineering</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{exp.summary}</p>

                  <div className="space-y-2.5">
                    {exp.responsibilities.map((line) => (
                      <div key={line} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Tilt3DCard>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          07. CONTACT EXPERIENCE SECTION
      ========================================== */}
      <section id="contact" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-[36px] bg-gradient-to-b from-[#0b0e1d]/90 via-[#070811]/95 to-[#040408]/95 border border-white/15 p-6 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.85)] relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-500/15 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-600/15 blur-[130px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cinematic Closing Typography & Direct Links */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest">
                05 // INITIATE COLLABORATION
              </div>

              <h2 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter uppercase leading-[0.92] text-white">
                LET'S CREATE{' '}
                <span className="block bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  SOMETHING
                </span>{' '}
                EXTRAORDINARY.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-md leading-relaxed">
                Have an idea, a project, or an opportunity? Let's turn it into something meaningful.
              </p>

              {/* Copyable Email Placeholder Card */}
              <div className="pt-2 space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">DIRECT ELECTRONIC MAIL</div>
                <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 max-w-md">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-white truncate flex-1">
                    waleedhassan95712@gmail.com
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Links: LinkedIn & GitHub */}
              <div className="pt-4 space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">OFFICIAL PROFILES</div>
                <div className="flex flex-wrap gap-3">
                  <MagneticButton
                    href="https://linkedin.com/in/waleedhassan-dev"
                    target="_blank"
                    className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-sky-500/20 border border-white/15 hover:border-sky-400/50 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 transition"
                  >
                    <Linkedin className="w-4 h-4 text-sky-400" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </MagneticButton>

                  <MagneticButton
                    href="https://github.com/devWaleedX"
                    target="_blank"
                    className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-violet-500/20 border border-white/15 hover:border-violet-400/50 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 transition"
                  >
                    <Github className="w-4 h-4 text-violet-400" />
                    <span>GitHub (@devWaleedX)</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </MagneticButton>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-3xl bg-black/50 border border-white/15 p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                    TRANSMISSION TERMINAL
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">● ENCRYPTED CHANNEL</span>
                </div>

                {formStatus === 'sent' ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Message Dispatched!</h3>
                    <p className="text-sm text-slate-300 max-w-sm mx-auto">
                      Thank you for reaching out to Waleed Hassan. Your message has been logged and I will respond shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus('idle')}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Carter"
                          className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Your Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Subject / Opportunity</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="React.js Project / Front-End Role / Collaboration"
                        className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Project Brief *</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your vision, timeline, or opportunity..."
                        className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 transition resize-none"
                      />
                    </div>

                    {formError && (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-600 text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(56,189,248,0.4)] hover:shadow-[0_0_60px_rgba(56,189,248,0.65)] transition-all flex items-center justify-center gap-2"
                    >
                      {formStatus === 'sending' ? (
                        <span>TRANSMITTING MESSAGE...</span>
                      ) : (
                        <>
                          <span>SEND TRANSMISSION</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PREMIUM FOOTER
      ========================================== */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-violet-600 flex items-center justify-center font-black text-xs text-slate-950">
              WH
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-white font-bold">WALEED HASSAN</span> — Front-End & React.js Developer • Jhelum, Pakistan
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <a
              href="https://linkedin.com/in/waleedhassan-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              LINKEDIN
            </a>
            <a
              href="https://github.com/devWaleedX"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              GITHUB
            </a>
            <button
              onClick={() => scrollToSection('hero')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
            >
              TOP <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}