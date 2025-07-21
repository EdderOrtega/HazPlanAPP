import L from "leaflet";
import { categoryIcons, mapConfig } from "../data/mapData";
import iconoHazPlanRedondo from "/images/iconoHazPlanRedondo.png";

// Función para crear iconos personalizados según la categoría
// Recibe el evento completo para poder distinguir entre tipo y categoria
export const createCategoryIcon = (evento, size = 40) => {
  // Si tiene subcategoría (evento.categoria), usarla; si no, usar tipo
  const categoria = evento?.categoria || evento?.tipo;
  let normalizedCategoria = categoria
    ? categoria.toLowerCase().trim().replace(/\s+/g, "")
    : null;

  // Forzar icono correcto para ONG y Ciudadanía aunque la subcategoría no coincida exactamente
  if (normalizedCategoria && normalizedCategoria.includes("ayuda_ongs")) {
    normalizedCategoria = "ayuda_ongs";
  } else if (
    normalizedCategoria &&
    normalizedCategoria.includes("ayuda_ciudadana")
  ) {
    normalizedCategoria = "ayuda_ciudadana";
  }

  const iconUrl =
    normalizedCategoria && categoryIcons[normalizedCategoria]
      ? categoryIcons[normalizedCategoria]
      : iconoHazPlanRedondo;
  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [size, size],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
    className: `category-icon category-${normalizedCategoria || "default"}`,
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
    .filter((e) => {
      if (!filtro) return true;
      // Mostrar si coincide con tipo o con categoria (para eventos personales)
      return e.tipo === filtro || e.categoria === filtro;
    });
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
