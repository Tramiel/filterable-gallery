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

    // Injecter le CSS
    const style = document.createElement('style');
    style.textContent = `
      .custom-gallery {
        max-width: 1224px;
        margin: 0 auto;
        padding: 20px;
      }
      .filter-buttons {
        text-align: center;
        margin: 20px 0;
      }
      .filter-button {
        padding: 8px 20px;
        margin: 0 10px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        cursor: pointer;
        border-radius: 4px;
        font-size: 16px;
        transition: background 0.3s, color 0.3s;
      }
      .filter-button:hover,
      .filter-button.active {
        background: #007bff;
        color: #fff;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 10px;
        padding: 20px;
      }
      .gallery-item {
        position: relative;
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
      }
      .gallery-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
      .filter-button[aria-selected="true"] {
        font-weight: bold;
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
        background: rgba(0, 0, 0, 0.85);
        justify-content: center;
        align-items: center;
        z-index: 999999 !important;
        flex-direction: column;
      }
      .lightbox-overlay.active {
        display: flex;
      }
      .lightbox-img {
        max-width: 90vw;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 30px #111;
        display: block;
        margin: 0 auto;
      }
      .lightbox-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.7);
        border: none;
        font-size: 2rem;
        cursor: pointer;
        padding: 8px 18px;
        border-radius: 50%;
        z-index: 1000000;
        color: #222;
        transition: background 0.2s;
      }
      .lightbox-arrow:hover {
        background: #fff;
      }
      .lightbox-arrow.prev {
        left: 2vw;
      }
      .lightbox-arrow.next {
        right: 2vw;
      }
      .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.7);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 50%;
        z-index: 1000000;
        color: #222;
        transition: background 0.2s;
      }
      .lightbox-close:hover {
        background: #fff;
      }
      .thumbnail-container {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
        overflow-x: auto;
        max-width: 90vw;
        padding: 10px 0;
      }
      .thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.3s;
      }
      .thumbnail.active {
        opacity: 1;
        border: 2px solid #007bff;
      }
      .thumbnail:hover {
        opacity: 1;
      }
      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .filter-button {
          padding: 8px 15px;
          font-size: 14px;
        }
        .gallery-item img {
          height: 150px;
        }
        .lightbox-img {
          max-width: 98vw;
          max-height: 60vh;
        }
        .lightbox-arrow.prev {
          left: 10px;
        }
        .lightbox-arrow.next {
          right: 10px;
        }
        .thumbnail {
          width: 50px;
          height: 50px;
        }
      }
    `;
    targetDocument.head.appendChild(style);

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

    // Créer le lightbox
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
          if (currentFilter === 'all' || item.classList.contains(currentFilter)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        // Forcer le reflow pour la grille
        galleryContainer.querySelector('.gallery-grid').offsetHeight;
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
