import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ModalEventoSorpresa from "./ui/ModalEventoSorpresa";
import ErrorBoundary from "./ui/ErrorBoundary";
import Loader from "./ui/Loader";
import FilterCarousel from "./ui/FilterCarousel";
import VehiculoMarker from "./VehiculoMarker";
import EventoMarker from "./EventoMarker";
import MapControls from "./MapControls";
import MapStyleSelector from "./MapStyleSelector";

// Importar datos y utilidades
import { rutasVehiculo, mapConfig, mapStyles } from "../data/mapData";
import { filterValidEvents, countEventsByCategory } from "../utils/mapUtils";
import { useMapEvents } from "../hooks/useMapEvents";

// Importar estilos CSS
import "leaflet/dist/leaflet.css";
import "../styles/MapaStyles.css";

function Mapa() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [user, setUser] = useState(null);
  const [vehiculoIdx, setVehiculoIdx] = useState(0);
  const [recorridoActivo, setRecorridoActivo] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState("ruta1");
  const [mostrarModalSorpresa, setMostrarModalSorpresa] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [mapStyle, setMapStyle] = useState(mapConfig.defaultMapStyle);

  // Usar hook personalizado para eventos
  const { eventos, isLoadingEventos, fetchEventos } = useMapEvents();

  const { vehiculosIdsAutorizados } = mapConfig;
  const rutaActual = rutasVehiculo[rutaSeleccionada];

  // Filtrar eventos válidos
  const eventosFiltrados = filterValidEvents(eventos, filtro);
  const eventosCounts = countEventsByCategory(eventos);

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      // logs eliminados
    });
  }, [vehiculosIdsAutorizados]);

  // Realtime listener mejorado para sincronización
  useEffect(() => {
    if (!user?.id) {
      // log eliminado
      return;
    }

    const channelName = `eventos-tiempo-real-global`;
    // log eliminado

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
          // log eliminado

          if (
            payload.eventType === "INSERT" &&
            payload.new?.tipo === "evento_sorpresa_iniciado" &&
            payload.new?.activo === true
          ) {
            // log eliminado
            setMostrarModalSorpresa(true);
            setRecorridoActivo(true);
            setRutaSeleccionada(payload.new?.datos?.ruta || "ruta1");
            setVehiculoIdx(0);
          } else if (
            payload.eventType === "DELETE" ||
            (payload.eventType === "UPDATE" && payload.new?.activo === false)
          ) {
            // log eliminado
            setRecorridoActivo(false);
            setVehiculoIdx(0);
            setMostrarModalSorpresa(false);
            setTiempoRestante(null);
          }
        }
      )
      .subscribe((status) => {
        // log eliminado
        if (status === "SUBSCRIBED") {
          // log eliminado
        } else if (status === "CHANNEL_ERROR") {
          // log eliminado
        } else if (status === "TIMED_OUT") {
          // log eliminado
        } else if (status === "CLOSED") {
          // log eliminado
        }
      });

    return () => {
      // log eliminado
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Funciones para manejar eventos
  const handleUnirseEvento = async (evento) => {
    try {
      // log eliminado
      navigate(`/evento/${evento.id}`);
    } catch (error) {
      // log eliminado
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleRecargarEventos = async () => {
    // log eliminado
    await fetchEventos();
  };

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
      // log eliminado

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
        // log eliminado
        clearInterval(countdownInterval);
        try {
          const { error } = await supabase
            .from("eventos_tiempo_real")
            .delete()
            .eq("tipo", "evento_sorpresa_iniciado");

          if (error) {
            // log eliminado
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

      // Solo permitir a usuarios autorizados (usando mapConfig)
      console.log(
        "[DEBUG] ID actual:",
        user.id,
        "Autorizados:",
        vehiculosIdsAutorizados
      );
      if (!vehiculosIdsAutorizados.includes(user.id)) {
        alert("Solo usuarios autorizados pueden activar el evento sorpresa.");
        return;
      }

      console.log("✅ Usuario válido y autorizado:", user.id);

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

  return (
    <div
      style={{
        paddingTop: "80px", // Para el navbar fijo
        paddingBottom: "80px", // Para el menubar inferior
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "calc(100vh - 160px)", // Ajustado para navbar y menubar

        background: "#9C79D7",
      }}
    >
      {/* Filtros con carrusel de iconos */}
      <FilterCarousel
        filtro={filtro}
        setFiltro={setFiltro}
        eventosCounts={eventosCounts}
      />

      {/* Controles superiores */}
      <MapControls
        user={user}
        recorridoActivo={recorridoActivo}
        rutaSeleccionada={rutaSeleccionada}
        onRecargarEventos={handleRecargarEventos}
        onIniciarRecorrido={iniciarRecorrido}
        onDetenerRecorrido={detenerRecorrido}
        eventosFiltrados={eventosFiltrados}
      />

      {/* Selector de estilo de mapa */}
      <MapStyleSelector currentStyle={mapStyle} onStyleChange={setMapStyle} />

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
            center={mapConfig.center}
            zoom={mapConfig.zoom}
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
              url={mapStyles[mapStyle]?.url || mapStyles.openstreetmap.url}
              attribution={
                mapStyles[mapStyle]?.attribution ||
                mapStyles.openstreetmap.attribution
              }
            />

            {/* Verificar que hay eventos */}
            {eventosFiltrados.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 1000,
                  background: "red",
                  color: "white",
                  padding: "5px",
                }}
              >
                No hay eventos para mostrar
              </div>
            )}

            {/* Renderizar eventos usando el nuevo componente */}
            {eventosFiltrados.map((evento) => {
              // Forzar categoría para íconos ONG y Ciudadanía
              let eventoForzado = { ...evento };
              if (
                evento.categoria?.toLowerCase().includes("ong") ||
                evento.tipo?.toLowerCase().includes("ong")
              ) {
                eventoForzado.categoria = "ayuda_ongs";
              } else if (
                evento.categoria?.toLowerCase().includes("ciudadan") ||
                evento.tipo?.toLowerCase().includes("ciudadan")
              ) {
                eventoForzado.categoria = "ayuda_ciudadana";
              }
              return (
                <EventoMarker
                  key={`evento-${evento.id}-${evento.lat}-${evento.lon}`}
                  evento={eventoForzado}
                  user={user}
                  onUnirseEvento={handleUnirseEvento}
                  onNavigateToLogin={handleNavigateToLogin}
                />
              );
            })}

            {/* Vehículo marker */}
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
