(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Tableau pour les attributs ALT
    const altMap = {
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg': 'Étude de sol G5 - Expertise sinistre',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg': 'Étude de sol G1 - Loi Elan',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg': 'Étude de sol - Assainissement',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg': 'Étude de sol G2 - Fondations restaurant scolaire'
    };

    // Tableau pour les attributs TITLE
    const titleMap = {
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg': 'Étude de sol G5 - Expertise sinistre',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg': 'Étude de sol G1 - Loi Elan',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg': 'Étude de sol - Assainissement',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg': 'Étude de sol G2 - Fondations restaurant scolaire'
    };

    // Ajout des styles CSS
    const style = localDocument.createElement('style');
    style.textContent = `
      .custom-gallery { max-width: 1224px; margin: 0 auto; padding: 20px; display: block !important; }
      .filter-buttons { display: flex !important; flex-wrap: wrap !important; justify-content: center !important; gap: 16px !important; margin: 20px 0 !important; padding: 10px 0 !important; font-weight: bold !important; }
      .filter-button { padding: 8px 20px !important; background: #b09862 !important; color: #fff !important; cursor: pointer !important; border: 2px solid #b09862 !important; border-radius: 4px !important; font-size: 16px !important; transition: background 0.3s, color 0.3s, transform 0.1s !important; white-space: nowrap !important; }
      .filter-button:hover { background: #df5212 !important; border: 2px solid #df5212 !important; }
      .filter-button.active, .filter-button[aria-selected="true"] { background: #df5212 !important; border: 2px solid #df5212 !important; font-weight: bold !important; }
      .filter-button:active { transform: scale(0.95) !important; }
      .gallery-grid { display: block !important; padding: 20px !important; position: relative !important; overflow: hidden !important; min-height: 424px !important; opacity: 0; transition: opacity 0.6s ease; }
      .gallery-grid.is-loaded { opacity: 1; }
      .gallery-item { position: absolute; width: calc(33.333% - 16px) !important; margin: 8px !important; height: 200px !important; border-radius: 8px !important; overflow: hidden !important; will-change: transform, opacity !important; transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .gallery-item.isotope-hidden { opacity: 0 !important; transform: scale(0.8); pointer-events: none; }
      .gallery-item img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; border-radius: 8px !important; cursor: pointer; transition: transform 0.3s ease !important; }
      .gallery-item:hover img { transform: scale(1.05); }
      .gallery-item .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); opacity: 0; transition: opacity 0.3s ease !important; pointer-events: none; }
      .gallery-item:hover .overlay { opacity: 1; }
      .gallery-item .caption { position: absolute; bottom: 10px; left: 10px; color: #fff; font-size: 14px; opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease !important; }
      .gallery-item:hover .caption { opacity: 1; transform: translateY(0); }
      @media only screen and (max-width: 400px) {
        .gallery-grid { padding: 8px !important; min-height: 376px !important; }
        .gallery-item { width: calc(100% - 16px) !important; height: 180px !important; }
      }
      @media only screen and (min-width: 400px) and (max-width: 920px) {
        .custom-gallery { padding: 8px !important; }
        .gallery-grid { padding: 8px !important; min-height: 396px !important; }
        .gallery-item { width: calc(50% - 16px) !important; margin: 8px !important; height: 190px !important; }
        .filter-buttons { gap: 8px !important; padding: 4px 0 !important; }
        .filter-button { padding: 8px 10px !important; font-size: 15px !important; }
      }
      .lg-container { z-index: 999999 !important; }
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.setAttribute('data-gallery', 'true');
    parentStyle.textContent = style.textContent;
    const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
    existingStyles.forEach(style => style.remove());
    targetDocument.head.appendChild(parentStyle);

    // Structure HTML de la galerie
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="*" role="tab" aria-selected="true">Voir tout</button>
        <button class="filter-button" data-filter=".sols" role="tab" aria-selected="false">Etudes de Sols</button>
        <button class="filter-button" data-filter=".elan" role="tab" aria-selected="false">Loi Elan</button>
        <button class="filter-button" data-filter=".assainissement" role="tab" aria-selected="false">Assainissement</button>
        <button class="filter-button" data-filter=".references" role="tab" aria-selected="false">Références</button>
      </div>
      <div class="gallery-grid">
        <div class="grid-sizer"></div>
        <div class="gallery-item sols" data-lg-id="1">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || 'Expertise Sinistre'}</div>
        </div>
        <div class="gallery-item elan" data-lg-id="2">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || 'Loi Elan'}</div>
        </div>
        <div class="gallery-item assainissement" data-lg-id="3">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || 'Assainissement'}</div>
        </div>
        <div class="gallery-item references" data-lg-id="4">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg'] || 'Références'}</div>
        </div>
      </div>
    `;
    galleryContainer.classList.add('loaded');

    // Préchargement des images
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        const fullSrc = img.getAttribute('data-full');
        const preloadImg = new Image();
        preloadImg.src = fullSrc;
      }
    });

    // Chargement des scripts nécessaires
    const scripts = [
      'https://code.jquery.com/jquery-3.6.0.min.js',
      'https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js',
      'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js',
      'https://cdn.jsdelivr.net/npm/lightgallery@2.7.0/lightgallery.min.js'
    ];

    let scriptsLoaded = 0;
    function checkAllScriptsLoaded() {
      scriptsLoaded++;
      if (scriptsLoaded === scripts.length) {
        initializeGallery();
      }
    }

    scripts.forEach(src => {
      const script = localDocument.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = checkAllScriptsLoaded;
      localDocument.head.appendChild(script);
    });

    function initializeGallery() {
      const grid = galleryContainer.querySelector('.gallery-grid');
      const filterButtons = galleryContainer.querySelectorAll('.filter-button');

      // Initialisation d'Isotope
      const iso = new Isotope(grid, {
        itemSelector: '.gallery-item',
        layoutMode: 'masonry',
        percentPosition: true,
        transitionDuration: '0.6s',
        stagger: 30,
        masonry: {
          columnWidth: '.grid-sizer'
        }
      });

      // Utilisation d'imagesLoaded pour éviter les scintillements
      imagesLoaded(grid).on('progress', function() {
        iso.layout();
      }).on('done', function() {
        grid.classList.add('is-loaded');
      });

      // Gestion des filtres
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          const filterValue = this.getAttribute('data-filter');
          iso.arrange({ filter: filterValue });
        });
      });

      // Initialisation de lightGallery
      lightGallery(grid, {
        selector: '.gallery-item',
        speed: 600,
        counter: false,
        download: false,
        mobileSettings: {
          showCloseIcon: true,
          controls: true
        }
      });

      // Gestion de la hauteur de l'iframe
      if (isInIframe) {
        const updateHeight = () => {
          const height = galleryContainer.offsetHeight;
          window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zhl_XD' }, '*');
        };
        new ResizeObserver(updateHeight).observe(galleryContainer);
        updateHeight();
      }
    }
  });
})();
