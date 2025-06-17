(function(){
    // Log de démarrage
    console.log('gallery-widget.js chargé');
    // Injecte MixItUp depuis CDN
    var mixitupScript = document.createElement('script');
    mixitupScript.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    document.head.appendChild(mixitupScript);

    // Injecte le CSS global (grille + lightbox)
    if(!document.getElementById('custom-gallery-css')){
        const style = document.createElement('style');
        style.id = 'custom-gallery-css';
        style.textContent = `
.custom-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
@media (max-width: 700px) { .custom-gallery-grid { grid-template-columns: 1fr; } }
.custom-gallery-filters { text-align:center; margin:20px 0; }
.custom-gallery-filters button { margin:0 10px; padding:8px 20px; background:#f0f0f0; border:1px solid #ddd; cursor:pointer; border-radius:5px; transition:background 0.2s; }
.custom-gallery-filters button.active, .custom-gallery-filters button:hover { background:#e0e0e0; }
.mix { position:relative; overflow:hidden; }
.mix img { width:100%; height:140px; object-fit:cover; border-radius:5px; cursor:pointer; transition:transform 0.2s; }
.mix img:hover { transform:scale(1.04); }
.custom-lightbox-overlay { display:none; position:fixed!important; top:0!important; left:0!important; width:100vw!important; height:100vh!important; background:rgba(0,0,0,0.85); justify-content:center; align-items:center; z-index:999999!important; flex-direction:column; }
.custom-lightbox-overlay.active { display:flex; }
.custom-lightbox-img { max-width:90vw; max-height:60vh; object-fit:contain; border-radius:8px; box-shadow:0 0 30px #111; display:block; margin:0 auto; }
.custom-lightbox-thumbs { margin-top:10px; text-align:center; }
.custom-thumb { width:50px; margin:0 2px; border-radius:4px; cursor:pointer; opacity:0.7; border:2px solid transparent; transition:opacity 0.2s, border 0.2s; }
.custom-thumb.active, .custom-thumb:hover { opacity:1; border:2px solid #fff; }
.custom-lightbox-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.7); border:none; font-size:2.5rem; cursor:pointer; padding:8px 18px; border-radius:50%; z-index:2; color:#222; transition:background 0.2s; }
.custom-lightbox-arrow.prev { left:2vw; }
.custom-lightbox-arrow.next { right:2vw; }
.custom-lightbox-arrow:hover { background:#fff; }
@media (max-width:600px){
    .custom-lightbox-img { max-width:98vw; max-height:40vh; }
    .custom-lightbox-arrow.prev { left:10px; }
    .custom-lightbox-arrow.next { right:10px; }
}
        `;
        document.head.appendChild(style);
    }

    // Initialisation après chargement de MixItUp
    mixitupScript.onload = function() {
        console.log('Recherche des .custom_gallery_component');
        document.querySelectorAll('.custom_gallery_component').forEach(container => {
            console.log('Nombre de galeries trouvées:', document.querySelectorAll('.custom_gallery_component').length);
            console.log('Attribut data-gallery:', container.getAttribute('data-gallery'));
            console.log('Attribut data-categories:', container.getAttribute('data-categories'));
            const images = JSON.parse(container.getAttribute('data-gallery'));
            const categories = JSON.parse(container.getAttribute('data-categories'));
            console.log('Images:', images);
            console.log('Categories:', categories);

            // Log des propriétés de chaque image
            images.forEach((img, i) => {
                console.log('img.src:', img.src, 'img.thumb:', img.thumb);
            });

            // Génère la galerie
            container.innerHTML = `
                <div class="custom-gallery-filters">
                    <button data-filter="all" class="active">Tout</button>
                    ${categories.map(cat => `<button data-filter=".${cat}">${cat}</button>`).join('')}
                </div>
                <div class="custom-gallery-grid">
                    ${images.map((img, i) => `
                        <div class="mix ${img.cat}" data-index="${i}">
                            <img src="${img.thumb || img.src}" alt="${img.title}">
                        </div>
                    `).join('')}
                </div>
            `;
            console.log('HTML généré pour la galerie:', container.innerHTML);

            // Initialise MixItUp
            const mixer = mixitup(container.querySelector('.custom-gallery-grid'), {
                animation: { duration: 300 },
                selectors: { target: '.mix' }
            });

            // Lightbox global (dans <body>)
            if (!document.getElementById('global-lightbox')) {
                const overlay = document.createElement('div');
                overlay.id = 'global-lightbox';
                overlay.className = 'custom-lightbox-overlay';
                overlay.innerHTML = `
                    <button class="custom-lightbox-arrow prev">❮</button>
                    <img class="custom-lightbox-img" src="" alt="">
                    <div class="custom-lightbox-thumbs"></div>
                    <button class="custom-lightbox-arrow next">❯</button>
                `;
                document.body.appendChild(overlay);
            }

            const lightbox = document.getElementById('global-lightbox');
            const lightboxImg = lightbox.querySelector('.custom-lightbox-img');
            const lightboxThumbs = lightbox.querySelector('.custom-lightbox-thumbs');
            let currentIndex = 0;

            function showLightbox(index) {
                currentIndex = index;
                lightboxImg.src = images[currentIndex].src;
                // Génère les thumbnails
                let thumbsHtml = '';
                images.forEach((img, idx) => {
                    thumbsHtml += `<img src="${img.thumb || img.src}" class="custom-thumb${idx===currentIndex?' active':''}" data-thumb-idx="${idx}">`;
                });
                lightboxThumbs.innerHTML = thumbsHtml;
                // Gestion du clic sur les thumbnails
                Array.from(lightboxThumbs.querySelectorAll('.custom-thumb')).forEach((thumb, idx) => {
                    thumb.onclick = function(e) {
                        e.stopPropagation();
                        showLightbox(idx);
                    }
                });
                lightbox.classList.add('active');
            }

            // Gestion des clics sur les images de la grille
            container.querySelectorAll('.mix img').forEach((img, index) => {
                img.addEventListener('click', () => {
                    showLightbox(index);
                });
            });

            // Navigation flèches
            lightbox.querySelector('.prev').addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showLightbox(currentIndex);
            });
            lightbox.querySelector('.next').addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                showLightbox(currentIndex);
            });

            // Fermeture au clic sur le fond
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });

            // Navigation clavier
            document.addEventListener('keydown', function(e) {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') lightbox.classList.remove('active');
                if (e.key === 'ArrowLeft') lightbox.querySelector('.prev').click();
                if (e.key === 'ArrowRight') lightbox.querySelector('.next').click();
            });
        });
    };
})();
