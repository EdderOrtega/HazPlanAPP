import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import EventoCard from "./EventoCard";
import "../styles/dashboardInicio.css";
import "../styles/pageTransitions.css";
import Loader from "./ui/Loader";
import {
  useScrollAnimation,
  useStaggerAnimation,
} from "../hooks/useAnimations";

function DashboardInicio({ user, onShowComingSoon }) {
  const navigate = useNavigate();
  const [eventosRecomendados, setEventosRecomendados] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    eventosAsistidos: 0,
    eventosCreados: 0,
    proximosEventos: 0,
  });

  // Hooks para animaciones
  const statsRef = useStaggerAnimation(150);
  const [eventsRef, eventsVisible] = useScrollAnimation(0.1);
  const [negociosRecomendados] = useState([
    {
      id: 1,
      nombre: "Café Central",
      tipo: "Café/Coworking",
      distancia: "0.5 km",
      rating: 4.5,
      imagen: "☕",
      descripcion: "Perfecto para meetups de estudio",
    },
    {
      id: 2,
      nombre: "Parque Fundidora",
      tipo: "Espacio al aire libre",
      distancia: "1.2 km",
      rating: 4.8,
      imagen: "🌳",
      descripcion: "Ideal para actividades deportivas",
    },
    {
      id: 3,
      nombre: "Biblioteca Central",
      tipo: "Espacio cultural",
      distancia: "0.8 km",
      rating: 4.3,
      imagen: "📚",
      descripcion: "Para clubs de lectura y estudio",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Obtener eventos recomendados (eventos futuros que no ha creado)
        const { data: eventosData } = await supabase
          .from("eventos")
          .select("*")
          .gte("fecha", new Date().toISOString())
          .neq("user_id", user.id)
          .limit(6)
          .order("fecha", { ascending: true });

        setEventosRecomendados(eventosData || []);

        // Obtener próximos eventos del usuario (eventos a los que se unió)
        const { data: participacionesData } = await supabase
          .from("participantes_eventos")
          .select(
            `
            evento_id,
            eventos (
              id,
              nombre,
              descripcion,
              fecha,
              ubicacion,
              tipo,
              cupo,
              lat,
              lon
            )
          `
          )
          .eq("user_id", user.id)
          .gte("eventos.fecha", new Date().toISOString())
          .limit(5);

        const proximosEventosData =
          participacionesData?.map((p) => p.eventos).filter(Boolean) || [];
        setProximosEventos(proximosEventosData);

        // Calcular estadísticas básicas
        const { count: eventosCreados } = await supabase
          .from("eventos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { count: eventosAsistidos } = await supabase
          .from("participantes_eventos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setEstadisticas({
          eventosAsistidos: eventosAsistidos || 0,
          eventosCreados: eventosCreados || 0,
          proximosEventos: proximosEventosData.length,
        });
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
      {/* Header personalizado con animación */}
      <div className="dashboard-header">
        <h1>¡Hola! 👋</h1>
        <p>Descubre eventos increíbles cerca de ti</p>
      </div>

      {/* Estadísticas rápidas con stagger animation */}
      <div ref={statsRef} className="stats-grid stagger-animation">
        <div className="stat-card hover-lift">
          <div className="stat-icon">🎉</div>
          <div className="stat-number">{estadisticas.eventosAsistidos}</div>
          <div className="stat-label">Eventos asistidos</div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-icon">📅</div>
          <div className="stat-number">{estadisticas.eventosCreados}</div>
          <div className="stat-label">Eventos creados</div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-icon">⏰</div>
          <div className="stat-number">{estadisticas.proximosEventos}</div>
          <div className="stat-label">Próximos eventos</div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <button
          className="action-btn primary"
          onClick={() => navigate("/crear-evento")}
        >
          ➕ Crear evento
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate("/mapa")}
        >
          🗺️ Ver mapa
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate("/mis-eventos")}
        >
          📋 Mis eventos
        </button>
        {/* Botón promocional para el modal Coming Soon */}
        <button className="action-btn promo" onClick={onShowComingSoon}>
          🚀 Más ciudades
        </button>
      </div>

      {/* Próximos eventos del usuario */}
      {proximosEventos.length > 0 && (
        <div
          ref={eventsRef}
          className={`section ${
            eventsVisible ? "animate-on-scroll in-view" : "animate-on-scroll"
          }`}
        >
          <h2 className="section-title">📅 Tus próximos eventos</h2>
          <div className="eventos-horizontal stagger-animation">
            {proximosEventos.map((evento) => (
              <div
                key={evento.id}
                className="evento-card-mini hover-lift glass-effect"
              >
                <h4>{evento.nombre}</h4>
                <p>📍 {evento.ubicacion}</p>
                <p>📅 {new Date(evento.fecha).toLocaleDateString()}</p>
                <button
                  onClick={() => navigate(`/evento/${evento.id}`)}
                  className="btn-ver-evento"
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eventos recomendados */}
      <div className="section">
        <h2 className="section-title">🔥 Eventos recomendados para ti</h2>
        <div className="eventos-grid">
          {eventosRecomendados.slice(0, 4).map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              user={user}
              onClick={() => navigate(`/evento/${evento.id}`)}
            />
          ))}
        </div>
        {eventosRecomendados.length > 4 && (
          <button className="btn-ver-mas" onClick={() => navigate("/mapa")}>
            Ver todos los eventos →
          </button>
        )}
      </div>

      {/* Negocios recomendados */}
      <div className="section">
        <h2 className="section-title">🏪 Lugares recomendados cerca de ti</h2>
        <div className="negocios-grid">
          {negociosRecomendados.map((negocio) => (
            <div key={negocio.id} className="negocio-card">
              <div className="negocio-icon">{negocio.imagen}</div>
              <div className="negocio-info">
                <h4>{negocio.nombre}</h4>
                <p className="negocio-tipo">{negocio.tipo}</p>
                <p className="negocio-descripcion">{negocio.descripcion}</p>
                <div className="negocio-meta">
                  <span className="rating">⭐ {negocio.rating}</span>
                  <span className="distancia">📍 {negocio.distancia}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips y sugerencias */}
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
            <button
              onClick={() => {
                /* Implementar compartir */
              }}
            >
              Compartir app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInicio;
