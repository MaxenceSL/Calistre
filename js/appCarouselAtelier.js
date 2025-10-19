const carousel = document.querySelector('.atelierPictures');
const cards = Array.from(document.querySelectorAll('.cadre-atelier-img-container'));
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

// On garde une pile de cartes (la première est celle devant)
let stack = [...cards];

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
