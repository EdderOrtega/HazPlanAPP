// Script para verificar eventos de tiempo real desde la consola del navegador
// Ejecutar en la consola del navegador después de cargar la app

console.log("🔍 INICIANDO DIAGNÓSTICO DE REALTIME...");

// Listener simple para eventos de tiempo real
const channel = window.supabase
  .channel("eventos-tiempo-real-global")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "eventos_tiempo_real",
    },
    (payload) => {
      console.log("🔥 EVENTO DETECTADO EN CANAL GLOBAL:", {
        eventType: payload.eventType,
        tipo: payload.new?.tipo || payload.old?.tipo,
        usuario_id: payload.new?.usuario_id || payload.old?.usuario_id,
        activo: payload.new?.activo || payload.old?.activo,
        datos: payload.new?.datos || payload.old?.datos,
        timestamp: new Date().toISOString(),
      });
    }
  )
  .subscribe((status) => {
    console.log("📡 Estado del canal de diagnóstico:", status);
    if (status === "SUBSCRIBED") {
      console.log("✅ Canal de diagnóstico conectado correctamente");
    }
  });

// Función para insertar evento de prueba manual
window.insertTestEvent = async () => {
  console.log("🧪 Insertando evento de prueba...");

  const eventData = {
    tipo: "evento_sorpresa_iniciado",
    usuario_id: "diagnostico-test",
    activo: true,
    datos: {
      ruta: "ruta1",
      iniciado_por: "diagnostico-test",
      timestamp: new Date().toISOString(),
    },
  };

  const { data, error } = await window.supabase
    .from("eventos_tiempo_real")
    .insert(eventData)
    .select();

  if (error) {
    console.error("❌ Error al insertar evento de prueba:", error);
  } else {
    console.log("✅ Evento de prueba insertado:", data);
  }
};

// Función para limpiar eventos
window.cleanEvents = async () => {
  console.log("🧹 Limpiando eventos...");

  const { data, error } = await window.supabase
    .from("eventos_tiempo_real")
    .delete()
    .eq("tipo", "evento_sorpresa_iniciado")
    .select();

  if (error) {
    console.error("❌ Error al limpiar eventos:", error);
  } else {
    console.log("✅ Eventos limpiados:", data);
  }
};

console.log("✅ Diagnóstico configurado. Funciones disponibles:");
console.log("- insertTestEvent() - Insertar evento de prueba");
console.log("- cleanEvents() - Limpiar eventos");
console.log("- El listener está activo y mostrará eventos en tiempo real");
