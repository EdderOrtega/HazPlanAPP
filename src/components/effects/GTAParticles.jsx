import React, { useEffect, useRef } from "react";

const GTAParticles = ({ particleCount = 15 }) => {
  const particlesRef = useRef([]);

  useEffect(() => {
    const particles = particlesRef.current;

    // Crear partículas con posiciones y velocidades aleatorias
    particles.forEach((particle) => {
      if (particle) {
        const delay = Math.random() * 5;
        const duration = 8 + Math.random() * 4;
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 400;

        particle.style.left = `${startX}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.setProperty("--end-x", `${endX}px`);
      }
    });
  }, []);

  return (
    <div className="gta-particles">
      {Array.from({ length: particleCount }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (particlesRef.current[index] = el)}
          className="gta-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
            background: `radial-gradient(circle, 
              rgba(255, 255, 255, ${0.6 + Math.random() * 0.4}) 0%, 
              rgba(${138 + Math.random() * 50}, ${43 + Math.random() * 50}, ${
              226 + Math.random() * 29
            }, 0.3) 70%, 
              transparent 100%
            )`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
};

export default GTAParticles;
