(function () {
  document.addEventListener('DOMContentLoaded', function () {
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
      .custom-gallery { max-width: 1224px; margin: 0 auto; padding: 20px; display: block !important; }
      .filter-buttons { text-align: center; margin: 20px 0 !important; padding: 10px 0 !important; }
      .filter-button { padding: 8px 20px !important; margin: 0 10px !important; background: #f0f0f0 !important; border: 1px solid #ddd !important; cursor: pointer !important; border-radius: 4px !important; font-size: 16px !important; transition: background 0.3s, color 0.3s, transform 0.1s !important; }
      .filter-button:hover { background: #e0e0e0 !important; }
      .filter-button.active, .filter-button[aria-selected="true"] { background: #007bff !important; color: #fff !important; font-weight: bold !important; }
      .filter-button:active { transform: scale(0.95) !important; }
      .gallery-grid { display: grid !important; grid-template-columns: repeat(auto-fill, 250px) !important; column-gap: 15px !important; row-gap: 15px !important; padding: 20px !important; justify-content: start !important; transition: opacity 0.3s; }
      .gallery-item { position: relative; width: 250px !important; height: 250px !important; border-radius: 8px !important; overflow: hidden !important; }
      .gallery-item img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; border-radius: 8px !important; cursor: pointer; transition: transform 0.3s ease; }
      .gallery-item:hover img { transform: scale(1.05); }
      .lightbox-overlay { display: none; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0, 0, 0, 0.85) !important; justify-content: center; align-items: center; z-index: 999999 !important; flex-direction: column; }
      .lightbox-overlay.active { display: flex !important; }
      .lightbox-img { max-width: 90vw !important; max-height: 70vh !important; object-fit: contain !important; border-radius: 8px !important; box-shadow: 0 0 30px #111 !important; display: block !important; margin: 0 auto !important; transition: opacity 0.4s cubic-bezier(0.22,0.61,0.36,1), transform 0.4s cubic-bezier(0.22,0.61,0.36,1) !important; }
      .lightbox-img.fading { opacity: 0; transform: scale(0.95); }
      .lightbox-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255, 255, 255, 0.7) !important; border: none !important; font-size: 2rem !important; cursor: pointer !important; padding: 8px 18px !important; border-radius: 50% !important; z-index: 1000000 !important; color: #222 !important; transition: background 0.2s !important; }
      .lightbox-arrow:hover { background: #fff !important; }
      .lightbox-arrow.prev { left: 2vw !important; }
      .lightbox-arrow.next { right: 2vw !important; }
      .lightbox-close { position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.7) !important; border: none !important; font-size: 1.5rem !important; cursor: pointer !important; padding: 5px 10px !important; border-radius: 50% !important; z-index: 1000000 !important; color: #222 !important; transition: background 0.2s !important; }
      .lightbox-close:hover { background: #fff !important; }
      .thumbnail-container { display: flex !important; justify-content: center !important; gap: 10px !important; margin-top: 10px !important; overflow-x: auto !important; max-width: 90vw !important; padding: 10px 0 !important; }
      .thumbnail { width: 60px !important; height: 60px !important; object-fit: cover !important; border-radius: 4px !important; cursor: pointer !important; opacity: 0.6 !important; transition: opacity 0.3s !important; }
      .thumbnail.active, .thumbnail:hover { opacity: 1 !important; border: 2px solid #007bff !important; }
      @media (max-width: 768px) {
        .gallery-grid { grid-template-columns: repeat(auto-fill, 150px) !important; }
        .gallery-item { width: 150px !important; height: 150px !important; }
        .filter-button { padding: 8px 15px !important; font-size: 14px !important; }
        .thumbnail { width: 50px !important; height: 50px !important; }
      }
    `;
    localDocument.head.appendChild(style);

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
    script.onload = function () {
      // Initialiser MixItUp
      const mixer = mixitup('.gallery-grid', {
        selectors: { target: '.gallery-item' },
        animation: { duration: 300, effects: 'fade translateY(20px)', easing: 'ease' }
      });

      // Gérer les boutons de filtrage
      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      filterButtons.forEach(button => {
        button.addEventListener('click', function () {
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
        });
      });

      // Fluidité lors du filtrage
      mixer.on('mixStart', function () {
        galleryContainer.querySelector('.gallery-grid').style.opacity = '0.5';
      });
      mixer.on('mixEnd', function () {
        galleryContainer.querySelector('.gallery-grid').style.opacity = '1';
        // Précharge les images visibles
        getVisibleImages().forEach(item => {
          const img = new Image();
          img.src = item.querySelector('img').getAttribute('data-full');
        });
      });

      // --- LIGHTBOX ---
      let lightbox = targetDocument.querySelector('.lightbox-overlay');
      if (!lightbox) {
        lightbox = targetDocument.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
          <button class="lightbox-close" title="Fermer">×</button>
          <button class="lightbox-arrow prev" title="Précédente">←</button>
          <img class="lightbox-img" src="" alt="">
          <button class="lightbox-arrow next" title="Suivante">→</button>
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

      function getVisibleImages() {
        return Array.from(galleryContainer.querySelectorAll('.gallery-item')).filter(item =>
          item.style.display !== 'none' && !item.classList.contains('mixitup-hidden')
        );
      }

      function updateThumbnails() {
        const visible = getVisibleImages();
        thumbnailContainer.innerHTML = visible.map((item, idx) => `
          <img class="thumbnail ${idx === currentIndex ? 'active' : ''}" 
               src="${item.querySelector('img').src}" 
               alt="${item.querySelector('img').alt}" 
               data-index="${idx}">
        `).join('');
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
          thumb.addEventListener('click', () => {
            if (!isAnimating) {
              const newIndex = parseInt(thumb.getAttribute('data-index'));
              showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
            }
          });
        });
      }

      function showLightbox(index, direction = 'none') {
        if (isAnimating || index < 0 || index >= getVisibleImages().length) return;
        isAnimating = true;
        const visible = getVisibleImages();
        currentIndex = index;
        if (direction !== 'none') {
          lightboxImg.classList.add('fading');
        }
        setTimeout(() => {
          lightboxImg.src = visible[currentIndex].querySelector('img').getAttribute('data-full');
          lightboxImg.alt = visible[currentIndex].querySelector('img').alt;
          lightboxImg.classList.remove('fading');
          isAnimating = false;
        }, direction === 'none' ? 0 : 300);
        lightbox.classList.add('active');
        updateThumbnails();
        targetBody.style.overflow = 'hidden';
      }

      galleryContainer.querySelectorAll('.gallery-item img').forEach((img, idx) => {
        img.addEventListener('click', () => {
          const visible = getVisibleImages();
          const visibleIndex = visible.findIndex(item => item.querySelector('img') === img);
          if (visibleIndex !== -1 && !isAnimating) showLightbox(visibleIndex);
        });
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        lightboxImg.alt = '';
        thumbnailContainer.innerHTML = '';
        targetBody.style.overflow = '';
        isAnimating = false;
      }

      prevBtn.addEventListener('click', e => {
        e.stopPropagation();
        const visible = getVisibleImages();
        let idx = currentIndex - 1;
        if (idx < 0) idx = visible.length - 1;
        if (visible[idx]) showLightbox(idx, 'left');
      });

      nextBtn.addEventListener('click', e => {
        e.stopPropagation();
        const visible = getVisibleImages();
        let idx = currentIndex + 1;
        if (idx >= visible.length) idx = 0;
        if (visible[idx]) showLightbox(idx, 'right');
      });

      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        closeLightbox();
      });

      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
      });

      targetDocument.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active') || isAnimating) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      });
    };
    localDocument.head.appendChild(script);
  });
})();
