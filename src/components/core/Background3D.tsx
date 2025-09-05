"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations, Edges, Bounds, Center } from "@react-three/drei";

// ============================================================================
// TIPOS E PROPS (Simplificados)
// ============================================================================

// A prop 'onHoverChange' não é mais necessária, então podemos removê-la.
type ShapeProps = { 
  color: string;
};

// ============================================================================
// COMPONENTES DE OBJETO 3D (Sem Interação)
// ============================================================================

function InteractiveIcosahedron({ color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    // ✅ Eventos de ponteiro removidos daqui
    <mesh ref={meshRef} scale={1.5}>
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

function InteractivePrism({ color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.2;
    // A escala agora é fixa, pois não há mais clique
    meshRef.current.scale.set(0.15, 0.15, 0.15);
  });

  return (
    // ✅ Eventos de ponteiro removidos daqui
    <mesh ref={meshRef} scale={0.5} rotation={[0.2, 0, 0]}>
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

function HologramGlobe({ color }: ShapeProps) {
  const { scene } = useGLTF("/assets/models/earth_globe_hologram.glb");
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    // A escala agora é fixa
    groupRef.current.scale.set(1, 1, 1);
  });

  return (
    // ✅ Eventos de ponteiro removidos daqui
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} color={color} />
    </group>
  );
}

function BlackDragon({ color }: ShapeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/assets/models/black_dragon.glb");
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.transparent = false;
        material.opacity = 10;
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

  // A animação de escala no clique foi removida
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // A escala agora é fixa
    groupRef.current.scale.set(1, 1, 1);
  });

  return (
    <group ref={groupRef}>
      {/* ✅ Eventos de ponteiro removidos daqui */}
      <primitive
        object={scene}
        scale={1.5}
        rotation={[0.95, 0, 0]}
      />
    </group>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL (Simplificado)
// ============================================================================

export default function Background3D({
  currentObject,
}: {
  currentObject: number;
  // ✅ A prop 'onObjectHover' não é mais necessária
}) {
  const cameraPosition: [number, number, number] = [0, 0, 5];

  return (
    // ✅ Adicionamos 'pointer-events-none' ao container do Canvas como uma garantia extra.
    // Isso assegura que todo o canvas 3D seja transparente para eventos do mouse.
    <div className="h-full w-full pointer-events-none">
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />

        {currentObject === 3 ? (
          <Bounds fit clip observe margin={0.8}>
            <Center>
              {/* ✅ A prop 'onHoverChange' foi removida */}
              <BlackDragon color="#ff4dff" />
            </Center>
          </Bounds>
        ) : (
          <>
            {currentObject === 0 && <InteractiveIcosahedron color="#00ffff" />}
            {currentObject === 1 && <InteractivePrism color="#00ffff" />}
            {currentObject === 2 && <HologramGlobe color="#4d94ff" />}
          </>
        )}
      </Canvas>
    </div>
  );
}
