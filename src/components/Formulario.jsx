import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";

function Formulario({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "",
    cupo: "",
    descripcion: "", // <--- CAMBIA aquí
  });
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });
  const [validandoUbicacion, setValidandoUbicacion] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const validarUbicacion = async () => {
    setValidandoUbicacion(true);
    setError("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          form.ubicacion
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setCoordenadas({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        });
        setStep(3);
      } else {
        setError(
          "Ubicación no encontrada. Escribe una colonia o ciudad válida."
        );
      }
    } catch {
      setError("Error al validar la ubicación.");
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user.id;

    const { error: insertError } = await supabase.from("eventos").insert({
      nombre: nombreEvento,
      descripcion, // <--- aquí
      tipo,
      ubicacion,
      fecha,
      fecha_fin,
      cupo,
      user_id: userId,
      lat: coordenadas.lat,
      lon: coordenadas.lon,
    });

    if (insertError) {
      console.error("Error al crear el evento:", insertError);
      setError("Error al crear el evento. Por favor, intenta nuevamente.");
    } else {
      onSubmit(form);
      setForm({
        nombreEvento: "",
        ubicacion: "",
        fecha: "",
        fecha_fin: "",
        tipo: "",
        cupo: "",
        descripcion: "", // <--- CAMBIA aquí
      });
      setStep(1);
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase.from("eventos").select("*");
      if (!error) setEventos(data || []);
    };
    fetchEventos();
  }, []);

  return (
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
            📍 Ubicación (colonia del área metropolitana de MTY):
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
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
            ✅ Frase clave de invitación:
            <input
              type="text"
              name="frase"
              value={form.frase}
              onChange={handleChange}
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
  );
}

export default Formulario;
