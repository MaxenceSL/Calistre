const btn = document.getElementById('menu-toggle');
const btnClose = document.getElementById('menu-close');
const menu = document.getElementById('menu');
const nav = document.querySelector('nav');

btn.addEventListener('click', () => {
    menu.classList.toggle('show');
});

btnClose.addEventListener('click', () => {
    menu.classList.remove('show');
});

document.addEventListener('click', (e) => {
    // Vérifie si le clic n'est pas à l'intérieur de la nav
    if (!nav.contains(e.target)) {
        menu.classList.remove('show');
    }
});