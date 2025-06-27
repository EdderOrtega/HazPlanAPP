import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import EventoCard from "./EventoCard";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import vehiculoIcono from "../assets/capiCamion.png"; // Usa tu propio icono
import "leaflet/dist/leaflet.css"; // <-- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ

// Rutas predefinidas para el vehículo capicamión
const rutasVehiculo = {
  ruta1: {
    nombre: "Universidad del Norte → Macroplaza",
    descripcion: "Universidad del Norte (UDENOR) hasta Centro Histórico",
    puntos: [
      [25.6727, -100.3156], // Universidad del Norte - UDENOR (inicio)
      [25.6725, -100.315], // Av. Venustiano Carranza este
      [25.6723, -100.314], // Av. Venustiano Carranza este
      [25.672, -100.313], // Av. Venustiano Carranza este
      [25.6718, -100.312], // Av. Venustiano Carranza este
      [25.6715, -100.311], // Av. Venustiano Carranza este
      [25.6713, -100.31], // Hacia el centro
      [25.6711, -100.3095], // Av. Constitución
      [25.671, -100.3093], // Acercándose a Macroplaza
      [25.6708148, -100.3092394], // Macroplaza (fin)
    ],
  },
  ruta2: {
    nombre: "Aeropuerto → UANL",
    descripcion: "Aeropuerto Internacional hasta Ciudad Universitaria",
    puntos: [
      [25.7785, -100.1069], // Aeropuerto Internacional (inicio)
      [25.7785, -100.12], // Carretera al Aeropuerto
      [25.778, -100.135], // Av. Rogelio Cantú Gómez
      [25.777, -100.15], // Av. Rogelio Cantú Gómez
      [25.776, -100.165], // Av. Rogelio Cantú Gómez
      [25.775, -100.18], // Av. Rogelio Cantú Gómez
      [25.774, -100.195], // Conectando con Av. Universidad
      [25.773, -100.21], // Av. Universidad
      [25.77, -100.225], // Av. Universidad
      [25.765, -100.24], // Av. Universidad
      [25.76, -100.255], // Av. Universidad
      [25.755, -100.27], // Av. Universidad
      [25.75, -100.285], // Av. Universidad
      [25.745, -100.3], // Av. Universidad
      [25.74, -100.308], // Av. Universidad
      [25.735, -100.31], // Av. Universidad
      [25.7266, -100.3111], // UANL - Ciudad Universitaria (fin)
    ],
  },
  ruta3: {
    nombre: "Tec Monterrey → Valle Oriente",
    descripcion: "Tecnológico de Monterrey hasta Valle Oriente",
    puntos: [
      [25.6514, -100.2895], // Tec de Monterrey (inicio)
      [25.652, -100.289], // Av. Eugenio Garza Sada
      [25.654, -100.288], // Av. Eugenio Garza Sada norte
      [25.656, -100.287], // Av. Eugenio Garza Sada norte
      [25.658, -100.286], // Av. Eugenio Garza Sada norte
      [25.66, -100.285], // Cruce con Av. Vasconcelos
      [25.662, -100.284], // Av. Vasconcelos este
      [25.664, -100.282], // Av. Vasconcelos este
      [25.666, -100.28], // Av. Vasconcelos este
      [25.668, -100.278], // Av. Vasconcelos este
      [25.67, -100.276], // Av. Vasconcelos este
      [25.672, -100.274], // Conectando con Av. Lázaro Cárdenas
      [25.674, -100.272], // Av. Lázaro Cárdenas norte
      [25.676, -100.27], // Av. Lázaro Cárdenas norte
      [25.678, -100.268], // Av. Lázaro Cárdenas norte
      [25.68, -100.266], // Valle Oriente zona
      [25.682, -100.264], // Valle Oriente (fin)
    ],
  },
};

