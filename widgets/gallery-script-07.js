document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".custom-gallery");

  // =========================
  // 🎨 1. STYLE CSS GÉNÉRÉ
  // =========================
  const style = document.createElement("style");
  style.textContent = `
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .gallery-item {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border-radius: 8px;
      transition: transform 0.3s ease;
    }

    .gallery-item:hover {
      transform: scale(1.02);
    }

    .gallery-item img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      border-radius: 8px;
    }

    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }

    .lightbox.active {
      opacity: 1;
      visibility: visible;
    }

    .lightbox img {
      max-width: 90%;
      max-height: 80%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      border-radius: 10px;
    }

    .lightbox-controls {
      position: absolute;
      top: 50%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .lightbox-controls button {
      pointer-events: all;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      font-size: 2rem;
      color: white;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background 0.3s;
      border-radius: 6px;
    }

    .lightbox-controls button:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    .lightbox-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: white;
      cursor: pointer;
    }

    @media (max-width: 600px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `;
  document.head.appendChild(style);

  // =========================
  // 🖼️ 2. HTML DE LA GALERIE
  // =========================
  const images = [
    "https://placekitten.com/800/600",
    "https://placekitten.com/801/600",
    "https://placekitten.com/802/600",
    "https://placekitten.com/803/600",
    "https://placekitten.com/804/600",
    "https://placekitten.com/805/600"
  ];

  const galleryHTML = `
    <div class="gallery-grid">
      ${images
        .map(
          (src, index) => `
        <div class="gallery-item" tabindex="0" data-index="${index}">
          <img src="${src}" alt="Image ${index + 1}" loading="lazy" />
        </div>
      `
        )
        .join("")}
    </div>
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image agrandie">
      <button class="lightbox-close" aria-label="Fermer la galerie">&times;</button>
      <div class="lightbox-controls">
        <button class="prev" aria-label="Image précédente">&#10094;</button>
        <button class="next" aria-label="Image suivante">&#10095;</button>
      </div>
      <img src="" alt="Image en grand" />
    </div>
  `;
  galleryContainer.innerHTML = galleryHTML;

  // =========================
  // 💡 3. LIGHTBOX JS
  // =========================
  const lightbox = galleryContainer.querySelector(".lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");
  const galleryItems = galleryContainer.querySelectorAll(".gallery-item");
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const src = images[currentIndex];
    lightboxImg.src = src;
    lightbox.classList.add("active");
    lightboxImg.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openLightbox(Number(item.dataset.index));
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrev();
        break;
      case "ArrowRight":
        showNext();
        break;
    }
  });
});
