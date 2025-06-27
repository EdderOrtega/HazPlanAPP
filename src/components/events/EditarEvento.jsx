import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function EditarEvento() {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    ubicacion: "",
    fecha: "",
    fecha_fin: "",
    cupo: "",
    lat: "",
    lon: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvento = async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("id", eventoId)
        .single();
      if (error || !data) {
        setError("No se pudo cargar el evento.");
        setLoading(false);
        return;
      }
      setForm(data);
      setLoading(false);
    };
    fetchEvento();
  }, [eventoId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("eventos")
      .update({
        nombre: form.nombre,
        descripcion: form.descripcion,
        tipo: form.tipo,
        ubicacion: form.ubicacion,
        fecha: form.fecha,
        fecha_fin: form.fecha_fin,
        cupo: form.cupo,
        lat: form.lat,
        lon: form.lon,
      })
      .eq("id", eventoId);
    if (error) {
      setError("Error al actualizar el evento.");
    } else {
      navigate("/perfil");
    }
  };

  if (loading) return <p>Cargando evento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Editar Evento</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del evento"
          required
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input
          type="text"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          placeholder="Tipo"
        />
        <input
          type="text"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación"
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha ? form.fecha.slice(0, 10) : ""}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin ? form.fecha_fin.slice(0, 10) : ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="cupo"
          value={form.cupo}
          onChange={handleChange}
          placeholder="Cupo"
        />
        {/* Si quieres permitir editar lat/lon, deja estos campos, si no, elimínalos */}
        <input
          type="text"
          name="lat"
          value={form.lat}
          onChange={handleChange}
          placeholder="Latitud"
        />
        <input
          type="text"
          name="lon"
          value={form.lon}
          onChange={handleChange}
          placeholder="Longitud"
        />
        <button type="submit">Guardar cambios</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default EditarEvento;
