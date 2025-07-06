// Script para verificar eventos de Monterrey
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogajfqpqkduvgpiqwhcx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWpmcXBxa2R1dmdwaXF3aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODgzMzYsImV4cCI6MjA2NDc2NDMzNn0.RiNoXPXuh6Os5Pc0YNXOhjLkS4sLFiyu0dKnwOv2E-Q";

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarEventosMonterrey() {
  try {
    console.log("🔍 Verificando eventos de Monterrey...");

    const { data: eventos, error } = await supabase.from("eventos").select("*");

    if (error) {
      console.error("❌ Error:", error);
      return;
    }

    console.log(`📊 Total eventos: ${eventos.length}`);

    // Área aproximada de Monterrey y zona metropolitana
    const monterreyArea = {
      latMin: 25.3, // Sur de Monterrey
      latMax: 26.0, // Norte de Monterrey
      lonMin: -100.7, // Oeste de Monterrey
      lonMax: -99.8, // Este de Monterrey
    };

    const eventosMonterrey = eventos.filter((e) => {
      const latValid = e.lat !== null && e.lat !== "" && !isNaN(Number(e.lat));
      const lonValid = e.lon !== null && e.lon !== "" && !isNaN(Number(e.lon));

      if (!latValid || !lonValid) return false;

      const latNum = Number(e.lat);
      const lonNum = Number(e.lon);

      const isInMonterrey =
        latNum >= monterreyArea.latMin &&
        latNum <= monterreyArea.latMax &&
        lonNum >= monterreyArea.lonMin &&
        lonNum <= monterreyArea.lonMax;

      return isInMonterrey;
    });

    console.log(`\n🎯 Eventos de Monterrey: ${eventosMonterrey.length}`);
    console.log("\n--- Eventos que aparecerán en el mapa ---");

    eventosMonterrey.forEach((evento, i) => {
      console.log(`${i + 1}. ${evento.nombre} (${evento.tipo})`);
      console.log(`   📍 [${Number(evento.lat)}, ${Number(evento.lon)}]`);
      console.log(`   📍 ${evento.ubicacion}`);
    });
  } catch (error) {
    console.error("💥 Error:", error);
  }
}

verificarEventosMonterrey();
