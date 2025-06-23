
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Inject CSS...
    // (on garde ton CSS d'origine intact ici — raccourci pour la démonstration)
    const style = localDocument.createElement('style');
    style.textContent = '/* Ton CSS complet ici (inchangé) */';
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.textContent = '/* Ton CSS Lightbox ici (inchangé) */';
    targetDocument.head.appendChild(parentStyle);

    // Inject HTML galerie
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

    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      mixitup('.gallery-grid', {
        selectors: { target: '.gallery-item' },
        animation: {
          duration: 300,
          effects: 'fade translateZ(-360px) translateY(20px)',
          easing: 'ease'
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
    };
    localDocument.head.appendChild(script);

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

    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
    let currentIndex = 0;
    let isAnimating = false;

    function getVisibleImages() {
      return Array.from(galleryItems).filter(item =>
        window.getComputedStyle(item).display !== 'none' && !item.classList.contains('mixitup-hidden')
      );
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
            const newIndex = parseInt(thumb.getAttribute('data-index'));
            showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
          }
        });
      });
    }

    function showLightbox(index, direction = 'none') {
      const visibleImages = getVisibleImages();
      if (isAnimating || index < 0 || index >= visibleImages.length) return;

      const newImgSrc = visibleImages[index].querySelector('img').getAttribute('data-full');
      const newAlt = visibleImages[index].querySelector('img').alt;

      const clone = lightboxImg.cloneNode();
      clone.src = newImgSrc;
      clone.alt = newAlt;
      clone.style.position = 'absolute';
      clone.style.top = '50%';
      clone.style.left = direction === 'left' ? '-100%' : '100%';
      clone.style.transform = 'translateY(-50%)';
      clone.style.transition = 'left 0.4s ease';
      clone.style.zIndex = 1000001;

      lightbox.appendChild(clone);
      isAnimating = true;

      requestAnimationFrame(() => {
        clone.style.left = '50%';
        clone.style.transform = 'translate(-50%, -50%)';
        lightboxImg.style.left = direction === 'left' ? '100%' : '-100%';
      });

      setTimeout(() => {
        lightboxImg.src = newImgSrc;
        lightboxImg.alt = newAlt;
        lightboxImg.style.left = '50%';
        lightbox.removeChild(clone);
        isAnimating = false;
      }, 400);

      currentIndex = index;
      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
      updateThumbnails();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      targetBody.style.overflow = '';
      thumbnailContainer.innerHTML = '';
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      img.addEventListener('click', () => {
        const visibleImages = getVisibleImages();
        const visibleIndex = visibleImages.indexOf(item);
        if (visibleIndex !== -1 && !isAnimating) {
          showLightbox(visibleIndex);
        }
      });
    });

    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      const visibleImages = getVisibleImages();
      let idx = currentIndex - 1;
      if (idx < 0) idx = visibleImages.length - 1;
      showLightbox(idx, 'left');
    });

    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      const visibleImages = getVisibleImages();
      let idx = currentIndex + 1;
      if (idx >= visibleImages.length) idx = 0;
      showLightbox(idx, 'right');
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
