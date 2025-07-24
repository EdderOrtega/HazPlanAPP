// Importar iconos de categorías
import deportesIcon from "/images/deportes.png";
import arteIcon from "/images/arte.png";
import comunidadIcon from "/images/comunidad.png";
import fandomsIcon from "/images/fandoms.png";
import mascotasIcon from "/images/mascotas.png";
import medioambienteIcon from "/images/medioambiente.png";
import saludIcon from "/images/salud.png";
import inclusionIcon from "/images/inclusion.png";
import todosIcon from "/images/iconoHazPlanRedondo.png";
import capiHeroIcono from "/images/capiHeroIcono.png";
import capiCapitanIcono from "/images/IconoONG.png";

// Rutas predefinidas para el vehículo capicamión
export const rutasVehiculo = {
  ruta1: {
    nombre: "Universidad del Norte → Macro Plaza",
    descripcion: "Universidad del Norte (UDENOR) hasta Centro Histórico",
    puntos: [
      [25.6727, -100.3156],
      [25.6725, -100.315],
      [25.6723, -100.314],
      [25.672, -100.313],
      [25.6718, -100.312],
      [25.6715, -100.311],
      [25.6713, -100.31],
      [25.6711, -100.3095],
      [25.671, -100.3093],
      [25.6708148, -100.3092394],
    ],
  },
  ruta2: {
    nombre: "Aeropuerto → UANL",
    descripcion: "Aeropuerto Internacional hasta Ciudad Universitaria",
    puntos: [
      [25.7785, -100.1069],
      [25.7785, -100.12],
      [25.778, -100.135],
      [25.777, -100.15],
      [25.776, -100.165],
      [25.775, -100.18],
      [25.774, -100.195],
      [25.773, -100.21],
      [25.77, -100.225],
      [25.765, -100.24],
      [25.76, -100.255],
      [25.755, -100.27],
      [25.75, -100.285],
      [25.745, -100.3],
      [25.74, -100.308],
      [25.735, -100.31],
      [25.7266, -100.3111],
    ],
  },
  ruta3: {
    nombre: "Tec Monterrey → Valle Oriente",
    descripcion: "Tecnológico de Monterrey hasta Valle Oriente",
    puntos: [
      [25.6514, -100.2895],
      [25.652, -100.289],
      [25.654, -100.288],
      [25.656, -100.287],
      [25.658, -100.286],
      [25.66, -100.285],
      [25.662, -100.284],
      [25.664, -100.282],
      [25.666, -100.28],
      [25.668, -100.278],
      [25.67, -100.276],
      [25.672, -100.274],
      [25.674, -100.272],
      [25.676, -100.27],
      [25.678, -100.268],
      [25.68, -100.266],
      [25.682, -100.264],
    ],
  },
};

