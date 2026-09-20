// ---------------------------------------------------------------
// Portfolio : carrousel horizontal + navigation en plein écran
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
  // 2. Flèches dans la photo en plein écran
  // ==============================================================
  const overlay = document.getElementById('imageOverlay');
  const overlayImg = document.getElementById('overlayImg');
  if (!overlay || !overlayImg) return;

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

  // Clavier : flèches gauche / droite
  document.addEventListener('keydown', (event) => {
    if (overlay.classList.contains('hidden')) return;
    if (event.key === 'ArrowRight') showRelative(1);
    else if (event.key === 'ArrowLeft') showRelative(-1);
  });

  // Tactile : swipe gauche / droite sur la photo
  let touchStartX = 0;
  overlay.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) showRelative(dx < 0 ? 1 : -1);
  });
})();