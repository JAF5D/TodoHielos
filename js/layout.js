// Esta funcion busca un contenedor dentro de la pagina y mete ahi un fragmento HTML comun,
// como el header o el footer. Asi evitamos repetir el mismo bloque en cada archivo.
async function cargarFragmento(selector, ruta) {
  const contenedor = document.querySelector(selector);

  if (!contenedor) {
    return;
  }

  try {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${ruta}`);
    }

    contenedor.innerHTML = await respuesta.text();
  } catch (error) {
    console.error(error);
  }
}

// Esta funcion revisa en que pagina estamos y marca en el menu el enlace correcto.
// Gracias a eso el usuario puede ubicar rapidamente en que seccion del sitio se encuentra.
function marcarEnlaceActivo() {
  const rutaActual = window.location.pathname.toLowerCase();
  const enlaces = document.querySelectorAll("[data-nav]");

  enlaces.forEach((enlace) => {
    const destino = enlace.getAttribute("href").toLowerCase();
    const esInicio =
      rutaActual.endsWith("/index.html") ||
      rutaActual === "/";

    if ((esInicio && enlace.dataset.nav === "inicio") || rutaActual.endsWith(destino)) {
      enlace.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Primero cargamos las partes compartidas de la web y despues marcamos el enlace activo.
  // El orden importa porque los enlaces del menu todavia no existen hasta que el header se inserta.
  await Promise.all([
    cargarFragmento("[data-shared-header]", "/components/header.html"),
    cargarFragmento("[data-shared-footer]", "/components/footer.html"),
  ]);

  marcarEnlaceActivo();
});
