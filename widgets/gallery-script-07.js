(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // … (styles injection identiques à ton code) …

    // HTML de la galerie
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Toutes</button>
        <button class="filter-button" data-filter=".mariage" role="tab" aria-selected="false">Coiffures de mariage</button>
        <button class="filter-button" data-filter=".soiree" role="tab" aria-selected="false">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <!-- … tes images … -->
      </div>
    `;

    // MixItUp
    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      mixitup('.gallery-grid', {
        selectors: { target: '.gallery-item' },
        animation: { duration: 300, effects: 'fade translateZ(-360px) translateY(20px)', easing: 'ease' }
      });
      galleryContainer.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
          galleryContainer.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');
        });
      });
    };
    localDocument.head.appendChild(script);

    // Création du lightbox
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

    // 🙌 Initialisation avec navigation fluide sur filtrées
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    let filteredImages = [];
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
    let currentIndex = 0;
    let isAnimating = false;

    function updateFilteredImages() {
      filteredImages = Array.from(galleryContainer.querySelectorAll('.gallery-item'))
        .filter(item => {
          const st = window.getComputedStyle(item);
          return st.display !== 'none' && !item.classList.contains('mixitup-hidden');
        })
        .map(item => item.querySelector('img'));
    }

    function updateThumbnails() {
      thumbnailContainer.innerHTML = filteredImages.map((img, idx) => `
        <img class="thumbnail ${idx === currentIndex ? 'active' : ''}"
             src="${img.src}" alt="${img.alt}"
             data-index="${idx}">
      `).join('');
      thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const newIndex = parseInt(thumb.dataset.index);
          if (newIndex !== currentIndex) showImage(newIndex, newIndex > currentIndex ? 'right' : 'left');
        });
      });
    }

    function showImage(index, direction = 'none') {
      if (isAnimating || index < 0 || index >= filteredImages.length) return;
      isAnimating = true;
      currentIndex = index;
      const img = filteredImages[index];

      if (direction !== 'none') {
        lightboxImg.classList.add('fading');
        lightboxImg.style.transform = direction === 'right' ? 'translateX(20px)' : 'translateX(-20px)';
      }

      setTimeout(() => {
        lightboxImg.src = img.dataset.full;
        lightboxImg.alt = img.alt;
        lightboxImg.classList.remove('fading');
        lightboxImg.style.transform = 'translateX(0)';
        isAnimating = false;
        updateThumbnails();
      }, 300);

      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
    }

    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      img.addEventListener('click', e => {
        e.stopPropagation();
        updateFilteredImages();
        const idx = filteredImages.indexOf(img);
        if (idx !== -1) showImage(idx);
      });
    });

    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (isAnimating) return;
      updateFilteredImages();
      const nextIdx = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      showImage(nextIdx, 'left');
    });

    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (isAnimating) return;
      updateFilteredImages();
      const nextIdx = (currentIndex + 1) % filteredImages.length;
      showImage(nextIdx, 'right');
    });

    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
      isAnimating = false;
    });

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeBtn.click();
    });

    targetDocument.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active') || isAnimating) return;
      if (e.key === 'Escape') closeBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Ajustement iframe inchangé
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
