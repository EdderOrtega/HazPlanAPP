import ONGsPromoSection from "./ONGsPromoSection";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EventoCard from "./EventoCard";
import "../styles/dashboardInicio.css";
import "../styles/pageTransitions.css";
import Loader from "./ui/Loader";
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
import capilentesImg from "/public/images/capilentes.png";
import StatCard from "./StatCard";
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarDay,
} from "react-icons/fa6";
import EventosCarruselRecomendados from "./EventosCarruselRecomendados";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function DashboardInicio({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
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
  const inspiracionTitleRef = useRef();
  const heroCardsRef = useRef();
  const galleryRef = useRef();
  const tipsRef = useRef();
  const gta6Ref = useRef();
  const footerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setEstadisticas({
          eventosAsistidos: 0,
          eventosCreados: 0,
          proximosEventos: 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // --- h1: efecto "wave" ---
      if (heroRef.current) {
        const h1 = heroRef.current.querySelector("h1");
        if (h1) {
          const chars = h1.textContent.split("");
          h1.innerHTML = chars
            .map(
              (c) =>
                `<span class="hazplan-char" style="display:inline-block">${
                  c === " " ? "&nbsp;" : c
                }</span>`
            )
            .join("");
          const charEls = h1.querySelectorAll(".hazplan-char");
          // Entrada: fade+up, luego loop tipo "wave"
          gsap.fromTo(
            charEls,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "elastic.out(1, 0.6)",
              stagger: 0.04,
              delay: 0.2,
              onComplete: () => {
                gsap.to(charEls, {
                  y: (i) => Math.sin(i / 2) * 12,
                  color: "#a259e6",
                  textShadow: "0 2px 8px #6c2ebf99",
                  repeat: -1,
                  yoyo: true,
                  duration: 1.2,
                  ease: "sine.inOut",
                  stagger: {
                    each: 0.04,
                    repeat: -1,
                    yoyo: true,
                  },
                  delay: 0.2,
                });
              },
            }
          );
        }
      }

      // FadeUp animación para todas las cards y secciones
      const fadeUp = (target, delay = 0, stagger = 0.1) => {
        if (!target) return;
        gsap.fromTo(
          target,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger,
            delay,
            scrollTrigger: {
              trigger: target,
              start: "top 90%",
              toggleActions: "play none none reset",
            },
          }
        );
      };

      fadeUp(heroRef.current);
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-simple");
        fadeUp(statCards, 0.2);
        // Animación especial eliminada para la card de Próximos eventos
      }
      fadeUp(carruselRef.current);
      fadeUp(empresasRef.current);
      fadeUp(inspiracionRef.current);

      // --- Inspiración: efecto "flip" ---
      // Inspiración: animación por palabra, sin cortar palabras
      if (inspiracionTitleRef.current) {
        const el = inspiracionTitleRef.current;
        const words = el.textContent.split(/\s+/);
        el.innerHTML = words
          .map(
            (w, i) =>
              `<span class="inspiracion-title-word" style="display:inline-flex; margin-right:8px; color:${
                i % 2 === 0 ? "#fff" : "#a259e6"
              }; font-weight:900;">${w}</span>`
          )
          .join(" ");
        const wordEls = el.querySelectorAll(".inspiracion-title-word");
        gsap.fromTo(
          wordEls,
          { opacity: 0, y: 40, scale: 0.7 },
          {
            opacity: 1,
            y: 0,
            scale: 1.1,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.09,
            delay: 0.2,
            onComplete: () => {
              gsap.to(wordEls, {
                scale: 1.04,
                color: (i) => (i % 2 === 0 ? "#fff" : "#a259e6"),
                textShadow: (i) =>
                  i % 2 === 0 ? "0 2px 8px #a259e6aa" : "0 2px 8px #fff8",
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
                stagger: {
                  each: 0.09,
                  repeat: -1,
                  yoyo: true,
                },
                delay: 0.2,
              });
            },
          }
        );
      }

      // Si quieres probar otro título, aquí puedes agregar un fade+skew:
      // Por ejemplo, para empresasRef.current.querySelector('h2')
      if (empresasRef.current) {
        const h2 = empresasRef.current.querySelector("h2");
        if (h2) {
          const words = h2.textContent.split(/\s+/);
          h2.innerHTML = words
            .map(
              (w, i) =>
                `<span class="empresas-title-word" style="display:inline-flex; margin-right:8px; color:${
                  i % 2 === 0 ? "#a259e6" : "#fff"
                }; font-weight:900;">${w}</span>`
            )
            .join(" ");
          const wordEls = h2.querySelectorAll(".empresas-title-word");
          gsap.fromTo(
            wordEls,
            { opacity: 0, y: 40, scale: 0.7 },
            {
              opacity: 1,
              y: 0,
              scale: 1.1,
              duration: 1.1,
              ease: "bounce.out",
              stagger: 0.09,
              delay: 0.2,
              onComplete: () => {
                gsap.to(wordEls, {
                  scale: 1.04,
                  color: (i) => (i % 2 === 0 ? "#a259e6" : "#fff"),
                  textShadow: (i) =>
                    i % 2 === 0 ? "0 2px 8px #fff8" : "0 2px 8px #a259e6aa",
                  repeat: -1,
                  yoyo: true,
                  duration: 1.2,
                  ease: "sine.inOut",
                  stagger: {
                    each: 0.09,
                    repeat: -1,
                    yoyo: true,
                  },
                  delay: 0.2,
                });
              },
            }
          );
        }
      }

      if (heroCardsRef.current) {
        const cards = heroCardsRef.current.querySelectorAll(
          ".modern-highlight-card"
        );
        if (cards.length > 0) fadeUp(cards, 0, 0.1);
      }

      if (galleryRef.current) {
        const imgs = galleryRef.current.querySelectorAll(".gallery-img");
        if (imgs.length > 0) fadeUp(imgs, 0, 0.05);
      }

      if (tipsRef.current) {
        const tipCards = tipsRef.current.querySelectorAll(".tip-card");
        if (tipCards.length > 0) fadeUp(tipCards, 0, 0.08);
      }

      if (gta6Ref.current) {
        const gta6Cards = gta6Ref.current.querySelectorAll(".gta6-img-card");
        if (gta6Cards.length > 0) fadeUp(gta6Cards, 0, 0.08);
      }

      fadeUp(footerRef.current);

      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [location.pathname, loading]);

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
      style={{ overflowX: "clip" }}
    >
      <div className="dashboard-inicio-inner">
        {/* 🔥 HERO */}
        <div className="dashboard-hero" ref={heroRef}>
          <div className="hero-overlay" />
          <div className="hero-content animate-fadein">
            <h1>¡Bienvenido a HazPlan!</h1>
            <p>
              Tu espacio para descubrir, conectar y vivir experiencias únicas en
              tu ciudad.
            </p>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div
          ref={statsRef}
          className="stats-grid stagger-animation stats-grid-simple"
        >
          <StatCard
            icon={<FaCalendarCheck />}
            number={estadisticas.eventosAsistidos}
            label="Eventos asistidos"
            duration={1200}
          />
          <StatCard
            icon={<FaCalendarPlus />}
            number={estadisticas.eventosCreados}
            label="Eventos creados"
            duration={1200}
          />
          <StatCard
            icon={<FaCalendarDay />}
            number={estadisticas.proximosEventos}
            label="Próximos eventos"
            duration={1200}
          />
        </div>

        {/* 🔥 CARRUSEL con efecto glassmorphism */}
        <div
          ref={carruselRef}
          style={{
            background: "rgba(255,255,255,0.13)",
            borderRadius: "2rem",
            boxShadow: "0 8px 32px 0 #a259e633",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1.5px solid #a259e655",
            padding: "1.5rem 0 1.5rem 0",
            marginBottom: 32,
          }}
        >
          <EventosCarruselRecomendados />
        </div>

        {/* 🔥 EMPRESAS */}
        <section
          className="dashboard-info-empresas animate-empresas-card"
          ref={empresasRef}
        >
          <div className="empresas-bg-glow"></div>
          <h2>
            ¿Tienes un <span className="negocio-keyword">negocio</span>,{" "}
            <span className="negocio-keyword">empresa</span> u{" "}
            <span className="negocio-keyword">organización</span>?
          </h2>
          <p>
            Únete a HazPlan y crea eventos, talleres, campañas o experiencias
            para miles de usuarios.
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

        {/* 🔥 INSPIRACIÓN */}
        <div
          className="dashboard-inspiration animate-parallax inspiration-bg"
          ref={inspiracionRef}
          style={{
            background:
              "linear-gradient(135deg, rgb(208 149 255) 60%, rgb(136 56 211)",
            borderRadius: "2rem",
            boxShadow: "0 8px 32px 0 #a259e633",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            marginBottom: 32,
            justifyItems: "center",
          }}
        >
          <h2 ref={inspiracionTitleRef}>¿Listo para tu próxima aventura?</h2>
          <p style={{ color: "#fff" }}>
            Explora eventos, haz nuevos amigos y vive experiencias inolvidables.
          </p>
          <img
            src={capilentesImg}
            alt="Capilentes"
            style={{
              bottom: 0,
              width: "120px",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* 🔥 ONGs */}
        <ONGsPromoSection />

        {/* 🔥 GTA6 CARDS */}
        <div className="dashboard-gta6-animaciones" ref={gta6Ref}>
          <div className="gta6-img-card">
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
          <div className="gta6-img-card">
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

      {/* 🔥 FOOTER */}
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
