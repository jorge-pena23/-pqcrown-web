-- ============================================================
-- PQ CROWN — configuración de Supabase
-- ------------------------------------------------------------
-- Cómo usarlo:
-- 1. Entra a tu proyecto en supabase.com
-- 2. Ve al "SQL Editor" (menú izquierdo)
-- 3. Pega todo este archivo y dale "Run"
-- ============================================================

-- Tabla de productos
create table if not exists productos (
  id text primary key,
  nombre text not null,
  categoria text not null,
  color text,
  imagen text,
  precio numeric(10,2) not null,
  descripcion text
);

-- Activa seguridad a nivel de fila (obligatorio en Supabase)
alter table productos enable row level security;

-- Permite que cualquier visitante de la tienda pueda LEER los
-- productos (no puede insertar, editar ni borrar nada)
drop policy if exists "Lectura publica de productos" on productos;
create policy "Lectura publica de productos"
on productos for select
using (true);

-- Catálogo inicial (el mismo que ya tiene la página)
insert into productos (id, nombre, categoria, color, imagen, precio, descripcion) values
('g01', 'Rosa Negra',          'snapback',   'Negro / Naranja', 'img/gorra-1.jpg', 18.0, 'Snapback 9FIFTY con bordado de rosa y visera plana.'),
('g02', 'Marfil Rosé',         'fitted',     'Marfil / Negro',  'img/gorra-2.jpg', 19.5, 'Fitted 59FIFTY bicolor con bordado floral en hilo rosa.'),
('g03', 'Aniversario Gris',    'adjustable', 'Marfil / Grafito','img/gorra-3.jpg', 17.0, 'Ajustable 9FORTY, visera curva y parche conmemorativo.'),
('g04', 'Jardín Dorado',       'adjustable', 'Negro / Oro',     'img/gorra-5.jpg', 19.0, 'Ajustable 9FORTY con bordado floral y logo en contorno dorado.'),
('g05', 'Terciopelo Carmesí',  'fitted',     'Negro / Rojo',    'img/gorra-6.jpg', 22.0, 'Fitted en terciopelo con bordado doble de rosas.'),
('g06', 'Jardín Nocturno',     'fitted',     'Negro sobre negro','img/gorra-7.jpg',20.5, 'Bordado floral tono sobre tono con logo degradado.'),
('g07', 'Cristal Araña',       'fitted',     'Negro',           'img/gorra-8.jpg', 21.0, 'Fitted con logo en strass y bordado de araña en hilo fino.')
on conflict (id) do nothing;

-- Para agregar una gorra nueva más adelante, solo corre algo así:
-- insert into productos (id, nombre, categoria, color, imagen, precio, descripcion)
-- values ('g08', 'Nombre de la gorra', 'fitted', 'Color', 'img/gorra-8.jpg', 20.0, 'Descripción corta.');
