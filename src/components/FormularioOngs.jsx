import { useState } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";
import ModalEventoCreadoExistosamente from "../components/ui/ModalEventoCreadoExistosamente";

function FormularioOngs() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "ayuda_ongs",
    cupo: "",
    descripcion: "",
    tipoEmergencia: "",
    nivelUrgencia: "",
    contactoResponsable: "",
    telefonoEmergencia: "",
    materialesNecesarios: "",
    experienciaRequerida: "",
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

      // Usar Nominatim directamente desde el frontend
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        form.ubicacion
      )}&addressdetails=1&limit=3&countrycodes=mx`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

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
      tipoEmergencia,
      nivelUrgencia,
      contactoResponsable,
      telefonoEmergencia,
      materialesNecesarios,
      experienciaRequerida,
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

    // Crear descripción extendida para eventos de ONGs/Refugios
    const descripcionCompleta = `${descripcion}

🚨 DETALLES DE LA EMERGENCIA/AYUDA:
🎯 Tipo de emergencia: ${tipoEmergencia}
⚡ Nivel de urgencia: ${nivelUrgencia}
👤 Contacto responsable: ${contactoResponsable}
📞 Teléfono de emergencia: ${telefonoEmergencia}
📦 Materiales necesarios: ${materialesNecesarios || "No especificado"}
🎓 Experiencia requerida: ${experienciaRequerida || "No requerida"}`;

    console.log("📋 Datos del evento de ONGs a crear:", {
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
        categoria: (tipoEmergencia || "ayuda_ongs")
          .toLowerCase()
          .replace(/\s+/g, "_"),
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
      console.log("✅ Evento de ONGs creado exitosamente:", eventData);

      // Resetear formulario
      setForm({
        nombreEvento: "",
        ubicacion: "",
        fecha: "",
        fecha_fin: "",
        tipo: "ayuda_ongs",
        cupo: "",
        descripcion: "",
        tipoEmergencia: "",
        nivelUrgencia: "",
        contactoResponsable: "",
        telefonoEmergencia: "",
        materialesNecesarios: "",
        experienciaRequerida: "",
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
        background: "#FF9800",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🐾 Crear Solicitud de Ayuda para ONGs/Refugios
      </h2>
      <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
        Solicita ayuda urgente para emergencias con animales, asistencia social,
        etc.
      </p>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🚨 Tipo de emergencia o ayuda:
              <select
                name="tipoEmergencia"
                value={form.tipoEmergencia}
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
                <option value="">Selecciona el tipo de emergencia</option>
                <option value="emergencia_animales">
                  🐕 Emergencia con animales
                </option>
                <option value="rescate_animales">🚑 Rescate de animales</option>
                <option value="alimentacion_refugio">
                  🍽️ Alimentación para refugio
                </option>
                <option value="atencion_medica">
                  🏥 Atención médica veterinaria
                </option>
                <option value="construccion_refugio">
                  �️ Construcción/reparación de refugio
                </option>
                <option value="limpieza_refugio">🧹 Limpieza de refugio</option>
                <option value="donaciones_materiales">
                  📦 Donaciones de materiales
                </option>
                <option value="transporte_animales">
                  🚛 Transporte de animales
                </option>
                <option value="asistencia_social">
                  🤝 Asistencia social general
                </option>
                <option value="otro">🆘 Otro tipo de emergencia</option>
              </select>
            </label>
            <button
              type="button"
              onClick={next}
              disabled={!form.tipoEmergencia}
              style={{
                backgroundColor: "#F57C00",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: form.tipoEmergencia ? "pointer" : "not-allowed",
              }}
            >
              Siguiente
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              �🏷️ Título de la solicitud de ayuda:
              <input
                type="text"
                name="nombreEvento"
                value={form.nombreEvento}
                onChange={handleChange}
                placeholder="Ej: Emergencia en Refugio de Perros - Ayuda Urgente"
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
              onClick={prev}
              style={{
                backgroundColor: "#FFB74D",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!form.nombreEvento}
              style={{
                backgroundColor: "#F57C00",
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

        {step === 3 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              📍 Ubicación donde se necesita la ayuda:
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Refugio San Francisco | Centro de Asistencia Social | Av. Lincoln 123"
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
                  backgroundColor: "#FFB74D",
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
                  backgroundColor: "#F57C00",
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

        {step === 4 && (
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
                  backgroundColor: "#FFB74D",
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
                  backgroundColor: "#F57C00",
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

        {step === 5 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🚨 Tipo de emergencia o ayuda:
              <select
                name="tipoEmergencia"
                value={form.tipoEmergencia}
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
                <option value="">Selecciona el tipo de emergencia</option>
                <option value="emergencia_animales">
                  🐕 Emergencia con animales
                </option>
                <option value="rescate_animales">🚑 Rescate de animales</option>
                <option value="alimentacion_refugio">
                  🍽️ Alimentación para refugio
                </option>
                <option value="atencion_medica">
                  🏥 Atención médica veterinaria
                </option>
                <option value="construccion_refugio">
                  🏗️ Construcción/reparación de refugio
                </option>
                <option value="limpieza_refugio">🧹 Limpieza de refugio</option>
                <option value="donaciones_materiales">
                  📦 Donaciones de materiales
                </option>
                <option value="transporte_animales">
                  🚛 Transporte de animales
                </option>
                <option value="asistencia_social">
                  🤝 Asistencia social general
                </option>
                <option value="otro">🆘 Otro tipo de emergencia</option>
              </select>
            </label>
            <label style={{ display: "block", marginBottom: "15px" }}>
              ⚡ Nivel de urgencia:
              <select
                name="nivelUrgencia"
                value={form.nivelUrgencia}
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
                <option value="">Selecciona el nivel de urgencia</option>
                <option value="baja">
                  🟢 Baja - Puede esperar algunos días
                </option>
                <option value="media">🟡 Media - Necesario en 1-2 días</option>
                <option value="alta">🟠 Alta - Necesario en pocas horas</option>
                <option value="critica">
                  🔴 Crítica - Emergencia inmediata
                </option>
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#FFB74D",
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
                disabled={!form.tipoEmergencia || !form.nivelUrgencia}
                style={{
                  backgroundColor: "#F57C00",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    !form.tipoEmergencia || !form.nivelUrgencia
                      ? "not-allowed"
                      : "pointer",
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
              👥 Número de voluntarios necesarios:
              <input
                type="number"
                name="cupo"
                value={form.cupo}
                onChange={handleChange}
                min={1}
                max={50}
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

            <label style={{ display: "block", marginBottom: "15px" }}>
              👤 Nombre del responsable:
              <input
                type="text"
                name="contactoResponsable"
                value={form.contactoResponsable}
                onChange={handleChange}
                placeholder="Ej: María González - Directora del Refugio"
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

            <label style={{ display: "block", marginBottom: "15px" }}>
              📞 Teléfono de emergencia:
              <input
                type="tel"
                name="telefonoEmergencia"
                value={form.telefonoEmergencia}
                onChange={handleChange}
                placeholder="Ej: 81-1234-5678"
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
                  backgroundColor: "#FFB74D",
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
                disabled={
                  !form.cupo ||
                  !form.contactoResponsable ||
                  !form.telefonoEmergencia
                }
                style={{
                  backgroundColor: "#F57C00",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    !form.cupo ||
                    !form.contactoResponsable ||
                    !form.telefonoEmergencia
                      ? "not-allowed"
                      : "pointer",
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
              📦 Materiales necesarios (opcional):
              <textarea
                name="materialesNecesarios"
                value={form.materialesNecesarios}
                onChange={handleChange}
                placeholder="Ej: Alimento para perros, medicamentos, mantas, herramientas de limpieza, etc."
                rows={3}
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

            <label style={{ display: "block", marginBottom: "15px" }}>
              🎓 Experiencia requerida (opcional):
              <select
                name="experienciaRequerida"
                value={form.experienciaRequerida}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <option value="">Selecciona si se requiere experiencia</option>
                <option value="ninguna">Ninguna experiencia requerida</option>
                <option value="basica">Experiencia básica con animales</option>
                <option value="veterinaria">Conocimientos veterinarios</option>
                <option value="rescate">
                  Experiencia en rescate de animales
                </option>
                <option value="construccion">
                  Conocimientos de construcción
                </option>
                <option value="trabajo_social">
                  Experiencia en trabajo social
                </option>
              </select>
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#FFB74D",
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
                  backgroundColor: "#F57C00",
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

        {step === 8 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              📝 Descripción detallada de la emergencia:
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente la situación, qué tipo de ayuda necesitas, urgencia, condiciones actuales, etc."
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
                  backgroundColor: "#FFB74D",
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
                  backgroundColor: "#F57C00",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !form.descripcion ? "not-allowed" : "pointer",
                }}
              >
                Crear Solicitud de Ayuda
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            style={{
              color: "#ffcdd2",
              backgroundColor: "#d84315",
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

export default FormularioOngs;
