// ---------------------------------------------------------------
// Carrousels "pile de cartes en éventail" : À propos (atelier) + Knowledge
// Un seul script pour les deux : remplace appCarouselAtelier.js
// et appCarouselKnowledge.js (voir index.html).
// ---------------------------------------------------------------
(function () {
  'use strict';

  // Position de chaque carte de la pile (index 0 = devant).
  // Ces valeurs remplacent les règles CSS "nth-child" : plus besoin
  // de compter les enfants dans le CSS.
  // z-index : 4 = carte de devant, 3 = réservé au cadre décoratif
  // (.cadreKnowledge, défini dans le CSS), puis 2, 1, 0 = cartes du dessous.
  const FAN_POSITIONS = [
    { transform: 'translateX(0) scale(1) rotate(0deg)',      zIndex: 4, filter: 'blur(0) brightness(100%)' },
    { transform: 'translateX(20px) scale(0.95) rotate(3deg)', zIndex: 2, filter: 'blur(2px) brightness(80%)' },
    { transform: 'translateX(40px) scale(0.9) rotate(7deg)',  zIndex: 1, filter: 'blur(2px) brightness(80%)' },
    { transform: 'translateX(50px) scale(0.85) rotate(9deg)', zIndex: 0, filter: 'blur(2px) brightness(80%)' },
  ];

  const SLIDE_MS = 300;                                 // durée de la sortie sur le côté
  const SLIDE_OUT = 'translateX(-110%) rotate(-12deg)'; // direction de la sortie
  const SWIPE_THRESHOLD = 50;                           // distance minimale d'un swipe (px)

  function createStackCarousel({ container, cardSelector, nextSelector, prevSelector }) {
    const carousel = document.querySelector(container);
    if (!carousel) return;

    // On cherche à l'intérieur du carrousel pour ne jamais mélanger les deux
    const stack = Array.from(carousel.querySelectorAll(cardSelector)); // stack[0] = carte de devant
    const nextBtn = carousel.querySelector(nextSelector);
    const prevBtn = carousel.querySelector(prevSelector);
    if (stack.length === 0) return;

    let isAnimating = false; // ignore les clics/swipes pendant une animation

    // Applique à CHAQUE carte la position correspondant à son rang dans la pile
    function render() {
      stack.forEach((card, index) => {
        const pos = FAN_POSITIONS[Math.min(index, FAN_POSITIONS.length - 1)];
        card.style.transition = 'transform 0.5s ease, filter 0.5s ease';
        card.style.transform = pos.transform;
        card.style.zIndex = pos.zIndex;
        card.style.filter = pos.filter;
        card.style.opacity = 1;
      });
    }

    function navigate(direction) {
      if (isAnimating) return;
      isAnimating = true;

      if (direction === 'next') {
        // 1. la carte de devant sort sur le côté (elle reste au-dessus du tas)
        const front = stack[0];
        front.style.transition = `transform ${SLIDE_MS}ms ease`;
        front.style.transform = SLIDE_OUT;

        // 2. elle passe sous le tas, les autres avancent d'un cran
        setTimeout(() => {
          stack.push(stack.shift());
          render();
          isAnimating = false;
        }, SLIDE_MS);
      } else {
        // la carte du dessous est placée hors champ (sans animation)...
        const last = stack[stack.length - 1];
        last.style.transition = 'none';
        last.style.transform = SLIDE_OUT;
        last.getBoundingClientRect(); // force le navigateur à appliquer ce style

        // ... puis elle revient devant en glissant
        stack.unshift(stack.pop());
        render();
        setTimeout(() => { isAnimating = false; }, 500);
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));

    // --- Swipe tactile ---
    let startX = 0;
    let endX = 0;

    carousel.style.touchAction = 'pan-y'; // le swipe horizontal ne bloque pas le scroll vertical

    carousel.addEventListener('touchstart', (e) => {
      // endX = startX : un simple tap n'est pas pris pour un swipe
      startX = endX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      const diff = startX - endX;
      // diff > 0 : swipe vers la gauche -> carte suivante
      // diff < 0 : swipe vers la droite -> carte précédente
      if (Math.abs(diff) >= SWIPE_THRESHOLD) {
        navigate(diff > 0 ? 'next' : 'prev');
      }
      startX = endX = 0;
    });

    render(); // état initial
  }

  // --- Les deux carrousels ---
  createStackCarousel({
    container: '.atelierPictures',
    cardSelector: '.cadre-atelier-img-container',
    nextSelector: '.next',
    prevSelector: '.prev',
  });

  createStackCarousel({
    container: '.knowledgePictures',
    cardSelector: '.cadre-knowledge-img-container',
    nextSelector: '.nextKnow',
    prevSelector: '.prevKnow',
  });
})();