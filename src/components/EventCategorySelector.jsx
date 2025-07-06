import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EventCategorySelector() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: "personal",
      title: "👥 Evento Personal",
      description: "Eventos comunes para todos los usuarios",
      color: "#667eea",
      route: "/crear-evento",
      available: true,
    },
    {
      id: "ciudadania",
      title: "🤝 Ayuda Ciudadana",
      description: "Pedir ayuda para limpiar terrenos, plazas, etc.",
      color: "#4CAF50",
      route: "/crear-evento-ciudadania",
      available: true,
    },
    {
      id: "ongs",
      title: "🐾 Ayuda ONGs/Refugios",
      description: "Emergencias con animales, asistencia social",
      color: "#FF9800",
      route: "/crear-evento-ongs",
      available: true,
    },
    {
      id: "premium",
      title: "⭐ Eventos Premium",
      description: "Solo para empresas afiliadas y PyMEs",
      color: "#9C27B0",
      route: "/crear-evento-premium",
      available: false, // Bloqueado para usuarios normales
      isPremium: true,
    },
  ];

  const handleCategorySelect = (category) => {
    if (!category.available) {
      alert(
        "Esta categoría está disponible solo para empresas afiliadas. Contacta con nosotros para más información."
      );
      return;
    }
    navigate(category.route);
  };

  return (
    <div
      style={{
        padding: "80px 20px",
        minHeight: "calc(100vh - 160px)",
        background: "#593c8f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "2rem",
        }}
      >
        🎯 ¿Qué tipo de evento quieres crear?
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridTemplateRows: "repeat(2, 250px)",
          gap: "20px 20px",
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{
              background: category.available
                ? hoveredCategory === category.id
                  ? category.color
                  : "white"
                : "#f0f0f0",
              color: category.available
                ? hoveredCategory === category.id
                  ? "white"
                  : "#333"
                : "#999",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              cursor: category.available ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              transform:
                hoveredCategory === category.id && category.available
                  ? "translateY(-5px)"
                  : "translateY(0)",
              boxShadow:
                hoveredCategory === category.id && category.available
                  ? `0 10px 25px ${category.color}40`
                  : "0 4px 15px rgba(0,0,0,0.1)",
              border: !category.available
                ? "2px dashed #ccc"
                : "2px solid transparent",
              opacity: category.available ? 1 : 0.6,
              height: "250px",
              width: "100%",
              minWidth: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  lineHeight: "1.3",
                }}
              >
                {category.title}
              </h3>

              <p
                style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  lineHeight: "1.3",
                  paddingBottom: "10px",
                }}
              >
                {category.description}
              </p>
            </div>

            <div
              style={{
                marginTop: "auto",
                minHeight: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {category.isPremium && (
                <div
                  style={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    color: "#333",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "inline-block",
                    marginBottom: "5px",
                  }}
                >
                  💼 Solo Empresas
                </div>
              )}

              {!category.available && (
                <div
                  style={{
                    color: "#999",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                  }}
                >
                  🔒 Próximamente disponible
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          💡 <strong>Tip:</strong> Cada tipo de evento tiene su propio
          formulario especializado con campos específicos para ayudarte a crear
          el evento perfecto para tu necesidad.
        </p>
      </div>
    </div>
  );
}

export default EventCategorySelector;
