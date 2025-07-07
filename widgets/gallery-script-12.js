(function() {
  function waitForElement(selector, callback, maxAttempts = 40, interval = 500) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Conteneur ${selector} trouvé`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`Conteneur ${selector} non trouvé, tentative ${attempts}/${maxAttempts}`);
        setTimeout(check, interval);
      } else {
        console.warn(`Conteneur ${selector} non trouvé après ${maxAttempts} tentatives, création d'un conteneur temporaire`);
        const tempContainer = document.createElement('div');
        tempContainer.className = 'custom-gallery';
        tempContainer.style.display = 'block !important';
        tempContainer.style.visibility = 'visible !important';
        tempContainer.style.position = 'relative !important';
        document.body.appendChild(tempContainer);
        console.log('Conteneur temporaire .custom-gallery créé');
        callback(tempContainer);
      }
    };
    check();
  }

  document.addEventListener('DOMContentLoaded', function() {
    waitForElement('.custom-gallery', (galleryContainer) => {
      const computedStyles = window.getComputedStyle(galleryContainer);
      console.log('Styles calculés du conteneur:', {
        className: galleryContainer.className,
        id: galleryContainer.id,
        display: computedStyles.display,
        visibility: computedStyles.visibility,
        position: computedStyles.position
      });

      galleryContainer.style.display = 'block !important';
      galleryContainer.style.visibility = 'visible !important';
      galleryContainer.style.position = 'relative !important';

      const isInIframe = window.self !== window.top;
      const targetDocument = isInIframe ? window.parent.document : document;
      const targetBody = targetDocument.body;
      const localDocument = document;

      const style = localDocument.createElement('style');
      style.textContent = `
        .custom-gallery {
          max-width: 1224px;
          margin: 0 auto;
          padding: 20px;
          display: block !important;
          visibility: visible !important;
          position: relative !important;
        }
        .filter-buttons {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 16px !important;
          margin: 20px 0 !important;
          padding: 10px 0 !important;
          font-weight: bold !important;
        }
        .filter-button {
          padding: 8px 20px !important;
          background: #b09862 !important;
          color: #fff !important;
          cursor: pointer !important;
          border: 2px solid #b09862 !important;
          border-radius: 4px !important;
          font-size: 16px !important;
          transition: background 0.3s, color 0.3s, transform 0.1s !important;
          white-space: nowrap !important;
        }
        .filter-button:hover {
          background: #df5212 !important;
          border: 2px solid #df5212 !important;
        }
        .filter-button.active, .filter-button[aria-selected="true"] {
          background: #df5212 !important;
          border: 2px solid #df5212 !important;
          font-weight: bold !important;
        }
        .filter-button:active {
          transform: scale(0.95) !important;
        }
        .filter-button.disabled {
          pointer-events: none !important;
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        .gallery-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px !important;
          padding: 20px !important;
          justify-content: center !important;
          position: relative !important;
          overflow: visible !important;
          min-height: 424px !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .gallery-item {
          position: relative;
          width: 100% !important;
          height: 200px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          will-change: transform, opacity !important;
          opacity: 1 !important;
          transform: none !important;
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: block !important;
        }
        .gallery-item.mixitup-hidden {
          opacity: 0 !important;
          transform: scale(0.95) !important;
          pointer-events: none !important;
          display: none !important;
        }
        .gallery-item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
          border-radius: 8px !important;
          cursor: pointer;
          transition: transform 0.3s ease !important;
        }
        .gallery-item:hover img {
          transform: scale(1.05) !important;
        }
        .gallery-item .overlay {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.5) !important;
          opacity: 0 !important;
          transition: opacity 0.3s ease !important;
          pointer-events: none !important;
        }
        .gallery-item:hover .overlay {
          opacity: 1 !important;
        }
        .gallery-item .caption {
          position: absolute !important;
          bottom: 10px !important;
          left: 10px !important;
          color: #fff !important;
          font-size: 14px !important;
          opacity: 0 !important;
          transform: translateY(10px) !important;
          transition: opacity 0.3s ease, transform 0.3s ease !important;
        }
        .gallery-item:hover .caption {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media only screen and (max-width: 400px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 8px !important;
            min-height: 376px !important;
          }
          .gallery-item {
            height: 180px !important;
          }
        }
        @media only screen and (min-width: 400px) and (max-width: 920px) {
          .custom-gallery {
            padding: 8px !important;
          }
          .gallery-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            padding: 8px !important;
            min-height: 396px !important;
          }
          .gallery-item {
            margin-left: 8px !important;
            margin-right: 8px !important;
            height: 190px !important;
          }
          .filter-buttons {
            gap: 8px !important;
            padding: 4px 0 !important;
          }
          .filter-button {
            padding: 8px 10px !important;
            font-size: 15px !important;
          }
        }
        .lightbox-overlay {
          display: none;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(0, 0, 0, 0.85) !important;
          justify-content: center;
          align-items: center;
          z-index: 999999 !important;
          flex-direction: column;
          opacity: 0;
          transition: opacity 0.4s ease !important;
        }
        .lightbox-overlay.active {
          display: flex !important;
          opacity: 1 !important;
        }
        .lightbox-img {
          max-width: 90vw !important;
          max-height: 70vh !important;
          object-fit: contain !important;
          border-radius: 8px !important;
          box-shadow: 0 0 30px #111 !important;
          display: block !important;
          margin: 0 auto !important;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.4s ease, transform 0.4s ease !important;
        }
        .lightbox-img.active {
          opacity: 1;
          transform: scale(1);
        }
        .lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.7) !important;
          border: none !important;
          font-size: 2rem !important;
          cursor: pointer !important;
          padding: 8px 16px !important;
          border-radius: 50% !important;
          z-index: 1000000 !important;
          color: #222 !important;
          transition: background 0.2s, transform 0.2s !important;
        }
        .lightbox-arrow:hover {
          background: #fff !important;
          transform: translateY(-50%) scale(1.1) !important;
        }
        .lightbox-arrow.prev {
          left: 2vw !important;
        }
        .lightbox-arrow.next {
          right: 2vw !important;
        }
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.7) !important;
          border: none !important;
          font-size: 1.5rem !important;
          cursor: pointer !important;
          padding: 5px 10px !important;
          border-radius: 50% !important;
          z-index: 1000000 !important;
          color: #222 !important;
          transition: background 0.2s, transform 0.2s !important;
        }
        .lightbox-close:hover {
          background: #fff !important;
          transform: scale(1.1) !important;
        }
        .thumbnail-container {
          display: flex !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-top: 10px !important;
          overflow-x: auto !important;
          max-width: 90vw !important;
          padding: 10px 0 !important;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease !important;
        }
        .thumbnail-container.active {
          opacity: 1;
          transform: translateY(0);
        }
        .thumbnail {
          width: 100px !important;
          height: 75px !important;
          object-fit: cover !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          opacity: 0.6 !important;
          transition: opacity 0.3s, transform 0.3s !important;
          border: 1px solid #fff !important;
        }
        .thumbnail.active {
          opacity: 1 !important;
          transform: scale(1.05) !important;
        }
        .thumbnail:hover {
          opacity: 1 !important;
          transform: scale(1.05) !important;
        }
      `;
      localDocument.head.appendChild(style);

      const parentStyle = targetDocument.createElement('style');
      parentStyle.setAttribute('data-gallery', 'true');
      parentStyle.textContent = style.textContent;
      try {
        const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
        existingStyles.forEach(style => style.remove());
        targetDocument.head.appendChild(parentStyle);
        console.log('Styles du lightbox injectés dans le DOM parent');
      } catch (e) {
        console.error('Erreur lors de l\'injection des styles du lightbox:', e);
      }

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

      galleryContainer.innerHTML = `
        <div class="filter-buttons" role="tablist">
          <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Voir tout</button>
          <button class="filter-button" data-filter=".sols" role="tab" aria-selected="false">Etudes de Sols</button>
          <button class="filter-button" data-filter=".elan" role="tab" aria-selected="false">Loi Elan</button>
          <button class="filter-button" data-filter=".assainissement" role="tab" aria-selected="false">Assainissement</button>
          <button class="filter-button" data-filter=".references" role="tab" aria-selected="false">Références</button>
        </div>
        <div class="gallery-grid">
          <div class="gallery-item mix sols">
            <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg"
                 data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg"
                 alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}"
                 title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || ''}">
            <div class="overlay"></div>
            <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg'] || 'Expertise Sinistre'}</div>
          </div>
          <div class="gallery-item mix elan">
            <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
                 data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
                 alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}"
                 title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || ''}">
            <div class="overlay"></div>
            <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg'] || 'Loi Elan'}</div>
          </div>
          <div class="gallery-item mix assainissement">
            <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
                 data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
                 alt="${altMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}"
                 title="${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || ''}">
            <div class="overlay"></div>
            <div class="caption">${titleMap['https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg'] || 'Assainissement'}</div>
          </div>
          <div class="gallery-item mix references">
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
      console.log('HTML de la galerie injecté');

      const galleryGrid = galleryContainer.querySelector('.gallery-grid');
      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
      console.log('État après injection:', {
        galleryGrid: galleryGrid ? 'Présent' : 'Absent',
        filterButtonsCount: filterButtons.length,
        galleryItemsCount: galleryItems.length,
        galleryGridStyles: galleryGrid ? {
          display: window.getComputedStyle(galleryGrid).display,
          visibility: window.getComputedStyle(galleryGrid).visibility,
          opacity: window.getComputedStyle(galleryGrid).opacity
        } : 'N/A',
        itemClasses: Array.from(galleryItems).map(item => item.className)
      });

      if (galleryItems.length === 0) {
        console.warn('Aucun .gallery-item trouvé dans .gallery-grid');
      } else {
        const preloadImages = [];
        galleryItems.forEach(item => {
          const img = item.querySelector('img');
          if (img) {
            const fullSrc = img.getAttribute('data-full');
            const preloadImg = new Image();
            preloadImg.src = fullSrc;
            preloadImg.onload = () => console.log(`Image préchargée : ${fullSrc}`);
            preloadImg.onerror = () => console.error(`Erreur de préchargement de l'image : ${fullSrc}`);
            preloadImages.push(fullSrc);
          } else {
            console.warn('Image manquante dans .gallery-item:', item);
          }
        });
        console.log('Images préchargées:', preloadImages);
      }

      if (filterButtons.length === 0) {
        console.warn('Aucun .filter-button trouvé dans .filter-buttons');
      } else {
        console.log('Boutons de filtrage trouvés:', Array.from(filterButtons).map(btn => btn.getAttribute('data-filter')));
      }

      function reenableButtons() {
        filterButtons.forEach(btn => btn.classList.remove('disabled'));
        console.log('Boutons réactivés');
      }

      function manualFilter(filter) {
        console.log('Filtrage manuel déclenché pour:', filter);
        const filterClass = filter === 'all' ? 'all' : filter.replace('.', '');
        galleryItems.forEach(item => {
          const isVisible = filter === 'all' || item.classList.contains(filterClass);
          item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important';
          if (isVisible) {
            item.style.opacity = '1 !important';
            item.style.transform = 'none !important';
            item.style.display = 'block !important';
            item.classList.remove('mixitup-hidden');
          } else {
            item.style.opacity = '0 !important';
            item.style.transform = 'scale(0.95) !important';
            item.style.display = 'none !important';
            item.classList.add('mixitup-hidden');
          }
          console.log('Élément:', {
            className: item.className,
            isVisible,
            styles: {
              display: window.getComputedStyle(item).display,
              opacity: window.getComputedStyle(item).opacity,
              transform: window.getComputedStyle(item).transform
            }
          });
        });
        console.log('État des éléments après filtrage manuel:', Array.from(galleryItems).map(item => ({
          className: item.className,
          display: window.getComputedStyle(item).display
        })));
        setTimeout(reenableButtons, 500);
      }

      const script = localDocument.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
      script.onload = function() {
        console.log('MixItUp chargé');
        let mixer = null;
        try {
          mixer = mixitup('.gallery-grid', {
            selectors: {
              target: '.gallery-item'
            },
            animation: {
              duration: 400,
              effects: 'fade scale(0.95)',
              easing: 'ease-out'
            },
            callbacks: {
              onMixStart: function(state) {
                console.log('Début du filtrage MixItUp:', state.activeFilter.selector);
                filterButtons.forEach(btn => btn.classList.add('disabled'));
              },
              onMixEnd: function(state) {
                console.log('Fin du filtrage MixItUp:', state.activeFilter.selector);
                reenableButtons();
                const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('mixitup-hidden'));
                console.log('Éléments visibles après filtrage MixItUp:', visibleItems.map(item => item.className));
              },
              onMixFail: function(state) {
                console.error('Échec du filtrage MixItUp:', state.activeFilter.selector);
                manualFilter(state.activeFilter.selector);
              }
            }
          });
          console.log('MixItUp initialisé');

          setTimeout(() => {
            console.log('Initialisation du filtre par défaut: all');
            try {
              mixer.filter('all');
              console.log('Filtre par défaut appliqué: all');
            } catch (err) {
              console.error('Erreur lors de l\'initialisation du filtre:', err);
              manualFilter('all');
            }
          }, 1000);

          filterButtons.forEach(button => {
            button.addEventListener('click', function() {
              if (button.classList.contains('disabled')) {
                console.log('Clic ignoré: bouton désactivé pendant l\'animation');
                return;
              }
              const filter = button.getAttribute('data-filter');
              console.log('Clic sur bouton de filtre:', filter);
              filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
              });
              button.classList.add('active');
              button.setAttribute('aria-selected', 'true');
              filterButtons.forEach(btn => btn.classList.add('disabled'));
              try {
                mixer.filter(filter);
                console.log('Filtre appliqué via MixItUp:', filter);
              } catch (err) {
                console.error('Erreur lors de l\'application du filtre via MixItUp:', err);
                manualFilter(filter);
              }
              setTimeout(reenableButtons, 500);
            });
          });
        } catch (e) {
          console.error('Erreur lors de l\'initialisation de MixItUp:', e);
          console.log('MixItUp non initialisé, activation du filtrage manuel');
          filterButtons.forEach(button => {
            button.addEventListener('click', function() {
              if (button.classList.contains('disabled')) {
                console.log('Clic ignoré: bouton désactivé pendant l\'animation');
                return;
              }
              const filter = button.getAttribute('data-filter');
              console.log('Clic sur bouton de filtre (manuel):', filter);
              filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
              });
              button.classList.add('active');
              button.setAttribute('aria-selected', 'true');
              filterButtons.forEach(btn => btn.classList.add('disabled'));
              manualFilter(filter);
              setTimeout(reenableButtons, 500);
            });
          });
          manualFilter('all');
        }
      };
      script.onerror = () => {
        console.error('Erreur de chargement de MixItUp');
        console.log('MixItUp non chargé, activation du filtrage manuel');
        filterButtons.forEach(button => {
          button.addEventListener('click', function() {
            if (button.classList.contains('disabled')) {
              console.log('Clic ignoré: bouton désactivé pendant l\'animation');
              return;
            }
            const filter = button.getAttribute('data-filter');
            console.log('Clic sur bouton de filtre (manuel):', filter);
            filterButtons.forEach(btn => {
              btn.classList.remove('active');
              btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            filterButtons.forEach(btn => btn.classList.add('disabled'));
            manualFilter(filter);
            setTimeout(reenableButtons, 500);
          });
        });
        manualFilter('all');
      };
      localDocument.head.appendChild(script);

      let lightbox = targetDocument.querySelector('.lightbox-overlay');
      if (!lightbox) {
        try {
          lightbox = targetDocument.createElement('div');
          lightbox.className = 'lightbox-overlay';
          lightbox.id = 'global-lightbox';
          lightbox.innerHTML = `
            <button class="lightbox-close" title="Fermer">×</button>
            <button class="lightbox-arrow prev" title="Précédente"><</button>
            <img class="lightbox-img" src="" alt="">
            <button class="lightbox-arrow next" title="Suivante">></button>
            <div class="thumbnail-container"></div>
          `;
          targetBody.appendChild(lightbox);
          console.log('Lightbox créé dans le DOM parent');
        } catch (e) {
          console.error('Erreur lors de la création du lightbox:', e);
          return;
        }
      }

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
      const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
      let currentIndex = 0;
      let isAnimating = false;

      if (!lightboxImg || !prevBtn || !nextBtn || !closeBtn || !thumbnailContainer) {
        console.error('Erreur : Éléments du lightbox manquants', { lightboxImg, prevBtn, nextBtn, closeBtn, thumbnailContainer });
        return;
      }

      function getVisibleImages() {
        const visibleImages = Array.from(galleryItems).filter(item => {
          const style = window.getComputedStyle(item);
          return style.display !== 'none' && !item.classList.contains('mixitup-hidden');
        });
        console.log('Images visibles:', visibleImages.map(item => item.querySelector('img').src));
        return visibleImages;
      }

      function updateThumbnails() {
        const visibleImages = getVisibleImages();
        thumbnailContainer.innerHTML = visibleImages.map((item, idx) => `
          <img class="thumbnail ${idx === currentIndex ? 'active' : ''}" 
               src="${item.querySelector('img').src}" 
               alt="${item.querySelector('img').alt}" 
               data-index="${idx}">
        `).join('');
        thumbnailContainer.classList.add('active');
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
          thumb.addEventListener('click', () => {
            if (!isAnimating) {
              console.log('Clic sur vignette:', thumb.alt, 'Index:', thumb.getAttribute('data-index'));
              showLightbox(parseInt(thumb.getAttribute('data-index')));
            }
          });
        });
      }

      function showLightbox(index) {
        if (isAnimating || index < 0 || index >= getVisibleImages().length) {
          console.warn('Animation en cours ou index hors limites:', index, isAnimating);
          isAnimating = false;
          return;
        }
        isAnimating = true;
        const visibleImages = getVisibleImages();
        currentIndex = index;
        const newSrc = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
        const newAlt = visibleImages[currentIndex].querySelector('img').alt;

        lightboxImg.classList.remove('active');
        setTimeout(() => {
          lightboxImg.src = newSrc;
          lightboxImg.alt = newAlt;
          lightboxImg.classList.add('active');
          lightbox.classList.add('active');
          updateThumbnails();
          targetBody.style.overflow = 'hidden';
          isAnimating = false;
          console.log('Affichage image:', lightboxImg.alt, 'Index:', currentIndex);
        }, 400);
      }

      galleryItems.forEach((item, idx) => {
        const img = item.querySelector('img');
        if (img) {
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Clic sur image:', img.alt, 'Index:', idx);
            const visibleImages = getVisibleImages();
            const visibleIndex = visibleImages.indexOf(item);
            if (visibleIndex !== -1 && !isAnimating) {
              showLightbox(visibleIndex);
            } else {
              console.warn('Image non visible ou animation en cours:', visibleIndex, isAnimating);
            }
          });
        } else {
          console.warn('Image manquante dans .gallery-item à l\'index:', idx);
        }
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.classList.remove('active');
        thumbnailContainer.classList.remove('active');
        lightboxImg.src = '';
        lightboxImg.alt = '';
        thumbnailContainer.innerHTML = '';
        targetBody.style.overflow = '';
        isAnimating = false;
        console.log('Lightbox fermé');
      }

      function showPrev() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex - 1;
        if (idx < 0) idx = visibleImages.length - 1;
        if (visibleImages[idx]) {
          console.log('Affichage image précédente:', idx);
          showLightbox(idx);
        }
      }

      function showNext() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex + 1;
        if (idx >= visibleImages.length) idx = 0;
        if (visibleImages[idx]) {
          console.log('Affichage image suivante:', idx);
          showLightbox(idx);
        }
      }

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Clic sur flèche précédente');
        showPrev();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Clic sur flèche suivante');
        showNext();
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Clic sur bouton fermer');
        closeLightbox();
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          console.log('Clic sur l\'overlay pour fermer');
          closeLightbox();
        }
      });

      targetDocument.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active') || isAnimating) return;
        if (e.key === 'Escape') {
          console.log('Touche Échap pressée');
          closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
          console.log('Touche flèche gauche pressée');
          showPrev();
        }
        if (e.key === 'ArrowRight') {
          console.log('Touche flèche droite pressée');
          showNext();
        }
      });

      if (isInIframe) {
        const updateHeight = () => {
          const height = galleryContainer.offsetHeight;
          try {
            window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zk3gro' }, '*');
            console.log('Hauteur iframe mise à jour:', height);
          } catch (e) {
            console.error('Erreur lors de l\'envoi de la hauteur iframe:', e);
          }
        };
        new ResizeObserver(updateHeight).observe(galleryContainer);
        updateHeight();
      }
    });
  });
})();
