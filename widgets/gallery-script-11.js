(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.querySelector(".custom-gallery");
    if (!galleryContainer) return;

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    const style = localDocument.createElement("style");
    style.textContent = `
      /* ... Ton CSS existant ... */
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement("style");
    parentStyle.textContent = `
      /* ... Ton CSS lightbox existant ... */
    `;
    targetDocument.head.appendChild(parentStyle);

    galleryContainer.innerHTML = `
      <!-- ... Ton HTML d'origine pour les boutons et images ... -->
    `;

    const mixitupScript = localDocument.createElement("script");
    mixitupScript.src = "https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js";
    mixitupScript.onload = function () {
      mixitup(".gallery-grid", {
        selectors: {
          target: ".gallery-item",
        },
        animation: {
          duration: 300,
          effects: "fade translateZ(-360px) translateY(20px)",
          easing: "ease",
        },
      });

      const filterButtons = galleryContainer.querySelectorAll(".filter-button");
      filterButtons.forEach((btn) =>
        btn.addEventListener("click", function () {
          filterButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          this.classList.add("active");
          this.setAttribute("aria-selected", "true");
        })
      );
    };
    localDocument.head.appendChild(mixitupScript);

    let lightbox = targetDocument.querySelector(".lightbox-overlay");
    if (!lightbox) {
      lightbox = targetDocument.createElement("div");
      lightbox.className = "lightbox-overlay";
      lightbox.id = "global-lightbox";
      lightbox.innerHTML = `
        <button class="lightbox-close" title="Fermer">×</button>
        <button class="lightbox-arrow prev" title="Précédente">←</button>
        <div class="lightbox-img-wrapper">
          <img class="lightbox-img" src="" alt="">
        </div>
        <button class="lightbox-arrow next" title="Suivante">→</button>
        <div class="thumbnail-container"></div>
      `;
      targetBody.appendChild(lightbox);

      const wrapperStyle = document.createElement("style");
      wrapperStyle.textContent = `
        .lightbox-img-wrapper {
          width: 100%;
          max-width: 90vw;
          height: auto;
          position: relative;
          overflow: hidden;
          display: flex;
        }
        .lightbox-img {
          min-width: 100%;
          transition: transform 0.5s ease;
        }
        .lightbox-img.transition-left {
          transform: translateX(-100%);
        }
        .lightbox-img.transition-right {
          transform: translateX(100%);
        }
        .lightbox-img.active {
          transform: translateX(0%);
        }
      `;
      targetDocument.head.appendChild(wrapperStyle);
    }

    const galleryItems = galleryContainer.querySelectorAll(".gallery-item");
    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const prevBtn = lightbox.querySelector(".lightbox-arrow.prev");
    const nextBtn = lightbox.querySelector(".lightbox-arrow.next");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const thumbnailContainer = lightbox.querySelector(".thumbnail-container");
    let currentIndex = 0;
    let isAnimating = false;

    function getVisibleImages() {
      return Array.from(galleryItems).filter(
        (item) =>
          window.getComputedStyle(item).display !== "none" &&
          !item.classList.contains("mixitup-hidden")
      );
    }

    function updateThumbnails() {
      if (!thumbnailContainer) return;
      const visible = getVisibleImages();
      thumbnailContainer.innerHTML = visible
        .map((item, idx) => {
          const img = item.querySelector("img");
          return `
          <img class="thumbnail ${idx === currentIndex ? "active" : ""}"
            src="${img.src}" 
            alt="${img.alt}"
            data-index="${idx}">
        `;
        })
        .join("");
      thumbnailContainer.querySelectorAll(".thumbnail").forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const newIndex = parseInt(thumb.getAttribute("data-index"));
          if (!isAnimating) {
            showLightbox(newIndex, newIndex > currentIndex ? "right" : "left");
          }
        });
      });
    }

    function showLightbox(index, direction = "none") {
      if (isAnimating) return;
      const visible = getVisibleImages();
      if (index < 0 || index >= visible.length) return;

      const newImg = new Image();
      const targetImg = visible[index].querySelector("img");

      newImg.src = targetImg.getAttribute("data-full");
      newImg.alt = targetImg.alt;
      newImg.className = "lightbox-img";
      newImg.style.position = "absolute";
      newImg.style.top = 0;
      newImg.style.left = 0;
      newImg.style.transition = "transform 0.5s ease";
      newImg.style.minWidth = "100%";

      if (direction === "right") {
        newImg.style.transform = "translateX(100%)";
      } else if (direction === "left") {
        newImg.style.transform = "translateX(-100%)";
      } else {
        newImg.style.transform = "translateX(0%)";
      }

      const wrapper = lightbox.querySelector(".lightbox-img-wrapper");
      wrapper.appendChild(newImg);
      isAnimating = true;

      setTimeout(() => {
        if (direction !== "none") {
          lightboxImg.style.transform =
            direction === "right" ? "translateX(-100%)" : "translateX(100%)";
          newImg.style.transform = "translateX(0%)";
        }

        setTimeout(() => {
          wrapper.removeChild(lightboxImg);
          newImg.classList.add("active");
          newImg.removeAttribute("style");
          newImg.className = "lightbox-img";
          lightboxImg.src = newImg.src;
          lightboxImg.alt = newImg.alt;
          currentIndex = index;
          isAnimating = false;
        }, 500);
      }, 20);

      lightbox.classList.add("active");
      updateThumbnails();
      targetBody.style.overflow = "hidden";
    }

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector("img");
      img.addEventListener("click", () => {
        const visible = getVisibleImages();
        const visibleIndex = visible.indexOf(item);
        if (visibleIndex !== -1 && !isAnimating) {
          showLightbox(visibleIndex);
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
      targetBody.style.overflow = "";
      isAnimating = false;
    }

    function showPrev() {
      const visible = getVisibleImages();
      let idx = currentIndex - 1;
      if (idx < 0) idx = visible.length - 1;
      showLightbox(idx, "left");
    }

    function showNext() {
      const visible = getVisibleImages();
      let idx = currentIndex + 1;
      if (idx >= visible.length) idx = 0;
      showLightbox(idx, "right");
    }

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isAnimating) showPrev();
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isAnimating) showNext();
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    targetDocument.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active") || isAnimating) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });

    if (isInIframe) {
      const updateHeight = () => {
        const height = galleryContainer.offsetHeight;
        window.parent.postMessage(
          { action: "iframeHeightUpdated", height, id: "zhl_XD" },
          "*"
        );
      };
      new ResizeObserver(updateHeight).observe(galleryContainer);
      updateHeight();
    }
  });
})();
