(function(){
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.custom_gallery_component').forEach(function(container){
            const images = JSON.parse(container.getAttribute('data-gallery'));
            const categories = JSON.parse(container.getAttribute('data-categories'));

            // Filtres
            let filterHtml = `<div class="custom-gallery-filters">
                <button data-filter="all" class="active">Tout</button>`;
            categories.forEach(cat => {
                filterHtml += `<button data-filter="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`;
            });
            filterHtml += `</div>`;

            // Grille
            let gridHtml = `<div class="custom-gallery-grid">`;
            images.forEach((img, i) => {
                gridHtml += `<div class="gallery-item" data-cat="${img.cat}" data-index="${i}">
                    <img src="${img.thumb}" alt="${img.title}" title="${img.title}">
                </div>`;
            });
            gridHtml += `</div>`;
            container.innerHTML = filterHtml + gridHtml;

            // Filtrage
            const filterBtns = container.querySelectorAll('.custom-gallery-filters button');
            const galleryItems = container.querySelectorAll('.gallery-item');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function(){
                    filterBtns.forEach(b=>b.classList.remove('active'));
                    this.classList.add('active');
                    const f = this.getAttribute('data-filter');
                    galleryItems.forEach(item => {
                        item.style.display = (f==='all' || item.getAttribute('data-cat')===f) ? '' : 'none';
                    });
                });
            });

            // Lightbox dans <body>
            if(!document.getElementById('custom-global-lightbox')){
                const overlay = document.createElement('div');
                overlay.id = 'custom-global-lightbox';
                overlay.className = 'custom-lightbox-overlay';
                overlay.innerHTML = `
                    <button class="custom-lightbox-arrow prev">&#8592;</button>
                    <div class="custom-lightbox-content">
                        <img class="custom-lightbox-img" src="" alt="">
                        <div class="custom-lightbox-title"></div>
                        <div class="custom-lightbox-thumbs"></div>
                    </div>
                    <button class="custom-lightbox-arrow next">&#8594;</button>
                `;
                document.body.appendChild(overlay);
            }
            const lightbox = document.getElementById('custom-global-lightbox');
            const lightboxImg = lightbox.querySelector('.custom-lightbox-img');
            const lightboxTitle = lightbox.querySelector('.custom-lightbox-title');
            const lightboxThumbs = lightbox.querySelector('.custom-lightbox-thumbs');
            const prevBtn = lightbox.querySelector('.custom-lightbox-arrow.prev');
            const nextBtn = lightbox.querySelector('.custom-lightbox-arrow.next');
            let currentIndex = 0;
            let filteredIndexes = images.map((_,i)=>i);

            function showLightbox(index){
                currentIndex = index;
                const img = images[filteredIndexes[currentIndex]];
                lightboxImg.src = img.src;
                lightboxImg.alt = img.title;
                lightboxTitle.textContent = img.title || '';
                // Thumbnails
                let thumbsHtml = '';
                filteredIndexes.forEach((imgIdx, k) => {
                    thumbsHtml += `<img src="${images[imgIdx].thumb}" class="custom-thumb${k===currentIndex?' active':''}" data-thumb-idx="${k}" style="width:50px;cursor:pointer;margin:0 2px;border-radius:4px;${k===currentIndex?'border:2px solid #fff;':''}">`;
                });
                lightboxThumbs.innerHTML = thumbsHtml;
                lightbox.classList.add('active');
            }

            container.querySelectorAll('.gallery-item').forEach((item, idx) => {
                item.addEventListener('click', function(){
                    filteredIndexes = [];
                    galleryItems.forEach((el, i) => {
                        if(el.style.display !== 'none') filteredIndexes.push(i);
                    });
                    const imgIdx = filteredIndexes.indexOf(idx);
                    if(imgIdx !== -1) showLightbox(imgIdx);
                });
            });

            prevBtn.onclick = function(e){
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + filteredIndexes.length) % filteredIndexes.length;
                showLightbox(currentIndex);
            };
            nextBtn.onclick = function(e){
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % filteredIndexes.length;
                showLightbox(currentIndex);
            };

            lightbox.onclick = function(e){
                if(e.target === lightbox) lightbox.classList.remove('active');
            };

            document.addEventListener('keydown', function(e){
                if(!lightbox.classList.contains('active')) return;
                if(e.key==='Escape') lightbox.classList.remove('active');
                if(e.key==='ArrowLeft') prevBtn.click();
                if(e.key==='ArrowRight') nextBtn.click();
            });

            lightboxThumbs.onclick = function(e){
                if(e.target && e.target.classList.contains('custom-thumb')){
                    showLightbox(Number(e.target.getAttribute('data-thumb-idx')));
                }
            };
        });
    });

    // CSS global
    if(!document.getElementById('custom-gallery-css')){
        const style = document.createElement('style');
        style.id = 'custom-gallery-css';
        style.textContent = `
.custom-gallery-filters { text-align:center;margin:20px 0; }
.custom-gallery-filters button { margin:0 10px;padding:8px 20px;background:#f0f0f0;border:1px solid #ddd;cursor:pointer;border-radius:5px;transition:background 0.2s; }
.custom-gallery-filters button.active, .custom-gallery-filters button:hover { background:#e0e0e0; }
.custom-gallery-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:15px;padding:20px; }
.gallery-item { position:relative;overflow:hidden; }
.gallery-item img { width:100%;height:140px;object-fit:cover;border-radius:5px;cursor:pointer;transition:transform 0.2s; }
.gallery-item img:hover { transform:scale(1.04); }
@media (max-width:700px){ .custom-gallery-grid { grid-template-columns:1fr; } }
.custom-lightbox-overlay { display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);justify-content:center;align-items:center;z-index:999999; }
.custom-lightbox-overlay.active { display:flex; }
.custom-lightbox-content { display:flex;flex-direction:column;align-items:center; }
.custom-lightbox-img { max-width:90vw;max-height:60vh;object-fit:contain;border-radius:8px;box-shadow:0 0 30px #111;display:block;margin:0 auto; }
.custom-lightbox-title { color:#fff;margin:12px 0 8px;font-size:1.2em;text-align:center;}
.custom-lightbox-thumbs { margin-top:10px;text-align:center; }
.custom-thumb { opacity:0.7;transition:opacity 0.2s,border 0.2s; }
.custom-thumb.active, .custom-thumb:hover { opacity:1;border:2px solid #fff; }
.custom-lightbox-arrow { position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.7);border:none;font-size:2.5rem;cursor:pointer;padding:8px 18px;border-radius:50%;z-index:2;color:#222;transition:background 0.2s; }
.custom-lightbox-arrow.prev { left:2vw; }
.custom-lightbox-arrow.next { right:2vw; }
.custom-lightbox-arrow:hover { background:#fff; }
@media (max-width:600px){
    .custom-lightbox-img { max-width:98vw;max-height:40vh; }
    .custom-lightbox-arrow.prev { left:10px; }
    .custom-lightbox-arrow.next { right:10px; }
}
        `;
        document.head.appendChild(style);
    }
})();
