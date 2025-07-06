import L from "leaflet";
import { categoryIcons, mapConfig } from "../data/mapData";

// Función para crear iconos personalizados según la categoría
export const createCategoryIcon = (categoria, size = 40) => {
  const normalizedCategoria = categoria
    ? categoria.toLowerCase().trim().replace(/\s+/g, "")
    : "todos";

  const iconUrl = categoryIcons[normalizedCategoria] || categoryIcons.todos;

  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [size, size],
    iconAnchor: [size / 2, size + 8], // Ajustado para el pico triangular
    popupAnchor: [0, -(size + 8)], // Popup aparece arriba del pin completo
    className: `category-icon category-${normalizedCategoria}`,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  });
};

// Función para validar eventos
export const isValidEvent = (evento) => {
  if (!evento || typeof evento !== "object") {
    console.log("❌ Evento rechazado - no es objeto:", evento);
    return false;
  }

  const lat = evento.lat;
  const lon = evento.lon;

  if (
    lat === null ||
    lat === undefined ||
    lat === "" ||
    lon === null ||
    lon === undefined ||
    lon === "" ||
    isNaN(Number(lat)) ||
    isNaN(Number(lon))
  ) {
    console.log("❌ Evento rechazado - coordenadas inválidas:", {
      nombre: evento.nombre,
      lat,
      lon,
      latType: typeof lat,
      lonType: typeof lon,
    });
    return false;
  }

  return true;
};

// Función para verificar si un evento está en Monterrey
export const isInMonterrey = (evento) => {
  const latNum = Number(evento.lat);
  const lonNum = Number(evento.lon);
  const { monterreyArea } = mapConfig;

  const isInArea =
    latNum >= monterreyArea.latMin &&
    latNum <= monterreyArea.latMax &&
    lonNum >= monterreyArea.lonMin &&
    lonNum <= monterreyArea.lonMax;

  if (!isInArea) {
    console.log("❌ Evento rechazado - fuera del área de Monterrey:", {
      nombre: evento.nombre,
      lat: latNum,
      lon: lonNum,
      ubicacion: evento.ubicacion,
    });
    return false;
  }

  return true;
};

// Función para filtrar eventos válidos
export const filterValidEvents = (eventos, filtro = "") => {
  return (eventos || [])
    .filter(isValidEvent)
    .filter(isInMonterrey)
    .filter((e) => (filtro ? e.tipo === filtro : true));
};

// Función para contar eventos por categoría
export const countEventsByCategory = (eventos) => {
  return eventos.reduce((counts, evento) => {
    if (evento && evento.tipo) {
      counts[evento.tipo] = (counts[evento.tipo] || 0) + 1;
    }
    // Contar todos los eventos válidos
    if (!counts[""]) counts[""] = 0;
    if (isValidEvent(evento)) {
      counts[""] += 1;
    }
    return counts;
  }, {});
};

// Función para formatear tiempo
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
