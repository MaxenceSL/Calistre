// ---------------------------------------------------------------
// Portfolio : carrousel horizontal + plein écran avec flèches et zoom
// À charger APRÈS appPortfolio.js (qui garde les filtres et l'ouverture
// du plein écran). Ce script ne remplace rien : il s'ajoute par-dessus.
// ---------------------------------------------------------------
(function () {
  'use strict';

  const track = document.querySelector('.portfolioArticle_allCards');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.portfolioArticle_card'));

  // Flèche "suivant" ; pour "précédent", le CSS la retourne
  const ARROW =
    '<svg width="21" height="21" viewBox="0 0 11 21" aria-hidden="true">' +
    '<path d="M1.5 1.5 9.5 10.5 1.5 19.5" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function makeButton(className, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.innerHTML = ARROW;
    return button;
  }

  // Une carte masquée par un filtre (display: none) n'a plus de taille
  const isVisible = (el) => el.offsetWidth > 0 && el.offsetHeight > 0;
  const visibleCards = () => cards.filter(isVisible);

  // ==============================================================
  // 1. Le carrousel
  // ==============================================================

  // Flèches sous le carrousel
  const nav = document.createElement('div');
  nav.className = 'portfolioCarouselNav';
  const prevBtn = makeButton('navig portfolioNavPrev', 'Photos précédentes');
  const nextBtn = makeButton('navig portfolioNavNext', 'Photos suivantes');
  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);
  track.after(nav);

  // Position de défilement qui place une carte au début visible de la piste
  function cardStop(card) {
    const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const cardLeft = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    return Math.max(0, cardLeft + track.scrollLeft - paddingLeft);
  }

  // Flèche suivante / précédente : on saute d'une carte à la suivante
  function scrollByCard(direction) {
    const stops = visibleCards().map(cardStop);
    const current = track.scrollLeft;
    const target = direction > 0
      ? stops.find((stop) => stop > current + 5)
      : [...stops].reverse().find((stop) => stop < current - 5);
    if (target === undefined) return;
    track.scrollTo({ left: target, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  // Flèches grisées aux extrémités, masquées si tout tient à l'écran
  function updateNav() {
    const max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= max - 1;
    nav.style.visibility = max > 1 ? 'visible' : 'hidden';
  }

  track.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  window.addEventListener('load', updateNav);
  if ('ResizeObserver' in window) {
    // Se déclenche quand les photos se chargent ou quand un filtre masque des cartes
    const observer = new ResizeObserver(updateNav);
    observer.observe(track);
    cards.forEach((card) => observer.observe(card));
  }
  updateNav();

  // Changement de filtre : on repart du début
  document.querySelectorAll('.portfolio_filters button').forEach((button) => {
    button.addEventListener('click', () => {
      track.scrollLeft = 0;
      setTimeout(updateNav, 0);
    });
  });

  // Défilement à la souris en faisant glisser (sur écran tactile, le défilement est natif)
  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    isDown = true;
    dragged = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });

  window.addEventListener('pointermove', (event) => {
    if (!isDown) return;
    const dx = event.clientX - startX;
    if (!dragged && Math.abs(dx) > 5) {
      dragged = true;
      track.classList.add('is-dragging');
    }
    if (dragged) track.scrollLeft = startScroll - dx;
  });

  function endDrag() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    // "dragged" reste vrai jusqu'au clic qui suit immédiatement le relâchement
    setTimeout(() => { dragged = false; }, 0);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Empêche le navigateur de "saisir" l'image (fantôme de glisser-déposer)
  track.addEventListener('dragstart', (event) => event.preventDefault());

  // Un glissement ne doit pas ouvrir le plein écran : on bloque le clic qui suit.
  // (phase de capture : passe avant les écouteurs de appPortfolio.js)
  track.addEventListener('click', (event) => {
    if (dragged) {
      event.stopImmediatePropagation();
      event.preventDefault();
      dragged = false;
    }
  }, true);

  // On retient la photo cliquée, pour savoir d'où partir avec les flèches du plein écran
  let currentImg = null;
  track.addEventListener('click', (event) => {
    const media = event.target.closest('.portfolioArticle_img');
    if (media) currentImg = media;
  }, true);

  // ==============================================================
  // 2. Photo en plein écran : zoom
  // ==============================================================
  const overlay = document.getElementById('imageOverlay');
  const overlayImg = document.getElementById('overlayImg');
  if (!overlay || !overlayImg) return;

  const MAX_SCALE = 5;      // zoom maximum
  const CLICK_SCALE = 2.5;  // zoom d'un clic (souris) ou d'un double toucher

  let scale = 1;
  let tx = 0; // décalage horizontal de la photo (px) par rapport à sa position centrée
  let ty = 0; // décalage vertical

  function applyZoom(animate) {
    overlayImg.style.transition = animate ? 'transform 0.25s ease' : 'none';
    overlayImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    overlayImg.classList.toggle('is-zoomed', scale > 1);
  }

  // Empêche la photo zoomée de sortir de l'écran quand on la déplace
  function clampPan() {
    const box = overlay.getBoundingClientRect();
    const maxX = Math.max(0, (overlayImg.offsetWidth * scale - box.width) / 2);
    const maxY = Math.max(0, (overlayImg.offsetHeight * scale - box.height) / 2);
    tx = Math.min(maxX, Math.max(-maxX, tx));
    ty = Math.min(maxY, Math.max(-maxY, ty));
  }

  // Zoome en gardant le point (x, y) de l'écran exactement au même endroit de la photo
  function zoomAt(x, y, newScale, animate) {
    newScale = Math.min(MAX_SCALE, Math.max(1, newScale));
    const box = overlay.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const dx = x - centerX - tx; // distance entre le centre actuel de la photo et le point visé
    const dy = y - centerY - ty;
    const ratio = newScale / scale;
    tx = x - centerX - dx * ratio;
    ty = y - centerY - dy * ratio;
    scale = newScale;
    if (scale < 1.01) { scale = 1; tx = 0; ty = 0; } // retour à la taille normale
    clampPan();
    applyZoom(animate);
  }

  function zoomFromCenter(factor) {
    const box = overlay.getBoundingClientRect();
    zoomAt(box.left + box.width / 2, box.top + box.height / 2, scale * factor, true);
  }

  function resetZoom(animate) {
    scale = 1;
    tx = 0;
    ty = 0;
    applyZoom(animate);
  }

  function toggleZoom(x, y) {
    if (scale > 1) resetZoom(true);
    else zoomAt(x, y, CLICK_SCALE, true);
  }

  // Nouvelle photo affichée, ouverture ou fermeture du plein écran : on repart à zéro
  overlayImg.addEventListener('load', () => resetZoom(false));
  if ('MutationObserver' in window) {
    new MutationObserver(() => resetZoom(false))
      .observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  // Molette (et pincement au trackpad) : zoom autour du curseur
  overlay.addEventListener('wheel', (event) => {
    if (overlay.classList.contains('hidden')) return;
    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 33 : event.deltaY;
    const speed = event.ctrlKey ? 0.01 : 0.0015; // pincer au trackpad envoie ctrlKey
    zoomAt(event.clientX, event.clientY, scale * Math.exp(-delta * speed), false);
  }, { passive: false });

  // Clic sur la photo = zoom, pas fermeture (bloqué avant les écouteurs de appPortfolio.js)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlayImg) event.stopPropagation();
  }, true);

  overlayImg.addEventListener('dragstart', (event) => event.preventDefault());

  // Souris et doigts : un doigt = déplacer (si zoomé) ou faire défiler les photos (swipe),
  // deux doigts = pincer pour zoomer, clic ou double toucher = zoom / dézoom
  const pointers = new Map();
  let panStartX = 0;
  let panStartY = 0;
  let panStartTx = 0;
  let panStartTy = 0;
  let moved = false;
  let lastDist = 0;
  let lastMidX = 0;
  let lastMidY = 0;
  let lastTap = { time: 0, x: 0, y: 0 };

  function startPan(point) {
    panStartX = point.x;
    panStartY = point.y;
    panStartTx = tx;
    panStartTy = ty;
  }

  function pinchState() {
    const [a, b] = [...pointers.values()];
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  }

  overlayImg.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    overlayImg.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      startPan({ x: event.clientX, y: event.clientY });
      moved = false;
    } else if (pointers.size === 2) {
      const pinch = pinchState();
      lastDist = pinch.dist;
      lastMidX = pinch.midX;
      lastMidY = pinch.midY;
      moved = true; // un pincement n'est jamais un "clic"
    }
  });

  overlayImg.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      const pinch = pinchState();
      tx += pinch.midX - lastMidX; // les deux doigts déplacent aussi la photo
      ty += pinch.midY - lastMidY;
      if (lastDist > 0) zoomAt(pinch.midX, pinch.midY, scale * (pinch.dist / lastDist), false);
      lastDist = pinch.dist;
      lastMidX = pinch.midX;
      lastMidY = pinch.midY;
    } else if (pointers.size === 1) {
      const dx = event.clientX - panStartX;
      const dy = event.clientY - panStartY;
      if (!moved && Math.hypot(dx, dy) > 6) moved = true;
      if (moved && scale > 1) {
        tx = panStartTx + dx;
        ty = panStartTy + dy;
        clampPan();
        applyZoom(false);
        overlayImg.classList.add('is-dragging');
      }
    }
  });

  function endPointer(event) {
    if (!pointers.has(event.pointerId)) return;
    const wasSingle = pointers.size === 1;
    pointers.delete(event.pointerId);
    overlayImg.classList.remove('is-dragging');

    // Un doigt reste après un pincement : il reprend le déplacement là où il est
    if (pointers.size === 1) {
      startPan([...pointers.values()][0]);
      moved = true;
      return;
    }
    if (!wasSingle || event.type === 'pointercancel') return;

    const dx = event.clientX - panStartX;
    const dy = event.clientY - panStartY;

    if (!moved) {
      // Simple clic / toucher
      if (event.pointerType === 'mouse') {
        toggleZoom(event.clientX, event.clientY);
      } else {
        const now = Date.now();
        const isDoubleTap = now - lastTap.time < 300 &&
          Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 40;
        if (isDoubleTap) {
          toggleZoom(event.clientX, event.clientY);
          lastTap = { time: 0, x: 0, y: 0 };
        } else {
          lastTap = { time: now, x: event.clientX, y: event.clientY };
        }
      }
    } else if (scale === 1 && event.pointerType !== 'mouse' &&
               Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Swipe tactile sur une photo non zoomée : photo suivante / précédente
      showRelative(dx < 0 ? 1 : -1);
    }
  }
  overlayImg.addEventListener('pointerup', endPointer);
  overlayImg.addEventListener('pointercancel', endPointer);

  // ==============================================================
  // 3. Photo en plein écran : flèches gauche / droite
  // ==============================================================

  // Photos parcourues : celles des cartes visibles (filtre actif), sans la vidéo
  function galleryImages() {
    return visibleCards()
      .map((card) => card.querySelector('.portfolioArticle_img'))
      .filter((media) => media && media.tagName === 'IMG');
  }

  function showRelative(step) {
    const list = galleryImages();
    if (list.length < 2) return;

    let index = list.indexOf(currentImg);
    if (index === -1) index = list.findIndex((img) => img.src === overlayImg.src);
    if (index === -1) return;

    const next = list[(index + step + list.length) % list.length];
    currentImg = next;
    resetZoom(false);
    overlayImg.src = next.currentSrc || next.src;
    overlayImg.alt = next.alt;

    // Le carrousel, derrière, suit la photo affichée
    track.scrollLeft = cardStop(next.closest('.portfolioArticle_card'));
  }

  function makeOverlayArrow(className, label, step) {
    const button = makeButton('overlayArrow ' + className, label);
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // ne ferme pas le plein écran
      showRelative(step);
    });
    overlay.appendChild(button);
  }

  makeOverlayArrow('overlayPrev', 'Photo précédente', -1);
  makeOverlayArrow('overlayNext', 'Photo suivante', 1);

  // Clavier : ← → changent de photo, + / - / 0 zooment
  document.addEventListener('keydown', (event) => {
    if (overlay.classList.contains('hidden')) return;
    if (event.key === 'ArrowRight') showRelative(1);
    else if (event.key === 'ArrowLeft') showRelative(-1);
    else if (event.key === '+' || event.key === '=') zoomFromCenter(1.4);
    else if (event.key === '-') zoomFromCenter(1 / 1.4);
    else if (event.key === '0') resetZoom(true);
  });
})();