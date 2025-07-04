-- Diagnóstico de la tabla participantes_eventos

-- 1. Verificar si la tabla existe
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'participantes_eventos';

-- 2. Verificar columnas de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'participantes_eventos'
ORDER BY ordinal_position;

-- 3. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'participantes_eventos';

-- 4. Verificar si RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'participantes_eventos';

-- 5. Intentar una consulta simple
SELECT COUNT(*) as total_registros FROM participantes_eventos;

-- 6. Verificar estructura específica
\d participantes_eventos
