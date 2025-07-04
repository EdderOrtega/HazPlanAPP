import { useState } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";
import ModalEventoCreadoExistosamente from "../components/ui/ModalEventoCreadoExistosamente"; // <-- AGREGA ESTA IMPORTACIÓN

function Formulario() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "",
    cupo: "",
    descripcion: "",
  });
  const [error, setError] = useState("");
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });
  const [validandoUbicacion, setValidandoUbicacion] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false); // <-- AGREGA ESTE ESTADO

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

    console.log("📋 Datos del evento a crear:", {
      nombre: nombreEvento,
      descripcion,
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

  return (
    <div
      style={{
        marginTop: "80px",
        paddingBottom: "80px",
        padding: "20px",
        maxWidth: "800px",
        margin: "80px auto 80px auto",
        background: "#593c8f",
      }}
    >
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label>
              🏷️ Nombre del evento:
              <input
                type="text"
                name="nombreEvento"
                value={form.nombreEvento}
                onChange={handleChange}
                required
              />
            </label>
            <button type="button" onClick={next} disabled={!form.nombreEvento}>
              Siguiente
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label>
              📍 Ubicación:
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Av. Constitución 400, Centro | Macroplaza | Fundidora"
                required
              />
            </label>
            <button type="button" onClick={prev}>
              Atrás
            </button>
            <button
              type="button"
              onClick={validarUbicacion}
              disabled={!form.ubicacion || validandoUbicacion}
            >
              {validandoUbicacion ? "Validando..." : "Siguiente"}
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            {/* Paso del calendario */}
            <CalendarioEvento
              fechaInicio={form.fecha}
              setFechaInicio={(fecha) => setForm({ ...form, fecha })}
              fechaFin={form.fecha_fin}
              setFechaFin={(fecha) => setForm({ ...form, fecha_fin: fecha })}
            />
            <button type="button" onClick={prev}>
              Atrás
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!form.fecha || !form.fecha_fin}
            >
              Siguiente
            </button>
          </div>
        )}
        {step === 4 && (
          <div>
            <label>
              🙋‍♂️ Tipo de plan o actividad:
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="reforestacion">
                  🌱 Reforestación y medio ambiente
                </option>
                <option value="salud">🧠 Salud mental y bienestar</option>
                <option value="mascotas">🐶 Actividades con mascotas</option>
                <option value="fandom">
                  🎬 Conversatorios de series y películas (fandom)
                </option>
                <option value="arte">🎨 Arte, dibujo o manualidades</option>
                <option value="club">📚 Club de lectura o escritura</option>
                <option value="juegos">
                  🎮 Juegos, trivias o retos comunitarios
                </option>
                <option value="actividad">
                  🏃 Caminatas, yoga o actividad física
                </option>
              </select>
            </label>
            <button type="button" onClick={prev}>
              Atrás
            </button>
            <button type="button" onClick={next} disabled={!form.tipo}>
              Siguiente
            </button>
          </div>
        )}
        {step === 5 && (
          <div>
            <label>
              👥 Cantidad de personas o cupo:
              <input
                type="number"
                name="cupo"
                value={form.cupo}
                onChange={handleChange}
                min={1}
                max={30}
                required
              />
            </label>
            <button type="button" onClick={prev}>
              Atrás
            </button>
            <button type="button" onClick={next} disabled={!form.cupo}>
              Siguiente
            </button>
          </div>
        )}
        {step === 6 && (
          <div>
            <label>
              📝 Descripción del evento:
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe tu evento aquí..."
                required
              />
            </label>
            <button type="button" onClick={prev}>
              Atrás
            </button>
            <button type="submit" disabled={!form.descripcion}>
              Crear evento
            </button>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
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

export default Formulario;
