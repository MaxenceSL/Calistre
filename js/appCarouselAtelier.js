const carousel = document.querySelector('.atelierPictures');
const cards = Array.from(document.querySelectorAll('.cadre-atelier-img-container'));
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

carousel.addEventListener('touchstart', handleTouchStart);
carousel.addEventListener('touchmove', handleTouchMove);
carousel.addEventListener('touchend', handleTouchEnd);

// On garde une pile de cartes (la première est celle devant)
let stack = [...cards];

// Variables pour le swipe
let startX = 0;
let endX = 0;
const threshold = 50; // Distance minimale de glissement (en pixels) pour valider un swipe

// --- Fonctions de navigation de base ---
function nextCard() {
  const first = stack.shift();
  stack.push(first);
  updateStackMobile();
}

function prevCard() {
  const last = stack.pop();
  stack.unshift(last);
  updateStackMobile();
}

function updateStack() {
  stack.forEach((card, index) => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    if (index === 0) {
      card.style.transform = 'translateX(0) scale(1)';
      card.style.zIndex = 3;
      card.style.filter = 'blur(0) brightness(100%)';
      card.style.opacity = 1;
    } else if (index === 1) {
      card.style.transform = 'translateX(40px) scale(0.95) rotate(3deg)';
      card.style.zIndex = 2;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    } else if (index === 2) {
      card.style.transform = 'translateX(80px) scale(0.9) rotate(5deg)';
      card.style.zIndex = 1;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    } else {
      card.style.transform = 'translateX(-30px) scale(0.95) rotate(-3deg)';
      card.style.zIndex = 0;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    }
  });
}

function updateStackMobile() {
  stack.forEach((card, index) => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    if (index === 0) {
      card.style.transform = 'translateX(0) scale(1)';
      card.style.zIndex = 3;
      card.style.filter = 'blur(0) brightness(100%)';
      card.style.opacity = 1;
    } else if (index === 1) {
      card.style.transform = 'translateX(20px) scale(0.95) rotate(3deg)';
      card.style.zIndex = 2;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    } else if (index === 2) {
      card.style.transform = 'translateX(40px) scale(0.9) rotate(5deg)';
      card.style.zIndex = 1;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    } else {
      card.style.transform = 'translateX(-10px) scale(0.95) rotate(-3deg)';
      card.style.zIndex = 0;
      card.style.filter = 'blur(2px) brightness(80%)';
      card.style.opacity = 1;
    }
  });
}

nextBtn.addEventListener('click', () => {
  const first = stack.shift();
  stack.push(first);
  updateStack();
});

prevBtn.addEventListener('click', () => {
  const last = stack.pop();
  stack.unshift(last);
  updateStack();
});

// Initialisation
//updateStack();


// --- Logique du Swipe ---

function handleTouchStart(e) {
  // Enregistre la position X du doigt au début du toucher
  startX = e.touches[0].clientX;
}

function handleTouchMove(e) {
  // Met à jour la position X pendant le mouvement
  endX = e.touches[0].clientX;
}

function handleTouchEnd() {
  const diff = startX - endX;

  // diff > 0 : Swipe vers la GAUCHE (pour afficher la carte suivante)
  // diff < 0 : Swipe vers la DROITE (pour afficher la carte précédente)

  // Vérifier si le mouvement est suffisant pour être considéré comme un swipe
  if (Math.abs(diff) < threshold) {
    return;
  }

  if (diff > 0) {
    nextCard();
  } else {
    prevCard();
  }

  // Réinitialiser les positions pour le prochain swipe
  startX = 0;
  endX = 0;
}
