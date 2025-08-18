"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

function InteractiveIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += delta * (isHovered ? 0.8 : 0.1);
    meshRef.current.rotation.x += delta * 0.05;

    const targetScale = isClicked ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      scale={1.5}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#00ffff" 
        transparent 
        opacity={0.15} 
        roughness={0.2} 
        metalness={0.8} 
      />
      <Edges scale={1.001}>
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </Edges>
    </mesh>
  );
}

function InteractivePrism() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotação diferente para variar
    meshRef.current.rotation.y += delta * (isHovered ? 0.9 : 0.2);
    meshRef.current.rotation.x -= delta * 0.08;

    const targetScale = isClicked ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      scale={1.5}
      rotation={[0.2, 0.2, 0.2]} // Uma leve rotação inicial para melhor visualização
    >
      {/* Um cilindro com 3 segmentos radiais forma um prisma triangular */}
      <cylinderGeometry args={[2, 1, 1, 3]} />
      <meshStandardMaterial
        color="#00ff99" // Uma cor diferente (verde neon)
        transparent
        opacity={0.15}
        roughness={0.2}
        metalness={0.8}
      />
      <Edges scale={1.001}>
        <meshBasicMaterial color="#00ff99" toneMapped={false} />
      </Edges>
    </mesh>
  );
}

export default function Background3D() {
  // Estado para controlar o objeto atual. 0 para Icosaedro, 1 para Prisma.
  const [currentObject, setCurrentObject] = useState(1);

  // Simples lógica para alternar a cada 5 segundos, apenas para demonstração.
  // Mais tarde, isso pode ser um clique do usuário.
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentObject((prev) => (prev + 1) % 2);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />
        
        {/* Renderização condicional baseada no estado */}
        {currentObject === 0 && <InteractiveIcosahedron />}
        {currentObject === 1 && <InteractivePrism />}
      </Canvas>
    </div>
  );
}
