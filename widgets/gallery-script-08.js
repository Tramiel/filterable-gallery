(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    const getVisibleImages = () =>
      Array.from(galleryContainer.querySelectorAll('.gallery-item')).filter(
        (item) => !item.classList.contains('mixitup-hidden')
      );

    const style = document.createElement('style');
    style.textContent = `.lightbox-img.fading{opacity:0;transform:translateX(20px);transition:all .3s ease;}`;
    document.head.appendChild(style);

    let lightbox = targetDocument.querySelector('.lightbox-overlay');
    if (!lightbox) {
      lightbox = targetDocument.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = `
        <button class="lightbox-close" title="Fermer">×</button>
        <button class="lightbox-arrow prev" title="Précédente">←</button>
        <img class="lightbox-img" src="" alt="">
        <button class="lightbox-arrow next" title="Suivante">→</button>
        <div class="thumbnail-container"></div>`;
      targetBody.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
    let currentIndex = 0;
    let isAnimating = false;

    function updateThumbnails() {
      const images = getVisibleImages();
      thumbnailContainer.innerHTML = images
        .map(
          (item, idx) =>
            `<img class="thumbnail ${
              idx === currentIndex ? 'active' : ''
            }" src="${item.querySelector('img').src}" data-index="${idx}">`
        )
        .join('');
      thumbnailContainer.querySelectorAll('.thumbnail').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const idx = +thumb.dataset.index;
          if (!isAnimating) showLightbox(idx, idx > currentIndex ? 'right' : 'left');
        });
      });
    }

    function showLightbox(index, direction = 'none') {
      const images = getVisibleImages();
      if (index < 0 || index >= images.length || !lightboxImg) return;

      currentIndex = index;
      isAnimating = true;

      if (direction !== 'none') {
        lightboxImg.classList.add('fading');
        lightboxImg.style.transform = direction === 'right' ? 'translateX(20px)' : 'translateX(-20px)';
      }

      setTimeout(() => {
        const img = images[currentIndex].querySelector('img');
        lightboxImg.src = img.dataset.full;
        lightboxImg.alt = img.alt;
        lightboxImg.classList.remove('fading');
        lightboxImg.style.transform = 'translateX(0)';
        isAnimating = false;
      }, 300);

      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
      updateThumbnails();
    }

    function showPrev() {
      const images = getVisibleImages();
      let idx = currentIndex - 1;
      if (idx < 0) idx = images.length - 1;
      showLightbox(idx, 'left');
    }

    function showNext() {
      const images = getVisibleImages();
      let idx = currentIndex + 1;
      if (idx >= images.length) idx = 0;
      showLightbox(idx, 'right');
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      lightboxImg.alt = '';
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
      isAnimating = false;
    }

    prevBtn.onclick = (e) => {
      e.stopPropagation();
      showPrev();
    };
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      showNext();
    };
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeLightbox();
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    targetDocument.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active') || isAnimating) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    const observer = new MutationObserver(() => {
      const galleryItems = galleryContainer.querySelectorAll('.gallery-item img');
      galleryItems.forEach((img, idx) => {
        img.onclick = (e) => {
          e.stopPropagation();
          const item = img.closest('.gallery-item');
          const visibleItems = getVisibleImages();
          const index = visibleItems.indexOf(item);
          if (index !== -1) showLightbox(index);
        };
      });
    });

    observer.observe(galleryContainer, { childList: true, subtree: true });
  });
})();
