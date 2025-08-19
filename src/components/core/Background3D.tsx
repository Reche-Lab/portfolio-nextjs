"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { MeshBasicMaterial } from "three";

// Tipo para as props dos nossos objetos
type ShapeProps = {
  color: string;
};

// Icosaedro ATUALIZADO para aceitar a prop de cor
function InteractiveIcosahedron({ color }: ShapeProps) {
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

  const edgesMaterial = new MeshBasicMaterial({ color: color, toneMapped: false });

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
        color={color} // ✅ Usa a cor da prop
        transparent 
        opacity={0.15} 
        roughness={0.2} 
        metalness={0.8} 
      />
      <Edges scale={1.001} color={color}>
        {/* ✅ Usa a cor da prop aqui também */}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Edges>
    </mesh>
  );
}

// Prisma ATUALIZADO para aceitar a prop de cor
function InteractivePrism({ color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
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
      rotation={[0.2, 0, 0]}
    >
      <cylinderGeometry args={[1, 1, 1.5, 3]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        roughness={0.2}
        metalness={0.8}
      />
      {/* ✅ PASSO 2: Passe a cor diretamente para a prop `color` */}
      <Edges scale={1.001} color={color} />
    </mesh>
  );
}

// Componente principal ATUALIZADO para passar as cores
export default function Background3D() {
  const [currentObject, setCurrentObject] = useState(1);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentObject((prev) => (prev + 1) % 2);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />
        
        {/* ✅ Passando as cores como props */}
        {currentObject === 0 && <InteractiveIcosahedron color="#00ffff" />}
        {currentObject === 1 && <InteractivePrism color="#00ff99" />}
      </Canvas>
    </div>
  );
}
