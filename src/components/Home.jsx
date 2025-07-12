import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import InfoSection from "./home/InfoSection";
import DashboardInicio from "./DashboardInicio";
import BusinessPromoSection from "./BusinessPromoSection";
import useGTAScrollAnimations from "../hooks/useGTAScrollAnimations";
import arteImg from "../assets/arte.png";
import { useEffect, useRef } from "react";
import gsap from "gsap";

function Home({ user, onShowComingSoon }) {
  useGTAScrollAnimations();

  // Refs para animaciones GSAP
  const heroRef = useRef();
  const featuresRef = useRef();
  const info1Ref = useRef();
  const businessRef = useRef();
  const info2Ref = useRef();
  const info3Ref = useRef();
  const ctaRef = useRef();
  const footerRef = useRef();
  const logoRef = useRef();
  const footerLinksRef = useRef();
  const footerSocialRef = useRef();

  useEffect(() => {
    // Hero animación fade in y slide up
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }
    );
    // Features cards animación stagger
    gsap.fromTo(
      featuresRef.current?.querySelectorAll(".feature-card"),
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
      }
    );
    // InfoSection 1
    gsap.fromTo(
      info1Ref.current,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );
    // BusinessPromoSection
    gsap.fromTo(
      businessRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, delay: 0.7, ease: "power2.out" }
    );
    // InfoSection 2 y 3
    gsap.fromTo(
      info2Ref.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: "power2.out" }
    );
    gsap.fromTo(
      info3Ref.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1, delay: 1, ease: "power2.out" }
    );
    // CTA
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: "power2.out" }
    );
    // Footer
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.5, ease: "power2.out" }
    );
    // Logo
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 1.7, ease: "back.out(1.7)" }
    );
    // Footer links
    gsap.fromTo(
      footerLinksRef.current?.querySelectorAll(".footer-link"),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 1.8,
        ease: "power2.out",
      }
    );
    // Footer social
    gsap.fromTo(
      footerSocialRef.current?.querySelectorAll(".footer-social-icon"),
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        delay: 2,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  if (user) {
    return <DashboardInicio user={user} onShowComingSoon={onShowComingSoon} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        overflow: "hidden",
        position: "relative",
        perspective: "1000px",
      }}
    >
      {/* HeroSection animada */}
      <div ref={heroRef}>
        <HeroSection />
      </div>

      {/* FeaturesSection animada */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* InfoSections animadas */}
      <div ref={info1Ref}>
        <InfoSection sectionKey="section1" />
      </div>

      {/* BusinessPromoSection animada */}
      <div
        ref={businessRef}
        style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <BusinessPromoSection />
      </div>

      <div ref={info2Ref}>
        <InfoSection sectionKey="section2" />
      </div>
      <div ref={info3Ref}>
        <InfoSection sectionKey="section3" />
      </div>

      {/* CTASection animada */}
      <div
        ref={ctaRef}
        style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <CTASection />
      </div>

      {/* Footer animado */}
      <footer className="dashboard-footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-logo" ref={logoRef}>
            <img src={arteImg} alt="HazPlan" />
            <span>HazPlan</span>
          </div>
          <div className="footer-links" ref={footerLinksRef}>
            <a href="/acerca" className="footer-link">
              Acerca
            </a>
            <a href="/faq" className="footer-link">
              FAQ
            </a>
            <a href="/contacto" className="footer-link">
              Contacto
            </a>
            <a href="/terminos" className="footer-link">
              Términos
            </a>
          </div>
          <div className="footer-social" ref={footerSocialRef}>
            <a
              href="https://instagram.com/hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
            >
              📸
            </a>
            <a
              href="https://facebook.com/hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
            >
              👍
            </a>
            <a
              href="mailto:contacto@hazplan.com"
              className="footer-social-icon"
            >
              ✉️
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HazPlan. Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
