import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Loader from "../ui/Loader";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiEdit3,
  FiSave,
  FiArrowLeft,
  FiAlertCircle,
  FiMap,
  FiType,
  FiAlignLeft,
} from "react-icons/fi";

// Estilo base para los inputs
const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  border: "1px solid #bdbdbd",
  borderRadius: 8,
  fontSize: 15,
  outline: "none",
  background: "#f8f8fa",
  color: "#333",
  fontWeight: 500,
  transition: "border 0.2s",
};

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
  const [success, setSuccess] = useState(false);

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
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
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
    setLoading(false);
    if (error) {
      setError("Error al actualizar el evento.");
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/perfil"), 1200);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 16,
        }}
      >
        <div className="loader" style={{ marginBottom: 16 }} />

        <Loader />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 16,
        }}
      >
        <FiAlertCircle size={48} color="#e65100" />
        <span style={{ color: "#e65100", fontWeight: 500 }}>{error}</span>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#b42acb",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          <FiArrowLeft /> Volver
        </button>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        background: "white",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(180,42,203,0.08)",
        padding: "32px 24px",
        position: "relative",
        minHeight: 480,
        marginTop: 80,
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        title="Volver"
      >
        <FiArrowLeft size={22} color="#b42acb" />
      </button>
      <h2
        style={{
          textAlign: "center",
          color: "#b42acb",
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: 0.5,
        }}
      >
        Editar Evento
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginTop: 18,
          marginBottom: 46,
        }}
        autoComplete="off"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiType color="#b42acb" />
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del evento"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiAlignLeft color="#b42acb" />
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            style={{ ...inputStyle, minHeight: 60 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiEdit3 color="#b42acb" />
          <input
            type="text"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            placeholder="Tipo"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiMapPin color="#b42acb" />
          <input
            type="text"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiCalendar color="#b42acb" />
          <input
            type="date"
            name="fecha"
            value={form.fecha ? form.fecha.slice(0, 10) : ""}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiCalendar color="#b42acb" />
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin ? form.fecha_fin.slice(0, 10) : ""}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiUsers color="#b42acb" />
          <input
            type="number"
            name="cupo"
            value={form.cupo}
            onChange={handleChange}
            placeholder="Cupo"
            style={inputStyle}
            min={1}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiMap color="#b42acb" />
          <input
            type="text"
            name="lat"
            value={form.lat}
            onChange={handleChange}
            placeholder="Latitud"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiMap color="#b42acb" />
          <input
            type="text"
            name="lon"
            value={form.lon}
            onChange={handleChange}
            placeholder="Longitud"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          style={{
            background: "#b42acb",
            color: "#fff",
            border: "none",
            padding: "12px 0",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 17,
            width: "100%",
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(180,42,203,0.13)",
          }}
        >
          <FiSave size={20} /> Guardar cambios
        </button>
        {success && (
          <span
            style={{
              color: "#2e7d32",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "center",
            }}
          >
            <FiSave /> Cambios guardados
          </span>
        )}
      </form>
    </div>
  );
}

export default EditarEvento;
