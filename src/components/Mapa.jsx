import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Formulario from "./Formulario";
import EventoCard from "./EventoCard";

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

  const handleAddEvento = async (form) => {
    const coords = await geocodeColonia(form.ubicacion);
    if (!coords) {
      alert("Colonia no encontrada.");
      return;
    }
    const imagen = `https://placehold.co/200x120/800080/FFF?text=${encodeURIComponent(
      form.nombreEvento
    )}`;
    setEventos([
      ...eventos,
      {
        ...form,
        nombre: form.nombreEvento,
        position: coords,
        imagen,
      },
    ]);
  };

  const eventosFiltrados = filtro
    ? eventos.filter((e) => e.tipo === filtro)
    : eventos;

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
      <h3>Agrega un evento y aparecerá en el mapa</h3>
      <Formulario onSubmit={handleAddEvento} />
      <MapContainer
        center={[25.6866, -100.3161]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventosFiltrados.map((evento, idx) => (
          <Marker key={idx} position={evento.position}>
            <Popup>
              <EventoCard evento={evento} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Mapa;
