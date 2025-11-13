const buttons = document.querySelectorAll('.portfolio_filters button');
const portfolioCards = document.querySelectorAll('.portfolioArticle_card');
const agrandirPics = document.querySelectorAll('.portfolioArticle_img-container');
const overlay = document.getElementById('imageOverlay');
const overlayImg = document.getElementById('overlayImg');
const closeOverlay = document.querySelector('.closeOverlay');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active du bouton précédent
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        portfolioCards.forEach(card => {
            if (filter === 'tous' || card.classList.contains(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

agrandirPics.forEach(container => {
    container.addEventListener('click', () => {
        const img = container.querySelector('img');
        if (!img) return; // Si c'est une vidéo par ex.
        overlayImg.src = img.src;
        overlay.classList.remove('hidden');
    });
});

// Fermer en cliquant sur la croix ou sur le fond
closeOverlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
    }
});