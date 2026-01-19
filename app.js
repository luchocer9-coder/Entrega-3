// ==============================
// VARIABLES GLOBALES
// ==============================

let productos = [];

let carrito = localStorage.getItem("carrito")
  ? JSON.parse(localStorage.getItem("carrito"))
  : [];

// Referencias al DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito");
const totalHTML = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar");
const btnFinalizar = document.getElementById("finalizar");

// ==============================
// CARGA DE PRODUCTOS (JSON)
// ==============================

fetch("data/productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    renderProductos();
    renderCarrito();
  });

// ==============================
// RENDER PRODUCTOS
// ==============================

function renderProductos() {
  contenedorProductos.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">
        Agregar al carrito
      </button>
    `;

    contenedorProductos.appendChild(card);
  });
}

// ==============================
// AGREGAR AL CARRITO + ALERTA
// ==============================

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(p => p.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  renderCarrito();

  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: producto.nombre,
    timer: 1200,
    showConfirmButton: false
  });
}

// ==============================
// RENDER CARRITO
// ==============================

function renderCarrito() {
  contenedorCarrito.innerHTML = "";

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <p><strong>${item.nombre}</strong></p>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Subtotal: $${item.precio * item.cantidad}</p>
      <hr>
    `;

    contenedorCarrito.appendChild(div);
  });

  calcularTotal();
}

// ==============================
// TOTAL (reduce)
// ==============================

function calcularTotal() {
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  totalHTML.innerText = "Total: $" + total;
}

// ==============================
// LOCAL STORAGE
// ==============================

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ==============================
// VACIAR CARRITO + CONFIRMACIÓN
// ==============================

btnVaciar.addEventListener("click", () => {
  if (carrito.length === 0) return;

  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      carrito = [];
      localStorage.removeItem("carrito");
      renderCarrito();

      Swal.fire("Carrito vacío", "", "success");
    }
  });
});

// ==============================
// FINALIZAR COMPRA
// ==============================

btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("El carrito está vacío", "", "info");
    return;
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  Swal.fire({
    title: "Finalizar compra",
    html: `<p>Total a pagar: <strong>$${total}</strong></p>`,
    icon: "success",
    showCancelButton: true,
    confirmButtonText: "Confirmar compra",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      carrito = [];
      localStorage.removeItem("carrito");
      renderCarrito();

      Swal.fire(
        "¡Gracias por tu compra!",
        "La operación fue realizada con éxito",
        "success"
      );
    }
  });
});