// Componente hijo para el marcador del vehículo con tamaño dinámico
function VehiculoMarker({ position, rutaInfo, progreso }) {
  const map = useMap();
  const [iconSize, setIconSize] = useState(64);

  useEffect(() => {
    const onZoom = () => {
      const zoom = map.getZoom();
      // Tamaño base + incremento por nivel de zoom
      const size = Math.max(32, Math.min(zoom * 10, 200));
      setIconSize(size);
    };
    map.on("zoom", onZoom);
    // Llama una vez al montar para el zoom inicial
    onZoom();
    return () => map.off("zoom", onZoom);
  }, [map]);

  const vehiculoIcon = new L.Icon({
    iconUrl: vehiculoIcono,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });

  return (
    <Marker position={position} icon={vehiculoIcon}>
      <Popup>
        <div style={{ minWidth: "180px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#2196F3" }}>
            🚛 Capicamión HazPlan
          </h4>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            <strong>📍 Ruta:</strong> {rutaInfo.nombre}
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            {rutaInfo.descripcion}
          </p>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
              padding: "4px 8px",
              margin: "8px 0",
            }}
          >
            <div
              style={{
                backgroundColor: "#4CAF50",
                height: "6px",
                borderRadius: "3px",
                width: `${progreso}%`,
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "11px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Progreso: {Math.round(progreso)}%
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

function Mapa() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [user, setUser] = useState(null);
  const [vehiculoIdx, setVehiculoIdx] = useState(0);
  const [recorridoActivo, setRecorridoActivo] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState("ruta1"); // Ruta por defecto

  //aqui
  //aqui//aqui
  //aqui
  //aqui
  const vehiculoIdAutorizado = "1"; // Cambia por el ID real autorizado
  const location = useLocation(); // Hook para detectar navegación
  //aqui
  //aqui
  //aqui
  // //aqui
  // //aqui
  //
  //
  // // Obtener la ruta actual
  const rutaActual = rutasVehiculo[rutaSeleccionada];

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Cargar eventos desde Supabase
  useEffect(() => {
    const fetchEventos = async () => {
      console.log("🔄 Cargando eventos desde la base de datos...");
      const { data, error } = await supabase.from("eventos").select("*");
      if (!error) {
        console.log(`📊 Eventos obtenidos: ${data?.length || 0}`);
        setEventos(data || []);
      } else {
        console.error("❌ Error al cargar eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  // Re-cargar eventos cuando se navega al mapa (después de crear evento)
  useEffect(() => {
    if (location.pathname === "/mapa") {
      console.log("🗺️ Navegado al mapa, recargando eventos...");
      const fetchEventos = async () => {
        const { data, error } = await supabase.from("eventos").select("*");
        if (!error) {
          console.log(`🔄 Eventos recargados: ${data?.length || 0}`);
          setEventos(data || []);
        }
      };
      fetchEventos();
    }
  }, [location]);

  // Filtrar eventos activos y por categoría
  const eventosFiltrados = eventos
    .filter(
      (e) =>
        e.lat !== null &&
        e.lon !== null &&
        e.lat !== "" &&
        e.lon !== "" &&
        !isNaN(Number(e.lat)) &&
        !isNaN(Number(e.lon)) &&
        new Date(e.fecha_fin) > new Date()
    )
    .filter((e) => (filtro ? e.tipo === filtro : true));

  // Agrega logs para depurar
  console.log("📋 Total eventos:", eventos.length);
  console.log("✅ Eventos que aparecen en mapa:", eventosFiltrados.length);
  console.log(
    "🎯 Eventos filtrados:",
    eventosFiltrados.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      coordenadas: [e.lat, e.lon],
      fecha_fin: e.fecha_fin,
    }))
  );

  // Animación del vehículo
  useEffect(() => {
    if (vehiculoIdx < rutaActual.puntos.length - 1 && recorridoActivo) {
      const totalDuration = 120000; // 2 minutos en ms
      const interval = totalDuration / (rutaActual.puntos.length - 1);
      const timer = setTimeout(() => {
        setVehiculoIdx(vehiculoIdx + 1);
      }, interval);
      return () => clearTimeout(timer);
    }
  }, [vehiculoIdx, recorridoActivo, rutaActual]);

  const iniciarRecorrido = (rutaKey) => {
    setRutaSeleccionada(rutaKey);
    setVehiculoIdx(0);
    setRecorridoActivo(true);
    console.log(`🚛 Iniciando recorrido: ${rutasVehiculo[rutaKey].nombre}`);
  };

  const detenerRecorrido = () => {
    setRecorridoActivo(false);
    setVehiculoIdx(0);
    console.log("🛑 Recorrido detenido");
  };

  return (
    <div>
      <select
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="">Todas las categorías</option>
        <option value="reforestacion">Reforestación</option>
        <option value="salud">Salud mental</option>
        <option value="mascotas">Mascotas</option>
        <option value="fandom">Fandom</option>
        <option value="arte">Arte</option>
        <option value="club">Club de lectura</option>
        <option value="juegos">Juegos</option>
        <option value="actividad">Actividad física</option>
      </select>
      <h3>Eventos activos</h3>
      {user && user.id === vehiculoIdAutorizado && (
        <div style={{ marginBottom: "10px" }}>
          <h4>🚛 Activar Capicamión:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => iniciarRecorrido("ruta1")}
              style={{
                backgroundColor:
                  rutaSeleccionada === "ruta1" && recorridoActivo
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🎓 Universidad del Norte → Macroplaza
            </button>
            <button
              onClick={() => iniciarRecorrido("ruta2")}
              style={{
                backgroundColor:
                  rutaSeleccionada === "ruta2" && recorridoActivo
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ✈️ Aeropuerto → UANL
            </button>
            <button
              onClick={() => iniciarRecorrido("ruta3")}
              style={{
                backgroundColor:
                  rutaSeleccionada === "ruta3" && recorridoActivo
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🏫 Tec → Valle Oriente
            </button>
            {recorridoActivo && (
              <button
                onClick={detenerRecorrido}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                🛑 Detener
              </button>
            )}
          </div>
          {recorridoActivo && (
            <p style={{ margin: "5px 0", fontStyle: "italic", color: "#666" }}>
              🚛 En ruta: {rutaActual.descripcion} ({vehiculoIdx + 1}/
              {rutaActual.puntos.length})
            </p>
          )}
        </div>
      )}
      <MapContainer
        center={[25.673, -100.312]}
        zoom={14}
        style={{ height: "80vh", width: "400px", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventosFiltrados.map((evento, idx) => (
          <Marker
            key={evento.id || idx}
            position={[Number(evento.lat), Number(evento.lon)]}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                  {evento.nombre}
                </h3>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>📍 Ubicación:</strong> {evento.ubicacion}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>🎯 Tipo:</strong> {evento.tipo}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>📅 Fecha:</strong>{" "}
                  {new Date(evento.fecha).toLocaleDateString()}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>⏰ Hasta:</strong>{" "}
                  {new Date(evento.fecha_fin).toLocaleString()}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>👥 Cupo:</strong> {evento.cupo} personas
                </p>
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "13px",
                    fontStyle: "italic",
                  }}
                >
                  {evento.descripcion}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Vehículo animado con tamaño dinámico */}
        {recorridoActivo && (
          <VehiculoMarker
            position={rutaActual.puntos[vehiculoIdx]}
            rutaInfo={rutaActual}
            progreso={(vehiculoIdx / (rutaActual.puntos.length - 1)) * 100}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Mapa;
