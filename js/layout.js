// Tomamos como referencia la carpeta raiz del proyecto a partir de la URL del script.
// Asi las rutas funcionan igual en local y en GitHub Pages aunque el sitio viva en un subdirectorio.
const layoutScript =
  document.currentScript ||
  Array.from(document.scripts).find((script) => script.src.includes("/js/layout.js"));

const siteRootUrl = layoutScript
  ? new URL("../", layoutScript.src)
  : new URL("./", window.location.href);

function obtenerRutaSitio(ruta) {
  return new URL(ruta.replace(/^\//, ""), siteRootUrl).toString();
}

function normalizarPathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function reescribirRutasAbsolutas(contenedor) {
  const elementos = contenedor.querySelectorAll("[href], [src]");

  elementos.forEach((elemento) => {
    ["href", "src"].forEach((atributo) => {
      const valor = elemento.getAttribute(atributo);

      if (!valor || !valor.startsWith("/")) {
        return;
      }

      elemento.setAttribute(atributo, obtenerRutaSitio(valor));
    });
  });
}

// Esta funcion busca un contenedor dentro de la pagina y mete ahi un fragmento HTML comun,
// como el header o el footer. Asi evitamos repetir el mismo bloque en cada archivo.
async function cargarFragmento(selector, ruta) {
  const contenedor = document.querySelector(selector);

  if (!contenedor) {
    return;
  }

  try {
    const respuesta = await fetch(obtenerRutaSitio(ruta));

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${ruta}`);
    }

    contenedor.innerHTML = await respuesta.text();
    reescribirRutasAbsolutas(contenedor);
  } catch (error) {
    console.error(error);
  }
}

// Esta funcion revisa en que pagina estamos y marca en el menu el enlace correcto.
// Gracias a eso el usuario puede ubicar rapidamente en que seccion del sitio se encuentra.
function marcarEnlaceActivo() {
  const rutaActual = normalizarPathname(window.location.pathname.toLowerCase());
  const raizSitio = normalizarPathname(siteRootUrl.pathname.toLowerCase());
  const enlaces = document.querySelectorAll("[data-nav]");

  enlaces.forEach((enlace) => {
    const urlDestino = new URL(enlace.getAttribute("href"), window.location.href);
    const destino = normalizarPathname(urlDestino.pathname.toLowerCase());
    const esInicio = rutaActual === raizSitio || rutaActual.endsWith("/index.html");

    if ((esInicio && enlace.dataset.nav === "inicio") || rutaActual === destino) {
      enlace.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Primero cargamos las partes compartidas de la web y despues marcamos el enlace activo.
  // El orden importa porque los enlaces del menu todavia no existen hasta que el header se inserta.
  await Promise.all([
    cargarFragmento("[data-shared-header]", "components/header.html"),
    cargarFragmento("[data-shared-footer]", "components/footer.html"),
  ]);

  marcarEnlaceActivo();
});
