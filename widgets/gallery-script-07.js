(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const localDocument = document;

    // Récupérer les images déjà présentes dans .custom-gallery
    const imageElements = galleryContainer.querySelectorAll('img[data-category]');
    const categories = new Set();

    // Création dynamique des éléments
    const grid = localDocument.createElement('div');
    grid.className = 'gallery-grid';

    imageElements.forEach((img, index) => {
      const category = img.dataset.category || 'all';
      categories.add(category);

      const wrapper = localDocument.createElement('div');
      wrapper.className = 'gallery-item';
      wrapper.dataset.category = category;

      const clonedImg = img.cloneNode(true);
      clonedImg.addEventListener('click', () => openLightbox(index));

      wrapper.appendChild(clonedImg);
      grid.appendChild(wrapper);
    });

    // Création des boutons filtres
    const filterContainer = localDocument.createElement('div');
    filterContainer.className = 'filter-buttons';

    const allBtn = localDocument.createElement('button');
    allBtn.textContent = 'Tous';
    allBtn.className = 'filter-button active';
    allBtn.dataset.filter = 'all';
    filterContainer.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = localDocument.createElement('button');
      btn.textContent = cat;
      btn.className = 'filter-button';
      btn.dataset.filter = cat;
      filterContainer.appendChild(btn);
    });

    // Injection
    galleryContainer.innerHTML = '';
    galleryContainer.appendChild(filterContainer);
    galleryContainer.appendChild(grid);

    // Filtres
    filterContainer.addEventListener('click', e => {
      if (e.target.classList.contains('filter-button')) {
        const filter = e.target.dataset.filter;
        document.querySelectorAll('.filter-button').forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');

        document.querySelectorAll('.gallery-item').forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? 'block' : 'none';
        });
      }
    });

    // Lightbox
    const lightboxOverlay = targetDocument.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';

    const lightboxImg = targetDocument.createElement('img');
    lightboxImg.className = 'lightbox-img';
    lightboxOverlay.appendChild(lightboxImg);

    const closeBtn = targetDocument.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      lightboxOverlay.classList.remove('active');
    });
    lightboxOverlay.appendChild(closeBtn);

    targetDocument.body.appendChild(lightboxOverlay);

    function openLightbox(index) {
      const images = [...galleryContainer.querySelectorAll('.gallery-item img')];
      const selectedImg = images[index];
      if (!selectedImg) return;

      lightboxImg.src = selectedImg.src;
      lightboxOverlay.classList.add('active');
    }
  });
})();
