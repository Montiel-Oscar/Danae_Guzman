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

        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        function bindHoverables() {
            const hoverables = document.querySelectorAll('a, button, .carousel-slide, .selector-panel');
            hoverables.forEach(el => {
                el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
            });
        }
        window.__bindHoverables = bindHoverables;
        bindHoverables();
    }

    /* =========================================
       1. Parallax en el Hero
       ========================================= */
    const heroContent = document.querySelector('.hero-content');
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        if (heroContent) heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });

    /* =========================================
       2. BARRA DE PROGRESO DE SCROLL
       ========================================= */
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = `${pct}%`;
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* =========================================
       3. LIGHTBOX
       ========================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    /* =========================================
       4. COMPONENTE CARRUSEL A PANTALLA COMPLETA
       (con fondo difuminado en crossfade por slide + Parallax)
       ========================================= */
    function createCarousel({ trackId, dotsId, prevId, nextId, captionId, bgAId, bgBId, items, basePath }) {
        const track = document.getElementById(trackId);
        const dotsWrap = document.getElementById(dotsId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const caption = document.getElementById(captionId);
        const bgA = document.getElementById(bgAId);
        const bgB = document.getElementById(bgBId);
        const section = track ? track.closest('.fullscreen-carousel') : null;
        if (!track || !section) return;

        let current = 0;
        let bgToggle = false;

        items.forEach((item) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = basePath + item.file;
            img.alt = item.title;
            img.loading = 'lazy';
            slide.appendChild(img);
            slide.addEventListener('click', () => openLightbox(basePath + item.file, item.title));
            track.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dotsWrap.appendChild(dot);
        });

        const dots = dotsWrap.querySelectorAll('.carousel-dot');

        function starsFor(rating) {
            if (!rating) return '';
            let html = '';
            for (let i = 1; i <= 5; i++) {
                const filled = i <= rating ? '★' : '☆';
                html += `<span class="star">${filled}</span>`;
            }
            return html;
        }

        function updateBackground(url) {
            if (!bgA || !bgB) return;
            const showEl = bgToggle ? bgB : bgA;
            const hideEl = bgToggle ? bgA : bgB;
            showEl.style.backgroundImage = `url('${url}')`;
            showEl.classList.add('active');
            hideEl.classList.remove('active');
            bgToggle = !bgToggle;
        }

        function render() {
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            const item = items[current];
            let html = `<div class="cap-title">${item.title}</div>`;
            if (item.author) html += `<div class="cap-meta">${item.author}</div>`;
            if (item.rating) html += `<div class="cap-rating">${starsFor(item.rating)}</div>`;
            caption.innerHTML = html;
            updateBackground(basePath + item.file);
        }

        function goTo(i) {
            current = (i + items.length) % items.length;
            render();
        }

        dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        // Swipe táctil
        let touchStartX = 0;
        const viewport = track.parentElement;
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        viewport.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                goTo(current + (diff < 0 ? 1 : -1));
            }
        });

        // Flechas del teclado
        document.addEventListener('keydown', (e) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
            if (!isVisible) return;
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'ArrowLeft') goTo(current - 1);
        });

        render();

        /* =========================================
           PARALLAX EN EL CARRUSEL (movimiento del ratón)
           ========================================= */
        let targetPX = 0, targetPY = 0;
        let currentPX = 0, currentPY = 0;
        let paraAnimating = false;

        function animateParallax() {
            currentPX += (targetPX - currentPX) * 0.12;
            currentPY += (targetPY - currentPY) * 0.12;
            const slides = track.querySelectorAll('.carousel-slide');
            slides.forEach(slide => {
                slide.style.setProperty('--px', currentPX + 'px');
                slide.style.setProperty('--py', currentPY + 'px');
            });
            if (Math.abs(targetPX - currentPX) > 0.05 || Math.abs(targetPY - currentPY) > 0.05) {
                requestAnimationFrame(animateParallax);
            } else {
                paraAnimating = false;
                // Asegurar que llegue exacto
                slides.forEach(slide => {
                    slide.style.setProperty('--px', targetPX + 'px');
                    slide.style.setProperty('--py', targetPY + 'px');
                });
            }
        }

        function startParallaxAnimation() {
            if (!paraAnimating) {
                paraAnimating = true;
                requestAnimationFrame(animateParallax);
            }
        }

        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const maxMove = 22; // Máximo desplazamiento en píxeles
            targetPX = ((e.clientX - centerX) / rect.width) * maxMove * 2;
            targetPY = ((e.clientY - centerY) / rect.height) * maxMove * 2;
            startParallaxAnimation();
        });

        section.addEventListener('mouseleave', () => {
            targetPX = 0;
            targetPY = 0;
            startParallaxAnimation();
        });
    }

    /* =========================================
       5. DATA: LIBROS (Must Read primero)
       ========================================= */
    const books = [
        {
            file: 'libros-must-read-recomendados.jpeg',
            title: 'Libros que son un Must Read',
            author: 'Recomendaciones',
            rating: null
        },
        {
            file: 'reseña-cuando-no-queden-mas-estrellas.jpeg',
            title: 'Cuando no queden más estrellas que contar',
            author: 'María Martínez',
            rating: 5
        },
        {
            file: 'reseña-a-little-life-bookidish.jpeg',
            title: 'A Little Life',
            author: 'Hanya Yanagihara',
            rating: 5
        },
        {
            file: 'reseña-a-little-life-sinfrase.jpeg',
            title: 'The Secret History',
            author: 'Donna Tartt',
            rating: 5
        },
        {
            file: 'reseña-once-upon-a-broken-heart.jpeg',
            title: 'Once Upon a Broken Heart',
            author: 'Stephanie Garber',
            rating: 5
        },
        {
            file: 'reseña-the-ballad-of-never-after.jpeg',
            title: 'The Ballad of Never After',
            author: 'Stephanie Garber',
            rating: 5
        },
        {
            file: 'reseña-a-curse-for-true-love.jpeg',
            title: 'A Curse for True Love',
            author: 'Stephanie Garber',
            rating: 4
        }
    ];

    createCarousel({
        trackId: 'libros-track',
        dotsId: 'libros-dots',
        prevId: 'libros-prev',
        nextId: 'libros-next',
        captionId: 'libros-caption',
        bgAId: 'libros-bg-a',
        bgBId: 'libros-bg-b',
        items: books,
        basePath: 'assets/libros/'
    });

    /* =========================================
       6. DATA: ARTE
       ========================================= */
    const artworks = [
        {
            file: 'bodegon-de-cristal-2023.png',
            title: 'Swan off white & Bodegón de cristal',
            author: '2023 – 2026'
        },
        {
            file: 'collage-moonlight-boat-floral.jpeg',
            title: 'Moonlight view, Boat under the moon & Naturaleza muerta n.º1',
            author: '2025 – 2026'
        },
        {
            file: 'collage-flamenco-palace.jpeg',
            title: 'Flamenco style & Palace of Fine Arts',
            author: '2023'
        },
        {
            file: 'collage-out-of-a-book-soldier.jpeg',
            title: "Out of a Book & Soldier's Weight",
            author: '2025'
        },
        {
            file: 'collage-todays-news-lirios-teclado.jpeg',
            title: "Today's News, Lirios & Teclado",
            author: '2025'
        }
    ];

    createCarousel({
        trackId: 'arte-track',
        dotsId: 'arte-dots',
        prevId: 'arte-prev',
        nextId: 'arte-next',
        captionId: 'arte-caption',
        bgAId: 'arte-bg-a',
        bgBId: 'arte-bg-b',
        items: artworks,
        basePath: 'assets/arte/'
    });

    if (window.__bindHoverables) window.__bindHoverables();

    /* =========================================
       7. BOTÓN FLOTANTE DE INSTAGRAM
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
       8. Animaciones al hacer Scroll
       ========================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
            }
        });
    }, { threshold: 0.15 });

    const elementsToAnimate = document.querySelectorAll('.fs-frame, .fs-caption, .carousel-dots, .fs-section-label');
    elementsToAnimate.forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });
});