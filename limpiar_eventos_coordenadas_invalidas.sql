-- Script SQL para limpiar eventos con coordenadas inválidas directamente en Supabase
-- Esto reduce los warnings en la consola del frontend

-- 1. Mostrar eventos con coordenadas inválidas antes de eliminar
SELECT 
  id, 
  nombre, 
  lat, 
  lon, 
  fecha_fin,
  created_at
FROM eventos 
WHERE 
  lat IS NULL 
  OR lon IS NULL 
  OR lat = 0 
  OR lon = 0 
  OR lat = '' 
  OR lon = ''
ORDER BY created_at DESC;

-- 2. Eliminar eventos con coordenadas inválidas
DELETE FROM eventos 
WHERE 
  lat IS NULL 
  OR lon IS NULL 
  OR lat = 0 
  OR lon = 0 
  OR lat = '' 
  OR lon = '';

-- 3. Eliminar eventos sin fecha_fin (causa warnings)
DELETE FROM eventos 
WHERE fecha_fin IS NULL OR fecha_fin = '';

-- 4. También limpiar eventos expirados para mejorar rendimiento
DELETE FROM eventos 
WHERE fecha_fin < NOW();

-- 5. Verificar que la limpieza fue exitosa
SELECT 
  COUNT(*) as eventos_restantes,
  COUNT(CASE WHEN lat IS NULL OR lon IS NULL OR lat = 0 OR lon = 0 THEN 1 END) as eventos_con_coordenadas_invalidas
FROM eventos;

-- 6. Opcional: Agregar constraint para prevenir futuras coordenadas inválidas
-- (Descomenta si quieres aplicar esta restricción)
/*
ALTER TABLE eventos 
ADD CONSTRAINT eventos_coordenadas_validas 
CHECK (
  lat IS NOT NULL 
  AND lon IS NOT NULL 
  AND lat != 0 
  AND lon != 0 
  AND lat != '' 
  AND lon != ''
  AND lat BETWEEN -90 AND 90 
  AND lon BETWEEN -180 AND 180
);
*/

-- 7. Crear índices para mejorar performance de las consultas de filtrado
-- Ejecuta estas líneas una por una en el SQL Editor de Supabase
-- Si ya existen, simplemente dará error pero no afectará nada

CREATE INDEX idx_eventos_coordenadas ON eventos(lat, lon);
CREATE INDEX idx_eventos_fecha_fin ON eventos(fecha_fin);

COMMIT;
