-- 🧹 Script para limpiar eventos problemáticos
-- Ejecutar en SQL Editor de Supabase

-- 1. Eliminar eventos sin coordenadas
DELETE FROM eventos 
WHERE lat IS NULL 
   OR lon IS NULL 
   OR lat = '' 
   OR lon = ''
   OR lat::text = 'null'
   OR lon::text = 'null';

-- 2. Eliminar eventos con coordenadas inválidas (no numéricas)
DELETE FROM eventos 
WHERE NOT (lat ~ '^[-+]?[0-9]*\.?[0-9]+$' AND lon ~ '^[-+]?[0-9]*\.?[0-9]+$');

-- 3. Eliminar eventos sin fecha_fin (datos incompletos)
DELETE FROM eventos 
WHERE fecha_fin IS NULL 
   OR fecha_fin = '';

-- 4. Eliminar eventos muy antiguos (más de 30 días)
DELETE FROM eventos 
WHERE fecha_fin < NOW() - INTERVAL '30 days';

-- 5. Limpiar tabla de eventos en tiempo real (todo)
DELETE FROM eventos_tiempo_real;

-- 6. Verificar resultado
SELECT COUNT(*) as total_eventos FROM eventos;
SELECT COUNT(*) as eventos_validos 
FROM eventos 
WHERE lat IS NOT NULL 
  AND lon IS NOT NULL 
  AND lat::numeric BETWEEN -90 AND 90 
  AND lon::numeric BETWEEN -180 AND 180
  AND fecha_fin > NOW();

-- 7. Mostrar eventos restantes (máximo 10)
SELECT id, nombre, lat, lon, fecha_fin 
FROM eventos 
WHERE fecha_fin > NOW()
ORDER BY fecha_fin ASC 
LIMIT 10;
