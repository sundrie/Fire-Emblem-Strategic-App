$(function() {
  // S'active lors de la validation du formulaire
  $("#contactForm").submit(function(e){
    // On empêche l'envoi du formulaire
    e.preventDefault();
    // Si l'utilisateur n'a pas fait le test on lui affiche un message l'invitant à faire le test
    // Renvoie '' (rien) si test pas fait ou la clé reCAPTCHA de notre site si test fait
    if (grecaptcha.getResponse() === '') {
      $("#message").html("<p><h2>Veuillez valider le reCAPTCHA pour vérifier que vous n'êtes pas un robot s'il vous plaît</h2></p>");
    } else {
      $.ajax({
        url: 'http://alexandreblin.ovh/FireEmblemStrategicApp/pages/contactme.php',
        method: 'POST',
        data:{
          objmsg: $("input[name='objectmsg']").val(),
          email: $("input[name='email']").val(),
          textmsg: $("textarea[name='textmsg']").val()
        },
        success: function(data){
          console.log(data);
          $("#message").html("<p><h2>Votre message a été correctement envoyé</h2></p>");
        }
      });
    }

  });


});
