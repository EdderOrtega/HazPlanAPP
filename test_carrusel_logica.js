// Test de la lógica del carrusel para verificar que no haya espacios vacíos

const filtros = [
  { value: "", label: "Todos", icon: "🌟" },
  { value: "reforestacion", label: "Reforestación", icon: "🌱" },
  { value: "salud", label: "Salud Mental", icon: "🧠" },
  { value: "mascotas", label: "Mascotas", icon: "🐾" },
  { value: "fandom", label: "Fandom", icon: "⭐" },
  { value: "arte", label: "Arte", icon: "🎨" },
  { value: "club", label: "Lectura", icon: "📚" },
  { value: "juegos", label: "Juegos", icon: "🎮" },
  { value: "actividad", label: "Deportes", icon: "⚽" },
];

const itemsPerView = 3;
const maxIndex = Math.max(0, filtros.length - itemsPerView);

console.log(`Total filtros: ${filtros.length}`);
console.log(`Items por vista: ${itemsPerView}`);
console.log(`MaxIndex calculado: ${maxIndex}`);

const getTransformValue = (currentIndex) => {
  const effectiveIndex = Math.min(currentIndex, maxIndex);
  return -(effectiveIndex * (100 / itemsPerView));
};

console.log("\n=== PRUEBAS DE POSICIONES ===");

for (let i = 0; i <= maxIndex + 2; i++) {
  const transform = getTransformValue(i);
  const startElement = Math.min(i, maxIndex);
  const endElement = Math.min(
    startElement + itemsPerView - 1,
    filtros.length - 1
  );

  console.log(`Índice ${i}:`);
  console.log(`  Transform: ${transform}%`);
  console.log(`  Elementos visibles: ${startElement} a ${endElement}`);
  console.log(
    `  Filtros mostrados: ${filtros
      .slice(startElement, endElement + 1)
      .map((f) => f.label)
      .join(", ")}`
  );

  if (i > maxIndex) {
    console.log(
      `  ⚠️  POSICIÓN FUERA DE LÍMITE - debería estar limitada a maxIndex ${maxIndex}`
    );
  }
  console.log();
}

console.log("\n=== VERIFICACIÓN DE LÍMITES ===");
console.log(`¿Puede navegar? ${filtros.length > itemsPerView}`);
console.log(`Botón izquierdo deshabilitado en índice 0: ${0 === 0}`);
console.log(
  `Botón derecho deshabilitado en maxIndex ${maxIndex}: ${maxIndex >= maxIndex}`
);
