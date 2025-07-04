import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import vehiculoIcono from "../assets/capiCamion.png";
import ModalEventoSorpresa from "./ui/ModalEventoSorpresa";
import ErrorBoundary from "./ui/ErrorBoundary";
import "leaflet/dist/leaflet.css";

// Rutas predefinidas para el vehículo capicamión
const rutasVehiculo = {
  ruta1: {
    nombre: "Universidad del Norte → Macroplaza",
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

function VehiculoMarker({ position, rutaInfo, progreso }) {
  const map = useMap();
  const [iconSize, setIconSize] = useState(64);

  useEffect(() => {
    const onZoom = () => {
      const zoom = map.getZoom();
      const size = Math.max(32, Math.min(zoom * 10, 200));
      setIconSize(size);
    };
    map.on("zoom", onZoom);
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
  const [rutaSeleccionada, setRutaSeleccionada] = useState("ruta1");
  const [mostrarModalSorpresa, setMostrarModalSorpresa] = useState(false);

  const vehiculoIdAutorizado = "2f6d5e34-da27-469a-9728-61aa0a67e52a";
  const location = useLocation();
  const rutaActual = rutasVehiculo[rutaSeleccionada];

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Realtime listener
  useEffect(() => {
    const channel = supabase
      .channel("eventos-tiempo-real")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "eventos_tiempo_real",
          filter: "tipo=eq.evento_sorpresa_iniciado",
        },
        (payload) => {
          setMostrarModalSorpresa(true);
          setRecorridoActivo(true);
          setRutaSeleccionada(payload.new?.datos?.ruta || "ruta1");
          setVehiculoIdx(0);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "eventos_tiempo_real",
        },
        () => {
          setRecorridoActivo(false);
          setVehiculoIdx(0);
          setMostrarModalSorpresa(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cargar eventos
  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase.from("eventos").select("*");
      if (!error) {
        setEventos(data || []);
      }
    };
    fetchEventos();
  }, []);

  // Filtrar eventos válidos
  const eventosFiltrados = (eventos || [])
    .filter((e) => {
      if (!e || typeof e !== "object") return false;

      const lat = e.lat;
      const lon = e.lon;

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
        return false;
      }

      if (!e.fecha_fin) {
        return false;
      }

      try {
        const fechaFin = new Date(e.fecha_fin);
        if (isNaN(fechaFin.getTime()) || fechaFin <= new Date()) {
          return false;
        }
      } catch {
        return false;
      }

      return true;
    })
    .filter((e) => (filtro ? e.tipo === filtro : true));

  // Animación del vehículo
  useEffect(() => {
    if (vehiculoIdx < rutaActual.puntos.length - 1 && recorridoActivo) {
      const totalDuration = 120000;
      const interval = totalDuration / (rutaActual.puntos.length - 1);
      const timer = setTimeout(() => {
        setVehiculoIdx(vehiculoIdx + 1);
      }, interval);
      return () => clearTimeout(timer);
    }
  }, [vehiculoIdx, recorridoActivo, rutaActual]);

  const iniciarRecorrido = async (rutaKey) => {
    try {
      if (!user?.id) {
        alert("Debes estar logueado para activar el recorrido");
        return;
      }

      // Limpiar eventos anteriores
      await supabase
        .from("eventos_tiempo_real")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      // Insertar nuevo evento
      const eventData = {
        tipo: "evento_sorpresa_iniciado",
        activo: true,
        datos: {
          ruta: rutaKey,
          iniciado_por: user.id,
          timestamp: new Date().toISOString(),
        },
      };

      const { error } = await supabase
        .from("eventos_tiempo_real")
        .insert(eventData);

      if (error) {
        console.error("Error al enviar evento:", error);
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const detenerRecorrido = async () => {
    try {
      if (!user?.id) return;

      await supabase
        .from("eventos_tiempo_real")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      setRecorridoActivo(false);
      setVehiculoIdx(0);
      setMostrarModalSorpresa(false);
    } catch (error) {
      console.error("Error:", error);
    }
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
                  recorridoActivo && rutaSeleccionada === "ruta1"
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🎓 Universidad → Macroplaza
            </button>
            <button
              onClick={() => iniciarRecorrido("ruta2")}
              style={{
                backgroundColor:
                  recorridoActivo && rutaSeleccionada === "ruta2"
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
                  recorridoActivo && rutaSeleccionada === "ruta3"
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
        </div>
      )}

      <ErrorBoundary>
        <MapContainer
          center={[25.673, -100.312]}
          zoom={14}
          style={{ height: "80vh", width: "400px", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {eventosFiltrados.map((evento, idx) => {
            const lat = Number(evento.lat);
            const lon = Number(evento.lon);

            if (isNaN(lat) || isNaN(lon)) return null;

            return (
              <Marker key={evento.id || idx} position={[lat, lon]}>
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <h3>{evento.nombre || "Evento sin nombre"}</h3>
                    <p>
                      <strong>📍 Ubicación:</strong>{" "}
                      {evento.ubicacion || "Sin ubicación"}
                    </p>
                    <p>
                      <strong>🎯 Tipo:</strong> {evento.tipo || "Sin tipo"}
                    </p>
                    <p>
                      <strong>📅 Fecha:</strong>{" "}
                      {evento.fecha
                        ? new Date(evento.fecha).toLocaleDateString()
                        : "Sin fecha"}
                    </p>
                    <p>
                      <strong>👥 Cupo:</strong> {evento.cupo || "Sin límite"}{" "}
                      personas
                    </p>
                    <p>{evento.descripcion || "Sin descripción"}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {recorridoActivo &&
            rutaActual &&
            rutaActual.puntos &&
            vehiculoIdx >= 0 &&
            vehiculoIdx < rutaActual.puntos.length &&
            rutaActual.puntos[vehiculoIdx] && (
              <VehiculoMarker
                position={rutaActual.puntos[vehiculoIdx]}
                rutaInfo={rutaActual}
                progreso={(vehiculoIdx / (rutaActual.puntos.length - 1)) * 100}
              />
            )}
        </MapContainer>
      </ErrorBoundary>

      <ModalEventoSorpresa
        isOpen={mostrarModalSorpresa}
        onClose={() => setMostrarModalSorpresa(false)}
        recorridoActivo={recorridoActivo}
      />
    </div>
  );
}

export default Mapa;
