(function(){
    //Ajout de console.log
    console.log('gallery-widget.js chargé');
    // Injecte MixItUp depuis CDN
    var mixitupScript = document.createElement('script');
    mixitupScript.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    document.head.appendChild(mixitupScript);

    // Injecte le CSS global
    if(!document.getElementById('custom-gallery-css')){
        const style = document.createElement('style');
        style.id = 'custom-gallery-css';
        style.textContent = `
            /* Grille */
            .custom-gallery-grid { 
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                padding: 20px;
            }
            @media (max-width: 700px) { .custom-gallery-grid { grid-template-columns: 1fr; } }
            
            /* Filtres */
            .custom-gallery-filters { text-align:center; margin:20px 0; }
            .custom-gallery-filters button { 
                margin:0 10px; padding:8px 20px; 
                background:#f0f0f0; border:1px solid #ddd; 
                cursor:pointer; border-radius:5px; transition:background 0.2s; 
            }
            .custom-gallery-filters button.active, .custom-gallery-filters button:hover { background:#e0e0e0; }
            
            /* Lightbox */
            .custom-lightbox-overlay { 
                display: none;
                position: fixed!important;
                top: 0!important; left: 0!important;
                width: 100vw!important; height: 100vh!important;
                background: rgba(0,0,0,0.85);
                justify-content: center; align-items: center;
                z-index: 999999!important;
            }
            .custom-lightbox-overlay.active { display: flex; }
            .custom-lightbox-img { 
                max-width: 90vw; max-height: 60vh;
                object-fit: contain; border-radius: 8px;
                box-shadow: 0 0 30px #111;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialisation après chargement de MixItUp
    mixitupScript.onload = function() {
        //ajout de console.log
        console.log('Recherche des .custom_gallery_component');
        document.querySelectorAll('.custom_gallery_component').forEach(container => {
            //ajout de console.log
            console.log('Nombre de galeries trouvées:', document.querySelectorAll('.custom_gallery_component').length);
            // ajout de console.log
            console.log('Attribut data-gallery:', container.getAttribute('data-gallery'));
            console.log('Attribut data-categories:', container.getAttribute('data-categories'));
            const images = JSON.parse(container.getAttribute('data-gallery'));
            const categories = JSON.parse(container.getAttribute('data-categories'));
            //ajout de console.log
            console.log('Images:', images);
            console.log('Categories:', categories);

            // Génère la galerie
            // Log des propriétés de chaque image
            images.forEach((img, i) => {
            console.log('img.src:', img.src, 'img.thumb:', img.thumb);
            });
            container.innerHTML = `
                <div class="custom-gallery-filters">
                    <button data-filter="all" class="active">Tout</button>
                    ${categories.map(cat => `<button data-filter=".${cat}">${cat}</button>`).join('')}
                </div>
                <div class="custom-gallery-grid">
                    ${images.map((img, i) => `
                        <div class="mix ${img.cat}" data-index="${i}">
                            <img src="${img.thumb}" alt="${img.title}">
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

            // Lightbox
            if (!document.getElementById('global-lightbox')) {
                const overlay = document.createElement('div');
                overlay.id = 'global-lightbox';
                overlay.className = 'custom-lightbox-overlay';
                overlay.innerHTML = `
                    <button class="custom-lightbox-arrow prev">❮</button>
                    <img class="custom-lightbox-img" src="" alt="">
                    <button class="custom-lightbox-arrow next">❯</button>
                `;
                document.body.appendChild(overlay);
            }

            const lightbox = document.getElementById('global-lightbox');
            const lightboxImg = lightbox.querySelector('.custom-lightbox-img');
            let currentIndex = 0;

            // Gestion des clics
            container.querySelectorAll('.mix img').forEach((img, index) => {
                img.addEventListener('click', () => {
                    currentIndex = index;
                    lightboxImg.src = images[currentIndex].src;
                    lightbox.classList.add('active');
                });
            });

            // Navigation
            lightbox.querySelector('.prev').addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                lightboxImg.src = images[currentIndex].src;
            });
            lightbox.querySelector('.next').addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                lightboxImg.src = images[currentIndex].src;
            });

            // Fermeture
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });
        });
    };
})();
