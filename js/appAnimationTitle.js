const target = document.querySelector('.articleAboutH2');
const targetKnowledge = document.querySelector('.articleKnowledgeH2');
const targetPortfolio = document.querySelector('.portfolioArticle_h2');
const targetServices = document.querySelector('.servicessection_h2');
const targetContact = document.querySelector('.contactSection_H1');

/***animation pour titre A PROPOS DE MOI***/
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            target.classList.add('visible');
            observer.unobserve(target); // optionnel : ne rejoue pas l’animation
        }
    });
}, {
    threshold: 0.2 // 20% visible avant de déclencher
});

observer.observe(target);


/***animation pour titre L'ATELIER***/
const observerKnowledge = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            targetKnowledge.classList.add('visible');
            observerKnowledge.unobserve(targetKnowledge); // optionnel : ne rejoue pas l’animation
        }
    });
}, {
    threshold: 0.2 // 20% visible avant de déclencher
});

observerKnowledge.observe(targetKnowledge);

/***animation pour titre PORTFOLIO***/
const observerPortfolio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            targetPortfolio.classList.add('visible');
            observerPortfolio.unobserve(targetPortfolio); // optionnel : ne rejoue pas l’animation
        }
    });
}, {
    threshold: 0.2 // 20% visible avant de déclencher
});

observerPortfolio.observe(targetPortfolio);

/***animation pour titre MES SERVICES***/
const observerServices = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            targetServices.classList.add('visible');
            observerServices.unobserve(targetServices); // optionnel : ne rejoue pas l’animation
        }
    });
}, {
    threshold: 0.2 // 20% visible avant de déclencher
});

observerServices.observe(targetServices);

/***animation pour titre CONTACT***/
const observerContact = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            targetContact.classList.add('visible');
            observerContact.unobserve(targetContact); // optionnel : ne rejoue pas l’animation
        }
    });
}, {
    threshold: 0.2 // 20% visible avant de déclencher
});

observerContact.observe(targetContact);

