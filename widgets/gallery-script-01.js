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
        border-radius: 5px;
        overflow: hidden;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease, height 0.3s ease;
      }
      .gallery-item.hidden {
        opacity: 0;
        transform: translateY(20px);
        height: 0;
        margin: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .gallery-item img {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 4/3 !important;
        object-fit: contain !important;
        display: block !important;
        border-radius: 5px !important;
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
        .gallery-grid {
          grid-template-columns: repeat(auto-fill, 150px) !important;
        }
        .gallery-item {
          width: 150px !important;
        }
        .filter-button {
          padding: 8px 15px !important;
          font-size: 14px !important;
        }
        .gallery-item img {
          aspect-ratio: 4/3 !important;
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
      .lightbox-img {
        max-width: 90vw !important;
        max-height: 70vh !important;
        object-fit: contain !important;
        border-radius: 8px !important;
        box-shadow: 0 0 30px #111 !important;
        display: block !important;
        margin: 0 auto !important;
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
    `;
    targetDocument.head.appendChild(parentStyle);

    // Injecter le HTML
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Toutes</button>
        <button class="filter-button" data-filter="mariage" role="tab" aria-selected="false">Coiffures de mariage</button>
        <button class="filter-button" data-filter="soiree" role="tab" aria-selected="false">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item mariage">
          <img src="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=1224"
               alt="Coiffure élégante pour mariage" 
               title="Coiffure élégante pour mariage">
        </div>
        <div class="gallery-item soiree">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1224"
               alt="Coiffure glamour pour soirée" 
               title="Coiffure glamour pour soirée">
        </div>
        <div class="gallery-item mariage">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1224"
               alt="Coiffure romantique pour mariage" 
               title="Coiffure romantique pour mariage">
        </div>
      </div>
    `;

    // Créer le lightbox dans le DOM parent
    let lightbox = targetDocument.querySelector('.lightbox-overlay');
    if (!lightbox) {
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
    }

    // Initialisation du filtrage
    const filterButtons = galleryContainer.querySelectorAll('.filter-button');
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    let currentFilter = 'all';

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        currentFilter = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const isVisible = currentFilter === 'all' || item.classList.contains(currentFilter);
          if (isVisible) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        // Animation fluide via transitions CSS
        requestAnimationFrame(() => {
          galleryItems.forEach(item => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease';
          });
        });
      });
    });

    // Initialisation du lightbox
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
    let currentIndex = 0;

    function getVisibleImages() {
      return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
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
          showLightbox(parseInt(thumb.getAttribute('data-index')));
        });
      });
    }

    function showLightbox(index) {
      const visibleImages = getVisibleImages();
      if (index < 0 || index >= visibleImages.length) return;
      currentIndex = index;
      lightboxImg.src = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
      lightboxImg.alt = visibleImages[currentIndex].querySelector('img').alt;
      lightbox.classList.add('active');
      updateThumbnails();
      targetBody.style.overflow = 'hidden';
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const visibleImages = getVisibleImages();
        const visibleIndex = visibleImages.indexOf(item);
        showLightbox(visibleIndex);
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
    }

    function showPrev() {
      let idx = currentIndex - 1;
      const visibleImages = getVisibleImages();
      if (idx < 0) idx = visibleImages.length - 1;
      showLightbox(idx);
    }

    function showNext() {
      let idx = currentIndex + 1;
      const visibleImages = getVisibleImages();
      if (idx >= visibleImages.length) idx = 0;
      showLightbox(idx);
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
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

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
