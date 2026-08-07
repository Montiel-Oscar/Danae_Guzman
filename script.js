document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Efecto Parallax en el Hero (reacciona al ratón)
    const heroContent = document.querySelector('.hero-content');
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });

    // 2. Efecto 3D Tilt en las imágenes de la galería
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X dentro de la tarjeta
            const y = e.clientY - rect.top;  // Posición Y dentro de la tarjeta
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Invertido para que se incline hacia el cursor
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // 3. Animaciones al hacer Scroll (Aparición suave)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
            }
        });
    }, {
        threshold: 0.1
    });

    // Añadir la clase hidden a los elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('.gallery-item, .books-placeholder, .section-title');
    elementsToAnimate.forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });
});