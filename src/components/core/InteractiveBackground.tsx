// src/components/core/InteractiveBackground.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
// ✅ Importe o 'loadSlim' do novo pacote
import { loadSlim } from "@tsparticles/slim"; 

const InteractiveBackground = () => {
  const [init, setInit] = useState(false);

  // Inicializa o motor de partículas uma única vez
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Carrega o pacote 'slim' que é mais leve e contém o que precisamos
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Partículas carregadas!", container);
  };

  // A configuração de 'options' permanece exatamente a mesma
  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#1a1a1a",
        },
      },
      fpsLimit: 220,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute inset-0 -z-20"
      />
    );
  }

  return null;
};

export default InteractiveBackground;
