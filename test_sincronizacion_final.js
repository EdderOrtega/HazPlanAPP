import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zxqcxdvdnqhgxigqmofr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cWN4ZHZkbnFoZ3hpZ3Ftb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjU3MzEsImV4cCI6MjA0ODMwMTczMX0.RXPXgCPiYvQoXlQqSAWBvyX5tQeHfKJqiUK5RcSDHUo";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealtimeSync() {
  console.log("🧪 Prueba de sincronización Realtime...");

  // Canal global compartido (como en la corrección)
  const channelName = `eventos-tiempo-real-global`;
  console.log(`📡 Creando canal compartido: ${channelName}`);

  const channel = supabase
    .channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: "test-user" },
      },
    })
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "eventos_tiempo_real",
      },
      (payload) => {
        console.log("📡 EVENTO RECIBIDO:", {
          eventType: payload.eventType,
          tipo: payload.new?.tipo || payload.old?.tipo,
          usuario_id: payload.new?.usuario_id || payload.old?.usuario_id,
          datos: payload.new?.datos || payload.old?.datos,
          timestamp: new Date().toISOString(),
        });
      }
    )
    .subscribe((status) => {
      console.log(`📡 Canal ${channelName} - Estado:`, status);
    });

  // Esperar un poco para la suscripción
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simular inserción de evento sorpresa
  console.log("🎉 Insertando evento sorpresa de prueba...");

  const eventData = {
    tipo: "evento_sorpresa_iniciado",
    usuario_id: "test-user-123",
    activo: true,
    datos: {
      ruta: "ruta1",
      iniciado_por: "test-user-123",
      timestamp: new Date().toISOString(),
    },
  };

  const { data, error } = await supabase
    .from("eventos_tiempo_real")
    .insert(eventData)
    .select();

  if (error) {
    console.error("❌ Error al insertar:", error);
  } else {
    console.log("✅ Evento insertado:", data);
  }

  // Esperar a recibir el evento
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Limpiar evento
  console.log("🧹 Limpiando evento...");
  const { error: deleteError } = await supabase
    .from("eventos_tiempo_real")
    .delete()
    .eq("tipo", "evento_sorpresa_iniciado");

  if (deleteError) {
    console.error("❌ Error al limpiar:", deleteError);
  } else {
    console.log("✅ Evento limpiado");
  }

  // Esperar evento DELETE
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Cerrar canal
  supabase.removeChannel(channel);
  console.log("✅ Prueba completada");
}

testRealtimeSync().catch(console.error);
