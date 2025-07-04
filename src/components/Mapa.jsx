import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import vehiculoIcono from "../assets/capiCamion.png";
import ModalEventoSorpresa from "./ui/ModalEventoSorpresa";
import ErrorBoundary from "./ui/ErrorBoundary";
import Loader from "./ui/Loader";
import FilterCarousel from "./ui/FilterCarousel";
import "leaflet/dist/leaflet.css";

// Rutas predefinidas para el vehículo capicamión
const rutasVehiculo = {
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

function VehiculoMarker({ position, rutaInfo, progreso, tiempoRestante }) {
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Marker position={position} icon={vehiculoIcon}>
      <Popup>
        <div style={{ minWidth: "180px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#2196F3" }}>
            Capicamión HazPlan
          </h4>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            <strong>Ruta:</strong> {rutaInfo.nombre}
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            {rutaInfo.descripcion}
          </p>

          {progreso >= 100 && tiempoRestante ? (
            <div
              style={{
                backgroundColor: "#e8f5e8",
                borderRadius: "8px",
                padding: "8px",
                margin: "8px 0",
                border: "1px solid #4CAF50",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  textAlign: "center",
                }}
              >
                ¡Destino alcanzado!
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "11px",
                  color: "#555",
                  textAlign: "center",
                }}
              >
                Desaparece en: {formatTime(tiempoRestante)}
              </p>
            </div>
          ) : (
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
          )}

          {progreso < 100 && (
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
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function Mapa() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [user, setUser] = useState(null);
  const [vehiculoIdx, setVehiculoIdx] = useState(0);
  const [recorridoActivo, setRecorridoActivo] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState("ruta1");
  const [mostrarModalSorpresa, setMostrarModalSorpresa] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [isLoadingEventos, setIsLoadingEventos] = useState(false); // Estado para el loader

  const vehiculoIdAutorizado = "2f6d5e34-da27-469a-9728-61aa0a67e52a";
  const rutaActual = rutasVehiculo[rutaSeleccionada];

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      console.log("👤 Usuario:", data.user?.id);
      console.log("🔑 ID requerido:", vehiculoIdAutorizado);
      console.log("✅ ¿Autorizado?", data.user?.id === vehiculoIdAutorizado);
    });
  }, []);

  // Realtime listener mejorado para sincronización
  useEffect(() => {
    if (!user?.id) {
      console.log("❌ Usuario no autenticado, saltando suscripción Realtime");
      return;
    }

    const channelName = `eventos-tiempo-real-global`;
    console.log(`📡 Creando canal compartido: ${channelName}`);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eventos_tiempo_real",
        },
        (payload) => {
          console.log("📡 Realtime evento recibido:", {
            eventType: payload.eventType,
            tipo: payload.new?.tipo || payload.old?.tipo,
            activo: payload.new?.activo || payload.old?.activo,
            iniciado_por:
              payload.new?.datos?.iniciado_por ||
              payload.old?.datos?.iniciado_por,
            currentUser: user.id,
            timestamp: new Date().toISOString(),
          });

          if (
            payload.eventType === "INSERT" &&
            payload.new?.tipo === "evento_sorpresa_iniciado" &&
            payload.new?.activo === true
          ) {
            console.log(`🎉 ACTIVANDO EVENTO SORPRESA PARA TODOS LOS USUARIOS`);
            console.log(`📍 Datos del evento:`, payload.new);
            setMostrarModalSorpresa(true);
            setRecorridoActivo(true);
            setRutaSeleccionada(payload.new?.datos?.ruta || "ruta1");
            setVehiculoIdx(0);
          } else if (
            payload.eventType === "DELETE" ||
            (payload.eventType === "UPDATE" && payload.new?.activo === false)
          ) {
            console.log(
              `🛑 DETENIENDO EVENTO SORPRESA PARA TODOS LOS USUARIOS`
            );
            setRecorridoActivo(false);
            setVehiculoIdx(0);
            setMostrarModalSorpresa(false);
            setTiempoRestante(null);
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Canal ${channelName} - Estado:`, status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Suscripción Realtime exitosa");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error en el canal Realtime");
        } else if (status === "TIMED_OUT") {
          console.error("⏰ Timeout en el canal Realtime");
        } else if (status === "CLOSED") {
          console.log("🔒 Canal Realtime cerrado");
        }
      });

    return () => {
      console.log(`🧹 Limpiando canal ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Cargar eventos y escuchar cambios en tiempo real
  useEffect(() => {
    const fetchEventos = async () => {
      setIsLoadingEventos(true); // Mostrar loader
      // Cargar todos los eventos y filtrar después para debug
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("fecha", { ascending: true });

      if (!error) {
        setEventos(data || []);
        console.log(`📋 Eventos cargados: ${data?.length || 0}`);
        console.log("📋 Primeros eventos:", data?.slice(0, 3));

        // Debug: mostrar fechas de eventos
        data?.forEach((evento, idx) => {
          if (idx < 3) {
            console.log(`Evento ${idx + 1}:`, {
              nombre: evento.nombre,
              fecha: evento.fecha,
              fecha_fin: evento.fecha_fin,
              coordenadas: [evento.lat, evento.lon],
            });
          }
        });
      } else {
        console.error("❌ Error al cargar eventos:", error);
      }

      setIsLoadingEventos(false); // Ocultar loader
    };

    // Cargar eventos inicialmente
    fetchEventos();

    // Suscribirse a cambios en tiempo real en la tabla eventos
    console.log("🔧 Configurando listener de eventos...");
    const eventosChannelName = `eventos-updates-${Date.now()}`;
    const eventosChannel = supabase
      .channel(eventosChannelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eventos",
        },
        (payload) => {
          console.log("📡 ¡Cambio detectado en tabla eventos!:", payload);

          if (payload.eventType === "INSERT") {
            console.log("➕ Insertando nuevo evento en mapa:", payload.new);
            setEventos((prev) => {
              const newEventos = [...prev, payload.new];
              console.log(
                "📊 Total eventos después de insertar:",
                newEventos.length
              );
              return newEventos;
            });
          } else if (payload.eventType === "UPDATE") {
            console.log("✏️ Actualizando evento en mapa:", payload.new);
            setEventos((prev) =>
              prev.map((evento) =>
                evento.id === payload.new.id ? payload.new : evento
              )
            );
          } else if (payload.eventType === "DELETE") {
            console.log("🗑️ Eliminando evento del mapa:", payload.old);
            setEventos((prev) =>
              prev.filter((evento) => evento.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(`� Canal ${eventosChannelName} - Estado:`, status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Suscripción a eventos exitosa");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error en el canal de eventos");
        }
      });

    return () => {
      console.log("🧹 Limpiando canal de eventos");
      supabase.removeChannel(eventosChannel);
    };
  }, []);

  // Filtrar eventos válidos
  const eventosFiltrados = (eventos || [])
    .filter((e) => {
      if (!e || typeof e !== "object") {
        console.log("❌ Evento rechazado - no es objeto:", e);
        return false;
      }

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
        console.log("❌ Evento rechazado - coordenadas inválidas:", {
          nombre: e.nombre,
          lat,
          lon,
          latType: typeof lat,
          lonType: typeof lon,
        });
        return false;
      }

      console.log("✅ Evento válido para el mapa:", {
        nombre: e.nombre,
        lat: e.lat,
        lon: e.lon,
        fecha_fin: e.fecha_fin,
      });
      return true;
    })
    .filter((e) => (filtro ? e.tipo === filtro : true));

  // Contar eventos por categoría
  const eventosCounts = eventos.reduce((counts, evento) => {
    if (evento && evento.tipo) {
      counts[evento.tipo] = (counts[evento.tipo] || 0) + 1;
    }
    // Contar todos los eventos válidos
    if (!counts[""]) counts[""] = 0;
    if (
      evento &&
      typeof evento === "object" &&
      evento.lat &&
      evento.lon &&
      !isNaN(Number(evento.lat)) &&
      !isNaN(Number(evento.lon))
    ) {
      counts[""] += 1;
    }
    return counts;
  }, {});

  // Log del resumen de filtrado
  console.log(
    `📊 Resumen de eventos: ${eventos.length} total, ${eventosFiltrados.length} válidos para el mapa`
  );

  // Animación del vehículo con auto-limpieza
  useEffect(() => {
    if (vehiculoIdx < rutaActual.puntos.length - 1 && recorridoActivo) {
      const totalDuration = 120000;
      const interval = totalDuration / (rutaActual.puntos.length - 1);
      const timer = setTimeout(() => {
        setVehiculoIdx(vehiculoIdx + 1);
      }, interval);
      return () => clearTimeout(timer);
    } else if (vehiculoIdx >= rutaActual.puntos.length - 1 && recorridoActivo) {
      // Si llegó al destino, esperar 3 minutos y limpiar automáticamente
      console.log(
        "🏁 Capicamión llegó al destino, iniciando temporizador de 3 minutos..."
      );

      // Iniciar contador regresivo
      setTiempoRestante(180); // 3 minutos en segundos

      const countdownInterval = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      const cleanupTimer = setTimeout(async () => {
        console.log(
          "⏰ Tiempo de espera terminado, limpiando evento automáticamente..."
        );
        clearInterval(countdownInterval);
        try {
          const { error } = await supabase
            .from("eventos_tiempo_real")
            .delete()
            .eq("tipo", "evento_sorpresa_iniciado");

          if (error) {
            console.warn("⚠️ Error al limpiar evento automáticamente:", error);
          } else {
            console.log(
              "✅ Evento limpiado automáticamente después de 3 minutos"
            );
          }
        } catch (error) {
          console.error("❌ Error inesperado al limpiar evento:", error);
        }
      }, 180000); // 3 minutos = 180000ms

      return () => {
        clearTimeout(cleanupTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [vehiculoIdx, recorridoActivo, rutaActual]);

  const iniciarRecorrido = async (rutaKey) => {
    try {
      console.log("🚀 INICIANDO RECORRIDO:", rutaKey);

      if (!user?.id) {
        alert("Debes estar logueado para activar el recorrido");
        return;
      }

      console.log("✅ Usuario válido:", user.id);

      // Limpiar eventos anteriores antes de insertar nuevo
      console.log("🧹 Limpiando eventos anteriores...");
      const { error: deleteError } = await supabase
        .from("eventos_tiempo_real")
        .delete()
        .eq("tipo", "evento_sorpresa_iniciado");

      if (deleteError) {
        console.warn("⚠️ Error al limpiar eventos anteriores:", deleteError);
      } else {
        console.log("✅ Eventos anteriores limpiados");
      }

      // Insertar nuevo evento
      const eventData = {
        tipo: "evento_sorpresa_iniciado",
        activo: true,
        datos: {
          ruta: rutaKey,
          iniciado_por: user.id,
          timestamp: new Date().toISOString(),
          auto_deactivate_at: new Date(
            Date.now() + 5 * 60 * 1000
          ).toISOString(), // 5 minutos desde ahora
        },
      };

      console.log("📤 Insertando evento con datos completos:", eventData);

      const { data, error } = await supabase
        .from("eventos_tiempo_real")
        .insert(eventData)
        .select();

      if (error) {
        console.error("❌ Error al enviar evento:", error);
        alert(`Error: ${error.message}`);
      } else {
        console.log("✅ Evento insertado exitosamente:", data);

        // Activación local inmediata para el usuario que inicia
        console.log("🔧 Activando estado local para el iniciador...");
        setMostrarModalSorpresa(true);
        setRecorridoActivo(true);
        setRutaSeleccionada(rutaKey);
        setVehiculoIdx(0);
        setTiempoRestante(null);

        // ⏰ TEMPORIZADOR DE AUTO-DESACTIVACIÓN - 5 MINUTOS
        console.log("⏰ Programando auto-desactivación en 5 minutos...");
        setTimeout(async () => {
          try {
            console.log(
              "🛑 5 minutos cumplidos - Desactivando evento automáticamente..."
            );

            // Opción 1: Cambiar activo a false (recomendado)
            const { error: updateError } = await supabase
              .from("eventos_tiempo_real")
              .update({
                activo: false,
                deactivated_at: new Date().toISOString(),
              })
              .eq("tipo", "evento_sorpresa_iniciado");

            // Opción 2: O eliminar completamente (descomenta si prefieres esto)
            // const { error: updateError } = await supabase
            //   .from("eventos_tiempo_real")
            //   .delete()
            //   .eq("tipo", "evento_sorpresa_iniciado");

            if (updateError) {
              console.error(
                "❌ Error al desactivar evento automáticamente:",
                updateError
              );
            } else {
              console.log(
                "✅ Evento desactivado automáticamente después de 5 minutos"
              );
            }
          } catch (error) {
            console.error("❌ Error inesperado en auto-desactivación:", error);
          }
        }, 5 * 60 * 1000); // 5 minutos = 300,000 milisegundos

        console.log("✅ Estado local activado para el iniciador:", {
          recorridoActivo: true,
          rutaSeleccionada: rutaKey,
          vehiculoIdx: 0,
          modalSorpresa: true,
        });
      }
    } catch (error) {
      console.error("❌ Error inesperado al iniciar recorrido:", error);
      alert("Error inesperado al iniciar el recorrido");
    }
  };

  const detenerRecorrido = async () => {
    try {
      console.log("🛑 DETENIENDO RECORRIDO...");

      if (!user?.id) {
        console.log("❌ Usuario no autenticado");
        return;
      }

      console.log("🧹 Eliminando eventos activos...");
      const { data, error } = await supabase
        .from("eventos_tiempo_real")
        .delete()
        .eq("tipo", "evento_sorpresa_iniciado")
        .select();

      if (error) {
        console.error("❌ Error al detener recorrido:", error);
      } else {
        console.log("✅ Eventos eliminados:", data);

        // Limpiar estado local inmediatamente
        console.log("🔧 Limpiando estado local...");
        setRecorridoActivo(false);
        setVehiculoIdx(0);
        setMostrarModalSorpresa(false);
        setTiempoRestante(null);

        console.log("✅ Estado local limpiado:", {
          recorridoActivo: false,
          vehiculoIdx: 0,
          modalSorpresa: false,
        });
      }
    } catch (error) {
      console.error("❌ Error inesperado al detener recorrido:", error);
    }
  };

  const handleUnirseEvento = async (evento) => {
    try {
      console.log("🎯 Navegando al evento:", evento.nombre);

      // Navegar al detalle del evento usando React Router
      navigate(`/evento/${evento.id}`);
    } catch (error) {
      console.error("❌ Error al navegar al evento:", error);
    }
  };

  return (
    <div
      style={{
        paddingTop: "80px", // Para el navbar fijo
        paddingBottom: "80px", // Para el menubar inferior
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "calc(100vh - 160px)", // Ajustado para navbar y menubar
        background: "#593c8f",
      }}
    >
      {/* Filtros con carrusel de iconos */}
      <FilterCarousel
        filtro={filtro}
        setFiltro={setFiltro}
        eventosCounts={eventosCounts}
      />

      {/* Controles superiores */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={async () => {
            console.log("🔄 Recargando todos los eventos...");

            const { data, error } = await supabase
              .from("eventos")
              .select("*")
              .order("fecha", { ascending: true });

            if (!error) {
              setEventos(data || []);
              console.log(`📋 Eventos recargados: ${data?.length || 0}`);
              console.log("📋 Primeros eventos:", data?.slice(0, 3));

              // Debug: mostrar fechas de eventos
              data?.forEach((evento, idx) => {
                if (idx < 3) {
                  console.log(`Evento ${idx + 1}:`, {
                    nombre: evento.nombre,
                    fecha: evento.fecha,
                    fecha_fin: evento.fecha_fin,
                    coordenadas: [evento.lat, evento.lon],
                  });
                }
              });
            } else {
              console.error("❌ Error al recargar eventos:", error);
            }
          }}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Recargar eventos
        </button>
        <h3>Eventos inmediatos y cercanos ({eventosFiltrados.length})</h3>
        {user && user.id === vehiculoIdAutorizado && (
          <div style={{ marginBottom: "10px" }}>
            <h4>Activar Capicamión:</h4>
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
                Universidad → Macroplaza
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
                Aeropuerto → UANL
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
                Tec → Valle Oriente
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
                  Detener
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ErrorBoundary>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <MapContainer
            center={[25.673, -100.312]}
            zoom={14}
            style={{
              height: "70vh",
              width: "100%",
              maxWidth: "800px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              zIndex: 0,
            }}
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
                    <div style={{ minWidth: "250px", maxWidth: "300px" }}>
                      <h3
                        style={{
                          color: "#2c3e50",
                          margin: "0 0 12px 0",
                          fontSize: "1.2rem",
                        }}
                      >
                        {evento.nombre || "Evento sin nombre"}
                      </h3>

                      <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                        <strong>Ubicación:</strong>{" "}
                        {evento.ubicacion || "Sin ubicación"}
                      </p>

                      <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                        <strong>Tipo:</strong> {evento.tipo || "Sin tipo"}
                      </p>

                      <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                        <strong>Fecha:</strong>{" "}
                        {evento.fecha
                          ? new Date(evento.fecha).toLocaleDateString()
                          : "Sin fecha"}
                      </p>

                      <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                        <strong>Cupo:</strong> {evento.cupo || "Sin límite"}{" "}
                        personas
                      </p>

                      <p
                        style={{
                          margin: "8px 0",
                          fontSize: "0.85rem",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        {evento.descripcion || "Sin descripción"}
                      </p>

                      {/* Botón para unirse al evento */}
                      <div
                        style={{
                          marginTop: "12px",
                          textAlign: "center",
                          borderTop: "1px solid #eee",
                          paddingTop: "10px",
                        }}
                      >
                        {user ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevenir comportamiento por defecto
                              e.stopPropagation(); // Evitar propagación
                              handleUnirseEvento(evento); // Llamar función sin recargar
                            }}
                            style={{
                              padding: "12px 24px",
                              background:
                                "linear-gradient(45deg, #667eea, #764ba2)",
                              color: "white",
                              border: "none",
                              borderRadius: "25px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                              transition: "all 0.3s ease",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                            }}
                          >
                            Unirme
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/login")}
                            style={{
                              background:
                                "linear-gradient(135deg, #95a5a6, #7f8c8d)",
                              color: "white",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Inicia sesión para unirte
                          </button>
                        )}
                      </div>
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
                  progreso={
                    (vehiculoIdx / (rutaActual.puntos.length - 1)) * 100
                  }
                  tiempoRestante={tiempoRestante}
                />
              )}
          </MapContainer>
        </div>
      </ErrorBoundary>
      <ModalEventoSorpresa
        isOpen={mostrarModalSorpresa}
        onClose={() => setMostrarModalSorpresa(false)}
        recorridoActivo={recorridoActivo}
      />
      {/* Loader para eventos */}
      {isLoadingEventos && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Mapa;
