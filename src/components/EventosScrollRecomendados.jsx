import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function EventosScrollRecomendados({ intereses }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      let query = supabase.from("eventos").select("*");
      if (intereses && intereses.length > 0) {
        const orFilters = intereses
          .map((i) => `categoria.ilike.%${i}%`)
          .join(",");
        query = query.or(orFilters);
      }
      const { data, error } = await query;
      if (!error) setEventos(data || []);
      setLoading(false);
    };
    fetchEventos();
  }, [intereses]);

  if (loading) return <div style={{ padding: 24 }}>Cargando eventos...</div>;
  if (!eventos.length)
    return <div style={{ padding: 24 }}>No hay eventos recomendados aún.</div>;

  return (
    <section style={{ margin: "40px 0" }}>
      <h2 style={{ color: "#593c8f", marginBottom: 16 }}>
        Eventos recomendados para ti
      </h2>
      <div
        style={{
          maxHeight: 900,
          minHeight: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          paddingRight: 8,
        }}
      >
        {eventos.map((evento) => (
          <div
            key={evento.id}
            style={{
              width: "100%",
              minHeight: 160,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px #593c8f22",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#593c8f",
                fontSize: 18,
                marginBottom: 2,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {evento.titulo || evento.nombre || "Evento"}
            </div>
            <div
              style={{
                color: "#7b5fb0",
                fontSize: 14,
                marginBottom: 2,
                whiteSpace: "normal",
              }}
            >
              {evento.categoria}
            </div>
            <div
              style={{
                color: "#444",
                fontSize: 13,
                marginBottom: 4,
                whiteSpace: "normal",
              }}
            >
              {evento.descripcion}
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                fontSize: 13,
                color: "#888",
                flexWrap: "wrap",
              }}
            >
              <span>📅 {evento.fecha || "Próximamente"}</span>
              <span>⏰ {evento.hora || ""}</span>
              <span>📍 {evento.ubicacion || ""}</span>
            </div>
            <button
              style={{
                background: "linear-gradient(90deg,#593c8f,#a18be6)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 18px",
                fontWeight: 700,
                fontSize: 14,
                marginTop: 6,
                cursor: "pointer",
                alignSelf: "flex-end",
                boxShadow: "0 1px 6px #593c8f22",
              }}
              onClick={() => (window.location.href = `/evento/${evento.id}`)}
            >
              Ver evento
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventosScrollRecomendados;
