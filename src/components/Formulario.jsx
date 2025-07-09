import { useState } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";
import ModalEventoCreadoExistosamente from "../components/ui/ModalEventoCreadoExistosamente";
import EventTypeSelector from "./EventTypeSelectorLimpio";
import "../styles/formulario.css";
import mascotasIcon from "../assets/mascotas.png";
import medioambienteIcon from "../assets/medioambiente.png";
import fandomsIcon from "../assets/fandoms.png";
import arteIcon from "../assets/arte.png";
import deportesIcon from "../assets/deportes.png";
import saludIcon from "../assets/salud.png";
import comunidadIcon from "../assets/comunidad.png";
import inclusionIcon from "../assets/inclusion.png";

function Formulario() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "",
    categoria: "", // NUEVO: categoría del evento
    cupo: "",
    descripcion: "",
  });
  const [error, setError] = useState("");
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });
  const [validandoUbicacion, setValidandoUbicacion] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const validarUbicacion = async () => {
    setValidandoUbicacion(true);
    setError("");
    try {
      console.log("🔍 Buscando ubicación:", form.ubicacion);

      // Determinar URL de la API
      const isDev = window.location.hostname === "localhost";
      const apiUrl = isDev
        ? "http://localhost:3000/api/geocoding" // Para desarrollo local
        : "/api/geocoding"; // Para producción (Vercel/Netlify)

      const response = await fetch(
        `${apiUrl}?q=${encodeURIComponent(form.ubicacion)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📍 Resultados: ${data.length}`);

      if (data.length > 0) {
        const resultado = data[0];

        setCoordenadas({
          lat: parseFloat(resultado.lat),
          lon: parseFloat(resultado.lon),
        });

        console.log("✅ Ubicación encontrada:", {
          original: form.ubicacion,
          encontrada: resultado.display_name,
          coordenadas: [resultado.lat, resultado.lon],
        });

        setStep(4);
      } else {
        setError(
          `No se encontró "${form.ubicacion}" en Monterrey. Intenta con una dirección más específica como "Av. Constitución 400, Centro" o lugares conocidos.`
        );
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError(
        "Error al buscar la ubicación. Verifica tu conexión e intenta nuevamente."
      );
    }
    setValidandoUbicacion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const {
      nombreEvento,
      ubicacion,
      fecha,
      fecha_fin,
      tipo,
      cupo,
      descripcion,
    } = form;

    // Validar que las fechas sean futuras
    const now = new Date();
    const fechaInicio = new Date(fecha);
    const fechaFinal = new Date(fecha_fin);

    if (fechaInicio <= now) {
      setError("La fecha de inicio debe ser futura.");
      return;
    }

    if (fechaFinal <= fechaInicio) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user.id;

    // Validar duplicados: mismo nombre, fecha y usuario
    const { data: eventosExistentes } = await supabase
      .from("eventos")
      .select("id")
      .eq("nombre", nombreEvento)
      .eq("fecha", fecha)
      .eq("user_id", userId);

    if (eventosExistentes && eventosExistentes.length > 0) {
      setError("Ya existe un evento con ese nombre y fecha creado por ti.");
      return;
    }

    const { data: eventData, error: insertError } = await supabase
      .from("eventos")
      .insert({
        nombre: nombreEvento,
        descripcion,
        tipo,
        ubicacion,
        fecha,
        fecha_fin,
        cupo,
        user_id: userId,
        lat: coordenadas.lat,
        lon: coordenadas.lon,
      })
      .select();

    if (insertError) {
      console.error("❌ Error al crear el evento:", insertError);
      setError("Error al crear el evento. Por favor, intenta nuevamente.");
    } else {
      console.log("✅ Evento creado exitosamente:", eventData);
      console.log(
        "📡 El evento debería aparecer en el mapa automáticamente vía realtime"
      );

      // Resetear formulario
      setForm({
        nombreEvento: "",
        ubicacion: "",
        fecha: "",
        fecha_fin: "",
        tipo: "",
        cupo: "",
        descripcion: "",
      });
      setCoordenadas({ lat: null, lon: null });
      setStep(1);

      // Mostrar modal de éxito
      setMostrarModalExito(true);
    }
  };

  // Lista de categorías solo para eventos personales
  const categoriasPersonales = [
    { value: "mascotas", label: "Mascotas", icon: mascotasIcon },
    { value: "medioambiente", label: "Ecología", icon: medioambienteIcon },
    { value: "fandom", label: "Fandoms", icon: fandomsIcon },
    { value: "arte", label: "Arte", icon: arteIcon },
    { value: "deportes", label: "Deportes", icon: deportesIcon },
    { value: "salud", label: "Salud", icon: saludIcon },
    { value: "club", label: "Lectura", icon: comunidadIcon },
    { value: "juegos", label: "Juegos", icon: inclusionIcon },
  ];

  return (
    <div className="formulario-container">
      <div className="formulario-card">
        {/* Indicador de pasos */}
        <div className="step-indicator">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`step-dot ${
                stepNumber === step
                  ? "active"
                  : stepNumber < step
                  ? "completed"
                  : ""
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h2 className="step-title">¿Qué tipo de evento quieres crear?</h2>
              <div className="event-type-container">
                <EventTypeSelector
                  selectedType={form.tipo}
                  onTypeChange={(tipo) => setForm({ ...form, tipo })}
                  userType="normal"
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.tipo}
                  className="btn-form btn-primary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* NUEVO: Paso de categoría solo si es evento personal */}
          {step === 2 && form.tipo === "personal" && (
            <div className="step-content">
              <h2 className="step-title">
                ¿A qué categoría pertenece tu evento?
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  margin: "24px 0",
                }}
              >
                {categoriasPersonales.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => setForm({ ...form, categoria: cat.value })}
                    style={{
                      border:
                        form.categoria === cat.value
                          ? "2px solid #593c8f"
                          : "2px solid #e0e0e0",
                      borderRadius: 12,
                      padding: 16,
                      textAlign: "center",
                      cursor: "pointer",
                      background:
                        form.categoria === cat.value ? "#f8f5ff" : "white",
                      boxShadow:
                        form.categoria === cat.value
                          ? "0 4px 12px rgba(89,60,143,0.15)"
                          : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.2s",
                    }}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      style={{
                        width: 48,
                        height: 48,
                        marginBottom: 8,
                        borderRadius: 40,
                      }}
                    />
                    <div style={{ fontWeight: 600, color: "#2c3e50" }}>
                      {cat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!form.categoria}
                  className="btn-form btn-primary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Ajustar los pasos siguientes para que el step avance correctamente */}
          {((step === 2 && form.tipo !== "personal") ||
            (step === 3 && form.tipo === "personal")) && (
            <div className="step-content">
              <h2 className="step-title">¿Cómo se llama tu evento?</h2>
              <div className="form-group">
                <label className="form-label">🏷️ Nombre del evento</label>
                <input
                  type="text"
                  name="nombreEvento"
                  value={form.nombreEvento}
                  onChange={(e) =>
                    setForm({ ...form, nombreEvento: e.target.value })
                  }
                  className="form-input"
                  placeholder="Ej: Limpieza del Parque Central"
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setStep(form.tipo === "personal" ? 2 : 1)}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(form.tipo === "personal" ? 4 : 3)}
                  disabled={!form.nombreEvento}
                  className="btn-form btn-primary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2 className="step-title">¿Dónde será tu evento?</h2>
              <div className="form-group">
                <label className="form-label">📍 Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm({ ...form, ubicacion: e.target.value })
                  }
                  className="form-input"
                  placeholder="Ej: Av. Constitución 400, Centro | Macroplaza | Fundidora"
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={prev}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={validarUbicacion}
                  disabled={!form.ubicacion || validandoUbicacion}
                  className={`btn-form btn-primary ${
                    validandoUbicacion ? "loading-button" : ""
                  }`}
                >
                  {validandoUbicacion && (
                    <span className="loading-spinner-btn"></span>
                  )}
                  {validandoUbicacion ? "Validando..." : "Siguiente"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2 className="step-title">¿Cuándo será tu evento?</h2>
              <CalendarioEvento
                fechaInicio={form.fecha}
                setFechaInicio={(fecha) => setForm({ ...form, fecha })}
                fechaFin={form.fecha_fin}
                setFechaFin={(fecha) => setForm({ ...form, fecha_fin: fecha })}
              />
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={prev}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!form.fecha || !form.fecha_fin}
                  className="btn-form btn-primary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="step-content">
              <h2 className="step-title">
                ¿Cuántas personas pueden participar?
              </h2>
              <div className="form-group">
                <label className="form-label">
                  👥 Cantidad de personas o cupo
                </label>
                <input
                  type="number"
                  name="cupo"
                  value={form.cupo}
                  onChange={(e) => setForm({ ...form, cupo: e.target.value })}
                  className="form-input"
                  min={1}
                  max={30}
                  placeholder="Ej: 15"
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={prev}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!form.cupo}
                  className="btn-form btn-primary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="step-content">
              <h2 className="step-title">Cuéntanos más sobre tu evento</h2>
              <div className="form-group">
                <label className="form-label">📝 Descripción del evento</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  className="form-textarea"
                  placeholder="Describe tu evento: objetivos, qué van a hacer, qué deben traer los participantes..."
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={prev}
                  className="btn-form btn-secondary"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={!form.descripcion}
                  className="btn-form btn-primary"
                >
                  🎉 Crear evento
                </button>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </form>

        {/* Modal de éxito */}
        {mostrarModalExito && (
          <ModalEventoCreadoExistosamente
            onClose={() => setMostrarModalExito(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Formulario;
