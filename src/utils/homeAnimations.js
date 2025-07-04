import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initializeHomeAnimations = (refs) => {
  const {
    containerRef,
    featuresRef,
    section1Ref,
    section2Ref,
    section3Ref,
    ctaRef,
  } = refs;

  // Configuración inicial
  gsap.set(
    [
      featuresRef.current.querySelectorAll(".feature-card"),
      section1Ref.current.querySelectorAll("h2, p, ul, .section-image"),
      section2Ref.current.querySelectorAll("h2, p, ul, .section-image"),
      section3Ref.current.querySelectorAll("h2, p, ul, .section-image"),
      ctaRef.current.querySelectorAll("h2, p, button"),
    ],
    {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotationX: 45,
      z: -200,
    }
  );

  // Features
  ScrollTrigger.create({
    trigger: featuresRef.current,
    start: "top 85%",
    onEnter: () => {
      gsap
        .timeline()
        .to(featuresRef.current.querySelector("h2"), {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          z: 0,
          duration: 1.2,
          ease: "back.out(2)",
        })
        .to(
          featuresRef.current.querySelectorAll(".feature-card"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            z: 0,
            duration: 1,
            stagger: { amount: 0.8, from: "random" },
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.8"
        );
    },
  });

  // Section 1
  ScrollTrigger.create({
    trigger: section1Ref.current,
    start: "top 85%",
    onEnter: () => {
      const tl = gsap.timeline();
      tl.fromTo(
        section1Ref.current.querySelector("h2"),
        { opacity: 0, scale: 0.3, rotationY: 180, z: -500 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 1.5,
          ease: "power4.out",
        }
      )
        .fromTo(
          section1Ref.current.querySelector("p"),
          { opacity: 0, x: -200, rotationZ: -15 },
          { opacity: 1, x: 0, rotationZ: 0, duration: 1, ease: "power3.out" },
          "-=1"
        )
        .fromTo(
          section1Ref.current.querySelectorAll("li"),
          { opacity: 0, x: -100, y: 50, scale: 0.5 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .fromTo(
          section1Ref.current.querySelector(".section-image"),
          { opacity: 0, scale: 0.2, rotationY: 90, rotationX: 45, z: -300 },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            duration: 1.8,
            ease: "power2.out",
          },
          "-=1.2"
        );
    },
  });

  // Section 2
  ScrollTrigger.create({
    trigger: section2Ref.current,
    start: "top 85%",
    onEnter: () => {
      const tl = gsap.timeline();
      tl.fromTo(
        section2Ref.current.querySelector(".section-image"),
        {
          opacity: 0,
          scale: 0,
          rotation: 180,
          transformOrigin: "center center",
        },
        {
          opacity: 1,
          scale: 1.1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.8)",
        }
      )
        .fromTo(
          section2Ref.current.querySelector("h2"),
          { opacity: 0, y: 100, skewX: 20 },
          { opacity: 1, y: 0, skewX: 0, duration: 1, ease: "power4.out" },
          "-=1"
        )
        .fromTo(
          [
            section2Ref.current.querySelector("p"),
            section2Ref.current.querySelector("ul"),
          ],
          { opacity: 0, y: 80, rotationX: 30 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.out",
          },
          "-=0.8"
        );
    },
  });

  // Section 3
  ScrollTrigger.create({
    trigger: section3Ref.current,
    start: "top 85%",
    onEnter: () => {
      const tl = gsap.timeline();
      tl.fromTo(
        section3Ref.current.querySelector("h2"),
        { opacity: 0, scale: 2, y: -200, filter: "blur(20px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "power4.out",
        }
      )
        .fromTo(
          [
            section3Ref.current.querySelector("p"),
            ...section3Ref.current.querySelectorAll("li"),
          ],
          {
            opacity: 0,
            rotation: 360,
            scale: 0.3,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 1,
            stagger: { amount: 1, from: "center" },
            ease: "back.out(1.7)",
          },
          "-=1.2"
        )
        .fromTo(
          section3Ref.current.querySelector(".section-image"),
          {
            opacity: 0,
            scale: 0.1,
            rotationZ: -180,
            x: 300,
            filter: "brightness(3)",
          },
          {
            opacity: 1,
            scale: 1,
            rotationZ: 0,
            x: 0,
            filter: "brightness(1)",
            duration: 2,
            ease: "expo.out",
          },
          "-=1.5"
        );
    },
  });

  // CTA
  ScrollTrigger.create({
    trigger: ctaRef.current,
    start: "top 90%",
    onEnter: () => {
      const tl = gsap.timeline();
      tl.fromTo(
        ctaRef.current.querySelector("h2"),
        { opacity: 0, y: -100, scale: 0.5, filter: "brightness(5) blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "brightness(1) blur(0px)",
          duration: 2,
          ease: "power4.out",
        }
      )
        .fromTo(
          ctaRef.current.querySelector("p"),
          { opacity: 0, scale: 0.8, y: 50, rotationX: 45 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.6)",
          },
          "-=1.5"
        )
        .fromTo(
          ctaRef.current.querySelector("button"),
          {
            opacity: 0,
            scale: 0,
            rotation: 720,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 2,
            ease: "back.out(2)",
          },
          "-=1"
        )
        .to(ctaRef.current.querySelector("button"), {
          scale: 1.05,
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
    },
  });

  // Parallax con cambio de color
  ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const r = Math.round(89 + (185 - 89) * progress); // #593c8f -> #b85bcc
      const g = Math.round(60 + (91 - 60) * progress);
      const b = Math.round(143 + (204 - 143) * progress);

      gsap.to(containerRef.current, {
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        backgroundPositionY: `${progress * 300}px`,
        duration: 0.3,
        ease: "none",
      });
    },
  });

  // Cleanup function
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
};
