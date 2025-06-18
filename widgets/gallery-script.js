// gallery.js
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Trouver le conteneur
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé.');
      return;
    }

    // Injecter le CSS
    const style = document.createElement('style');
    style.textContent = `
      .custom-gallery {
        max-width: 1224px;
        margin: 0 auto;
        padding: 20px;
      }
      .filter-buttons {
        margin-bottom: 20px;
        text-align: center;
      }
      .filter-button {
        padding: 10px 20px;
        margin: 0 5px;
        cursor: pointer;
        background: #f0f0f0;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        transition: background 0.3s, color 0.3s;
      }
      .filter-button:hover,
      .filter-button.active {
        background: #007bff;
        color: #fff;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }
      .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gallery-item img {
        width: 100%;
        height: auto;
        max-width: 100%;
        object-fit: contain;
        display: block;
        border-radius: 8px;
        transition: transform 0.3s;
        cursor: pointer;
      }
      .gallery-item.visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s, transform 0.3s;
      }
      .gallery-item:not(.visible) {
        opacity: 0;
        transform: translateY(20px);
        display: none;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
      .filter-button[aria-selected="true"] {
        font-weight: bold;
      }
      .custom-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100000;
      }
      .custom-lightbox.active {
        display: flex;
      }
      .lightbox-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }
      .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: background 0.3s;
      }
      .lightbox-nav:hover {
        background: #fff;
      }
      .lightbox-prev {
        left: 20px;
      }
      .lightbox-next {
        right: 20px;
      }
      .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: background 0.3s;
      }
      .lightbox-close:hover {
        background: #fff;
      }
      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .filter-button {
          padding: 8px 15px;
          font-size: 14px;
        }
        .lightbox-nav {
          width: 35px;
          height: 35px;
          font-size: 18px;
        }
        .lightbox-close {
          width: 25px;
          height: 25px;
          font-size: 16px;
        }
      }
    `;
    document.head.appendChild(style);

    // Injecter le HTML
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Toutes</button>
        <button class="filter-button" data-filter="mariage" role="tab" aria-selected="false">Coiffures de mariage</button>
        <button class="filter-button" data-filter="soiree" role="tab" aria-selected="false">Coiffures de soirée</button>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item mariage visible" data-category="mariage">
          <a href="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=1224" class="gallery-link">
            <img src="https://images.unsplash.com/photo-1687079661067-6cb3afbeaff6?auto=format&fit=crop&w=250" 
                 alt="Coiffure élégante pour mariage" 
                 title="Coiffure élégante pour mariage">
          </a>
        </div>
        <div class="gallery-item soiree visible" data-category="soiree">
          <a href="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1224" class="gallery-link">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250" 
                 alt="Coiffure glamour pour soirée" 
                 title="Coiffure glamour pour soirée">
          </a>
        </div>
        <div class="gallery-item mariage visible" data-category="mariage">
          <a href="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1224" class="gallery-link">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250" 
                 alt="Coiffure romantique pour mariage" 
                 title="Coiffure romantique pour mariage">
          </a>
        </div>
      </div>
    `;

    // Initialisation du filtrage
    const filterButtons = galleryContainer.querySelectorAll('.filter-button');
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const filterValue = this.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'flex';
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
        <button class="lightbox-prev" id="lightboxPrev">←</button>
        <button class="lightbox-next" id="lightboxNext">→</button>
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
      document.body.style.overflow = 'hidden';
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
