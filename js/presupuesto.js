// Aqui reunimos las referencias a los campos del formulario para poder validarlos
// y recalcular el presupuesto sin estar buscando elementos todo el tiempo.
const form = document.getElementById("form-presupuesto");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const producto = document.getElementById("producto");
const plazo = document.getElementById("plazo");
const extras = document.querySelectorAll('input[name="extras"]');
const condiciones = document.getElementById("condiciones");
const presupuestoTotal = document.getElementById("presupuesto-total");

// Estas funciones limpian lo que el usuario escribe para que cada campo admita
// solo el tipo de dato esperado incluso antes de validar el formulario.
function permitirSoloLetras(valor) {
  return valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "");
}

function permitirSoloNumeros(valor) {
  return valor.replace(/\D/g, "");
}

// Esta funcion calcula el total final combinando el producto elegido, los extras
// y el descuento que pueda aplicarse segun el plazo indicado por el usuario.
function calcularPresupuesto() {
  let subtotal = 0;

  if (producto.value) {
    subtotal += parseInt(producto.value, 10);
  }

  extras.forEach((extra) => {
    if (extra.checked) {
      subtotal += parseInt(extra.value, 10);
    }
  });

  // Cada mes suma un 5 % de descuento y el limite maximo es del 50 %.
  const meses = parseInt(plazo.value, 10) || 0;
  const descuento = Math.min(meses * 0.05, 0.5);
  const total = subtotal * (1 - descuento);

  presupuestoTotal.textContent = `${total.toFixed(2)} EUR`;
}

// Cada vez que cambia un dato importante del formulario, volvemos a calcular
// el presupuesto para que el total siempre este actualizado en pantalla.
producto.addEventListener("change", calcularPresupuesto);
plazo.addEventListener("input", calcularPresupuesto);
extras.forEach((extra) => extra.addEventListener("change", calcularPresupuesto));

// Comprobamos que el nombre tenga un formato razonable: solo letras
// y una longitud que no supere el limite definido.
function validarNombre() {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  if (!regex.test(nombre.value) || nombre.value.length > 15) {
    document.getElementById("error-nombre").textContent = "Solo letras, max 15 caracteres.";
    return false;
  }

  document.getElementById("error-nombre").textContent = "";
  return true;
}

// Los apellidos se validan con una regla parecida a la del nombre
// para mantener el formulario coherente y evitar entradas invalidas.
function validarApellidos() {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  if (!regex.test(apellidos.value) || apellidos.value.length > 40) {
    document.getElementById("error-apellidos").textContent = "Solo letras, max 40 caracteres.";
    return false;
  }

  document.getElementById("error-apellidos").textContent = "";
  return true;
}

// En el telefono solo permitimos numeros y una longitud maxima de nueve cifras,
// que es el formato esperado en este caso.
function validarTelefono() {
  const regex = /^\d{1,9}$/;

  if (!regex.test(telefono.value)) {
    document.getElementById("error-telefono").textContent = "Solo numeros, max 9 digitos.";
    return false;
  }

  document.getElementById("error-telefono").textContent = "";
  return true;
}

// Aqui hacemos una validacion basica del correo para detectar errores comunes
// antes de que el formulario se envie.
function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email.value)) {
    document.getElementById("error-email").textContent = "Correo invalido.";
    return false;
  }

  document.getElementById("error-email").textContent = "";
  return true;
}

// Mientras se escribe, eliminamos cualquier caracter que no pertenezca al tipo de dato esperado.
nombre.addEventListener("input", () => {
  nombre.value = permitirSoloLetras(nombre.value);
});

apellidos.addEventListener("input", () => {
  apellidos.value = permitirSoloLetras(apellidos.value);
});

telefono.addEventListener("input", () => {
  telefono.value = permitirSoloNumeros(telefono.value).slice(0, 9);
});

// Cuando el usuario intenta enviar el formulario, revisamos todos los campos.
// Si algo esta mal, detenemos el envio y mostramos los mensajes necesarios.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valido = true;
  valido = validarNombre() && valido;
  valido = validarApellidos() && valido;
  valido = validarTelefono() && valido;
  valido = validarEmail() && valido;

  if (!condiciones.checked) {
    document.getElementById("error-condiciones").textContent = "Debes aceptar las condiciones.";
    valido = false;
  } else {
    document.getElementById("error-condiciones").textContent = "";
  }

  if (valido) {
    alert("Presupuesto enviado correctamente.");
  }
});

// Si el formulario se reinicia, tambien limpiamos los errores visibles
// y devolvemos el presupuesto total a su estado inicial.
form.addEventListener("reset", () => {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  presupuestoTotal.textContent = "0 EUR";
});
