/* ============================================================
   CONFIGURACIÓN — edita esto con tus datos reales
   ============================================================ */
const WHATSAPP_NUMERO = '50372849459'; // <-- cambia esto por tu número, con código de país, sin "+" ni espacios

/* ============================================================
   ESTADO
   ============================================================ */
let productos = [];
let carrito = cargarCarrito();
let categoriaActiva = 'todas';
let precioMaximo = 25;

/* ============================================================
   INICIO
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  productos = await getProducts();
  renderGrid();
  renderCarrito();
  hoyComoMinimo();

  document.getElementById('filtroPrecio').addEventListener('input', onFiltroPrecio);
  document.getElementById('filtroCategorias').addEventListener('click', onFiltroCategoria);
  document.getElementById('formPedido').addEventListener('submit', enviarPedido);
});

function hoyComoMinimo() {
  const input = document.getElementById('fecha');
  const hoy = new Date().toISOString().split('T')[0];
  input.min = hoy;
}

/* ============================================================
   CATÁLOGO
   ============================================================ */
function onFiltroPrecio(e) {
  precioMaximo = parseFloat(e.target.value);
  document.getElementById('filtroPrecioValor').textContent = `$${precioMaximo.toFixed(0)}`;
  renderGrid();
}

function onFiltroCategoria(e) {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  categoriaActiva = btn.dataset.cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--activo'));
  btn.classList.add('chip--activo');
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const filtrados = productos.filter(p => {
    const pasaCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva;
    const pasaPrecio = p.precio <= precioMaximo;
    return pasaCategoria && pasaPrecio;
  });

  grid.innerHTML = filtrados.map(p => `
    <article class="card">
      <div class="card__art">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      </div>
      <div class="card__body">
        <p class="card__nombre">${p.nombre}</p>
        <p class="card__desc">${p.descripcion}</p>
        <div class="card__pie">
          <span class="card__precio">$${p.precio.toFixed(2)}</span>
          <button class="card__btn" data-id="${p.id}" aria-label="Agregar ${p.nombre}">+</button>
        </div>
      </div>
    </article>
  `).join('');

  if (filtrados.length === 0) {
    grid.innerHTML = `<p style="color:var(--ivory-dim)">No hay gorras en este rango. Prueba subiendo el precio máximo.</p>`;
  }

  grid.querySelectorAll('.card__btn').forEach(btn => {
    btn.addEventListener('click', () => agregarAlCarrito(btn.dataset.id));
  });
}

/* ============================================================
   CARRITO
   ============================================================ */
function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem('gorrasBravo_carrito')) || [];
  } catch {
    return [];
  }
}

function guardarCarrito() {
  localStorage.setItem('gorrasBravo_carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }
  guardarCarrito();
  renderCarrito();
  mostrarToast(`${producto.nombre} agregada`);
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById('listaCarrito');
  const vacio = document.getElementById('carritoVacio');
  const totalEl = document.getElementById('carritoTotal');
  const btnWhatsapp = document.getElementById('btnWhatsapp');

  vacio.style.display = carrito.length === 0 ? 'block' : 'none';

  lista.innerHTML = carrito.map(i => `
    <li class="carrito__item">
      <span>${i.nombre} <small>x${i.cantidad} · $${(i.precio * i.cantidad).toFixed(2)}</small></span>
      <button data-id="${i.id}" aria-label="Quitar ${i.nombre}">Quitar</button>
    </li>
  `).join('');

  lista.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => quitarDelCarrito(btn.dataset.id));
  });

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;

  btnWhatsapp.disabled = carrito.length === 0;
}

/* ============================================================
   ENVÍO DEL PEDIDO POR WHATSAPP
   ============================================================ */
function enviarPedido(e) {
  e.preventDefault();

  const aviso = document.getElementById('avisoVacio');
  if (carrito.length === 0) {
    aviso.classList.add('form__aviso--visible');
    return;
  }
  aviso.classList.remove('form__aviso--visible');

  const nombre = document.getElementById('nombre').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const direccion = document.getElementById('direccion').value.trim();
  const notas = document.getElementById('notas').value.trim();

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const detalle = carrito
    .map(i => `- ${i.nombre} x${i.cantidad} ($${(i.precio * i.cantidad).toFixed(2)})`)
    .join('%0A');

  let mensaje = `Hola, quiero hacer un pedido:%0A%0A${detalle}%0A%0ATotal: $${total.toFixed(2)}%0A%0ANombre: ${nombre}%0AFecha de entrega: ${fecha}%0AHora: ${hora}%0ADirección: ${direccion}`;

  if (notas) {
    mensaje += `%0ANotas: ${notas}`;
  }

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
  window.open(url, '_blank');

  carrito = [];
  guardarCarrito();
  renderCarrito();
  document.getElementById('formPedido').reset();
  mostrarToast('Pedido enviado. Revisa WhatsApp para confirmarlo.');
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimeout;
function mostrarToast(texto) {
  const toast = document.getElementById('toast');
  toast.textContent = texto;
  toast.classList.add('toast--visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('toast--visible'), 2400);
}
