function Registro() {
  return (
    <div>
      <h2>Registro</h2>
      {/* Aquí puedes agregar botones para Google, Facebook y un formulario para correo, nombre, apellido, edad */}
      <button>Registrarse con Google</button>
      <button>Registrarse con Facebook</button>
      <form>
        <input type="text" placeholder="Correo" required />
        <input type="text" placeholder="Nombre" required />
        <input type="text" placeholder="Apellido" required />
        <input type="number" placeholder="Edad" required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
