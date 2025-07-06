import { useEffect, useRef, useState } from "react";

// Hook para animaciones on scroll
export const useScrollAnimation = (threshold = 0.1) => {
  const elementRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez visible, no lo ocultar de nuevo
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, isVisible];
};

// Hook para efectos parallax
export const useParallax = (speed = 0.5) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;

      // Solo aplicar parallax si el elemento está en viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = -(scrolled - elementTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [speed]);

  return elementRef;
};

// Hook para efectos de mouse parallax
export const useMouseParallax = (strength = 0.1) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0, 0)";
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
};

// Hook para efectos de stagger animation
export const useStaggerAnimation = (delay = 100) => {
  const containerRef = useRef();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * delay}ms`;
      child.classList.add("stagger-item-animate");
    });
  }, [shouldAnimate, delay]);

  return containerRef;
};
