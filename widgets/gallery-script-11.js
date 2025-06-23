(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    const style = localDocument.createElement('style');
    style.textContent = `
      .custom-gallery { max-width: 1224px; margin: 0 auto; padding: 20px; display: block !important; }
      .filter-buttons { text-align: center; margin: 20px 0; padding: 10px 0; }
      .filter-button { padding: 8px 20px; margin: 0 10px; background: #f0f0f0; border: 1px solid #ddd; cursor: pointer; border-radius: 4px; font-size: 16px; }
      .filter-button.active { background: #007bff; color: #fff; }
      .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, 250px); gap: 15px; padding: 20px; justify-content: start; }
      .gallery-item { position: relative; width: 250px; height: 250px; border-radius: 8px; overflow: hidden; }
      .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px; cursor: pointer; transition: transform 0.3s ease; }
      .gallery-item:hover img { transform: scale(1.05); }

      .lightbox-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); justify-content: center; align-items: center; z-index: 999999; flex-direction: column; }
      .lightbox-overlay.active { display: flex; }

      .lightbox-slider { position: relative; width: 90vw; height: 70vh; overflow: hidden; display: flex; }
      .lightbox-img { min-width: 100%; height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 0 30px #111; transition: transform 0.5s ease; }

      .lightbox-arrow, .lightbox-close {
        position: absolute; background: rgba(255,255,255,0.7); border: none; font-size: 2rem; cursor: pointer; padding: 8px 18px; border-radius: 50%; z-index: 1000000; color: #222;
      }
      .lightbox-arrow:hover, .lightbox-close:hover { background: #fff; }
      .lightbox-arrow.prev { left: 2vw; top: 50%; transform: translateY(-50%); }
      .lightbox-arrow.next { right: 2vw; top: 50%; transform: translateY(-50%); }
      .lightbox-close { top: 20px; right: 20px; font-size: 1.5rem; padding: 5px 10px; }

      .thumbnail-container { display: flex; justify-content: center; gap: 10px; margin-top: 10px; overflow-x: auto; max-width: 90vw; padding: 10px 0; }
      .thumbnail { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.6; transition: opacity 0.3s; }
      .thumbnail.active { opacity: 1; border: 2px solid #007bff; }
      .thumbnail:hover { opacity: 1; }
    `;
    localDocument.head.appendChild(style);

    galleryContainer.innerHTML = `
      <div class="filter-buttons">
        <button class="filter-button active" data-filter="all">Toutes</button>
        <button class="filter-button" data-filter=".mariage">Coiffures de mariage</button>
        <button class="filter-button" data-filter=".soiree">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item mix mariage">
          <img src="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=250&h=250" data-full="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=1224" alt="Coiffure mariage 1">
        </div>
        <div class="gallery-item mix soiree">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250&h=250" data-full="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1224" alt="Coiffure soirée 1">
        </div>
        <div class="gallery-item mix mariage">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250&h=250" data-full="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1224" alt="Coiffure mariage 2">
        </div>
      </div>
    `;

    const mixScript = document.createElement('script');
    mixScript.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    mixScript.onload = function () {
      mixitup('.gallery-grid', { selectors: { target: '.gallery-item' }, animation: { duration: 300 } });

      galleryContainer.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', function () {
          galleryContainer.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
    };
    localDocument.head.appendChild(mixScript);

    // LIGHTBOX HTML dans parent
    let lightbox = targetDocument.querySelector('.lightbox-overlay');
    if (!lightbox) {
      lightbox = targetDocument.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = `
        <button class="lightbox-close">×</button>
        <button class="lightbox-arrow prev">←</button>
        <div class="lightbox-slider"></div>
        <button class="lightbox-arrow next">→</button>
        <div class="thumbnail-container"></div>
      `;
      targetBody.appendChild(lightbox);
    }

    const slider = lightbox.querySelector('.lightbox-slider');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const thumbnailContainer = lightbox.querySelector('.thumbnail-container');

    let galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let isAnimating = false;

    function getVisibleItems() {
      return Array.from(galleryItems).filter(i => !i.classList.contains('mixitup-hidden'));
    }

    function updateThumbnails() {
      const items = getVisibleItems();
      thumbnailContainer.innerHTML = items.map((item, i) => {
        const src = item.querySelector('img').src;
        return `<img class="thumbnail ${i === currentIndex ? 'active' : ''}" data-index="${i}" src="${src}" />`;
      }).join('');
      thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const index = parseInt(thumb.dataset.index);
          if (!isAnimating) showSlide(index, index > currentIndex ? 'right' : 'left');
        });
      });
    }

    function showSlide(index, direction = 'none') {
      const items = getVisibleItems();
      if (index < 0 || index >= items.length) return;

      const newImg = document.createElement('img');
      newImg.className = 'lightbox-img';
      newImg.src = items[index].querySelector('img').dataset.full || items[index].querySelector('img').src;
      newImg.alt = items[index].querySelector('img').alt;
      newImg.style.transform = `translateX(${direction === 'left' ? '-100%' : direction === 'right' ? '100%' : '0'})`;
      slider.appendChild(newImg);

      setTimeout(() => {
        const oldImg = slider.querySelector('.lightbox-img:first-child');
        newImg.style.transform = 'translateX(0)';
        if (oldImg) oldImg.style.transform = `translateX(${direction === 'left' ? '100%' : direction === 'right' ? '-100%' : '0'})`;

        setTimeout(() => {
          if (oldImg && slider.contains(oldImg)) oldImg.remove();
          isAnimating = false;
        }, 500);
      }, 30);

      currentIndex = index;
      updateThumbnails();
      lightbox.classList.add('active');
      targetBody.style.overflow = 'hidden';
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      img.addEventListener('click', () => {
        if (!isAnimating) {
          currentIndex = getVisibleItems().indexOf(item);
          showSlide(currentIndex);
        }
      });
    });

    function showNext() {
      if (isAnimating) return;
      const items = getVisibleItems();
      const next = (currentIndex + 1) % items.length;
      isAnimating = true;
      showSlide(next, 'right');
    }

    function showPrev() {
      if (isAnimating) return;
      const items = getVisibleItems();
      const prev = (currentIndex - 1 + items.length) % items.length;
      isAnimating = true;
      showSlide(prev, 'left');
    }

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    targetDocument.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active') || isAnimating) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      slider.innerHTML = '';
      thumbnailContainer.innerHTML = '';
      targetBody.style.overflow = '';
      isAnimating = false;
    }

    // Resize Iframe (si nécessaire)
    if (isInIframe) {
      const resize = () => {
        const height = galleryContainer.offsetHeight;
        window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zhl_XD' }, '*');
      };
      new ResizeObserver(resize).observe(galleryContainer);
      resize();
    }
  });
})();
