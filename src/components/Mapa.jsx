import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import EventoCard from "./EventoCard";
import { supabase } from "../supabaseClient";

async function geocodeColonia(colonia) {
  const apiKey = "pk.75718cf70ebc64c3d8a6b00f1cb5d3ad";
  // Normaliza el texto
  const query = colonia.trim() + ", Monterrey, Nuevo Leon, Mexico";
  const response = await fetch(
    `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&format=json`
  );
  const data = await response.json();
  console.log("Resultado geocodificación:", data); // <-- Para depurar
  if (data && data[0]) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

function Mapa() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Cargar eventos desde Supabase al iniciar
  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase.from("eventos").select("*");
      if (!error) setEventos(data || []);
    };
    fetchEventos();
  }, []);

  const handleAddEvento = async (form) => {
    const coords = await geocodeColonia(form.ubicacion);
    if (!coords) {
      alert("Colonia no encontrada.");
      return;
    }
    const imagen = `https://placehold.co/200x120/800080/FFF?text=${encodeURIComponent(
      form.nombreEvento
    )}`;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes iniciar sesión para crear un evento.");
      return;
    }

    // LOG para depuración
    console.log("Insertando evento:", {
      nombre: form.nombreEvento,
      descripcion: form.frase,
      tipo: form.tipo,
      ubicacion: form.ubicacion,
      lat: coords[0],
      lon: coords[1],
      imagen,
      fecha: form.fecha,
      fecha_fin: form.horaFin,
      cupo: form.cupo,
      user_id: user.id,
    });

    const { data, error } = await supabase
      .from("eventos")
      .insert([
        {
          nombre: form.nombreEvento,
          descripcion: form.frase,
          tipo: form.tipo,
          ubicacion: form.ubicacion,
          lat: coords[0],
          lon: coords[1],
          imagen,
          fecha: form.fecha, // <--- ahora sí existe
          fecha_fin: form.fecha_fin, // <--- ahora sí existe
          cupo: form.cupo,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error al guardar el evento:", error);
      alert("Error al guardar el evento: " + error.message);
      return;
    }

    // Agregar el evento recién creado al estado local
    setEventos([...eventos, data]);
  };

  // Solo muestra eventos activos
  const now = new Date();
  const eventosActivos = eventos.filter(
    (evento) => new Date(evento.fecha_fin) > now
  );

  const eventosFiltrados = (
    filtro ? eventosActivos.filter((e) => e.tipo === filtro) : eventosActivos
  ).filter((e) => e.lat !== null && e.lon !== null);

  return (
    <div>
      <select
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="">Todas las categorías</option>
        <option value="reforestacion">Reforestación</option>
        <option value="salud">Salud mental</option>
        <option value="mascotas">Mascotas</option>
        <option value="fandom">Fandom</option>
        <option value="arte">Arte</option>
        <option value="club">Club de lectura</option>
        <option value="juegos">Juegos</option>
        <option value="actividad">Actividad física</option>
      </select>
      <h3>Eventos activos</h3>
      <MapContainer
        center={[25.6866, -100.3161]}
        zoom={12}
        style={{ height: "80vh", width: "400px", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventosFiltrados.map((evento, idx) => (
          <Marker key={evento.id || idx} position={[evento.lat, evento.lon]}>
            <Popup>
              <EventoCard evento={evento} user={user} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Mapa;
