$(function() {
  // S'active lors de la validation du formulaire
  $("#contactForm").submit(function(e){
    // On empêche l'envoi du formulaire
    e.preventDefault();
    // Renvoie '' (rien) ou la clé reCAPTCHA de notre site
    console.log(grecaptcha.getResponse());
    // Si l'utilisateur n'a pas fait le test on lui
    if (grecaptcha.getResponse() === '') {
      $("#message").html("<p><h2>Veuillez valider le reCAPTCHA pour vérifier que vous n'êtes pas un robot s'il vous plaît</h2></p>");
    } else {
      $("#message").html("<p><h2>Test passé avec succès vous n'êtes pas un robot</h2></p>")
    }

  });


});
