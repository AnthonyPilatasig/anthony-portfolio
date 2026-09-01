import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.Material & { distort: number }>(null);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

      // Gentle parallax tilt toward the pointer, on top of the base rotation.
      meshRef.current.rotation.x += state.pointer.y * 0.15;
      meshRef.current.rotation.y += state.pointer.x * 0.15;
    }

    if (materialRef.current) {
      // Click sends a short distort "pulse" that decays back to baseline.
      const target = 0.4 + pulse;
      materialRef.current.distort += (target - materialRef.current.distort) * 0.08;
      if (pulse > 0) setPulse((p) => Math.max(0, p - 0.015));
    }
  });

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
          color="#9d4edd"
          envMapIntensity={1}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

export const Hero3DGraphic = () => {
  return (
    <div className="absolute inset-0 z-[-1] opacity-60 md:opacity-100 mix-blend-screen pointer-events-none md:pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00f5d4" />
        <AnimatedShape />
      </Canvas>
    </div>
  );
};
