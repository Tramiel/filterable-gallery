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
        text-align: center;
        margin: 20px 0 !important;
        padding: 10px 0 !important;
      }
      .filter-button {
        padding: 8px 20px !important;
        margin: 0 10px !important;
        background: #f0f0f0 !important;
        border: 1px solid #ddd !important;
        cursor: pointer !important;
        border-radius: 4px !important;
        font-size: 16px !important;
        transition: background 0.3s, color 0.3s, transform 0.1s !important;
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
      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(auto-fill, 150px) !important;
        }
        .gallery-item {
          width: 150px !important;
          height: 150px !important;
          border-radius: 8px !important;
        }
        .filter-button {
          padding: 8px 15px !important;
          font-size: 14px !important;
        }
        .gallery-item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
      }
    `;
    localDocument.head.appendChild(style);

    // Injecter les styles du lightbox dans le DOM parent
    const parentStyle = targetDocument.createElement('style');
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
      .lightbox-image-container {
        position: relative;
        width: 90vw !important;
        max-height: 70vh !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: row;
        align-items: center;
      }
      .lightbox-img {
        width: auto !important;
        max-width: 90vw !important;
        max-height: 70vh !important;
        object-fit: contain !important;
        border-radius: 8px !important;
        box-shadow: 0 0 30px #111 !important;
        flex-shrink: 0;
        display: block !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
      }
      .lightbox-img.incoming-left {
        transform: translateX(100%);
        opacity: 0;
      }
      .lightbox-img.incoming-right {
        transform: translateX(-100%);
        opacity: 0;
      }
      .lightbox-img.active {
        transform: translateX(0);
        opacity: 1;
      }
      .lightbox-img.outgoing-left {
        transform: translateX(-100%);
        opacity: 0;
      }
      .lightbox-img.outgoing-right {
        transform: translateX(100%);
        opacity: 0;
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
      @media (max-width: 768px) {
        .lightbox-image-container {
          width: 98vw !important;
          max-height: 60vh !important;
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
    `;
    targetDocument.head.appendChild(parentStyle);

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

    // Charger MixItUp
    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      // Initialiser MixItUp
      mixitup('.gallery-grid', {
        selectors: {
          target: '.gallery-item'
        },
        animation: {
          duration: 300,
          effects: 'fade translateZ(-360px) translateY(20px)',
          easing: 'ease'
        }
      });

      // Gérer les boutons de filtrage
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
    };
    localDocument.head.appendChild(script);

    // Fonction pour créer ou récupérer le lightbox
    function initializeLightbox() {
      let lightbox = targetDocument.querySelector('.lightbox-overlay');
      if (!lightbox) {
        lightbox = targetDocument.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.id = 'global-lightbox';

        // Créer les éléments un par un
        const closeBtn = targetDocument.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.title = 'Fermer';
        closeBtn.textContent = '×';

        const prevBtn = targetDocument.createElement('button');
        prevBtn.className = 'lightbox-arrow prev';
        prevBtn.title = 'Précédente';
        prevBtn.textContent = '←';

        const imageContainer = targetDocument.createElement('div');
        imageContainer.className = 'lightbox-image-container';

        const img = targetDocument.createElement('img');
        img.className = 'lightbox-img active';
        img.src = '';
        img.alt = '';
        imageContainer.appendChild(img);

        const nextBtn = targetDocument.createElement('button');
        nextBtn.className = 'lightbox-arrow next';
        nextBtn.title = 'Suivante';
        nextBtn.textContent = '→';

        const thumbnailContainer = targetDocument.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(prevBtn);
        lightbox.appendChild(imageContainer);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(thumbnailContainer);

        targetBody.appendChild(lightbox);
        console.log('Lightbox créé dans le DOM parent');
      }

      const lightboxImageContainer = lightbox.querySelector('.lightbox-image-container');
      if (!lightboxImageContainer) {
        console.error('Erreur : .lightbox-image-container non trouvé dans le lightbox');
        return null;
      }
      console.log('Lightbox initialisé avec succès');
      return {
        lightbox,
        lightboxImageContainer,
        prevBtn: lightbox.querySelector('.lightbox-arrow.prev'),
        nextBtn: lightbox.querySelector('.lightbox-arrow.next'),
        closeBtn: lightbox.querySelector('.lightbox-close'),
        thumbnailContainer: lightbox.querySelector('.thumbnail-container')
      };
    }

    // Initialiser le lightbox avec un délai pour le DOM parent
    let lightboxElements = null;
    function tryInitializeLightbox(attempts = 3, delay = 100) {
      lightboxElements = initializeLightbox();
      if (!lightboxElements && attempts > 0) {
        console.warn(`Échec de l'initialisation du lightbox, nouvelle tentative (${attempts} restantes)...`);
        setTimeout(() => tryInitializeLightbox(attempts - 1, delay), delay);
        return;
      }
      if (!lightboxElements) {
        console.error('Échec définitif de l\'initialisation du lightbox');
        return;
      }

      const { lightbox, lightboxImageContainer, prevBtn, nextBtn, closeBtn, thumbnailContainer } = lightboxElements;

      // Initialisation des variables
      const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
      let currentIndex = 0;
      let isAnimating = false;

      function getVisibleImages() {
        const visibleImages = Array.from(galleryItems).filter(item => {
          const style = window.getComputedStyle(item);
          return style.display !== 'none' && !item.classList.contains('mixitup-hidden');
        });
        console.log('Visible images:', visibleImages.map(item => item.querySelector('img').alt));
        return visibleImages;
      }

      function updateThumbnails() {
        thumbnailContainer.innerHTML = '';
        const visibleImages = getVisibleImages();
        visibleImages.forEach((item, idx) => {
          const thumb = targetDocument.createElement('img');
          thumb.className = `thumbnail ${idx === currentIndex ? 'active' : ''}`;
          thumb.src = item.querySelector('img').src;
          thumb.alt = item.querySelector('img').alt;
          thumb.dataset.index = idx;
          thumb.addEventListener('click', () => {
            if (!isAnimating) {
              const newIndex = parseInt(thumb.dataset.index);
              showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
            }
          });
          thumbnailContainer.appendChild(thumb);
        });
      }

      function showLightbox(index, direction = 'none') {
        if (isAnimating || index < 0 || index >= getVisibleImages().length) {
          console.warn('Animation en cours ou index hors limites:', index);
          return;
        }
        isAnimating = true;
        const visibleImages = getVisibleImages();
        currentIndex = index;

        // Nettoyer le conteneur pour l'ouverture initiale
        if (direction === 'none') {
          lightboxImageContainer.innerHTML = '';
        }

        // Créer la nouvelle image
        const newImg = targetDocument.createElement('img');
        newImg.className = `lightbox-img ${direction === 'right' ? 'incoming-right' : direction === 'left' ? 'incoming-left' : 'active'}`;
        newImg.src = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
        newImg.alt = visibleImages[currentIndex].querySelector('img').alt;
        console.log('Nouvelle image:', newImg.src, newImg.alt);

        // Ajouter la nouvelle image
        lightboxImageContainer.appendChild(newImg);

        // Animer l'ancienne image si nécessaire
        const currentImg = lightboxImageContainer.querySelector('.lightbox-img.active');
        if (currentImg && direction !== 'none') {
          currentImg.classList.remove('active');
          currentImg.classList.add(direction === 'right' ? 'outgoing-left' : 'outgoing-right');
        }

        // Forcer le reflow
        lightboxImageContainer.offsetHeight;

        // Activer la nouvelle image
        newImg.classList.remove('incoming-right', 'incoming-left');
        newImg.classList.add('active');

        // Nettoyer après l'animation
        setTimeout(() => {
          if (currentImg) {
            currentImg.remove();
          }
          isAnimating = false;
          console.log('Animation terminée, isAnimating:', isAnimating);
        }, 300);

        lightbox.classList.add('active');
        updateThumbnails();
        targetBody.style.overflow = 'hidden';
        console.log('Lightbox affiché:', newImg.alt, 'Index:', currentIndex);
      }

      galleryItems.forEach((item, idx) => {
        const img = item.querySelector('img');
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const visibleImages = getVisibleImages();
          const visibleIndex = visibleImages.indexOf(item);
          if (visibleIndex !== -1 && !isAnimating) {
            showLightbox(visibleIndex);
          }
        });
      });

      function closeLightbox() {
        if (!lightbox) {
          console.error('Erreur : lightbox est null');
          return;
        }
        lightbox.classList.remove('active');
        if (lightboxImageContainer) {
          const activeImg = lightboxImageContainer.querySelector('.lightbox-img');
          if (activeImg) {
            activeImg.src = '';
            activeImg.alt = '';
            activeImg.classList.remove('active', 'incoming-left', 'incoming-right', 'outgoing-left', 'outgoing-right');
          }
        } else {
          console.warn('Avertissement : lightboxImageContainer est null lors de la fermeture');
        }
        if (thumbnailContainer) {
          thumbnailContainer.innerHTML = '';
        }
        targetBody.style.overflow = '';
        isAnimating = false;
        console.log('Lightbox fermé');
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
        if (e.target === lightbox) closeLightbox();
      });

      // Navigation clavier
      targetDocument.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active') || isAnimating) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      });

      function showPrev() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex - 1;
        if (idx < 0) idx = visibleImages.length - 1;
        if (visibleImages[idx]) {
          showLightbox(idx, 'left');
        }
      }

      function showNext() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex + 1;
        if (idx >= visibleImages.length) idx = 0;
        if (visibleImages[idx]) {
          showLightbox(idx, 'right');
        }
      }
    }

    // Lancer l'initialisation du lightbox
    tryInitializeLightbox();

    // Ajuster la hauteur de l'iframe
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
