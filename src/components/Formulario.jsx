import { useState } from "react";

function Formulario({ onSubmit }) {
  const [form, setForm] = useState({
    usuario: "",
    nombreEvento: "",
    ubicacion: "",
    fechaHora: "",
    tipo: "",
    cupo: "",
    frase: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form); // Envía los datos al padre (Mapa)
    setForm({
      usuario: "",
      nombreEvento: "",
      ubicacion: "",
      fechaHora: "",
      tipo: "",
      cupo: "",
      frase: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre del usuario que lo creó:
        <input
          type="text"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          required
        />
      </label>
      <br />
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
      <br />
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
      <br />
      <label>
        📅 Fecha y hora:
        <input
          type="datetime-local"
          name="fechaHora"
          value={form.fechaHora}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        🙋‍♂️ Tipo de plan o actividad:
        <select name="tipo" value={form.tipo} onChange={handleChange} required>
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
      <br />
      <label>
        👥 Cantidad de personas o cupo:
        <input
          type="number"
          name="cupo"
          value={form.cupo}
          onChange={handleChange}
          min={1}
          required
        />
      </label>
      <br />
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
      <br />
      <button  id="btnEnviar" type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;
