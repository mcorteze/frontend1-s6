// Carga los productos en memoria si aún no están disponibles
async function asegurarProductosGlobal() {
  if (!window.productosGlobal) {
    try {
      const res = await fetch("../../assets/data/productos.json");
      window.productosGlobal = await res.json();
    } catch (err) {
      console.error("No se pudo cargar productos.json", err);
      window.productosGlobal = [];
    }
  }
}

// Actualiza la interfaz del carrito
async function actualizarCarritoUI() {
  await asegurarProductosGlobal();

  const carrito = JSON.parse(localStorage.getItem("carrito-frontend-s6")) || [];
  const lista = document.getElementById("carrito-lista");
  const totalElem = document.getElementById("carrito-total");
  const countElem = document.getElementById("cart-count");

  lista.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center">El carrito está vacío</li>`;
  } else {
    carrito.forEach((item) => {
      const producto = window.productosGlobal.find((p) => p.id === item.id);
      if (!producto) return;

      // Elemento de lista para cada producto
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      li.innerHTML = `
        <div>
          <strong>ID:</strong> ${producto.id} <br>
          ${producto.nombre}
        </div>
        <span>$${producto.precio.toLocaleString("es-CL")}</span>
      `;
      lista.appendChild(li);

      total += producto.precio * item.cantidad;
    });
  }

  // Muestra el total y la cantidad de ítems
  totalElem.textContent = total.toLocaleString("es-CL");
  countElem.textContent = carrito.length;
}

// Actualiza el carrito al detectar cambios en localStorage
window.addEventListener("storage", (e) => {
  if (e.key === "carrito-frontend-s6") {
    actualizarCarritoUI();
  }
});

// Inicializa la UI al cargar la página
document.addEventListener("DOMContentLoaded", actualizarCarritoUI);
