// Guardamos referencias a los elementos principales de la galeria para no tener que
// buscarlos en el DOM cada vez que el usuario interactua con el visor.
const imagenes = document.querySelectorAll('#galeria img');
const lightbox = document.querySelector('#contenedor-principal');
const imagenActiva = document.querySelector('#img-activa');

const btnCierra = document.querySelector('#btn-cierra');
const btnAdelante = document.querySelector('#btn-adelante');
const btnRetrocede = document.querySelector('#btn-retrocede');

let indiceImagen = 0;


// Esta funcion abre el visor y coloca como imagen principal la miniatura
// sobre la que acaba de hacer click el usuario.
imagenes.forEach((img, index) => {

    img.addEventListener("click", () => {

        indiceImagen = index;
        imagenActiva.src = img.src;

        lightbox.style.display = "flex";

    });

});


// Cerramos el visor cuando el usuario pulsa el boton pensado para salir.
btnCierra.addEventListener("click", () => {
    lightbox.style.display = "none";
});


// Esta parte permite avanzar por la galeria. Si llegamos al final,
// volvemos al principio para que la navegacion sea continua.
function adelanteImagen(){

    indiceImagen++;

    if(indiceImagen >= imagenes.length){
        indiceImagen = 0;
    }

    imagenActiva.src = imagenes[indiceImagen].src;
}

btnAdelante.addEventListener("click", adelanteImagen);


// Aqui hacemos lo mismo pero en sentido contrario. Si el usuario esta en la primera imagen,
// saltamos a la ultima para que tambien pueda moverse hacia atras sin cortes.
function retrocedeImagen(){

    indiceImagen--;

    if(indiceImagen < 0){
        indiceImagen = imagenes.length - 1;
    }

    imagenActiva.src = imagenes[indiceImagen].src;
}

btnRetrocede.addEventListener("click", retrocedeImagen);


// Tambien damos soporte al teclado para que la galeria sea mas comoda de usar:
// flechas para moverse y Escape para cerrar.
document.addEventListener("keydown", (e)=>{

    if(lightbox.style.display === "flex"){

        if(e.key === "ArrowRight") adelanteImagen();

        if(e.key === "ArrowLeft") retrocedeImagen();

        if(e.key === "Escape") lightbox.style.display = "none";

    }

});


// Si el usuario hace click fuera de la imagen, en el fondo oscuro,
// interpretamos que quiere cerrar el visor.
lightbox.addEventListener("click",(e)=>{

    if(e.target === lightbox){
        lightbox.style.display = "none";
    }

});
