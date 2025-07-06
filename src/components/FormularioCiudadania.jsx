import { useState } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";
import ModalEventoCreadoExistosamente from "../components/ui/ModalEventoCreadoExistosamente";

function FormularioCiudadania() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "ayuda_ciudadana",
    cupo: "",
    descripcion: "",
    tipoAyuda: "",
    herramientasNecesarias: "",
    contactoEmergencia: "",
    materialRequerido: "",
  });
  const [error, setError] = useState("");
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });
  const [validandoUbicacion, setValidandoUbicacion] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const validarUbicacion = async () => {
    setValidandoUbicacion(true);
    setError("");
    try {
      console.log("🔍 Buscando ubicación:", form.ubicacion);

      const isDev = window.location.hostname === "localhost";
      const apiUrl = isDev
        ? "http://localhost:3000/api/geocoding"
        : "/api/geocoding";

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

        setStep(3);
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

    const {
      nombreEvento,
      ubicacion,
      fecha,
      fecha_fin,
      tipo,
      cupo,
      descripcion,
      tipoAyuda,
      herramientasNecesarias,
      contactoEmergencia,
      materialRequerido,
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

    // Crear descripción extendida para eventos de ciudadanía
    const descripcionCompleta = `${descripcion}

📋 DETALLES DE LA AYUDA CIUDADANA:
🎯 Tipo de ayuda: ${tipoAyuda}
🔧 Herramientas necesarias: ${herramientasNecesarias || "Por definir"}
📱 Contacto de emergencia: ${contactoEmergencia || "No especificado"}
📦 Material requerido: ${materialRequerido || "No especificado"}`;

    console.log("📋 Datos del evento de ciudadanía a crear:", {
      nombre: nombreEvento,
      descripcion: descripcionCompleta,
      tipo,
      ubicacion,
      fecha,
      fecha_fin,
      cupo,
      coordenadas: coordenadas,
      user_id: userId,
    });

    const { data: eventData, error: insertError } = await supabase
      .from("eventos")
      .insert({
        nombre: nombreEvento,
        descripcion: descripcionCompleta,
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
      console.log("✅ Evento de ciudadanía creado exitosamente:", eventData);

      // Resetear formulario
      setForm({
        nombreEvento: "",
        ubicacion: "",
        fecha: "",
        fecha_fin: "",
        tipo: "ayuda_ciudadana",
        cupo: "",
        descripcion: "",
        tipoAyuda: "",
        herramientasNecesarias: "",
        contactoEmergencia: "",
        materialRequerido: "",
      });
      setCoordenadas({ lat: null, lon: null });
      setStep(1);

      // Mostrar modal de éxito
      setMostrarModalExito(true);
    }
  };

  return (
    <div
      style={{
        marginTop: "80px",
        paddingBottom: "80px",
        padding: "20px",
        maxWidth: "800px",
        margin: "80px auto 80px auto",
        background: "#4CAF50",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🤝 Crear Evento de Ayuda Ciudadana
      </h2>
      <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
        Organiza actividades de ayuda comunitaria como limpieza de plazas,
        reforestación, etc.
      </p>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🏷️ Nombre de la actividad de ayuda:
              <input
                type="text"
                name="nombreEvento"
                value={form.nombreEvento}
                onChange={handleChange}
                placeholder="Ej: Limpieza del Parque Central"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>
            <button
              type="button"
              onClick={next}
              disabled={!form.nombreEvento}
              style={{
                backgroundColor: "#2E7D32",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: form.nombreEvento ? "pointer" : "not-allowed",
              }}
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              📍 Ubicación donde se necesita ayuda:
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Parque Fundidora | Plaza México | Av. Constitución 400"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={validarUbicacion}
                disabled={!form.ubicacion || validandoUbicacion}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    !form.ubicacion || validandoUbicacion
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {validandoUbicacion ? "Validando..." : "Siguiente"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <CalendarioEvento
              fechaInicio={form.fecha}
              setFechaInicio={(fecha) => setForm({ ...form, fecha })}
              fechaFin={form.fecha_fin}
              setFechaFin={(fecha) => setForm({ ...form, fecha_fin: fecha })}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!form.fecha || !form.fecha_fin}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    !form.fecha || !form.fecha_fin ? "not-allowed" : "pointer",
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🎯 Tipo de ayuda ciudadana:
              <select
                name="tipoAyuda"
                value={form.tipoAyuda}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <option value="">Selecciona el tipo de ayuda</option>
                <option value="limpieza_parques">
                  🌳 Limpieza de parques y plazas
                </option>
                <option value="reforestacion">🌱 Reforestación urbana</option>
                <option value="limpieza_calles">🧹 Limpieza de calles</option>
                <option value="pintura_murales">
                  🎨 Pintura de murales comunitarios
                </option>
                <option value="jardineria">🌺 Jardinería comunitaria</option>
                <option value="limpieza_rios">
                  🌊 Limpieza de ríos y arroyos
                </option>
                <option value="reciclaje">♻️ Jornadas de reciclaje</option>
                <option value="construccion_comunitaria">
                  🔨 Construcción/reparación comunitaria
                </option>
                <option value="otro">🤝 Otro tipo de ayuda</option>
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!form.tipoAyuda}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !form.tipoAyuda ? "not-allowed" : "pointer",
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              👥 Número de voluntarios necesarios:
              <input
                type="number"
                name="cupo"
                value={form.cupo}
                onChange={handleChange}
                min={1}
                max={100}
                placeholder="¿Cuántas personas necesitas?"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!form.cupo}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !form.cupo ? "not-allowed" : "pointer",
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🔧 Herramientas necesarias (opcional):
              <input
                type="text"
                name="herramientasNecesarias"
                value={form.herramientasNecesarias}
                onChange={handleChange}
                placeholder="Ej: Palas, escobas, guantes, bolsas de basura"
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              📦 Material requerido (opcional):
              <input
                type="text"
                name="materialRequerido"
                value={form.materialRequerido}
                onChange={handleChange}
                placeholder="Ej: Pintura, plantas, cemento, etc."
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              📱 Contacto de emergencia (opcional):
              <input
                type="text"
                name="contactoEmergencia"
                value={form.contactoEmergencia}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez - 81-1234-5678"
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              📝 Descripción detallada de la actividad:
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente qué tipo de ayuda necesitas, objetivos, beneficios para la comunidad, etc."
                required
                rows={6}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                  resize: "vertical",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#81C784",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={!form.descripcion}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !form.descripcion ? "not-allowed" : "pointer",
                }}
              >
                Crear Evento de Ayuda
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            style={{
              color: "#ffcdd2",
              backgroundColor: "#c62828",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "15px",
            }}
          >
            {error}
          </p>
        )}
      </form>

      {/* Modal de éxito */}
      {mostrarModalExito && (
        <ModalEventoCreadoExistosamente
          onClose={() => setMostrarModalExito(false)}
        />
      )}
    </div>
  );
}

export default FormularioCiudadania;
