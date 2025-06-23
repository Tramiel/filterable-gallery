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

    let lightbox = targetDocument.querySelector('.lightbox-overlay');
    const lightboxHTML = \`
      <button class="lightbox-close" title="Fermer">×</button>
      <button class="lightbox-arrow prev" title="Précédente">←</button>
      <div class="lightbox-image-wrapper">
        <img class="lightbox-img" src="" alt="">
      </div>
      <button class="lightbox-arrow next" title="Suivante">→</button>
      <div class="thumbnail-container"></div>
    \`;

    if (!lightbox) {
      lightbox = targetDocument.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = lightboxHTML;
      targetBody.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');

    let currentIndex = 0;
    let isAnimating = false;

    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');

    function getVisibleImages() {
      return Array.from(galleryItems).filter(item => {
        const style = window.getComputedStyle(item);
        return style.display !== 'none' && !item.classList.contains('mixitup-hidden');
      });
    }

    function updateThumbnails() {
      const visibleImages = getVisibleImages();
      thumbnailContainer.innerHTML = visibleImages.map((item, idx) => \`
        <img class="thumbnail \${idx === currentIndex ? 'active' : ''}" 
             src="\${item.querySelector('img').src}" 
             alt="\${item.querySelector('img').alt}" 
             data-index="\${idx}">
      \`).join('');

      thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const newIndex = parseInt(thumb.getAttribute('data-index'));
          if (!isAnimating && newIndex !== currentIndex) {
            showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
          }
        });
      });
    }

    function showLightbox(index, direction = 'none') {
      if (isAnimating) return;
      const visibleImages = getVisibleImages();
      if (index < 0 || index >= visibleImages.length) return;

      const newSrc = visibleImages[index].querySelector('img').getAttribute('data-full');
      const newAlt = visibleImages[index].querySelector('img').alt;

      const newImg = document.createElement('img');
      newImg.src = newSrc;
      newImg.alt = newAlt;
      newImg.className = 'lightbox-img';
      newImg.style.position = 'absolute';
      newImg.style.top = '0';
      newImg.style.left = direction === 'right' ? '100%' : '-100%';
      newImg.style.transition = 'left 0.4s ease';
      newImg.style.width = '100%';
      newImg.style.height = '100%';
      newImg.style.objectFit = 'contain';

      const wrapper = lightbox.querySelector('.lightbox-image-wrapper');
      wrapper.appendChild(newImg);
      isAnimating = true;

      setTimeout(() => {
        newImg.style.left = '0';
        lightboxImg.style.transition = 'left 0.4s ease';
        lightboxImg.style.position = 'absolute';
        lightboxImg.style.left = direction === 'right' ? '-100%' : '100%';
      }, 10);

      setTimeout(() => {
        wrapper.removeChild(lightboxImg);
        newImg.classList.remove('lightbox-img');
        newImg.classList.add('lightbox-img');
        newImg.removeAttribute('style');
        isAnimating = false;
        updateThumbnails();
      }, 420);

      currentIndex = index;
      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      lightboxImg.alt = '';
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
      isAnimating = false;
    }

    function showPrev() {
      const visibleImages = getVisibleImages();
      const idx = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
      showLightbox(idx, 'left');
    }

    function showNext() {
      const visibleImages = getVisibleImages();
      const idx = (currentIndex + 1) % visibleImages.length;
      showLightbox(idx, 'right');
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      img.addEventListener('click', () => {
        const visibleImages = getVisibleImages();
        const visibleIndex = visibleImages.indexOf(item);
        if (visibleIndex !== -1) {
          currentIndex = visibleIndex;
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
  });
})();
