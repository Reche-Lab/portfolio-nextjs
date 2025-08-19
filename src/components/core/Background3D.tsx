"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations, Edges, Bounds, Center } from "@react-three/drei";

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
    meshRef.current.rotation.y += delta * (isHovered ? 1 : 0.3);
    meshRef.current.rotation.x += delta * 0.1;
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
        opacity={0.5} 
        roughness={0.5} 
        metalness={2} 
      />
      <Edges scale={1.1} color={color}>
        {/* ✅ Usa a cor da prop aqui também */}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Edges>
    </mesh>
  );
}

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
      <primitive object={scene} scale={1.5} color={color} />
    </group>
  );
}

function InteractiveHologram({ }: ShapeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/assets/models/hologram.glb");
  const { actions } = useAnimations(animations, groupRef);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        
        
        material.transparent = true;
        material.opacity = 0.3;

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
    groupRef.current.rotation.y += delta * (isHovered ? 0.5 : 0.1);
    const targetScale = isClicked ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={1.5} // Pode manter a escala que você gostou
        rotation={[Math.PI / 6, 0, 0]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onPointerDown={() => setIsClicked(true)}
        onPointerUp={() => setIsClicked(false)}
      />
    </group>
  );
}

function BlackDragon({ }: ShapeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/assets/models/black_dragon.glb");
  const { actions } = useAnimations(animations, groupRef);
  const [isHovered, setIsHovered] = useState(false);
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
    // groupRef.current.rotation.y += delta * (isHovered ? 0.2 : 0);
    const targetScale = isClicked ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={1.5} // Pode manter a escala que você gostou
        rotation={[0.95, 0, 0]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onPointerDown={() => setIsClicked(true)}
        onPointerUp={() => setIsClicked(false)}
      />
    </group>
  );
}

// Componente principal ATUALIZADO para passar as cores
export default function Background3D({ currentObject }: { currentObject: number }) {
    
    const cameraPosition: [number, number, number] = [0, 0, 5];

    return (
        <div className="h-full w-full">
            <Canvas camera={{ position: cameraPosition, fov: 50 }}>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={150} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />
                
                {/* ✅ Passando as cores como props */}
                {currentObject === 3 ? (
                    <Bounds fit clip observe margin={0.8}>
                        <Center>
                            <BlackDragon color="#ff4dff" />
                        </Center>
                    </Bounds>
                    ) : (
                    <>
                        {currentObject === 0 && <InteractiveIcosahedron color="#00ffff" />}
                        {currentObject === 1 && <InteractivePrism color="#00ff99" />}
                        {currentObject === 2 && <HologramGlobe color="#4d94ff" />}
                        {/* {currentObject === 4 && <BlackDragon color="#4d94ff" />} */}
                    </>
                )}
            </Canvas>
        </div>
    );
}
