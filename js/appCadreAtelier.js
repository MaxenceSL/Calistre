const cadreH = document.querySelector('.cadreH_atelier');
const cadreB = document.querySelector('.cadreB_atelier');
const cadreG = document.querySelector('.cadreG_atelier');
const cadreD = document.querySelector('.cadreD_atelier');
const crochet = document.querySelector('.cadreCrochet_atelier');
const sousCarte = document.querySelector('.sous-carte_atelier');
const photoCadre = document.querySelector('.cadre-atelier-img-container');

window.addEventListener('scroll', () => {
  const rect = cadreH.getBoundingClientRect();
  const start = window.innerHeight * 0.8; // point de départ de l'animation
  const end = start - 300; // 450px plus haut → fin de l'animation
  const scrollProgress = (start - rect.top) / (start - end);

  // clamp entre 0 et 1
  const progress = Math.min(Math.max(scrollProgress, 0), 1);

  // appliquer transformation progressive
  const rotate = 10 * (1 - progress);
  const translateX = -45 * (1 - progress);
  const translateY = -60 * (1 - progress);
  const opacity = progress;

  cadreH.style.transform = `rotate(${rotate}deg) translateY(${translateY}px) translateX(${translateX}px)`;
  cadreB.style.transform = `rotate(${15 * (1 - progress)}deg) translateY(${20 * (1 - progress)}px) translateX(${45 * (1 - progress)}px)`;
  cadreG.style.transform = `rotate(${-15 * (1 - progress)}deg) translateY(${-60 * (1 - progress)}px) translateX(${-100 * (1 - progress)}px)`;
  cadreD.style.transform = `rotate(${15 * (1 - progress)}deg) translateY(${60 * (1 - progress)}px) translateX(${100 * (1 - progress)}px)`;
  crochet.style.transform = `rotate(${-15 * (1 - progress)}deg) translateY(${-60 * (1 - progress)}px) translateX(${-150 * (1 - progress)}px)`;
  sousCarte.style.transform = `rotate(${-18 * (1 - progress)}deg) translateY(${-600 * (1 - progress)}px) translateX(${-500 * (1 - progress)}px)`;
  sousCarte.style.height = `${496 * (progress)}px`;
  sousCarte.style.setProperty('--ombre-opacity', opacity.toFixed(2));
  photoCadre.style.transform = `translateY(${200 * (1 - progress)}px)`;

  // ✅ Z-index dynamique
  if (progress > 0 && progress < 1) {
    sousCarte.style.zIndex = "10"; // pendant la rotation
  } else {
    sousCarte.style.zIndex = "0";  // avant/après
  }
});