(function(){
    // Vérifie si on est dans un iframe Hostinger
    const isInIframe = window.self !== window.top;

    // Fonction pour injecter le lightbox dans le DOM global
    function createGlobalLightbox() {
        if (isInIframe) {
            // Envoie un message au parent pour créer le lightbox
            window.parent.postMessage({
                type: 'CREATE_LIGHTBOX',
                html: `
                    <div id="global-lightbox" class="custom-lightbox-overlay">
                        <button class="custom-lightbox-arrow prev">❮</button>
                        <img class="custom-lightbox-img" src="" alt="">
                        <div class="custom-lightbox-thumbs"></div>
                        <button class="custom-lightbox-arrow next">❯</button>
                    </div>
                `,
                css: `
                    .custom-lightbox-overlay { 
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(0,0,0,0.9) !important;
                        z-index: 2147483647 !important;
                        display: none;
                        justify-content: center;
                        align-items: center;
                    }
                    .custom-lightbox-overlay.active { display: flex !important; }
                    .custom-lightbox-img { max-width: 90vw; max-height: 90vh; }
                `
            }, '*');
        } else {
            // Crée le lightbox localement si pas en iframe
            const overlay = document.createElement('div');
            overlay.id = 'global-lightbox';
            overlay.className = 'custom-lightbox-overlay';
            overlay.innerHTML = `...`; // Même HTML que ci-dessus
            document.body.appendChild(overlay);
        }
    }

    // Écoute les messages du parent (si en iframe)
    if (isInIframe) {
        window.addEventListener('message', (e) => {
            if (e.data.type === 'LIGHTBOX_ACTION') {
                const lightbox = document.getElementById('global-lightbox');
                if (e.data.action === 'show') lightbox.classList.add('active');
                if (e.data.action === 'hide') lightbox.classList.remove('active');
            }
        });
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        createGlobalLightbox();
        // ... reste du code (filtres, grille, etc.)
    });
})();
