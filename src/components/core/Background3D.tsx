"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  useAnimations,
  Edges,
  Bounds,
  Center,
  useProgress,
  Preload,
} from "@react-three/drei";

// -------- Tipos --------
type ShapeProps = { color: string };

// -------- Objetos --------
function InteractiveIcosahedron({ color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += d * 0.3;
    meshRef.current.rotation.x += d * 0.1;
  });
  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.5} metalness={0.8} />
      <Edges scale={1.1} color={color} />
    </mesh>
  );
}

function InteractivePrism({ color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(0.15, 0.15, 0.15);
  });
  return (
    <mesh ref={meshRef} scale={0.5} rotation={[0.2, 0, 0]}>
      <cylinderGeometry args={[0, 5, 10, 7]} />
      <meshStandardMaterial color={color} transparent opacity={0.7} roughness={0.5} metalness={1} />
      <Edges scale={1.2} color={color} />
    </mesh>
  );
}

function HologramGlobe({ color }: ShapeProps) {
  const { scene } = useGLTF("/assets/models/earth_globe_hologram.glb");
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, d) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += d * 0.3;
    groupRef.current.scale.set(1, 1, 1);
  });
  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
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
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.transparent = false;
        mat.opacity = 1;
        if (mat.emissive) mat.emissiveIntensity = 0.5;
      }
    });
  }, [scene]);

  useEffect(() => {
    const first = Object.keys(actions)[0];
    if (first) actions[first]?.play();
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} rotation={[0.95, 0, 0]} />
    </group>
  );
}

// -------- Sub-cena (facilita Suspense + key) --------
function Scene({ currentObject }: { currentObject: number }) {
  return currentObject === 3 ? (
    <Bounds fit clip observe margin={0.8}>
      <Center>
        <BlackDragon color="#ff4dff" />
      </Center>
    </Bounds>
  ) : (
    <>
      {currentObject === 0 && <InteractiveIcosahedron color="#00ffff" />}
      {currentObject === 1 && <InteractivePrism color="#00ffff" />}
      {currentObject === 2 && <HologramGlobe color="#4d94ff" />}
    </>
  );
}

// -------- Principal com FADE + BLUR --------
export default function Background3D({ currentObject }: { currentObject: number }) {
  const cameraPosition: [number, number, number] = [0, 0, 5];

  // "active" = true enquanto ainda há assets sendo carregados em qualquer Suspense
  const { active } = useProgress();

  // controle visual do container do Canvas
  const [visible, setVisible] = useState(false);

  // ao trocar de objeto, recomeça o ciclo (fica oculto até carregar)
  useEffect(() => {
    setVisible(false);
  }, [currentObject]);

  // quando terminar de carregar, revela com um pequeno atraso para garantir transição
  useEffect(() => {
    if (!active) {
      const id = setTimeout(() => {
        // garante um frame com opacity 0/blur aplicado
        requestAnimationFrame(() => setVisible(true));
      }, 80); // ajuste fino do "timing" perceptual
      return () => clearTimeout(id);
    } else {
      setVisible(false);
    }
  }, [active]);

  return (
    <div
      className="h-full w-full pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(12px)",
        transition:
          "opacity 900ms cubic-bezier(.22,.61,.36,1), filter 5000ms cubic-bezier(.22,.61,.36,1)",
        willChange: "opacity, filter",
        // previne flash do background da página enquanto carrega:
        background: "transparent",
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />

        <Suspense fallback={null}>
          {/* forçar remontagem ao trocar objeto = reinicia progresso */}
          <Scene key={currentObject} currentObject={currentObject} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
