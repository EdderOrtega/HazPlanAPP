-- Script rápido para encontrar y eliminar evento específico que causa warning
-- Ejecutar en SQL Editor de Supabase

-- 1. Encontrar el evento problemático (ID: 13)
SELECT id, nombre, lat, lon, fecha_fin, created_at 
FROM eventos 
WHERE id = 13;

-- 2. Eliminar el evento específico que causa el warning
DELETE FROM eventos WHERE id = 13;

-- 3. Verificar que se eliminó
SELECT COUNT(*) as eventos_con_id_13 FROM eventos WHERE id = 13;

-- 4. Buscar otros eventos sin fecha_fin
SELECT id, nombre, lat, lon, fecha_fin 
FROM eventos 
WHERE fecha_fin IS NULL 
   OR fecha_fin = ''
ORDER BY id;

-- 5. Eliminar todos los eventos sin fecha_fin
DELETE FROM eventos 
WHERE fecha_fin IS NULL 
   OR fecha_fin = '';

-- 6. Confirmación final
SELECT COUNT(*) as total_eventos_validos 
FROM eventos 
WHERE lat IS NOT NULL 
  AND lon IS NOT NULL 
  AND fecha_fin IS NOT NULL 
  AND fecha_fin != '';

COMMIT;
