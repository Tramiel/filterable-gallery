(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      return;
    }

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
        transition: background 0.2s !important;
      }
      .lightbox-arrow:hover {
        background: #fff !important;
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
        transition: background 0.2s !important;
      }
      .lightbox-close:hover {
        background: #fff !important;
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
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.setAttribute('data-gallery', 'true');
    parentStyle.textContent = style.textContent;
    const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
    existingStyles.forEach(style => style.remove());
    targetDocument.head.appendChild(parentStyle);

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
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-m6LbPK76LlTkVVwe.jpg">
        </div>
        <div class="gallery-item mix elan">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-AE0r2VnBxoHRLzvl.jpg">
        </div>
        <div class="gallery-item mix assainissement">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sol_assainissement-mk3J87wjlaco54Om.jpg">
        </div>
        <div class="gallery-item mix references">
          <img src="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg"
               data-full="https://assets.zyrosite.com/YBgbqOylE1CXEOa3/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-YX4x18Ee21upqzjP.jpg">
        </div>
      </div>
    `;
    galleryContainer.classList.add('loaded');

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
          <button class="lightbox-close" title="Fermer">×</button>
          <button class="lightbox-arrow prev" title="Précédente"><</button>
          <img class="lightbox-img" src="" alt="">
          <button class="lightbox-arrow next" title="Suivante">></button>
          <div class="thumbnail-container"></div>
        `;
        targetBody.appendChild(lightbox);
      }

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
      const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
      let currentIndex = 0;
      let isAnimating = false;

      if (!lightboxImg || !prevBtn || !nextBtn || !closeBtn || !thumbnailContainer) {
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

        lightboxImg.classList.remove('active');
        setTimeout(() => {
          lightboxImg.src = newSrc;
          lightboxImg.alt = newAlt;
          lightboxImg.classList.add('active');
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
