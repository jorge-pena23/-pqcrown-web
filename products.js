/* ============================================================
   PRODUCTOS
   ------------------------------------------------------------
   Los datos viven aquí, en un arreglo local. El día que quieras
   conectar una base de datos real, solo cambia el CONTENIDO de
   getProducts() para que haga un fetch a tu API, por ejemplo:

   async function getProducts() {
     const res = await fetch('https://tu-api.com/productos');
     return res.json();
   }

   El resto de la página (catálogo, carrito, WhatsApp) no
   necesita cambiar nada, porque siempre le pide los productos
   a esta única función.
   ============================================================ */
const SUPABASE_URL = 'https://ofbtakknyxgoflrikldm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_78wCYHvalSEoLTyrKdN76g_76DIXcOM';
 
let supabaseClient = null;
if (window.supabase && !SUPABASE_URL.includes('TU_SUPABASE')) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
 
async function getProducts() {
  if (!supabaseClient) return PRODUCTS_DB;
 
  const { data, error } = await supabaseClient
    .from('productos')
    .select('*')
    .order('precio', { ascending: true });
 
  if (error || !data || data.length === 0) {
    console.warn('No se pudo leer Supabase, usando catálogo local:', error);
    return PRODUCTS_DB;
  }
  return data;
}

const PRODUCTS_DB = [
  {
    id: 'g01',
    nombre: 'Rosa Negra',
    categoria: 'snapback',
    color: 'Negro / Naranja',
    imagen: '1.jpeg',
    precio: 18.0,
    descripcion: 'Snapback 9FIFTY con bordado de rosa y visera plana.'
  },
  {
    id: 'g02',
    nombre: 'Marfil Rosé',
    categoria: 'fitted',
    color: 'Marfil / Negro',
    imagen: '2.jpeg',
    precio: 19.5,
    descripcion: 'Fitted 59FIFTY bicolor con bordado floral en hilo rosa.'
  },
  {
    id: 'g03',
    nombre: 'Aniversario Gris',
    categoria: 'adjustable',
    color: 'Marfil / Grafito',
    imagen: '3.jpeg',
    precio: 17.0,
    descripcion: 'Ajustable 9FORTY, visera curva y parche conmemorativo.'
  },
  {
    id: 'g04',
    nombre: 'Cristal Araña',
    categoria: 'adjustable',
    color: 'Negro / Oro',
    imagen: '8.jpeg',
    precio: 19.0,
    descripcion: 'Ajustable 9FORTY con bordado floral y logo en contorno dorado.'
  },
  {
    id: 'g05',
    nombre: 'Terciopelo Carmesí',
    categoria: 'fitted',
    color: 'Negro / Rojo',
    imagen: '5.jpeg',
    precio: 22.0,
    descripcion: 'Fitted en terciopelo con bordado doble de rosas.'
  },
  {
    id: 'g06',
    nombre: 'Jardín Nocturno',
    categoria: 'fitted',
    color: 'Negro sobre negro',
    imagen: '6.jpeg',
    precio: 20.5,
    descripcion: 'Bordado floral tono sobre tono con logo degradado.'
  },
  {
    id: 'g07',
    nombre: 'Jardín Dorado',
    categoria: 'fitted',
    color: 'Negro',
    imagen: '7.jpeg',
    precio: 21.0,
    descripcion: 'Fitted con logo en strass y bordado de araña en hilo fino.'
  }
];

async function getProducts() {
  // Simula una llamada asíncrona (como sería a una API real).
  return Promise.resolve(PRODUCTS_DB);
}
