/**
 * Script para verificar y limpiar el estado de eventos en tiempo real
 * Ejecutar con: node verificar_realtime_simple.js
 */

import { createClient } from "@supabase/supabase-js";

// ⚠️ REEMPLAZA CON TUS CREDENCIALES REALES DE SUPABASE
const supabaseUrl = "TU_URL_AQUI";
const supabaseKey = "TU_KEY_AQUI";

if (supabaseUrl === "TU_URL_AQUI" || supabaseKey === "TU_KEY_AQUI") {
  console.log(
    "❌ Por favor configura las credenciales de Supabase en este archivo"
  );
  console.log("Busca en src/supabaseClient.js las credenciales correctas");
  // process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🔍 Verificando estado de eventos en tiempo real...\n");

const verificarEventos = async () => {
  try {
    // Obtener todos los eventos en tiempo real
    const { data: eventos, error } = await supabase
      .from("eventos_tiempo_real")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error al obtener eventos:", error);
      return;
    }

    console.log(`📊 Total de eventos encontrados: ${eventos.length}\n`);

    if (eventos.length === 0) {
      console.log("✅ No hay eventos activos en la tabla eventos_tiempo_real");
      return;
    }

    // Mostrar eventos
    eventos.forEach((evento, index) => {
      console.log(`📝 Evento ${index + 1}:`);
      console.log(`   - ID: ${evento.id}`);
      console.log(`   - Tipo: ${evento.tipo}`);
      console.log(`   - Usuario ID: ${evento.usuario_id}`);
      console.log(`   - Activo: ${evento.activo}`);
      console.log(`   - Datos: ${JSON.stringify(evento.datos)}`);
      console.log(`   - Creado: ${evento.created_at}`);
      console.log("");
    });

    // Filtrar eventos de tipo evento_sorpresa_iniciado
    const eventosActivos = eventos.filter(
      (e) => e.tipo === "evento_sorpresa_iniciado"
    );

    if (eventosActivos.length > 0) {
      console.log(`🎉 Eventos sorpresa activos: ${eventosActivos.length}`);
      eventosActivos.forEach((evento, index) => {
        console.log(
          `   ${index + 1}. Ruta: ${evento.datos?.ruta}, Usuario: ${
            evento.usuario_id
          }`
        );
      });
    } else {
      console.log("😴 No hay eventos sorpresa activos");
    }
  } catch (err) {
    console.error("❌ Error general:", err);
  }
};

const limpiarEventos = async () => {
  try {
    console.log("\n🧹 Limpiando todos los eventos...");

    const { data, error } = await supabase
      .from("eventos_tiempo_real")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select();

    if (error) {
      console.error("❌ Error al limpiar eventos:", error);
    } else {
      console.log(`✅ ${data?.length || 0} eventos eliminados`);
    }
  } catch (err) {
    console.error("❌ Error al limpiar:", err);
  }
};

const crearEventoPrueba = async () => {
  try {
    console.log("\n🎭 Creando evento de prueba...");

    const eventData = {
      tipo: "evento_sorpresa_iniciado",
      usuario_id: "test-user-12345",
      activo: true,
      datos: {
        ruta: "ruta1",
        iniciado_por: "test-user-12345",
        timestamp: new Date().toISOString(),
        es_prueba: true,
      },
    };

    const { data, error } = await supabase
      .from("eventos_tiempo_real")
      .insert(eventData)
      .select();

    if (error) {
      console.error("❌ Error al crear evento de prueba:", error);
    } else {
      console.log("✅ Evento de prueba creado:", data[0]);
    }
  } catch (err) {
    console.error("❌ Error al crear evento de prueba:", err);
  }
};

// Menú de opciones
const mostrarMenu = () => {
  console.log("\n=== OPCIONES ===");
  console.log("1. Verificar eventos actuales");
  console.log("2. Limpiar todos los eventos");
  console.log("3. Crear evento de prueba");
  console.log("4. Salir");
  console.log("================\n");
};

// Función principal
const main = async () => {
  await verificarEventos();

  // Si quieres limpiar automáticamente, descomenta la siguiente línea:
  // await limpiarEventos();

  // Si quieres crear un evento de prueba, descomenta la siguiente línea:
  // await crearEventoPrueba();

  console.log("\n✅ Verificación completada");
  console.log(
    "💡 Para usar este script interactivamente, modifica la función main()"
  );
};

// Ejecutar
main().catch(console.error);
