(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Trouver le conteneur
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    // Vérifier si dans une iframe
    if (window.self !== window.top) {
      console.warn('Module dans une iframe. Le plein écran peut être confiné.');
    }

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
      }
      .gallery-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
      .gallery-item.visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .gallery-item:not(.visible) {
        opacity: 0;
        transform: translateY(20px);
        display: none;
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
      }
      .lightbox-overlay.active {
        display: flex;
      }
      .lightbox-img {
        max-width: 90vw;
        max-height: 90vh;
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
          max-height: 70vh;
        }
        .lightbox-arrow.prev {
          left: 10px;
        }
        .lightbox-arrow.next {
          right: 10px;
        }
      }
    `;
    document.head.appendChild(style);

    // Injecter le HTML
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Toutes</button>
        <button class="filter-button" data-filter="mariage" role="tab" aria-selected="false">Coiffures de mariage</button>
        <button class="filter-button" data-filter="soiree" role="tab" aria-selected="false">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item mariage visible">
          <img src="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=1224"
               alt="Coiffure élégante pour mariage" 
               title="Coiffure élégante pour mariage">
        </div>
        <div class="gallery-item soiree visible">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1224"
               alt="Coiffure glamour pour soirée" 
               title="Coiffure glamour pour soirée">
        </div>
        <div class="gallery-item mariage visible">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250" 
               data-full="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1224"
               alt="Coiffure romantique pour mariage" 
               title="Coiffure romantique pour mariage">
        </div>
      </div>
    `;

    // Créer le lightbox
    let lightbox = document.querySelector('.lightbox-overlay');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.id = 'global-lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-arrow prev" title="Précédente">←</button>
        <img class="lightbox-img" src="" alt="">
        <button class="lightbox-arrow next" title="Suivante">→</button>
      `;
      document.body.appendChild(lightbox);
    }

    // Initialisation du filtrage
    const filterButtons = galleryContainer.querySelectorAll('.filter-button');
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const filterValue = this.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => item.classList.add('visible'), 10);
          } else {
            item.classList.remove('visible');
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });

    // Initialisation du lightbox
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    let currentIndex = 0;

    function getVisibleImages() {
      return Array.from(galleryItems).filter(item => item.classList.contains('visible'));
    }

    function showLightbox(index) {
      const visibleImages = getVisibleImages();
      if (index < 0 || index >= visibleImages.length) return;
      currentIndex = index;
      lightboxImg.src = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
      lightboxImg.alt = visibleImages[currentIndex].querySelector('img').alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
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
      document.body.style.overflow = '';
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

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Navigation clavier
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  });
})();
