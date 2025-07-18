import ONGsPromoSection from "./ONGsPromoSection";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
import EventoCard from "./EventoCard";
import "../styles/dashboardInicio.css";
import "../styles/pageTransitions.css";
import Loader from "./ui/Loader";
import heroImg from "/public/images/heroFondoCamion.png";
import amigos2Img from "/public/images/amigos2.jpg";
import amigos3Img from "/public/images/amigos3.jpg";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import logoHazPlan from "/public/images/iconoHazPlanRedondo.png";
import StatCard from "./StatCard";
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarDay,
} from "react-icons/fa6";
import EventosCarruselRecomendados from "./EventosCarruselRecomendados";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function DashboardInicio({ user }) {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    eventosAsistidos: 0,
    eventosCreados: 0,
    proximosEventos: 0,
  });
  const [loading, setLoading] = useState(true);

  // Refs para animaciones GSAP
  const heroRef = useRef();
  const statsRef = useRef();
  const carruselRef = useRef();
  const empresasRef = useRef();
  const inspiracionRef = useRef();
  const heroCardsRef = useRef();
  const galleryRef = useRef();
  const tipsRef = useRef();
  const gta6Ref = useRef();
  const footerRef = useRef();

  useEffect(() => {
    if (loading) return;
    // Limpiar triggers previos para evitar duplicados y bugs
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Hero animación de entrada
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out" }
      );
      const heroContent = heroRef.current.querySelector(".hero-content");
      if (heroContent) {
        gsap.fromTo(
          heroContent,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "expo.out" }
        );
      }
    }
    // Stats: stagger animado (trigger en el contenedor padre)
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll(".stat-simple");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }
    // Carrusel recomendado
    if (carruselRef.current) {
      gsap.fromTo(
        carruselRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: carruselRef.current, start: "top 90%" },
        }
      );
    }
    // Empresas card
    if (empresasRef.current) {
      gsap.fromTo(
        empresasRef.current,
        { opacity: 0, scale: 0.93 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: empresasRef.current, start: "top 90%" },
        }
      );
    }
    // Inspiración parallax
    if (inspiracionRef.current) {
      gsap.fromTo(
        inspiracionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: inspiracionRef.current, start: "top 90%" },
        }
      );
    }
    // Hero cards tipo GTA6 (trigger en el contenedor padre)
    if (heroCardsRef.current) {
      const cards = heroCardsRef.current.querySelectorAll(
        ".modern-highlight-card"
      );
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: heroCardsRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }
    // Galería
    if (galleryRef.current) {
      const imgs = galleryRef.current.querySelectorAll(".gallery-img");
      gsap.fromTo(
        imgs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: galleryRef.current, start: "top 95%" },
        }
      );
    }
    // Tips
    if (tipsRef.current) {
      const tipCards = tipsRef.current.querySelectorAll(".tip-card");
      gsap.fromTo(
        tipCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: tipsRef.current, start: "top 95%" },
        }
      );
    }
    // GTA6 animaciones (trigger en el contenedor padre)
    if (gta6Ref.current) {
      const gta6Cards = gta6Ref.current.querySelectorAll(".gta6-img-card");
      gsap.fromTo(
        gta6Cards,
        { opacity: 0, y: 40, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: gta6Ref.current,
            start: "top 95%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }
    // Footer
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 98%" },
        }
      );
    }
    // Refrescar triggers después de un pequeño delay para asegurar layout
    setTimeout(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 100);
    // Limpieza de triggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

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
    <div
      className="dashboard-inicio page-transition-container"
      style={{ overflowX: "hidden" }}
    >
      <div className="dashboard-inicio-inner">
        {/* HERO visual con overlay y animación */}
        <div className="dashboard-hero" ref={heroRef}>
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
        {/* Carrusel horizontal tipo Spotify */}
        <div ref={carruselRef}>
          <EventosCarruselRecomendados />
        </div>

        {/* Card informativa para empresas, negocios y ONGs con animación y estilo destacado */}
        <section
          className="dashboard-info-empresas animate-empresas-card"
          ref={empresasRef}
        >
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
        <div
          className="dashboard-inspiration animate-parallax"
          ref={inspiracionRef}
        >
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>
            Explora eventos, haz nuevos amigos y vive experiencias inolvidables.
          </p>
        </div>

        {/* Sección de ONGs aliadas con videos tipo TikTok */}
        <ONGsPromoSection />

        {/* Cards modernas con imagen de fondo y animaciones tipo GTA6 + info de empresas */}
        <div className="dashboard-hero-cards" ref={heroCardsRef}>
          {/* Cards eliminadas por solicitud */}
        </div>

        {/* Galería de imágenes animada */}
        <div className="dashboard-gallery" ref={galleryRef}>
          {/* Imágenes eliminadas por solicitud */}
        </div>

        {/* Tips y sugerencias visuales */}
        <div className="section tips-section" ref={tipsRef}>
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
        <div className="dashboard-gta6-animaciones" ref={gta6Ref}>
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
      <footer className="dashboard-footer" ref={footerRef}>
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
