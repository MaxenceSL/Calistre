const buttons = document.querySelectorAll('.portfolio_filters button');
const portfolioCards = document.querySelectorAll('.portfolioArticle_card');

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