import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase (usar las mismas variables que en la app)
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🔍 Iniciando diagnóstico de sincronización Realtime...");

// Simular múltiples usuarios conectados
const crearClienteListener = (usuarioId) => {
  console.log(`👤 Conectando usuario ${usuarioId}...`);

  const channel = supabase
    .channel(`eventos-tiempo-real-test-${usuarioId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: usuarioId },
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
        console.log(`📡 Usuario ${usuarioId} recibió evento:`, {
          tipo: payload.eventType,
          datos: payload.new || payload.old,
          timestamp: new Date().toISOString(),
        });
      }
    )
    .subscribe((status) => {
      console.log(`📡 Usuario ${usuarioId} - Estado canal:`, status);
    });

  return channel;
};

// Crear 3 usuarios de prueba
const usuarios = ["usuario1", "usuario2", "usuario3"];
const canales = usuarios.map(crearClienteListener);

// Función para simular evento sorpresa
const simularEventoSorpresa = async () => {
  console.log("🎉 Simulando evento sorpresa...");

  try {
    // Primero eliminar eventos anteriores
    await supabase
      .from("eventos_tiempo_real")
      .delete()
      .eq("tipo", "evento_sorpresa_iniciado");

    console.log("🧹 Eventos anteriores eliminados");

    // Insertar nuevo evento
    const { data, error } = await supabase.from("eventos_tiempo_real").insert({
      tipo: "evento_sorpresa_iniciado",
      usuario_id: "test-user",
      datos: {
        ruta: "ruta1",
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("❌ Error al insertar evento:", error);
    } else {
      console.log("✅ Evento insertado correctamente:", data);
    }
  } catch (err) {
    console.error("❌ Error general:", err);
  }
};

// Función para detener evento
const detenerEvento = async () => {
  console.log("🛑 Deteniendo evento sorpresa...");

  try {
    const { error } = await supabase
      .from("eventos_tiempo_real")
      .delete()
      .eq("tipo", "evento_sorpresa_iniciado");

    if (error) {
      console.error("❌ Error al detener evento:", error);
    } else {
      console.log("✅ Evento detenido correctamente");
    }
  } catch (err) {
    console.error("❌ Error general:", err);
  }
};

// Verificar estado actual
const verificarEstado = async () => {
  console.log("🔍 Verificando estado actual...");

  const { data, error } = await supabase
    .from("eventos_tiempo_real")
    .select("*")
    .eq("tipo", "evento_sorpresa_iniciado");

  if (error) {
    console.error("❌ Error al verificar estado:", error);
  } else {
    console.log("📊 Estado actual:", data);
  }
};

// Programa de pruebas
const ejecutarPruebas = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar conexiones

  console.log("\n=== INICIANDO PRUEBAS ===");

  // 1. Verificar estado inicial
  await verificarEstado();

  // 2. Simular evento sorpresa
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await simularEventoSorpresa();

  // 3. Esperar y verificar
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await verificarEstado();

  // 4. Detener evento
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await detenerEvento();

  // 5. Verificar estado final
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await verificarEstado();

  console.log("\n=== PRUEBAS COMPLETADAS ===");
};

// Ejecutar después de un momento
setTimeout(ejecutarPruebas, 3000);

// Limpiar después de 30 segundos
setTimeout(() => {
  console.log("🧹 Limpiando canales...");
  canales.forEach((canal) => supabase.removeChannel(canal));
  process.exit(0);
}, 30000);
