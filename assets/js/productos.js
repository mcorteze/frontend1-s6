// Variable global para productos
let productosGlobal = [];

// Cargar y renderizar productos
async function cargarProductos() {
  try {
    const res = await fetch("../../assets/data/productos.json");
    if (!res.ok) {
      throw new Error("Error al cargar productos: " + res.status);
    }

    const productos = await res.json();
    window.productosGlobal = productos;
    productosGlobal = productos;

    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";

    // Agregar cada producto a la lista
    productos.forEach((p) => {
      const li = document.createElement("li");
      li.classList.add("producto");
      li.innerHTML = `
        <div class="producto-container">
          <figure class="producto-media">
            <img src="${p.imagen}" alt="${p.alt}">
          </figure>
          <div class="producto-info">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p class="meta">
              <em>Género:</em> ${p.genero} • <em>Enfoque:</em> ${p.enfoque}
            </p>
            <p class="precio fw-bold">Precio: $${p.precio.toLocaleString("es-CL")}</p>
            <button class="btn btn-primary agregar-carrito" data-id="${p.id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      `;
      lista.appendChild(li);
    });

    // Escuchar clicks en botones "Agregar al carrito"
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("agregar-carrito")) {
        const id = parseInt(e.target.dataset.id);
        agregarAlCarrito(id);
      }
    });
  } catch (error) {
    console.error("Error cargando productos:", error);
    mostrarAlerta(
      "No se pudieron cargar los productos. Intenta nuevamente más tarde.",
      "danger"
    );
  }
}

// Mostrar alerta flotante
function mostrarAlerta(mensaje, tipo = "success") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${tipo} alert-dismissible fade show`;
  alert.role = "alert";
  alert.style.position = "fixed";
  alert.style.top = "20px";
  alert.style.left = "50%";
  alert.style.transform = "translateX(-50%)";
  alert.style.zIndex = "9999";
  alert.style.minWidth = "300px";
  alert.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);

  setTimeout(() => alert.remove(), 4000);
}

// Agregar un producto al carrito
function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito-frontend-s6")) || [];

  // Verificar duplicados
  if (carrito.some((item) => item.id === idProducto)) {
    mostrarAlerta("Este artículo ya está en el carrito", "warning");
    return;
  }

  carrito.push({ id: idProducto, cantidad: 1 });
  localStorage.setItem("carrito-frontend-s6", JSON.stringify(carrito));
  mostrarAlerta("Artículo agregado al carrito", "success");

  // Actualizar UI del carrito si está disponible
  if (typeof actualizarCarritoUI === "function") {
    actualizarCarritoUI();
  }
}

// Filtrar productos por nombre
function filtrarProductos(termino) {
  const lista = document.getElementById("lista-productos");
  lista.innerHTML = "";

  const productosFiltrados = productosGlobal.filter((p) =>
    p.nombre.toLowerCase().includes(termino.toLowerCase())
  );

  if (productosFiltrados.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center text-muted">No se encontraron productos</li>`;
    return;
  }

  productosFiltrados.forEach((p) => {
    const li = document.createElement("li");
    li.classList.add("producto");
    li.innerHTML = `
      <div class="producto-container">
        <figure class="producto-media">
          <img src="${p.imagen}" alt="${p.alt}">
        </figure>
        <div class="producto-info">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <p class="meta">
            <em>Género:</em> ${p.genero} • <em>Enfoque:</em> ${p.enfoque}
          </p>
          <p class="precio fw-bold">Precio: $${p.precio.toLocaleString("es-CL")}</p>
          <button class="btn btn-primary agregar-carrito" data-id="${p.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    lista.appendChild(li);
  });
}

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  // Barra de búsqueda
  const formBusqueda = document.getElementById("form-busqueda");
  formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    const termino = document.getElementById("input-busqueda").value.trim();
    filtrarProductos(termino);
  });
});
