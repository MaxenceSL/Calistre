document.addEventListener('DOMContentLoaded', () => {
  const frameOverlay = document.getElementById('frameOverlay');

  window.addEventListener('scroll', () => {
    const frameOverlay = document.getElementById('frameOverlay');
    if (!frameOverlay) return;

    // Position du haut de la page par rapport à l'écran
    const scrollY = window.scrollY || window.pageYOffset;

    // Seuil de déclenchement (ex: dès qu'on a scrollé de 50px)
    if (scrollY > 100) {
      frameOverlay.classList.add('is-active');
    } else {
      frameOverlay.classList.remove('is-active');
    }
  });

  // 1. On vérifie immédiatement au chargement
  checkScroll();

  // 2. On écoute le scroll
  window.addEventListener('scroll', checkScroll, { passive: true });

  // Déclenchement rapide dès un début de scroll (seuil à 20%)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        frameOverlay.classList.add('is-active');
      } else {
        frameOverlay.classList.remove('is-active'); // Réinitialise si on remonte tout en haut
      }
    });
  }, {
    threshold: 0.2
  });


  observer.observe(frameOverlay);
});