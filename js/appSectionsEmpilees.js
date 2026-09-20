// ---------------------------------------------------------------
// Effet "sections empilées" : chaque section reste immobile une fois
// entièrement lue, et la suivante vient la recouvrir en remontant.
// À charger à la fin du <body>, avec les autres scripts.
// ---------------------------------------------------------------
(function () {
  'use strict';

  const sections = Array.from(document.querySelectorAll('main > section'));
  if (sections.length === 0) return;

  // 1. Une section plus haute que l'écran doit se bloquer quand son BAS atteint
  //    le bas de l'écran (sinon sa fin serait recouverte avant d'avoir été lue).
  //    Il faut donc top = (hauteur de l'écran - hauteur de la section), négatif.
  //    Section plus courte que l'écran : elle se bloque simplement en haut (top: 0).
  function updateStickyTops() {
    const viewportHeight = window.innerHeight;
    sections.forEach((section) => {
      const overflow = Math.floor(section.getBoundingClientRect().height - viewportHeight);
      section.style.top = overflow > 0 ? `-${overflow}px` : '0px';
    });
  }

  updateStickyTops();
  window.addEventListener('resize', updateStickyTops);
  window.addEventListener('load', updateStickyTops); // images chargées = hauteurs définitives

  // Recalcule aussi quand une section change de hauteur (filtres du portfolio, etc.)
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(updateStickyTops);
    sections.forEach((section) => observer.observe(section));
  }

  // 2. Liens d'ancre (menu, footer) : avec des sections bloquées, le navigateur
  //    ne sait plus où se trouve vraiment la section visée. On calcule donc sa
  //    position "normale" en additionnant la hauteur des sections qui la précèdent.
  function sectionFlowTop(section) {
    const main = section.parentElement;
    let top = main.getBoundingClientRect().top + window.scrollY;
    for (let el = section.previousElementSibling; el; el = el.previousElementSibling) {
      top += el.getBoundingClientRect().height;
    }
    return top;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash.length < 2) return;

      const target = document.querySelector(hash);
      if (!target || !sections.includes(target)) return; // ex. #Accueil : comportement normal

      event.preventDefault();
      window.scrollTo({ top: sectionFlowTop(target), behavior: 'smooth' });
    });
  });
})();