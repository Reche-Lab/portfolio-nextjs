"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations, Edges, Bounds, Center } from "@react-three/drei";

// ============================================================================
// TIPOS E PROPS
// ============================================================================

// Prop `onHoverChange` adicionada para comunicar o estado de hover para o pai.
type ShapeProps = {
  color: string;
  onHoverChange: (isHovered: boolean) => void;
};

// ============================================================================
// COMPONENTES DE OBJETO 3D (Refatorados)
// ============================================================================

function InteractiveIcosahedron({ color, onHoverChange }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isClicked, setIsClicked] = useState(false);
  // O estado `isHovered` foi removido.

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // A lógica de aceleração no hover foi removida para simplificar,
    // pois o estado de hover agora é gerenciado pelo componente pai.
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
    const targetScale = isClicked ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => onHoverChange(true)}
      onPointerOut={() => onHoverChange(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      scale={1.5}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color}
        transparent 
        opacity={0.5} 
        roughness={0.5} 
        metalness={0.8} 
      />
      <Edges scale={1.1} color={color} />
    </mesh>
  );
}

function InteractivePrism({ color, onHoverChange }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.2;
    // meshRef.current.rotation.x -= delta * 0.05;
    const targetScale = isClicked ? 0.20 : 0.15;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => onHoverChange(true)}
      onPointerOut={() => onHoverChange(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      scale={0.5}
      rotation={[0.2, 0, 0]}
    >
      <cylinderGeometry args={[0, 5, 10, 7]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        roughness={0.5}
        metalness={1}
      />
      <Edges scale={1.2} color={color} />
    </mesh>
  );
}

function HologramGlobe({ color, onHoverChange }: ShapeProps) {
  const { scene } = useGLTF("/assets/models/earth_globe_hologram.glb");
  const groupRef = useRef<THREE.Group>(null!);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    const targetScale = isClicked ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => onHoverChange(true)}
      onPointerOut={() => onHoverChange(false)}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
    >
      <primitive object={scene} scale={1.5} color={color} />
    </group>
  );
}

function BlackDragon({ color, onHoverChange }: ShapeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/assets/models/black_dragon.glb");
  const { actions } = useAnimations(animations, groupRef);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.transparent = false;
        material.opacity = 1;
        if (material.emissive) {
          material.emissiveIntensity = 0.5;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const firstAnimation = Object.keys(actions)[0];
    if (firstAnimation) {
      actions[firstAnimation]?.play();
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetScale = isClicked ? 1.5 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={1.5}
        rotation={[0.95, 0, 0]}
        onPointerOver={() => onHoverChange(true)}
        onPointerOut={() => onHoverChange(false)}
        onPointerDown={() => setIsClicked(true)}
        onPointerUp={() => setIsClicked(false)}
      />
    </group>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL (Refatorado)
// ============================================================================

export default function Background3D({
  currentObject,
  onObjectHover,
}: {
  currentObject: number;
  onObjectHover: (isHovered: boolean) => void;
}) {
  const cameraPosition: [number, number, number] = [0, 0, 5];

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />

        {currentObject === 3 ? (
          <Bounds fit clip observe margin={0.8}>
            <Center>
              <BlackDragon color="#ff4dff" onHoverChange={onObjectHover} />
            </Center>
          </Bounds>
        ) : (
          <>
            {currentObject === 0 && <InteractiveIcosahedron color="#00ffff" onHoverChange={onObjectHover} />}
            {currentObject === 1 && <InteractivePrism color="#00ffff" onHoverChange={onObjectHover} />}
            {currentObject === 2 && <HologramGlobe color="#4d94ff" onHoverChange={onObjectHover} />}
          </>
        )}
      </Canvas>
    </div>
  );
}
