import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import InfoSection from "./home/InfoSection";
import CTASection from "./home/CTASection";
import DashboardInicio from "./DashboardInicio";
import BusinessPromoSection from "./BusinessPromoSection"; // Nueva sección para empresas
import useGTAScrollAnimations from "../hooks/useGTAScrollAnimations";

function Home({ user, onShowComingSoon }) {
  // Hook para animaciones de scroll estilo GTA 6
  useGTAScrollAnimations();

  // Si el usuario está logueado, mostrar dashboard personalizado
  if (user) {
    return <DashboardInicio user={user} onShowComingSoon={onShowComingSoon} />;
  }

  // Si no está logueado, mostrar landing page con la nueva sección de empresas
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent", // Eliminar fondo para que el video del hero se vea
        overflow: "hidden",
        position: "relative",
        perspective: "1000px",
      }}
    >
      {/* HeroSection sin contenedor para pantalla completa */}
      <HeroSection />

      {/* FeaturesSection fuera del contenedor para fondo completo */}
      <FeaturesSection />

      {/* InfoSections fuera del contenedor para fondos completos */}
      <InfoSection sectionKey="section1" />

      {/* BusinessPromoSection en contenedor */}
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <BusinessPromoSection />
      </div>

      {/* Más InfoSections fuera del contenedor */}
      <InfoSection sectionKey="section2" />
      <InfoSection sectionKey="section3" />

      {/* CTASection en contenedor */}
      <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <CTASection />
      </div>

      {/* Footer moderno HazPlan */}

      <span>
        © {new Date().getFullYear()} HazPlan. Todos los derechos reservados.
      </span>
    </div>
  );
}

export default Home;
