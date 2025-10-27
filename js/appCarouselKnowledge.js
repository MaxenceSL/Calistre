const carouselKnow = document.querySelector('.knowledgePictures');
const cardsKnowledge = Array.from(document.querySelectorAll('.cadre-knowledge-img-container'));
const nextBtnKnowledge = document.querySelector('.nextKnow');
const prevBtnKnowledge = document.querySelector('.prevKnow');

carouselKnow.addEventListener('touchstart', handleTouchStartKnow);
carouselKnow.addEventListener('touchmove', handleTouchMoveKnow);
carouselKnow.addEventListener('touchend', handleTouchEndKnow);

// On garde une pile de cartes (la première est celle devant)
let stackKnowledge = [...cardsKnowledge];

// Variables pour le swipe
let startXknow = 0;
let endXknow = 0;
const thresholdKnow = 50;

// --- Fonctions de navigation de base ---
function nextCardKnow() {
  const firstKnow = stackKnowledge.shift();
  stackKnowledge.push(firstKnow);
  updateStackMobileKnow();
}

function prevCardKnow() {
  const lastKnow = stackKnowledge.pop();
  stackKnowledge.unshift(lastKnow);
  updateStackMobileKnow();
}

function updateStackKnowledge() {
  stackKnowledge.forEach((card, index) => {
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

function updateStackMobileKnow() {
  stackKnowledge.forEach((card, index) => {
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

nextBtnKnowledge.addEventListener('click', () => {
  const first = stackKnowledge.shift();
  stackKnowledge.push(first);
  updateStackKnowledge();
});

prevBtnKnowledge.addEventListener('click', () => {
  const last = stackKnowledge.pop();
  stackKnowledge.unshift(last);
  updateStackKnowledge();
});

// Initialisation
//updateStack();


function handleTouchStartKnow(e) {
  // Enregistre la position X du doigt au début du toucher
  startXknow = e.touches[0].clientXKnow;
}

function handleTouchMoveKnow(e) {
  // Met à jour la position X pendant le mouvement
  endXknow = e.touches[0].clientXKnow;
}

function handleTouchEndKnow() {
  const diffKnow = startXknow - endXknow;

  // diff > 0 : Swipe vers la GAUCHE (pour afficher la carte suivante)
  // diff < 0 : Swipe vers la DROITE (pour afficher la carte précédente)

  // Vérifier si le mouvement est suffisant pour être considéré comme un swipe
  if (Math.abs(diffKnow) < thresholdKnow) {
    return;
  }

  if (diffKnow > 0) {
    nextCardKnow();
  } else {
    prevCardKnow();
  }

  // Réinitialiser les positions pour le prochain swipe
  startXKnow = 0;
  endXknow = 0;
}