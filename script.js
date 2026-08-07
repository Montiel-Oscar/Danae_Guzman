document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       0. CURSOR PERSONALIZADO
       ========================================= */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // El halo sigue con un pequeño retraso (lerp) para efecto "trail"
        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Efecto "magnético" al pasar sobre elementos interactivos
        const hoverables = document.querySelectorAll('a, button, .gallery-item, .book-card, .ig-post');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    /* =========================================
       1. Parallax en el Hero (reacciona al ratón)
       ========================================= */
    const heroContent = document.querySelector('.hero-content');
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        if (heroContent) heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });

    /* =========================================
       2. Efecto 3D Tilt en las imágenes de la galería
       ========================================= */
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
    });

    /* =========================================
       3. DATA DE LIBROS
       Edita este arreglo para agregar/quitar reseñas.
       icon: cualquier emoji que represente el libro
       hue: número del 1 al 6 (paleta de portada, ver CSS .book-hue-N)
       ========================================= */
    const books = [
        {
            title: "Cien Años de Soledad",
            author: "Gabriel García Márquez",
            genre: "Clásico",
            rating: 5,
            icon: "📖",
            hue: 1,
            review: "Un viaje generacional que se siente tan vívido como un sueño recurrente. Cada relectura revela algo nuevo sobre Macondo y sobre nosotros mismos."
        },
        {
            title: "Rayuela",
            author: "Julio Cortázar",
            genre: "Ficción",
            rating: 4,
            icon: "🌀",
            hue: 2,
            review: "Una estructura que reta al lector a construir su propio camino. No es una lectura cómoda, pero es de las que se quedan pegadas a la piel."
        },
        {
            title: "Veinte Poemas de Amor",
            author: "Pablo Neruda",
            genre: "Poesía",
            rating: 5,
            icon: "🕊️",
            hue: 3,
            review: "Cada verso parece escrito para ilustrarse. La melancolía y la ternura conviven en cada página de una forma casi pictórica."
        },
        {
            title: "Sapiens",
            author: "Yuval Noah Harari",
            genre: "No ficción",
            rating: 4,
            icon: "🧠",
            hue: 4,
            review: "Una manera de mirar la historia humana en gran angular. Cambia por completo la perspectiva de por qué creemos en las cosas que creemos."
        },
        {
            title: "El Aleph",
            author: "Jorge Luis Borges",
            genre: "Clásico",
            rating: 5,
            icon: "♾️",
            hue: 5,
            review: "Cada cuento es un laberinto en miniatura. Borges logra que lo infinito quepa en apenas unas páginas."
        },
        {
            title: "Persépolis",
            author: "Marjane Satrapi",
            genre: "No ficción",
            rating: 4,
            icon: "🎨",
            hue: 6,
            review: "La combinación de ilustración y memoria histórica es justo el tipo de narrativa visual que más me inspira como artista."
        }
    ];

    const shelf = document.getElementById('book-shelf');
    const modal = document.getElementById('book-modal');
    const modalCover = document.getElementById('modal-cover');
    const modalGenre = document.getElementById('modal-genre');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const modalRating = document.getElementById('modal-rating');
    const modalReview = document.getElementById('modal-review');
    const modalClose = document.getElementById('book-modal-close');
    const modalBackdrop = document.getElementById('book-modal-backdrop');

    function starsFor(rating) {
        return '🪶'.repeat(rating) + '<span style="opacity:.25">' + '🪶'.repeat(5 - rating) + '</span>';
    }

    function openModal(book) {
        modalCover.className = `book-modal-cover book-hue-${book.hue}`;
        modalCover.textContent = book.icon;
        modalGenre.textContent = book.genre;
        modalTitle.textContent = book.title;
        modalAuthor.textContent = book.author;
        modalRating.innerHTML = starsFor(book.rating);
        modalReview.textContent = book.review;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (shelf) {
        books.forEach((book, i) => {
            const card = document.createElement('div');
            card.className = `book-card book-hue-${book.hue}`;
            card.dataset.genre = book.genre;
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <div class="book-icon">${book.icon}</div>
                <h4>${book.title}</h4>
                <p class="book-author">${book.author}</p>
            `;
            card.addEventListener('click', () => openModal(book));
            shelf.appendChild(card);
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* =========================================
       4. FILTROS DE GÉNERO
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.book-card').forEach(card => {
                const matches = filter === 'todos' || card.dataset.genre === filter;
                card.classList.toggle('filtered-out', !matches);
            });
        });
    });

    /* =========================================
       5. GRID DE INSTAGRAM
       Reutiliza las imágenes de arte que ya existen.
       Cambia el "href" de cada post por el link real
       a la publicación de Instagram cuando lo tengas.
       ========================================= */
    const igPosts = [
        { img: 'assets/arte/dragon.webp', href: 'https://instagram.com/' },
        { img: 'assets/arte/caballero.webp', href: 'https://instagram.com/' },
        { img: 'assets/arte/flores.webp', href: 'https://instagram.com/' },
        { img: 'assets/arte/barco.webp', href: 'https://instagram.com/' },
        { img: 'assets/arte/paisaje.webp', href: 'https://instagram.com/' },
        { img: 'assets/arte/piano.webp', href: 'https://instagram.com/' }
    ];

    const igGrid = document.getElementById('instagram-grid');
    if (igGrid) {
        igPosts.forEach(post => {
            const a = document.createElement('a');
            a.className = 'ig-post';
            a.href = post.href;
            a.target = '_blank';
            a.rel = 'noopener';
            a.innerHTML = `<img src="${post.img}" alt="Publicación de Instagram">`;
            igGrid.appendChild(a);
        });
    }

    /* =========================================
       6. BOTÓN FLOTANTE DE INSTAGRAM
       Aparece después de salir del hero
       ========================================= */
    const floatingBtn = document.getElementById('ig-floating-btn');
    const heroEl = document.getElementById('hero');
    if (floatingBtn && heroEl) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                floatingBtn.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        heroObserver.observe(heroEl);
    }

    /* =========================================
       7. Animaciones al hacer Scroll (Aparición suave)
       ========================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
            }
        });
    }, { threshold: 0.1 });

    const elementsToAnimate = document.querySelectorAll(
        '.gallery-item, .section-title, .books-hint, .instagram-subtitle, .ig-follow-btn'
    );
    elementsToAnimate.forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });
});