import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Solo loguear errores importantes, no spam
    if (
      error.message?.includes("Invalid LatLng") ||
      error.message?.includes("coordinates") ||
      error.message?.includes("marker")
    ) {
      console.debug("🗺️ Error de coordenadas capturado (silenciado)");
    } else {
      console.error("🚨 Error capturado por ErrorBoundary:", error);
      console.error("📋 Información del error:", errorInfo);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de error personalizada
      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <h2 style={{ color: "#856404", margin: "0 0 10px 0" }}>
            🗺️ Error en el Mapa
          </h2>
          <p style={{ color: "#856404", margin: "0 0 15px 0" }}>
            Hubo un problema al cargar el mapa. Esto puede deberse a:
          </p>
          <ul style={{ color: "#856404", marginLeft: "20px" }}>
            <li>Conexión a internet inestable</li>
            <li>Problemas con los tiles del mapa</li>
            <li>Coordenadas inválidas en los eventos</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            🔄 Recargar página
          </button>

          {import.meta.env.DEV && (
            <details style={{ marginTop: "20px" }}>
              <summary style={{ cursor: "pointer", color: "#856404" }}>
                Ver detalles técnicos (solo en desarrollo)
              </summary>
              <pre
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  overflow: "auto",
                  marginTop: "10px",
                  color: "#721c24",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
