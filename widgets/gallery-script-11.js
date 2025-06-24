(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.querySelector(".custom-gallery");
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // 1. CSS injection
    const style = localDocument.createElement("style");
    style.textContent = `/* ... TON CSS EXISTANT ... */`;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement("style");
    parentStyle.textContent = `/* ... TON CSS LIGHTBOX EXISTANT ... */`;
    targetDocument.head.appendChild(parentStyle);

    const wrapperStyle = targetDocument.createElement("style");
    wrapperStyle.textContent = `
      .lightbox-img-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        max-width: 90vw;
        height: auto;
        display: flex;
        justify-content: center;
      }
      .lightbox-img {
        transition: transform 0.4s ease-in-out;
        min-width: 100%;
      }
      .lightbox-img.slide-left {
        transform: translateX(-100%);
      }
      .lightbox-img.slide-right {
        transform: translateX(100%);
      }
      .lightbox-img.show {
        transform: translateX(0%);
      }
    `;
    targetDocument.head.appendChild(wrapperStyle);

    // 2. Injecter HTML galerie et lightbox
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

    let lightbox = targetDocument.querySelector(".lightbox-overlay");
    if (!lightbox) {
      lightbox = targetDocument.createElement("div");
      lightbox.className = "lightbox-overlay";
      lightbox.id = "global-lightbox";
      lightbox.innerHTML = `
        <button class="lightbox-close" title="Fermer">×</button>
        <button class="lightbox-arrow prev" title="Précédente">←</button>
        <div class="lightbox-img-wrapper">
          <img class="lightbox-img show" src="" alt="">
        </div>
        <button class="lightbox-arrow next" title="Suivante">→</button>
        <div class="thumbnail-container"></div>
      `;
      targetBody.appendChild(lightbox);
    }

    // 3. Initialiser MixItUp après HTML injection
    const mixer = mixitup('.gallery-grid', {
      selectors: {
        target: '.gallery-item'
      },
      animation: {
        duration: 300,
        effects: 'fade translateZ(-360px) translateY(20px)',
        easing: 'ease'
      }
    });

    // Gérer les boutons de filtre
    const filterButtons = galleryContainer.querySelectorAll(".filter-button");
    filterButtons.forEach(button => {
      button.addEventListener("click", function () {
        filterButtons.forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-selected", "true");
      });
    });

    // 4. Lightbox logique avec effet de glissement
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const wrapper = lightbox.querySelector('.lightbox-img-wrapper');
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

    function showLightbox(index, direction = 'none') {
      if (isAnimating) return;
      const visibleImages = getVisibleImages();
      if (index < 0 || index >= visibleImages.length) return;

      const target = visibleImages[index].querySelector('img');
      const newImg = new Image();
      newImg.src = target.dataset.full;
      newImg.alt = target.alt;
      newImg.className = 'lightbox-img';

      if (direction === 'right') newImg.classList.add('slide-right');
      if (direction === 'left') newImg.classList.add('slide-left');

      wrapper.appendChild(newImg);
      requestAnimationFrame(() => {
        newImg.classList.add('show');
      });

      isAnimating = true;

      setTimeout(() => {
        const oldImg = wrapper.querySelectorAll('.lightbox-img')[0];
        if (oldImg && oldImg !== newImg) wrapper.removeChild(oldImg);
        newImg.classList.remove('slide-left', 'slide-right');
        newImg.classList.add('show');
        currentIndex = index;
        isAnimating = false;
      }, 400);

      lightbox.classList.add("active");
      updateThumbnails();
      targetBody.style.overflow = "hidden";
    }

    function updateThumbnails() {
      const visible = getVisibleImages();
      thumbnailContainer.innerHTML = visible.map((item, idx) => {
        const img = item.querySelector("img");
        return `<img class="thumbnail ${idx === currentIndex ? 'active' : ''}" 
          src="${img.src}" alt="${img.alt}" data-index="${idx}">`;
      }).join('');

      thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const newIndex = parseInt(thumb.dataset.index);
          if (!isAnimating) {
            showLightbox(newIndex, newIndex > currentIndex ? 'right' : 'left');
          }
        });
      });
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector("img");
      img.addEventListener("click", () => {
        const visible = getVisibleImages();
        const visibleIndex = visible.indexOf(item);
        if (visibleIndex !== -1) {
          showLightbox(visibleIndex);
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("active");
      const currentImg = wrapper.querySelector('.lightbox-img');
      if (currentImg) currentImg.remove();
      targetBody.style.overflow = "";
    }

    function showPrev() {
      const visible = getVisibleImages();
      let idx = currentIndex - 1;
      if (idx < 0) idx = visible.length - 1;
      showLightbox(idx, 'left');
    }

    function showNext() {
      const visible = getVisibleImages();
      let idx = currentIndex + 1;
      if (idx >= visible.length) idx = 0;
      showLightbox(idx, 'right');
    }

    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });

    targetDocument.addEventListener("keydown", e => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });

    // Resize
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
