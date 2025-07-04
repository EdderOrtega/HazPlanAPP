import React, { useState, useRef, useEffect } from "react";
import "../../styles/filterCarousel.css";

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const trackRef = useRef(null);

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

  // Simplificar por ahora - usar solo los filtros originales
  const itemsPerView = 3; // Número de items visibles a la vez
  const maxIndex = Math.max(0, filtros.length - itemsPerView); // Máximo índice sin espacios vacíos

  // Debug: verificar contenido
  console.log("Filtros originales:", filtros.length, "Max index:", maxIndex);

  // Inicializar en 0
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calcular el transform simple con límites
  const getTransformValue = () => {
    // Asegurar que el índice esté dentro de los límites
    const boundedIndex = Math.max(0, Math.min(maxIndex, currentIndex));
    const translateX = -(boundedIndex * (100 / itemsPerView));
    console.log("Transform:", translateX, "Index:", boundedIndex);
    return translateX;
  };

  // Función para aplicar límites
  const applyBounds = (index) => {
    return Math.max(0, Math.min(maxIndex, index));
  };

  // Función para resetear posición cuando sea necesario
  const resetPosition = () => {
    const boundedIndex = applyBounds(currentIndex);
    if (boundedIndex !== currentIndex) {
      setCurrentIndex(boundedIndex);
    }
    console.log(
      "Reset position called, currentIndex:",
      currentIndex,
      "bounded:",
      boundedIndex
    );
  };

  // Manejar drag/swipe
  const handleMouseDown = (e) => {
    setIsDragging(false); // Inicialmente no es drag
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(currentIndex);
    setDragDistance(0);
    trackRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (startX === 0) return; // No hay mouse down previo

    const currentX = e.pageX - trackRef.current.offsetLeft;
    const distance = Math.abs(currentX - startX);
    setDragDistance(distance);

    // Solo activar dragging si se movió más de 10px
    if (distance > 10) {
      setIsDragging(true);
      e.preventDefault();
      const walk = (currentX - startX) / 80;
      const newIndex = Math.round(scrollLeft - walk);
      const boundedIndex = applyBounds(newIndex);
      setCurrentIndex(boundedIndex);
    }
  };

  const handleMouseUp = () => {
    // Si no se movió mucho, no fue un drag
    if (dragDistance < 10) {
      setIsDragging(false);
    }

    setStartX(0);
    setDragDistance(0);
    trackRef.current.style.cursor = "grab";
    resetPosition();
  };

  // Touch events para móviles
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(currentIndex);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) / 60; // Mayor sensibilidad en móvil
    const newIndex = Math.round(scrollLeft - walk);

    // Aplicar límites inmediatamente
    const boundedIndex = applyBounds(newIndex);
    setCurrentIndex(boundedIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Efectos del teclado con límites
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev - 1)));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev + 1)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maxIndex]);

  // Effect para debug
  useEffect(() => {
    console.log(
      "Current index changed:",
      currentIndex,
      "Total filters:",
      filtros.length
    );
    console.log("🔍 FilterCarousel - eventosCounts:", eventosCounts);
    console.log("🔍 FilterCarousel - filtro actual:", filtro);
  }, [currentIndex, filtros.length, eventosCounts, filtro]);

  const handleFilterSelect = (filterValue) => {
    console.log("🔍 FilterCarousel - Filtro seleccionado:", filterValue);
    console.log("🔍 FilterCarousel - Tipo de filtro:", typeof filterValue);
    setFiltro(filterValue);
  };

  const handleFilterClick = (filterValue, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Click directo en filtro:", filterValue);
    handleFilterSelect(filterValue);
  };

  return (
    <div className="filter-carousel-container">
      {/* Carrusel con deslizamiento */}
      <div className="filter-carousel">
        {/* Gradientes de desvanecimiento */}
        <div className="carousel-fade-left" />
        <div className="carousel-fade-right" />

        {/* Indicador de deslizamiento */}
        <div className="swipe-indicator">⇄</div>

        <div
          ref={trackRef}
          className={`filter-track ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translateX(${getTransformValue()}%)`,
            width: `${(filtros.length / itemsPerView) * 100}%`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {filtros.map((filter, index) => {
            const count = eventosCounts[filter.value] || 0;
            const isActive = filtro === filter.value;

            return (
              <div
                key={`${filter.value}-${index}`}
                className={`filter-item ${isActive ? "active" : ""} ${
                  isDragging ? "dragging" : ""
                }`}
                onClick={(e) => handleFilterClick(filter.value, e)}
                onMouseDown={(e) => e.stopPropagation()}
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
                <div className="filter-label">{filter.label}</div>

                {/* Contador de eventos */}
                {count > 0 && (
                  <div className="events-counter">
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
