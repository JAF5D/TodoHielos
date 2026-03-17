// Esta funcion prepara las animaciones de la portada para que cada bloque aparezca
// suavemente cuando entra en pantalla y la pagina se sienta mas viva.
function activarScrollRevealInicio() {
  if (!document.body.classList.contains("home")) {
    return;
  }

  const secciones = document.querySelectorAll(
    ".reveal-news, .reveal-about, .reveal-work, .reveal-gallery"
  );
  const elementosHero = document.querySelectorAll(".hero-item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
  });

  secciones.forEach((seccion) => {
    seccion.classList.add("scroll-reveal");
    observer.observe(seccion);
  });

  elementosHero.forEach((elemento, index) => {
    elemento.classList.add("scroll-reveal");
    elemento.style.transitionDelay = `${index * 0.18}s`;
    observer.observe(elemento);
  });
}

// Esta funcion lee el archivo JSON de noticias y crea las tarjetas que se muestran
// en la pagina principal sin tener que escribirlas una por una en el HTML.
function cargarNoticias() {
  fetch("/assets/data/noticias.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar el JSON de noticias");
      }
      return response.json();
    })
    .then((data) => {
      const contenedor = document.getElementById("contenedor-noticias");

      if (!contenedor) {
        return;
      }

      // Aqui vamos armando todo el HTML en una sola cadena para insertarlo de golpe.
      // De esa forma el renderizado es mas simple y el codigo queda mas facil de mantener.
      let html = "";
      data.forEach((noticia) => {
        html += `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <img src="${noticia.imagen}" class="card-img-top" alt="${noticia.titulo}" style="height: 200px; object-fit: cover;">
              <div class="card-body">
                <span class="badge bg-primary mb-2">${noticia.categoria}</span>
                <h5 class="card-title">${noticia.titulo}</h5>
                <p class="card-text text-muted">${noticia.resumen}</p>
              </div>
              <div class="card-footer bg-white border-0 small text-muted">
                <i class="bi bi-calendar3"></i> ${noticia.fecha}
              </div>
            </div>
          </div>
        `;
      });
      contenedor.innerHTML = html;
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", activarScrollRevealInicio);
