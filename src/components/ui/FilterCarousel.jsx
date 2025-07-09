import React from "react";
import "../../styles/filterCarousel.css";
import "../../styles/contrastImprovements.css";

// Importar las imágenes de assets
import arte from "../../assets/arte.png";
import comunidad from "../../assets/comunidad.png";
import deportes from "../../assets/deportes.png";
import fandoms from "../../assets/fandoms.png";
import inclusion from "../../assets/inclusion.png";
import mascotas from "../../assets/mascotas.png";
import medioambiente from "../../assets/medioambiente.png";
import salud from "../../assets/salud.png";
import iconoHazPlanRedondo from "../../assets/iconoHazPlanRedondo.png";

const FilterCarousel = ({ filtro, setFiltro, eventosCounts = {} }) => {
  // Definir filtros con iconos de imágenes
  const filtros = [
    {
      value: "",
      label: "Todos",
      icon: iconoHazPlanRedondo,
      color: "#667eea",
    },
    {
      value: "reforestacion",
      label: "Reforestación",
      icon: medioambiente,
      color: "#2ecc71",
    },
    {
      value: "salud",
      label: "Salud Mental",
      icon: salud,
      color: "#e74c3c",
    },
    {
      value: "mascotas",
      label: "Mascotas",
      icon: mascotas,
      color: "#f39c12",
    },
    {
      value: "fandom",
      label: "Fandom",
      icon: fandoms,
      color: "#9b59b6",
    },
    {
      value: "arte",
      label: "Arte",
      icon: arte,
      color: "#e67e22",
    },
    {
      value: "club",
      label: "Lectura",
      icon: comunidad,
      color: "#3498db",
    },
    {
      value: "juegos",
      label: "Juegos",
      icon: inclusion,
      color: "#1abc9c",
    },
    {
      value: "actividad",
      label: "Deportes",
      icon: deportes,
      color: "#27ae60",
    },
  ];

  return (
    <div className="filter-carousel-container">
      {/* Carrusel con deslizamiento */}
      <div className="filter-carousel">
        {/* Eliminados los gradientes de desvanecimiento */}
        {/* <div className="carousel-fade-left" /> */}
        {/* <div className="carousel-fade-right" /> */}
        {/* Indicador de deslizamiento */}
        <div className="swipe-indicator">⇄</div>

        <div className="filter-track" style={{ minWidth: "fit-content" }}>
          {filtros.map((filter, index) => {
            const count = eventosCounts[filter.value] || 0;
            const isActive = filtro === filter.value;

            return (
              <div
                key={`${filter.value}-${index}`}
                className={`filter-item ${isActive ? "active" : ""}`}
                onClick={() => setFiltro(filter.value)}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${filter.color}, ${filter.color}dd)`
                    : "rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={filter.icon}
                  alt={filter.label}
                  className="filter-image"
                />
                <div className="filter-label small-text-contrast">
                  {filter.label}
                </div>

                {/* Contador de eventos */}
                {count > 0 && (
                  <div className="events-counter badge-contrast">
                    {count > 99 ? "99+" : count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterCarousel;
