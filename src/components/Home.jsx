import capibaraMascota from "../assets/capibaraMascota.png";
function Home() {
  return (
    <div>
      <img
        src={capibaraMascota}
        alt="Logo de HazPlan"
        style={{ width: "100%", height: "auto" }}
      />
      <h1>HazPlan</h1>
      <p>
        Bienvenido a la app para crear y compartir eventos comunitarios en
        Monterrey.
      </p>
      <a href="/registro">Registro</a> | <a href="/login">Login</a>
      <h3>¿Qué puedes hacer?</h3>
      <ul>
        <li>Crear y buscar eventos por categoría</li>
        <li>Unirte a eventos y chatear con otros miembros</li>
        <li>Personalizar tu perfil</li>
      </ul>
    </div>
  );
}

export default Home;
