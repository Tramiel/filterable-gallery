(function() {
  // Attendre que la fenêtre soit complètement chargée
  window.addEventListener('load', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Tableau pour les attributs ALT et TITLE
    const altMap = {
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg': 'Étude de sol G5 - Expertise sinistre',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg': 'Étude de sol G1 - Loi Elan',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg': 'Étude de sol - Assainissement',
      'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg': 'Étude de sol G2 - Fondations restaurant scolaire'
    };

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
      .gallery-grid { display: block !important; padding: 20px !important; position: relative !important; overflow: hidden !important; min-height: 424px !important; opacity: 0; transition: opacity 0.6s ease !important; }
      .gallery-grid.is-loaded { opacity: 1 !important; }
      .grid-sizer { width: calc(33.333% - 16px) !important; height: 0 !important; }
      .gallery-item { position: absolute !important; width: calc(33.333% - 16px) !important; margin: 8px !important; height: 200px !important; border-radius: 8px !important; overflow: hidden !important; will-change: transform, opacity !important; transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .gallery-item.isotope-hidden { opacity: 0 !important; transform: scale(0.8) translateY(-20px) !important; pointer-events: none !important; }
      .gallery-item img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.3s ease !important; }
      .gallery-item:hover img { transform: scale(1.05) !important; }
      .gallery-item .overlay { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background: rgba(0, 0, 0, 0.5) !important; opacity: 0 !important; transition: opacity 0.3s ease !important; pointer-events: none !important; }
      .gallery-item:hover .overlay { opacity: 1 !important; }
      .gallery-item .caption { position: absolute !important; bottom: 10px !important; left: 10px !important; color: #fff !important; font-size: 14px !important; opacity: 0 !important; transform: translateY(10px) !important; transition: opacity 0.3s ease, transform 0.3s ease !important; }
      .gallery-item:hover .caption { opacity: 1 !important; transform: translateY(0) !important; }
      @media only screen and (max-width: 400px) {
        .gallery-grid { padding: 8px !important; min-height: 376px !important; }
        .grid-sizer, .gallery-item { width: calc(100% - 16px) !important; height: 180px !important; }
      }
      @media only screen and (min-width: 400px) and (max-width: 920px) {
        .custom-gallery { padding: 8px !important; }
        .gallery-grid { padding: 8px !important; min-height: 396px !important; }
        .grid-sizer, .gallery-item { width: calc(50% - 16px) !important; height: 190px !important; }
        .filter-buttons { gap: 8px !important; padding: 4px 0 !important; }
        .filter-button { padding: 8px 10px !important; font-size: 15px !important; }
      }
      .lg-container { z-index: 1000000 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; }
      .lg-sub-html { color: #fff !important; font-size: 14px !important; padding: 10px !important; }
      .lg-backdrop { z-index: 999999 !important; }
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
        <div class="gallery-item sols" data-src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg" data-sub-html="<h4>Étude de sol G5 - Expertise sinistre</h4>">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || 'Expertise Sinistre'}</div>
        </div>
        <div class="gallery-item elan" data-src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg" data-sub-html="<h4>Étude de sol G1 - Loi Elan</h4>">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || 'Loi Elan'}</div>
        </div>
        <div class="gallery-item assainissement" data-src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg" data-sub-html="<h4>Étude de sol - Assainissement</h4>">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
               alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}"
               title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}">
          <div class="overlay"></div>
          <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || 'Assainissement'}</div>
        </div>
        <div class="gallery-item references" data-src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg" data-sub-html="<h4>Étude de sol G2 - Fondations restaurant scolaire</h4>">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg"
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
      if (img && img.src) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onerror = () => console.error(`Erreur de chargement de l'image : ${img.src}`);
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
      script.onerror = () => console.error(`Erreur de chargement du script : ${src}`);
      localDocument.head.appendChild(script);
    });

    // Ajout du CSS pour lightGallery
    const lgStyle = localDocument.createElement('link');
    lgStyle.rel = 'stylesheet';
    lgStyle.href = 'https://cdn.jsdelivr.net/npm/lightgallery@2.7.0/css/lightgallery.css';
    lgStyle.onload = () => console.log('CSS lightGallery chargé');
    lgStyle.onerror = () => console.error('Erreur de chargement du CSS lightGallery');
    localDocument.head.appendChild(lgStyle);

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
          columnWidth: '.grid-sizer',
          gutter: 16
        }
      });

      // Forcer le recalcul de la disposition après chargement
      imagesLoaded(grid, { background: true }, function() {
        iso.layout();
        grid.classList.add('is-loaded');
        setTimeout(() => iso.layout(), 100); // Recalcul supplémentaire
      });

      // Gestion des filtres avec mise à jour de lightGallery
      let lgInstance = null;
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          const filterValue = this.getAttribute('data-filter');
          iso.arrange({
            filter: filterValue,
            onArrangeComplete: () => {
              // Mettre à jour lightGallery pour n'inclure que les éléments visibles
              if (lgInstance) {
                lgInstance.destroy(true);
              }
              lgInstance = lightGallery(grid, {
                selector: '.gallery-item:not(.isotope-hidden)',
                speed: 600,
                counter: false,
                download: false,
                closeOnTap: true,
                enableDrag: true,
                enableSwipe: true,
                getCaptionFromTitleOrAlt: true,
                subHtmlSelectorRelative: true,
                appendSubHtmlTo: '.lg-sub-html',
                mobileSettings: {
                  showCloseIcon: true,
                  controls: true
                },
                licenseKey: '0000-0000-000-0000', // À remplacer par une clé valide en production
                container: isInIframe ? targetBody : localDocument.body // Attacher au body parent en iframe
              });
            }
          });
        });
      });

      // Initialisation initiale de lightGallery
      lgInstance = lightGallery(grid, {
        selector: '.gallery-item:not(.isotope-hidden)',
        speed: 600,
        counter: false,
        download: false,
        closeOnTap: true,
        enableDrag: true,
        enableSwipe: true,
        getCaptionFromTitleOrAlt: true,
        subHtmlSelectorRelative: true,
        appendSubHtmlTo: '.lg-sub-html',
        mobileSettings: {
          showCloseIcon: true,
          controls: true
        },
        licenseKey: '0000-0000-000-0000', // À remplacer par une clé valide en production
        container: isInIframe ? targetBody : localDocument.body // Attacher au body parent en iframe
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
