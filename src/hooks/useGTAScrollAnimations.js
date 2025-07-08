import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useGTAScrollAnimations = () => {
  const animationsRef = useRef([]);

  useEffect(() => {
    // Limpiar animaciones anteriores
    animationsRef.current.forEach((animation) => {
      animation.kill();
    });
    animationsRef.current = [];

    return () => {
      animationsRef.current.forEach((animation) => {
        animation.kill();
      });
    };
  }, []);

  const addAnimation = (element, animationType = "fadeInUp", options = {}) => {
    if (!element) return;

    const {
      delay = 0,
      duration = 1,
      triggerStart = "top 130%",
      ...otherOptions
    } = options;

    // Definir diferentes tipos de animaciones estilo GTA 6
    const animations = {
      fadeInUp: {
        from: {
          opacity: 0,
          y: 100,
          rotationX: 45,
          scale: 0.8,
          filter: "blur(20px)",
        },
        to: {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power4.out",
        },
      },
      slideInLeft: {
        from: {
          opacity: 0,
          x: -100,
          rotationY: 25,
          scale: 0.9,
          filter: "blur(10px)",
        },
        to: {
          opacity: 1,
          x: 0,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
        },
      },
      slideInRight: {
        from: {
          opacity: 0,
          x: 100,
          rotationY: -25,
          scale: 0.9,
          filter: "blur(10px)",
        },
        to: {
          opacity: 1,
          x: 0,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
        },
      },
      zoomIn: {
        from: {
          opacity: 0,
          scale: 0.6,
          rotationX: 60,
          rotationY: 15,
          z: -200,
          filter: "blur(15px) brightness(0.5)",
        },
        to: {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          filter: "blur(0px) brightness(1)",
          ease: "power4.out",
        },
      },
      flipIn: {
        from: {
          opacity: 0,
          rotationY: 90,
          scale: 0.8,
          filter: "blur(10px)",
        },
        to: {
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "back.out(1.7)",
        },
      },
      glitch: {
        from: {
          opacity: 0,
          x: 20,
          skewX: 10,
          filter: "blur(5px) hue-rotate(90deg)",
        },
        to: {
          opacity: 1,
          x: 0,
          skewX: 0,
          filter: "blur(0px) hue-rotate(0deg)",
          ease: "power2.out",
        },
      },
      morphIn: {
        from: {
          opacity: 0,
          scale: 0.5,
          rotation: 180,
          borderRadius: "50%",
          filter: "blur(20px) saturate(2)",
        },
        to: {
          opacity: 1,
          scale: 1,
          rotation: 0,
          borderRadius: "0%",
          filter: "blur(0px) saturate(1)",
          ease: "elastic.out(1, 0.3)",
        },
      },
    };

    const animation = animations[animationType];
    if (!animation) return;

    // Aplicar animación con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          // Efecto de partículas al entrar
          gsap.to(element, {
            boxShadow:
              "0 0 30px rgba(103, 58, 183, 0.6), 0 0 60px rgba(184, 91, 204, 0.3)",
            duration: 0.5,
            yoyo: true,
            repeat: 1,
          });
        },
      },
    });

    tl.fromTo(element, animation.from, {
      ...animation.to,
      duration,
      delay,
      ...otherOptions,
    });

    animationsRef.current.push(tl);
    return tl;
  };

  return { addAnimation };
};

export default useGTAScrollAnimations;
