import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
import EventoCard from "./EventoCard";
import "../styles/dashboardInicio.css";
import "../styles/pageTransitions.css";
import Loader from "./ui/Loader";
import { useStaggerAnimation } from "../hooks/useAnimations";
import heroImg from "../assets/arte.png";
import comunidadImg from "../assets/comunidad.png";
import deportesImg from "../assets/deportes.png";
import fandomsImg from "../assets/fandoms.png";
import saludImg from "../assets/salud.png";
import medioambienteImg from "../assets/medioambiente.png";
import amigos2Img from "../assets/amigos2.jpg";
import amigos3Img from "../assets/amigos3.jpg";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import logoHazPlan from "../assets/iconoHazPlanRedondo.png";
import StatCard from "./StatCard";
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarDay,
} from "react-icons/fa6";
import EventosCarruselRecomendados from "./EventosCarruselRecomendados";

function DashboardInicio({ user }) {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    eventosAsistidos: 0,
    eventosCreados: 0,
    proximosEventos: 0,
  });
  const [gustos, setGustos] = useState([]);

  // Hooks para animaciones
  const statsRef = useStaggerAnimation(150);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Obtener gustos/intereses del usuario
        // Suponiendo que el campo se llama "gustos" y es string separado por comas
        // Puedes ajustar el nombre del campo según tu base
        // Descomenta y ajusta si tienes supabase:
        // const { data: perfil } = await supabase.from("usuariosRegistrados").select("gustos").eq("user_id", user.id).single();
        // if (perfil && perfil.gustos) setGustos(perfil.gustos.split(",").map(g => g.trim()));
        setEstadisticas({
          eventosAsistidos: 0,
          eventosCreados: 0,
          proximosEventos: 0,
        });
        // Aquí podrías dejar la lógica de supabase si quieres estadísticas reales
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-inicio page-transition-container">
      <div className="dashboard-inicio-inner">
        {/* HERO visual con overlay y animación */}
        <div className="dashboard-hero">
          <img src={heroImg} alt="Hero HazPlan" className="hero-bg-img" />
          <div className="hero-overlay" />
          <div className="hero-content animate-fadein">
            <h1>¡Bienvenido a HazPlan!</h1>
            <p>
              Tu espacio para descubrir, conectar y vivir experiencias únicas en
              tu ciudad.
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas con animación */}
        <div
          ref={statsRef}
          className="stats-grid stagger-animation stats-grid-simple"
        >
          <StatCard
            icon={<FaCalendarCheck />}
            number={estadisticas.eventosAsistidos}
            label="Eventos asistidos"
            duration={1200}
            delay={0}
          />
          <StatCard
            icon={<FaCalendarPlus />}
            number={estadisticas.eventosCreados}
            label="Eventos creados"
            duration={1200}
            delay={200}
          />
          <StatCard
            icon={<FaCalendarDay />}
            number={estadisticas.proximosEventos}
            label="Próximos eventos"
            duration={1200}
            delay={400}
          />
        </div>
        {/* Scroll de eventos recomendados por intereses (vertical antiguo) */}
        {/* <EventosScrollRecomendados intereses={gustos} /> */}

        {/* Carrusel horizontal tipo Spotify */}
        <EventosCarruselRecomendados />

        {/* Card informativa para empresas, negocios y ONGs con animación y estilo destacado */}
        <section className="dashboard-info-empresas animate-empresas-card">
          <div className="empresas-bg-glow"></div>
          <h2>¿Tienes un negocio, empresa u organización?</h2>
          <p>
            Únete a HazPlan y crea eventos, talleres, campañas o experiencias
            para miles de usuarios.
            <br />
            <strong>Promociona tu marca</strong>, conecta con tu comunidad y
            accede a herramientas exclusivas para aliados.
          </p>
          <ul className="info-list">
            <li>
              ✔️ Publica eventos ilimitados con planes desde <b>$99 MXN/mes</b>
            </li>
            <li>
              ✔️ Acceso a analíticas, promoción y badge de empresa verificada
            </li>
            <li>✔️ Alianzas gratuitas para ONGs y proyectos ecológicos</li>
            <li>
              ✔️ Suscripciones premium para negocios:{" "}
              <b>más visibilidad y usuarios</b>
            </li>
            <li>✔️ Soporte personalizado y difusión en redes HazPlan</li>
          </ul>
          <button
            className="btn-aliado"
            onClick={() => window.open("mailto:contacto@hazplan.com", "_blank")}
          >
            Quiero ser aliado
          </button>
        </section>

        {/* Animación de parallax y sección de inspiración */}
        <div className="dashboard-inspiration animate-parallax">
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>
            Explora eventos, haz nuevos amigos y vive experiencias inolvidables.
          </p>
        </div>

        {/* Cards modernas con imagen de fondo y animaciones tipo GTA6 + info de empresas */}
        <div className="dashboard-hero-cards">
          <div
            className="modern-highlight-card animate-gta6-img"
            style={{
              backgroundImage: `url(${amigos2Img})`,
              animationDelay: "0.1s",
            }}
          >
            <div className="gta6-img-overlay" />
            <div className="modern-card-content gta6-img-text">
              <h3>Eventos deportivos y más</h3>
              <p>
                Empresas y gimnasios pueden crear torneos, clases y retos.
                ¡Atrae nuevos clientes y fortalece tu marca!
              </p>
              <span className="modern-card-extra">
                Costo para empresas: desde $299 MXN/mes
              </span>
              <span className="modern-card-extra">
                Suscripción premium: incluye promoción y analíticas
              </span>
            </div>
          </div>
          <div
            className="modern-highlight-card animate-gta6-img"
            style={{
              backgroundImage: `url(${amigos3Img})`,
              animationDelay: "0.2s",
            }}
          >
            <div className="gta6-img-overlay" />
            <div className="modern-card-content gta6-img-text">
              <h3>Encuentra tu fandom</h3>
              <p>
                Librerías, tiendas y cafés pueden organizar meetups,
                lanzamientos y clubs. ¡Haz crecer tu comunidad!
              </p>
              <span className="modern-card-extra">
                Negocios aliados: desde $199 MXN/evento
              </span>
              <span className="modern-card-extra">
                Suscripción: eventos ilimitados y visibilidad extra
              </span>
            </div>
          </div>
          <div
            className="modern-highlight-card animate-gta6-img"
            style={{
              backgroundImage: `url(${deportesImg})`,
              animationDelay: "0.3s",
            }}
          >
            <div className="gta6-img-overlay" />
            <div className="modern-card-content gta6-img-text">
              <h3>Bienestar y salud</h3>
              <p>
                Clínicas, spas y nutriólogos pueden ofrecer talleres, consultas
                y experiencias. ¡Promociona tu servicio!
              </p>
              <span className="modern-card-extra">
                Planes desde $249 MXN/mes
              </span>
              <span className="modern-card-extra">
                Incluye: badge de empresa verificada y acceso a usuarios premium
              </span>
            </div>
          </div>
          <div
            className="modern-highlight-card animate-gta6-img"
            style={{
              backgroundImage: `url(${fandomsImg})`,
              animationDelay: "0.4s",
            }}
          >
            <div className="gta6-img-overlay" />
            <div className="modern-card-content gta6-img-text">
              <h3>Cuida el planeta</h3>
              <p>
                Empresas ecológicas y ONGs pueden lanzar campañas, voluntariados
                y retos verdes. ¡Haz la diferencia y gana visibilidad!
              </p>
              <span className="modern-card-extra">
                Alianzas gratuitas y planes pro desde $99 MXN/mes
              </span>
              <span className="modern-card-extra">
                Certificados, premios y difusión especial
              </span>
            </div>
          </div>
        </div>

        {/* Galería de imágenes animada */}
        <div className="dashboard-gallery">
          <img
            src={comunidadImg}
            alt="Comunidad"
            className="gallery-img animate-fadein"
          />
          <img
            src={deportesImg}
            alt="Deportes"
            className="gallery-img animate-fadein"
            style={{ animationDelay: "0.1s" }}
          />
          <img
            src={fandomsImg}
            alt="Fandoms"
            className="gallery-img animate-fadein"
            style={{ animationDelay: "0.2s" }}
          />
          <img
            src={saludImg}
            alt="Salud"
            className="gallery-img animate-fadein"
            style={{ animationDelay: "0.3s" }}
          />
          <img
            src={medioambienteImg}
            alt="Medioambiente"
            className="gallery-img animate-fadein"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Tips y sugerencias visuales */}
        <div className="section tips-section">
          <h2 className="section-title">💡 Tips para ti</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h4>Completa tu perfil</h4>
              <p>Agrega tus intereses para recibir mejores recomendaciones</p>
              <button onClick={() => navigate("/perfil")}>
                Completar perfil
              </button>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4>Invita amigos</h4>
              <p>Comparte HazPlan con tus amigos y creen eventos juntos</p>
              <button onClick={() => {}}>Compartir app</button>
            </div>
          </div>
        </div>

        {/* Animaciones dinámicas tipo GTA6 con imágenes de amigos */}
        <div className="dashboard-gta6-animaciones">
          <div
            className="gta6-img-card animate-gta6-img"
            style={{ animationDelay: "0.1s" }}
          >
            <img src={amigos2Img} alt="Amigos HazPlan 2" className="gta6-img" />
            <div className="gta6-img-overlay" />
            <div className="gta6-img-text">
              <h3>¡Crea recuerdos con tus amigos!</h3>
              <p>
                Organiza eventos, comparte experiencias y haz nuevos lazos en tu
                ciudad.
              </p>
            </div>
          </div>
          <div
            className="gta6-img-card animate-gta6-img"
            style={{ animationDelay: "0.3s" }}
          >
            <img src={amigos3Img} alt="Amigos HazPlan 3" className="gta6-img" />
            <div className="gta6-img-overlay" />
            <div className="gta6-img-text">
              <h3>¡Explora, juega y vive HazPlan!</h3>
              <p>
                Descubre actividades, deportes y eventos únicos con la mejor
                comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logoHazPlan} alt="HazPlan" />
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
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
            <a
              href="https://youtube.com/@hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
            <a
              href="https://x.com/hazplan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="X"
            >
              <FaXTwitter />
            </a>
            <a
              href="mailto:contacto@hazplan.com"
              className="footer-social-icon"
              aria-label="Email"
            >
              <FaEnvelope />
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

export default DashboardInicio;