// Mapeo de categorías a iconos
export const categoryIcons = {
  deportes: deportesIcon,
  deporte: deportesIcon,
  deportivo: deportesIcon,
  futbol: deportesIcon,
  basquet: deportesIcon,
  tenis: deportesIcon,
  arte: arteIcon,
  artes: arteIcon,
  cultura: arteIcon,
  cultural: arteIcon,
  musica: arteIcon,
  pintura: arteIcon,
  teatro: arteIcon,
  cine: arteIcon,
  comunidad: comunidadIcon,
  social: comunidadIcon,
  comunitario: comunidadIcon,
  voluntariado: comunidadIcon,
  reunion: comunidadIcon,
  fandoms: fandomsIcon,
  fandom: fandomsIcon,
  entretenimiento: fandomsIcon,
  juegos: fandomsIcon,
  gaming: fandomsIcon,
  anime: fandomsIcon,
  comics: fandomsIcon,
  mascotas: mascotasIcon,
  animales: mascotasIcon,
  perros: mascotasIcon,
  gatos: mascotasIcon,
  adopcion: mascotasIcon,
  medioambiente: medioambienteIcon,
  naturaleza: medioambienteIcon,
  ecologia: medioambienteIcon,
  reciclaje: medioambienteIcon,
  verde: medioambienteIcon,
  plantas: medioambienteIcon,
  salud: saludIcon,
  bienestar: saludIcon,
  medicina: saludIcon,
  fitness: saludIcon,
  ejercicio: saludIcon,
  yoga: saludIcon,
  inclusion: inclusionIcon,
  diversidad: inclusionIcon,
  inclusivo: inclusionIcon,
  accesibilidad: inclusionIcon,
  todos: todosIcon,
  general: todosIcon,
  otro: todosIcon,
  mixto: todosIcon,
  // Nuevas categorías especializadas
  ayuda_ciudadana: capiHeroIcono,
  limpieza_parques: capiHeroIcono,
  reforestacion: capiHeroIcono,
  limpieza_calles: capiHeroIcono,
  pintura_murales: capiHeroIcono,
  jardineria: capiHeroIcono,
  limpieza_rios: capiHeroIcono,
  construccion_comunitaria: capiHeroIcono,

  ayuda_ongs: capiCapitanIcono,
  emergencia_animales: capiCapitanIcono,
  rescate_animales: capiCapitanIcono,
  alimentacion_refugio: capiCapitanIcono,
  atencion_medica: capiCapitanIcono,
  construccion_refugio: capiCapitanIcono,
  limpieza_refugio: capiCapitanIcono,
  donaciones_materiales: capiCapitanIcono,
  transporte_animales: capiCapitanIcono,
  asistencia_social: capiCapitanIcono,
  evento_premium: inclusionIcon,
  networking: comunidadIcon,
  conferencia: arteIcon,
  workshop: arteIcon,
  capacitacion: arteIcon,
  lanzamiento: comunidadIcon,
  team_building: deportesIcon,
  feria_empleo: comunidadIcon,
  expo_comercial: comunidadIcon,
  gala_empresarial: inclusionIcon,
};

// Configuración del mapa
export const mapConfig = {
  center: [25.673, -100.312],
  zoom: 12,
  vehiculosIdsAutorizados: [
    "08d54fc4-0879-40a4-b247-b11c38a386f7",
    "588b2b86-6775-4e46-bb98-0f5ada6d9d1c",
    "f88c6ac4-8895-4323-8b72-34a9f49dfb73",
    "648a6ffc-1ce7-44c9-bc9a-c1218caee0fe",
    "8675bc0f-251a-46f4-82f5-aa9c1e9c5745"

    // Agrega aquí más IDs si lo deseas
  ],
  defaultMapStyle: "openstreetmap", // Mapa estándar por defecto
  monterreyArea: {
    latMin: 25.3,
    latMax: 26.0,
    lonMin: -100.7,
    lonMax: -99.8,
  },
};

// Estilos de mapas disponibles
export const mapStyles = {
  // Mapas claros/blancos
  openstreetmap: {
    name: "OpenStreetMap (Estándar)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    description: "Mapa estándar con colores normales",
  },
  cartodb_light: {
    name: "CartoDB Light (Blanco)",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    description: "Mapa blanco minimalista",
  },
  cartodb_positron: {
    name: "CartoDB Positron (Blanco Puro)",
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    description: "Mapa blanco sin etiquetas",
  },

  // Mapas oscuros
  cartodb_dark: {
    name: "CartoDB Dark (Oscuro)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    description: "Mapa oscuro elegante",
  },

  // Mapas satelitales
  esri_satellite: {
    name: "Esri Satellite (Satelital)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    description: "Vista satelital real",
  },

  // Mapas temáticos
  stamen_watercolor: {
    name: "Stamen Watercolor (Acuarela)",
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    description: "Estilo artístico acuarela",
  },

  stamen_terrain: {
    name: "Stamen Terrain (Relieve)",
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    description: "Mapa con relieve topográfico",
  },
};
