// ---------------------------------------------------------------
// Formulaire de contact -> Formspree
// À charger à la fin du <body>, avec vos autres scripts.
// Le formulaire doit avoir : action="https://formspree.io/f/VOTRE_ID" method="POST"
// ---------------------------------------------------------------
(function () {
  'use strict';

  const form = document.querySelector('.contactSection_form');
  if (!form) return;

  const submitBtn = form.querySelector('.contactSection_buttonDeco');

  // Zone de message (succès / erreur), créée une seule fois, juste après le bouton
  const feedback = document.createElement('p');
  feedback.className = 'contactSection_feedback';
  feedback.setAttribute('role', 'status'); // lu automatiquement par les lecteurs d'écran
  feedback.hidden = true;
  form.querySelector('.contactSection_button').after(feedback);

  function showFeedback(message, isError) {
    feedback.textContent = message;
    feedback.classList.toggle('is-error', !!isError);
    feedback.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // on empêche le rechargement de page par défaut

    const action = form.getAttribute('action');
    if (!action || action.includes('VOTRE_ID')) {
      showFeedback('Configuration manquante : ajoutez votre adresse Formspree dans action="...".', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';
    feedback.hidden = true;

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }, // reste sur la page, pas de redirection
      });

      if (response.ok) {
        showFeedback('Votre message a bien été envoyé, merci !', false);
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        const detail = data && data.errors && data.errors[0] && data.errors[0].message;
        showFeedback(detail || "Une erreur est survenue, réessayez dans un instant.", true);
      }
    } catch (error) {
      showFeedback('Connexion impossible. Vérifiez votre connexion internet et réessayez.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });
})();