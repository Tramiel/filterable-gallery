(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé');
      return;
    }

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Liste des images avec captions pour la lightbox
    const images = [
      {
        src: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg',
        fullSrc: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg',
        alt: 'Expertise sinistre argiles - Haute-Garonne',
        title: 'Expertise de sol pour sinistre lié aux argiles, Haute-Garonne',
        caption: 'Expertise de sol pour sinistre lié aux argiles, Haute-Garonne',
        category: 'sols'
      },
      {
        src: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg',
        fullSrc: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg',
        alt: 'Étude de sol G1 - Loi Elan',
        title: 'Étude géotechnique G1 pour vente de terrain, Loi Elan',
        caption: 'Étude géotechnique G1 pour vente de terrain, Loi Elan',
        category: 'elan'
      },
      {
        src: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg',
        fullSrc: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg',
        alt: 'Étude de sol - Assainissement',
        title: 'Étude de sol pour système d’assainissement',
        caption: 'Étude de sol pour système d’assainissement',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg',
        fullSrc: 'https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg',
        alt: 'Fondations restaurant scolaire - Tarn',
        title: 'Étude G2 pour fondations de restaurant scolaire, Le Séquestre, Tarn',
        caption: 'Étude G2 pour fondations de restaurant scolaire, Le Séquestre, Tarn',
        category: 'references'
      }
    ];

    // Générer le HTML de la galerie avec caption au hover
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Voir tout</button>
        <button class="filter-button" data-filter=".sols" role="tab" aria-selected="false">Etudes de Sols</button>
        <button class="filter-button" data-filter=".elan" role="tab" aria-selected="false">Loi Elan</button>
        <button class="filter-button" data-filter=".assainissement" role="tab" aria-selected="false">Assainissement</button>
        <button class="filter-button" data-filter=".references" role="tab" aria-selected="false">Références</button>
      </div>
      <div class="gallery-grid">
        ${images.map(img => `
          <div class="gallery-item mix ${img.category}">
            <img src="${img.src}" data-full="${img.fullSrc}" alt="${img.alt}" data-caption="${img.caption}">
            <div class="hover-caption">${img.caption}</div>
          </div>
        `).join('')}
      </div>
    `;
    galleryContainer.classList.add('loaded');

    const style = localDocument.createElement('style');
    style.textContent = `
      .custom-gallery {
        max-width: 1224px;
        margin: 0 auto;
        padding: 20px;
        display: block !important;
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
      .gallery-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px !important;
        padding: 20px !important;
        justify-content: center !important;
        position: relative !important;
        overflow: hidden !important;
        min-height: 424px !important;
      }
      .gallery-item {
        position: relative;
        width: 100% !important;
        height: 200px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        will-change: transform, opacity !important;
      }
      .gallery-item img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        border-radius: 8px !important;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
      .hover-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5) !important;
        color: #fff !important;
        font-size: 14px !important;
        text-align: center;
        padding: 10px !important;
        opacity: 0;
        transition: opacity 0.3s ease !important;
      }
      .gallery-item:hover .hover-caption {
        opacity: 1;
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
      }
      .lightbox-overlay.active {
        display: flex !important;
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
        transition: opacity 0.2s ease !important;
      }
      .lightbox-img.active {
        opacity: 1;
      }
      .thumbnail-container {
        display: flex !important;
        justify-content: center !important;
        gap: 10px !important;
        margin-top: 10px !important;
        overflow-x: auto !important;
        max-width: 90vw !important;
        padding: 10px 0 !important;
      }
      .thumbnail {
        width: 100px !important;
        height: 75px !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        opacity: 0.6 !important;
        transition: opacity 0.3s !important;
        border: 1px solid #fff !important;
      }
      .thumbnail.active {
        opacity: 1 !important;
      }
      .thumbnail:hover {
        opacity: 1 !important;
      }
      .lightbox-arrow, .lightbox-close {
        position: absolute;
        background: rgba(255, 255, 255, 0.7) !important;
        border: none !important;
        cursor: pointer !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        z-index: 1000000 !important;
        transition: background 0.2s, transform 0.2s !important;
      }
      .lightbox-arrow:hover, .lightbox-close:hover {
        background: #fff !important;
        transform: scale(1.1) !important;
      }
      .lightbox-arrow.prev {
        left: 2vw !important;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-arrow.next {
        right: 2vw !important;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-close {
        top: 20px;
        right: 20px;
      }
      .lightbox-arrow::before, .lightbox-close::before, .lightbox-close::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
      }
      .lightbox-arrow.prev::before {
        width: 12px;
        height: 12px;
        border: solid #222;
        border-width: 0 3px 3px 0;
        transform: translate(-50%, -50%) rotate(135deg);
      }
      .lightbox-arrow.next::before {
        width: 12px;
        height: 12px;
        border: solid #222;
        border-width: 0 3px 3px 0;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      .lightbox-close::before {
        width: 20px;
        height: 2px;
        background: #222;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      .lightbox-close::after {
        content: '';
        width: 20px;
        height: 2px;
        background: #222;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      /* Option 2 : Légende en bas de l’image avec fond semi-transparent */
      .lightbox-caption {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: rgba(0, 0, 0, 0.7) !important;
        color: #fff !important;
        font-size: 16px !important;
        text-align: center !important;
        padding: 10px !important;
        max-width: 100% !important;
        border-bottom-left-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
        opacity: 0;
        transition: opacity 0.2s ease !important;
      }
      .lightbox-overlay.active .lightbox-caption {
        opacity: 1;
      }
      /* Option 1 : Légende entre l’image et les thumbnails (commentée) */
      /*
      .lightbox-caption {
        color: #fff !important;
        font-size: 16px !important;
        text-align: center !important;
        margin: 10px 0 !important;
        max-width: 90vw !important;
        opacity: 0;
        transition: opacity 0.2s ease !important;
      }
      .lightbox-overlay.active .lightbox-caption {
        opacity: 1;
      }
      */
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
        .lightbox-caption {
          font-size: 14px !important;
          padding: 8px !important;
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
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.setAttribute('data-gallery', 'true');
    parentStyle.textContent = style.textContent;
    const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
    existingStyles.forEach(style => style.remove());
    targetDocument.head.appendChild(parentStyle);

    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
          const fullSrc = img.getAttribute('data-full');
          const preloadImg = new Image();
          preloadImg.src = fullSrc;
        }
      });
    }

    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      const mixer = mixitup('.gallery-grid', {
        selectors: { target: '.gallery-item' },
        animation: {
          duration: 300,
          effects: 'fade scale(0.95)',
          easing: 'ease-out',
          queue: false
        },
        callbacks: {
          onMixStart: function() {
            const grid = galleryContainer.querySelector('.gallery-grid');
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.position = 'relative';
            wrapper.className = 'gallery-wrapper';
            grid.parentNode.insertBefore(wrapper, grid);
            wrapper.appendChild(grid);
          },
          onMixEnd: function() {
            const grid = galleryContainer.querySelector('.gallery-grid');
            const wrapper = grid.parentNode;
            if (wrapper.classList.contains('gallery-wrapper')) {
              wrapper.parentNode.insertBefore(grid, wrapper);
              wrapper.remove();
            }
          }
        }
      });

      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
        });
      });

      let lightbox = targetDocument.querySelector('.lightbox-overlay');
      if (!lightbox) {
        lightbox = targetDocument.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.id = 'global-lightbox';
        lightbox.innerHTML = `
          <button class="lightbox-close" title="Fermer" aria-label="Fermer la visionneuse"></button>
          <button class="lightbox-arrow prev" title="Précédente" aria-label="Image précédente"></button>
          <div class="lightbox-image-container">
            <img class="lightbox-img" src="" alt="">
            <div class="lightbox-caption"></div>
          </div>
          <button class="lightbox-arrow next" title="Suivante" aria-label="Image suivante"></button>
          <div class="thumbnail-container"></div>
        `;
        targetBody.appendChild(lightbox);
      }

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
      const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
      let currentIndex = 0;
      let isAnimating = false;

      if (!lightboxImg || !lightboxCaption || !prevBtn || !nextBtn || !closeBtn || !thumbnailContainer) {
        return;
      }

      function getVisibleImages() {
        return Array.from(galleryItems).filter(item => {
          const style = window.getComputedStyle(item);
          return style.display !== 'none' && !item.classList.contains('mixitup-hidden');
        });
      }

      function updateThumbnails() {
        const visibleImages = getVisibleImages();
        thumbnailContainer.innerHTML = visibleImages.map((item, idx) => `
          <img class="thumbnail ${idx === currentIndex ? 'active' : ''}"
               src="${item.querySelector('img').src}"
               alt="${item.querySelector('img').alt}"
               data-index="${idx}">
        `).join('');
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
          thumb.addEventListener('click', () => {
            if (!isAnimating) {
              showLightbox(parseInt(thumb.getAttribute('data-index')));
            }
          });
        });
      }

      function showLightbox(index) {
        if (isAnimating || index < 0 || index >= getVisibleImages().length) {
          isAnimating = false;
          return;
        }
        isAnimating = true;
        const visibleImages = getVisibleImages();
        currentIndex = index;
        const newSrc = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
        const newAlt = visibleImages[currentIndex].querySelector('img').alt;
        const newCaption = visibleImages[currentIndex].querySelector('img').getAttribute('data-caption');

        lightboxImg.classList.remove('active');
        lightboxCaption.style.opacity = '0';
        setTimeout(() => {
          lightboxImg.src = newSrc;
          lightboxImg.alt = newAlt;
          lightboxCaption.textContent = newCaption;
          lightboxImg.classList.add('active');
          lightboxCaption.style.opacity = '1';
          isAnimating = false;
        }, 200);

        lightbox.classList.add('active');
        updateThumbnails();
        targetBody.style.overflow = 'hidden';
      }

      galleryItems.forEach((item, idx) => {
        const img = item.querySelector('img');
        if (img) {
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            const visibleImages = getVisibleImages();
            const visibleIndex = visibleImages.indexOf(item);
            if (visibleIndex !== -1 && !isAnimating) {
              showLightbox(visibleIndex);
            }
          });
        }
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        lightboxImg.alt = '';
        lightboxCaption.textContent = '';
        lightboxImg.classList.remove('active');
        thumbnailContainer.innerHTML = '';
        targetBody.style.overflow = '';
        isAnimating = false;
      }

      function showPrev() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex - 1;
        if (idx < 0) idx = visibleImages.length - 1;
        if (visibleImages[idx]) {
          showLightbox(idx);
        }
      }

      function showNext() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex + 1;
        if (idx >= visibleImages.length) idx = 0;
        if (visibleImages[idx]) {
          showLightbox(idx);
        }
      }

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      targetDocument.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active') || isAnimating) return;
        if (e.key === 'Escape') {
          closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
          showPrev();
        }
        if (e.key === 'ArrowRight') {
          showNext();
        }
      });
    };
    localDocument.head.appendChild(script);

    if (isInIframe) {
      const updateHeight = () => {
        const height = galleryContainer.offsetHeight;
        window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zhl_XD' }, '*');
      };
      new ResizeObserver(updateHeight).observe(galleryContainer);
      updateHeight();
    }
  });
})();
