    script.onload = function() {
      // Initialiser MixItUp
      const mixer = mixitup(galleryContainer.querySelector('.gallery-grid'), {
        selectors: {
          target: '.gallery-item'
        },
        animation: {
          duration: 300
        }
      });

      // Gestion des boutons filtres
      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filterValue = button.getAttribute('data-filter');
          mixer.filter(filterValue);

          // Mise à jour aria-selected et classes active
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');
        });
      });

      // Créer la lightbox dans le DOM parent (ou local si pas iframe)
      let lightboxOverlay = targetDocument.querySelector('.lightbox-overlay');
      if (!lightboxOverlay) {
        lightboxOverlay = targetDocument.createElement('div');
        lightboxOverlay.className = 'lightbox-overlay';
        lightboxOverlay.setAttribute('role', 'dialog');
        lightboxOverlay.setAttribute('aria-modal', 'true');
        lightboxOverlay.setAttribute('aria-label', 'Visionneuse d\'images');
        lightboxOverlay.innerHTML = `
          <button class="lightbox-close" aria-label="Fermer la lightbox">&times;</button>
          <button class="lightbox-arrow prev" aria-label="Image précédente">&#10094;</button>
          <img class="lightbox-img" src="" alt="" />
          <button class="lightbox-arrow next" aria-label="Image suivante">&#10095;</button>
          <div class="thumbnail-container" role="list"></div>
        `;
        targetBody.appendChild(lightboxOverlay);
      }

      const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
      const btnClose = lightboxOverlay.querySelector('.lightbox-close');
      const btnPrev = lightboxOverlay.querySelector('.lightbox-arrow.prev');
      const btnNext = lightboxOverlay.querySelector('.lightbox-arrow.next');
      const thumbnailContainer = lightboxOverlay.querySelector('.thumbnail-container');

      // Récupérer toutes les images filtrées visibles (selon MixItUp)
      function getVisibleImages() {
        return Array.from(galleryContainer.querySelectorAll('.gallery-item:visible img'));
      }

      // Comme :visible n'existe pas en JS natif, on filtre sur display pas none
      function getFilteredImages() {
        return Array.from(galleryContainer.querySelectorAll('.gallery-item'))
          .filter(item => item.style.display !== 'none')
          .map(item => item.querySelector('img'));
      }

      let currentIndex = 0;
      let images = [];

      // Afficher lightbox sur clic image
      galleryContainer.querySelectorAll('.gallery-item img').forEach((img, index) => {
        img.addEventListener('click', () => {
          images = getFilteredImages();
          currentIndex = images.indexOf(img);
          if (currentIndex === -1) currentIndex = 0;
          openLightbox(currentIndex);
        });
      });

      // Ouvrir la lightbox
      function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightboxOverlay.classList.add('active');
        updateThumbnails();
      }

      // Fermer la lightbox
      function closeLightbox() {
        lightboxOverlay.classList.remove('active');
      }

      // Mettre à jour l’image principale de la lightbox
      function updateLightboxImage() {
        const img = images[currentIndex];
        if (!img) return;

        lightboxImg.classList.add('fading');

        setTimeout(() => {
          lightboxImg.src = img.getAttribute('data-full') || img.src;
          lightboxImg.alt = img.alt || '';
          lightboxImg.title = img.title || '';
          lightboxImg.classList.remove('fading');
          updateActiveThumbnail();
        }, 300);
      }

      // Navigation
      function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
      }
      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
      }

      // Gestion des événements boutons lightbox
      btnClose.addEventListener('click', closeLightbox);
      btnPrev.addEventListener('click', prevImage);
      btnNext.addEventListener('click', nextImage);

      // Fermer lightbox au clic hors image
      lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
      });

      // Gestion clavier dans lightbox (Esc, flèches)
      targetDocument.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') prevImage();
        else if (e.key === 'ArrowRight') nextImage();
      });

      // Miniatures sous lightbox
      function updateThumbnails() {
        thumbnailContainer.innerHTML = '';
        images.forEach((img, i) => {
          const thumb = targetDocument.createElement('img');
          thumb.className = 'thumbnail';
          thumb.src = img.src;
          thumb.alt = img.alt || '';
          thumb.title = img.title || '';
          if (i === currentIndex) thumb.classList.add('active');
          thumb.addEventListener('click', () => {
            currentIndex = i;
            updateLightboxImage();
          });
          thumbnailContainer.appendChild(thumb);
        });
      }

      function updateActiveThumbnail() {
        const thumbs = thumbnailContainer.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === currentIndex);
        });
      }
    };

    localDocument.head.appendChild(script);
  });
})();
