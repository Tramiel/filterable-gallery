(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Trouver le conteneur
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    // Détecter si dans une iframe
    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Injecter le CSS dans le DOM local
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
        margin: 20px 0 !important;
        padding: 10px 0 !important;
        gap: 10px !important;
      }
      .filter-button {
        padding: 8px 20px !important;
        background: #f0f0f0 !important;
        border: 1px solid #ddd !important;
        cursor: pointer !important;
        border-radius: 4px !important;
        font-size: 16px !important;
        transition: background 0.3s, color 0.3s, transform 0.1s !important;
        white-space: nowrap !important;
      }
      .filter-button:hover {
        background: #e0e0e0 !important;
      }
      .filter-button.active {
        background: #007bff !important;
        color: #fff !important;
      }
      .filter-button:active {
        transform: scale(0.95) !important;
      }
      .gallery-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, 250px) !important;
        column-gap: 15px !important;
        row-gap: 15px !important;
        padding: 20px !important;
        justify-content: start !important;
      }
      .gallery-item {
        position: relative;
        width: 250px !important;
        height: 250px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
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
      .filter-button[aria-selected="true"] {
        font-weight: bold !important;
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
        transition: opacity 0.4s ease !important;
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
        padding: 8px 18px !important;
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
        width: 60px !important;
        height: 60px !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        opacity: 0.6 !important;
        transition: opacity 0.3s !important;
      }
      .thumbnail.active {
        opacity: 1 !important;
        border: 2px solid #007bff !important;
      }
      .thumbnail:hover {
        opacity: 1 !important;
      }
      @media (max-width: 920px) {
        .filter-buttons {
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        .filter-button {
          padding: 6px 15px !important;
          font-size: 14px !important;
        }
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          column-gap: 10px !important;
          row-gap: 10px !important;
          padding: 10px !important;
        }
        .gallery-item {
          width: 100% !important;
          height: 200px !important;
          border-radius: 6px !important;
        }
        .gallery-item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 6px !important;
        }
      }
      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          column-gap: 8px !important;
          row-gap: 8px !important;
          padding: 8px !important;
        }
        .gallery-item {
          width: 100% !important;
          height: 180px !important;
          border-radius: 6px !important;
        }
        .filter-button {
          padding: 6px 12px !important;
          font-size: 13px !important;
        }
        .gallery-item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 6px !important;
        }
        .lightbox-img {
          max-width: 98vw !important;
          max-height: 60vh !important;
        }
        .lightbox-arrow.prev {
          left: 10px !important;
        }
        .lightbox-arrow.next {
          right: 10px !important;
        }
        .thumbnail {
          width: 50px !important;
          height: 50px !important;
        }
      }
      @media (max-width: 480px) {
        .gallery-grid {
          grid-template-columns: 1fr !important;
          column-gap: 0 !important;
          row-gap: 8px !important;
        }
        .gallery-item {
          width: 100% !important;
          height: 200px !important;
        }
        .filter-button {
          padding: 5px 10px !important;
          font-size: 12px !important;
        }
      }
    `;
    localDocument.head.appendChild(style);

    // Injecter les styles du lightbox dans le DOM parent
    const parentStyle = targetDocument.createElement('style');
    parentStyle.setAttribute('data-gallery', 'true');
    parentStyle.textContent = `
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
        transition: opacity 0.4s ease !important;
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
        padding: 8px 18px !important;
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
        width: 60px !important;
        height: 60px !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        opacity: 0.6 !important;
        transition: opacity 0.3s !important;
      }
      .thumbnail.active {
        opacity: 1 !important;
        border: 2px solid #007bff !important;
      }
      .thumbnail:hover {
        opacity: 1 !important;
      }
      @media (max-width: 920px) {
        .filter-buttons {
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        .filter-button {
          padding: 6px 15px !important;
          font-size: 14px !important;
        }
      }
      @media (max-width: 768px) {
        .lightbox-img {
          max-width: 98vw !important;
          max-height: 60vh !important;
        }
        .lightbox-arrow.prev {
          left: 10px !important;
        }
        .lightbox-arrow.next {
          right: 10px !important;
        }
        .thumbnail {
          width: 50px !important;
          height: 50px !important;
        }
      }
    `;
    try {
      const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
      existingStyles.forEach(style => style.remove());
      targetDocument.head.appendChild(parentStyle);
      console.log('Styles du lightbox injectés dans le DOM parent');
    } catch (e) {
      console.error('Erreur lors de l\'injection des styles du lightbox:', e);
    }

    // Injecter le HTML
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Toutes</button>
        <button class="filter-button" data-filter=".mariage" role="tab" aria-selected="false">Coiffures de mariage</button>
        <button class="filter-button" data-filter=".soiree" role="tab" aria-selected="false">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item mix mariage">
          <img src="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=250&h=250" 
               data-full="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=1224"
               alt="Coiffure élégante pour mariage" 
               title="Coiffure élégante pour mariage">
        </div>
        <div class="gallery-item mix soiree">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250&h=250" 
               data-full="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1224"
               alt="Coiffure glamour pour soirée" 
               title="Coiffure glamour pour soirée">
        </div>
        <div class="gallery-item mix mariage">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250&h=250" 
               data-full="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1224"
               alt="Coiffure romantique pour mariage" 
               title="Coiffure romantique pour mariage">
        </div>
      </div>
    `;
    galleryContainer.classList.add('loaded');

    // Précharger les images pleine résolution (asynchrone)
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
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
          preloadImages.push(fullSrc);
        } else {
          console.warn('Image manquante dans .gallery-item:', item);
        }
      });
      console.log('Images préchargées:', preloadImages);
    }

    // Charger MixItUp
    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      console.log('MixItUp chargé');
      const mixer = mixitup('.gallery-grid', {
        selectors: {
          target: '.gallery-item'
        },
        animation: {
          duration: 300,
          effects: 'fade translateZ(-360px) translateY(20px)',
          easing: 'ease'
        }
      });

      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          console.log('Filtre cliqué:', button.getAttribute('data-filter'));
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          setTimeout(getVisibleImages, 310);
        });
      });
    };
    localDocument.head.appendChild(script);

    // Créer le lightbox dans le DOM parent
    let lightbox = targetDocument.querySelector('.lightbox-overlay');
    if (!lightbox) {
      try {
        lightbox = targetDocument.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.id = 'global-lightbox';
        lightbox.innerHTML = `
          <button class="lightbox-close" title="Fermer">×</button>
          <button class="lightbox-arrow prev" title="Précédente">←</button>
          <img class="lightbox-img" src="" alt="">
          <button class="lightbox-arrow next" title="Suivante">→</button>
          <div class="thumbnail-container"></div>
        `;
        targetBody.appendChild(lightbox);
        console.log('Lightbox créé dans le DOM parent');
      } catch (e) {
        console.error('Erreur lors de la création du lightbox:', e);
        return;
      }
    }

    // Initialisation du lightbox
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
      console.log('Images visibles:', visibleImages.map(item => item.querySelector('img').alt));
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
        isAnimating = false;
        console.log('Affichage image:', lightboxImg.alt, 'Index:', currentIndex);
      }, 400);

      lightbox.classList.add('active');
      updateThumbnails();
      targetBody.style.overflow = 'hidden';
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
      lightboxImg.src = '';
      lightboxImg.alt = '';
      lightboxImg.classList.remove('active');
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
          window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zhl_XD' }, '*');
          console.log('Hauteur iframe mise à jour:', height);
        } catch (e) {
          console.error('Erreur lors de l\'envoi de la hauteur iframe:', e);
        }
      };
      new ResizeObserver(updateHeight).observe(galleryContainer);
      updateHeight();
    }
  });
})();
