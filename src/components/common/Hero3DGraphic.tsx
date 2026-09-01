import { useRef, useState, useEffect, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import React from 'react';

// ─── Error Boundary para WebGL ────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean }
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ─── Fallback estático (si WebGL no está disponible) ─────────────────────────
const WebGLFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className="w-32 h-32 rounded-full opacity-30"
      style={{
        background: 'radial-gradient(circle at 40% 40%, #9d4edd, #06b6d4, transparent)',
        filter: 'blur(24px)',
      }}
    />
  </div>
);

// ─── Animated 3D Shape ────────────────────────────────────────────────────────
const AnimatedShape = ({ isDark }: { isDark: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.Material & { distort: number }>(null);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x += state.pointer.y * 0.15;
      meshRef.current.rotation.y += state.pointer.x * 0.15;
    }
    if (materialRef.current) {
      const target = 0.4 + pulse;
      materialRef.current.distort += (target - materialRef.current.distort) * 0.08;
      if (pulse > 0) setPulse((p) => Math.max(0, p - 0.015));
    }
  });

  // En dark mode: wireframe neón purple. En light mode: wireframe slate más sutil.
  const color = isDark ? '#9d4edd' : '#94a3b8';

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        scale={1.5}
        onClick={() => setPulse(0.9)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={color}
          envMapIntensity={1}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={isDark ? 0.8 : 0.3}
          roughness={isDark ? 0.2 : 0.5}
          distort={0.4}
          speed={2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

// ─── Export principal ─────────────────────────────────────────────────────────
export const Hero3DGraphic = () => {
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] opacity-60 md:opacity-100 mix-blend-screen pointer-events-none md:pointer-events-auto">
      <WebGLErrorBoundary fallback={<WebGLFallback />}>
        <React.Suspense fallback={<WebGLFallback />}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00f5d4" />
            <AnimatedShape isDark={isDark} />
          </Canvas>
        </React.Suspense>
      </WebGLErrorBoundary>
    </div>
  );
};
