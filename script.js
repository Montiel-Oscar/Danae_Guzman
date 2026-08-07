// Cambiar el fondo del menú de navegación al hacer scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Interactividad para los botones de las reseñas
const botonesResena = document.querySelectorAll('.btn-read');

botonesResena.forEach(boton => {
    boton.addEventListener('click', function() {
        // Obtenemos el título del libro buscando en los elementos hermanos
        const tituloLibro = this.parentElement.querySelector('h3').innerText;
        alert(`Has abierto la bitácora literaria de: ${tituloLibro}. Aquí se desplegará tu crítica completa.`);
    });
});