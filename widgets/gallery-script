// gallery.js
(function() {
  // Attendre que le DOM soit chargé
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    // Initialisation du filtrage
    const filterButtons = galleryContainer.querySelectorAll('.filter-button');
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filtrer les éléments
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

    // Créer le conteneur du lightbox
    let lightbox = document.querySelector('.custom-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'custom-lightbox';
      lightbox.innerHTML = `
        <img class="lightbox-image" id="lightboxImage" src="" alt="">
        <button class="lightbox-prev" id="lightboxPrev"><</button>
        <button class="lightbox-next" id="lightboxNext">></button>
        <button class="lightbox-close" id="lightboxClose">×</button>
      `;
      document.body.appendChild(lightbox);
    }

    // Initialisation du lightbox
    const lightboxImage = lightbox.querySelector('#lightboxImage');
    const prevButton = lightbox.querySelector('#lightboxPrev');
    const nextButton = lightbox.querySelector('#lightboxNext');
    const closeButton = lightbox.querySelector('#lightboxClose');
    const links = galleryContainer.querySelectorAll('.gallery-link');
    let currentIndex = 0;

    function showImage(index) {
      currentIndex = index;
      lightboxImage.src = links[index].href;
      lightboxImage.alt = links[index].querySelector('img').alt;
      lightbox.classList.add('active');
      prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
      nextButton.style.display = currentIndex === links.length - 1 ? 'none' : 'block';
      document.body.style.overflow = 'hidden'; // Bloquer le défilement
    }

    links.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) showImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex < links.length - 1) showImage(currentIndex + 1);
    });

    closeButton.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightboxImage.src = '';
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImage.src = '';
        document.body.style.overflow = '';
      }
    });
  });
})();
