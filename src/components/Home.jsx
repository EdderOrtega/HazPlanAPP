import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import InfoSection from "./home/InfoSection";
import CTASection from "./home/CTASection";
import DashboardInicio from "./DashboardInicio";
import BusinessPromoSection from "./BusinessPromoSection"; // Nueva sección para empresas
import useGTAScrollAnimations from "../hooks/useGTAScrollAnimations";
import arteImg from "../assets/arte.png";

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
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={arteImg} alt="HazPlan" />
            <span>HazPlan</span>
          </div>
          <div className="footer-links">
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
          <div className="footer-social">
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
