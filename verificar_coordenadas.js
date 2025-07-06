// Script simple para verificar coordenadas de eventos
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogajfqpqkduvgpiqwhcx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWpmcXBxa2R1dmdwaXF3aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODgzMzYsImV4cCI6MjA2NDc2NDMzNn0.RiNoXPXuh6Os5Pc0YNXOhjLkS4sLFiyu0dKnwOv2E-Q";

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarCoordenadas() {
  try {
    console.log("🔍 Verificando eventos y coordenadas...");

    const { data: eventos, error } = await supabase.from("eventos").select("*");

    if (error) {
      console.error("❌ Error:", error);
      return;
    }

    console.log(`📊 Total eventos: ${eventos.length}`);

    eventos.forEach((evento, i) => {
      console.log(`\n--- Evento ${i + 1} ---`);
      console.log(`ID: ${evento.id}`);
      console.log(`Nombre: ${evento.nombre}`);
      console.log(`Tipo: ${evento.tipo}`);
      console.log(`Ubicación: ${evento.ubicacion}`);
      console.log(`Lat: ${evento.lat} (${typeof evento.lat})`);
      console.log(`Lon: ${evento.lon} (${typeof evento.lon})`);
      console.log(`Fecha: ${evento.fecha}`);
      console.log(`Fecha fin: ${evento.fecha_fin}`);

      // Validar coordenadas
      const latValid =
        evento.lat !== null && evento.lat !== "" && !isNaN(Number(evento.lat));
      const lonValid =
        evento.lon !== null && evento.lon !== "" && !isNaN(Number(evento.lon));

      console.log(`✅ Coordenadas válidas: ${latValid && lonValid}`);

      if (latValid && lonValid) {
        console.log(
          `📍 Coordenadas: [${Number(evento.lat)}, ${Number(evento.lon)}]`
        );
      }
    });

    // Eventos con coordenadas válidas
    const eventosValidos = eventos.filter((e) => {
      const latValid = e.lat !== null && e.lat !== "" && !isNaN(Number(e.lat));
      const lonValid = e.lon !== null && e.lon !== "" && !isNaN(Number(e.lon));
      return latValid && lonValid;
    });

    console.log(
      `\n🎯 Eventos con coordenadas válidas: ${eventosValidos.length}`
    );
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

verificarCoordenadas();
