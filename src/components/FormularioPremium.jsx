import { useState } from "react";
import { supabase } from "../supabaseClient";
import CalendarioEvento from "../components/events/CalendarioEvento";
import ModalEventoCreadoExistosamente from "../components/ui/ModalEventoCreadoExistosamente";

function FormularioPremium() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombreEvento: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    tipo: "evento_premium",
    cupo: "",
    descripcion: "",
    tipoEvento: "",
    empresaOrganizadora: "",
    contactoEmpresa: "",
    telefonoContacto: "",
    presupuesto: "",
    serviciosRequeridos: "",
    publicoObjetivo: "",
    requisitosParticipantes: "",
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
      tipoEvento,
      empresaOrganizadora,
      contactoEmpresa,
      telefonoContacto,
      presupuesto,
      serviciosRequeridos,
      publicoObjetivo,
      requisitosParticipantes,
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

    // Crear descripción extendida para eventos premium
    const descripcionCompleta = `${descripcion}

⭐ DETALLES DEL EVENTO PREMIUM:
🏢 Empresa organizadora: ${empresaOrganizadora}
🎯 Tipo de evento: ${tipoEvento}
👤 Contacto empresa: ${contactoEmpresa}
📞 Teléfono de contacto: ${telefonoContacto}
💰 Presupuesto estimado: ${presupuesto || "No especificado"}
🛠️ Servicios requeridos: ${serviciosRequeridos || "No especificado"}
👥 Público objetivo: ${publicoObjetivo || "General"}
📋 Requisitos participantes: ${requisitosParticipantes || "Ninguno"}`;

    console.log("📋 Datos del evento premium a crear:", {
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
      console.log("✅ Evento premium creado exitosamente:", eventData);

      // Resetear formulario
      setForm({
        nombreEvento: "",
        ubicacion: "",
        fecha: "",
        fecha_fin: "",
        tipo: "evento_premium",
        cupo: "",
        descripcion: "",
        tipoEvento: "",
        empresaOrganizadora: "",
        contactoEmpresa: "",
        telefonoContacto: "",
        presupuesto: "",
        serviciosRequeridos: "",
        publicoObjetivo: "",
        requisitosParticipantes: "",
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
        background: "linear-gradient(135deg, #9C27B0, #673AB7)",
        borderRadius: "10px",
        color: "white",
        boxShadow: "0 8px 32px rgba(156, 39, 176, 0.3)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        ⭐ Crear Evento Premium
      </h2>
      <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
        Eventos exclusivos para empresas afiliadas y PyMEs con servicios
        especializados
      </p>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              🏷️ Nombre del evento premium:
              <input
                type="text"
                name="nombreEvento"
                value={form.nombreEvento}
                onChange={handleChange}
                placeholder="Ej: Networking Empresarial 2024 | Workshop de Innovación"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              🏢 Empresa organizadora:
              <input
                type="text"
                name="empresaOrganizadora"
                value={form.empresaOrganizadora}
                onChange={handleChange}
                placeholder="Ej: TechCorp S.A. de C.V."
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>

            <button
              type="button"
              onClick={next}
              disabled={!form.nombreEvento || !form.empresaOrganizadora}
              style={{
                backgroundColor: "#7B1FA2",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor:
                  form.nombreEvento && form.empresaOrganizadora
                    ? "pointer"
                    : "not-allowed",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={{ display: "block", marginBottom: "15px" }}>
              📍 Ubicación del evento:
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Centro de Convenciones Cintermex | Hotel Gran Plaza | Av. Garza Sada 1234"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
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
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor:
                    !form.ubicacion || validandoUbicacion
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
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
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor:
                    !form.fecha || !form.fecha_fin ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
              🎯 Tipo de evento premium:
              <select
                name="tipoEvento"
                value={form.tipoEvento}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecciona el tipo de evento</option>
                <option value="networking">🤝 Networking empresarial</option>
                <option value="conferencia">🎤 Conferencia/Seminario</option>
                <option value="workshop">
                  🛠️ Workshop/Taller especializado
                </option>
                <option value="capacitacion">
                  📚 Capacitación corporativa
                </option>
                <option value="lanzamiento">🚀 Lanzamiento de producto</option>
                <option value="team_building">👥 Team building</option>
                <option value="feria_empleo">💼 Feria de empleo</option>
                <option value="expo_comercial">🏪 Exposición comercial</option>
                <option value="gala_empresarial">✨ Gala empresarial</option>
                <option value="otro">⭐ Otro evento premium</option>
              </select>
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              👥 Capacidad del evento:
              <input
                type="number"
                name="cupo"
                value={form.cupo}
                onChange={handleChange}
                min={10}
                max={1000}
                placeholder="¿Cuántas personas pueden asistir?"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!form.tipoEvento || !form.cupo}
                style={{
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor:
                    !form.tipoEvento || !form.cupo ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
              👤 Contacto de la empresa:
              <input
                type="text"
                name="contactoEmpresa"
                value={form.contactoEmpresa}
                onChange={handleChange}
                placeholder="Ej: Ana López - Gerente de Eventos"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              📞 Teléfono de contacto:
              <input
                type="tel"
                name="telefonoContacto"
                value={form.telefonoContacto}
                onChange={handleChange}
                placeholder="Ej: 81-1234-5678"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              💰 Presupuesto estimado (opcional):
              <select
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecciona rango de presupuesto</option>
                <option value="10k-25k">$10,000 - $25,000 MXN</option>
                <option value="25k-50k">$25,000 - $50,000 MXN</option>
                <option value="50k-100k">$50,000 - $100,000 MXN</option>
                <option value="100k-250k">$100,000 - $250,000 MXN</option>
                <option value="250k+">$250,000+ MXN</option>
              </select>
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!form.contactoEmpresa || !form.telefonoContacto}
                style={{
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor:
                    !form.contactoEmpresa || !form.telefonoContacto
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
              🛠️ Servicios requeridos (opcional):
              <textarea
                name="serviciosRequeridos"
                value={form.serviciosRequeridos}
                onChange={handleChange}
                placeholder="Ej: Catering, equipo audiovisual, decoración, fotografía, seguridad, etc."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                  resize: "vertical",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              👥 Público objetivo:
              <select
                name="publicoObjetivo"
                value={form.publicoObjetivo}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                <option value="">Selecciona el público objetivo</option>
                <option value="ejecutivos">👔 Ejecutivos y directivos</option>
                <option value="profesionales">
                  💼 Profesionales independientes
                </option>
                <option value="emprendedores">🚀 Emprendedores</option>
                <option value="estudiantes">
                  🎓 Estudiantes universitarios
                </option>
                <option value="pymes">🏪 PyMEs</option>
                <option value="corporativo">🏢 Sector corporativo</option>
                <option value="tecnologia">💻 Sector tecnología</option>
                <option value="general">🌟 Público general</option>
              </select>
            </label>

            <label style={{ display: "block", marginBottom: "15px" }}>
              📋 Requisitos para participantes (opcional):
              <textarea
                name="requisitosParticipantes"
                value={form.requisitosParticipantes}
                onChange={handleChange}
                placeholder="Ej: Registro previo, código de vestimenta, experiencia mínima, etc."
                rows={2}
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                  resize: "vertical",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                style={{
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
              📝 Descripción completa del evento:
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente el evento, objetivos, agenda, beneficios para los participantes, etc."
                required
                rows={6}
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                  resize: "vertical",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  backgroundColor: "#BA68C8",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={!form.descripcion}
                style={{
                  backgroundColor: "#7B1FA2",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: !form.descripcion ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                ⭐ Crear Evento Premium
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            style={{
              color: "#ffcdd2",
              backgroundColor: "#7B1FA2",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "15px",
              border: "2px solid #E1BEE7",
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

export default FormularioPremium;
