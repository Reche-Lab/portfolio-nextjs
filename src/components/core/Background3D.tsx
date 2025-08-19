"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

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

function HologramGlobe({ color }: ShapeProps) {
  // Carrega o modelo GLB. O Drei cuida do cache e do carregamento.
  const { scene } = useGLTF("/assets/models/earth_globe_hologram.glb");
  
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * (isHovered ? 0.7 : 0.3);

    const targetScale = isClicked ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  // O modelo GLB é renderizado usando o componente <primitive>
  return (
    <group
      ref={groupRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
    >
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

// Componente principal ATUALIZADO para passar as cores
export default function Background3D() {
  const [currentObject, setCurrentObject] = useState(2);

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
        {currentObject === 2 && <HologramGlobe color="#4d94ff" />}
      </Canvas>
    </div>
  );
}
