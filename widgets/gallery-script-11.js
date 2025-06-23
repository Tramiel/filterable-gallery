<script>
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

    // Injecter le CSS (original + slide)
    const style = localDocument.createElement('style');
    style.textContent = `/* ton CSS initial... */
      .lightbox-img.slide-left-enter {
        transform: translateX(100%);
        opacity: 0;
      }
      .lightbox-img.slide-left-enter-active {
        transform: translateX(0%);
        opacity: 1;
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      .lightbox-img.slide-right-enter {
        transform: translateX(-100%);
        opacity: 0;
      }
      .lightbox-img.slide-right-enter-active {
        transform: translateX(0%);
        opacity: 1;
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.textContent = style.textContent;
    targetDocument.head.appendChild(parentStyle);

    galleryContainer.innerHTML = `<!-- ton HTML initial avec .filter-buttons et .gallery-grid -->`;

    // Charger MixItUp
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

    // Créer lightbox si pas déjà
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
        window.getComputedStyle(item).display !== 'none' &&
        !item.classList.contains('mixitup-hidden')
      );
    }

    function updateThumbnails() {
      if (!thumbnailContainer) return;
      const thumbs = getVisibleImages().map((item, idx) => `
        <img class="thumbnail ${idx === currentIndex ? 'active' : ''}" 
             src="${item.querySelector('img').src}" 
             alt="${item.querySelector('img').alt}" 
             data-index="${idx}">
      `).join('');
      thumbnailContainer.innerHTML = thumbs;
      thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const newIndex = parseInt(thumb.getAttribute('data-index'));
          if (!isAnimating) {
            showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
          }
        });
      });
    }

    function showLightbox(index, direction = 'none') {
      if (isAnimating || index < 0 || index >= getVisibleImages().length) return;
      isAnimating = true;
      const visibleImages = getVisibleImages();
      const newImgUrl = visibleImages[index].querySelector('img').getAttribute('data-full');
      const newAlt = visibleImages[index].querySelector('img').alt;

      const newImg = lightboxImg.cloneNode();
      newImg.src = newImgUrl;
      newImg.alt = newAlt;

      if (direction === 'right') {
        newImg.classList.add('slide-left-enter');
      } else if (direction === 'left') {
        newImg.classList.add('slide-right-enter');
      }

      lightboxImg.style.display = 'none';
      lightbox.appendChild(newImg);
      void newImg.offsetWidth;

      if (direction === 'right') {
        newImg.classList.add('slide-left-enter-active');
      } else if (direction === 'left') {
        newImg.classList.add('slide-right-enter-active');
      }

      setTimeout(() => {
        if (lightboxImg.parentNode) lightboxImg.remove();
        newImg.className = 'lightbox-img';
        newImg.style.display = '';
        currentIndex = index;
        isAnimating = false;
        updateThumbnails();
      }, 500);

      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      if (lightboxImg) {
        lightboxImg.src = '';
        lightboxImg.alt = '';
      }
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
      isAnimating = false;
    }

    function showPrev() {
      if (isAnimating) return;
      const visible = getVisibleImages();
      const idx = (currentIndex - 1 + visible.length) % visible.length;
      showLightbox(idx, 'left');
    }

    function showNext() {
      if (isAnimating) return;
      const visible = getVisibleImages();
      const idx = (currentIndex + 1) % visible.length;
      showLightbox(idx, 'right');
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      img.addEventListener('click', () => {
        const visibleIndex = getVisibleImages().indexOf(item);
        if (visibleIndex !== -1 && !isAnimating) {
          showLightbox(visibleIndex);
        }
      });
    });

    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      showPrev();
    });

    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      showNext();
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
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
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
</script>
