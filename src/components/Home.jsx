import { useEffect, useRef } from "react";
import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import InfoSection from "./home/InfoSection";
import CTASection from "./home/CTASection";
import DashboardInicio from "./DashboardInicio";
import { initializeHomeAnimations } from "../utils/homeAnimations";
import "../styles/homeAnimations.css";

function Home({ user, onShowComingSoon }) {
  const containerRef = useRef();
  const heroRef = useRef();
  const featuresRef = useRef();
  const section1Ref = useRef();
  const section2Ref = useRef();
  const section3Ref = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    // Solo inicializar animaciones si no hay usuario logueado
    if (!user) {
      const cleanup = initializeHomeAnimations({
        containerRef,
        featuresRef,
        section1Ref,
        section2Ref,
        section3Ref,
        ctaRef,
      });
      return cleanup;
    }
  }, [user]);

  // Si el usuario está logueado, mostrar dashboard personalizado
  if (user) {
    return <DashboardInicio user={user} onShowComingSoon={onShowComingSoon} />;
  }

  // Si no está logueado, mostrar landing page tradicional
  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, #593c8f 0%, blueviolet 100%),
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.5" fill="%23ffffff" opacity="0.02"/><circle cx="80" cy="80" r="0.5" fill="%23ffffff" opacity="0.02"/><circle cx="40" cy="60" r="0.5" fill="%23ffffff" opacity="0.02"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>')
        `,
        backgroundSize: "cover, 150px 150px",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        position: "relative",
        perspective: "1000px",
      }}
    >
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <HeroSection ref={heroRef} />
        <FeaturesSection ref={featuresRef} />
        <InfoSection ref={section1Ref} sectionKey="section1" />
        <InfoSection ref={section2Ref} sectionKey="section2" />
        <InfoSection ref={section3Ref} sectionKey="section3" />
        <CTASection ref={ctaRef} />
      </div>
    </div>
  );
}

export default Home;
