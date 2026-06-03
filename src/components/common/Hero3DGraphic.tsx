import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial 
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
