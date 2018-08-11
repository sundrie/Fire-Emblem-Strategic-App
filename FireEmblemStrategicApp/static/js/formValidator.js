$(function() {
  $(".captchashowemail").hide();
  // S'active lors d'un clic sur le bouton pour afficher mon adresse email
  $(".showemail").on("click",function(){
    $(".captchashowemail").show();
    $("#givemyemail").remove();
    $(".captchashowemail").append('<form id="givemyemail"><input type="submit" value="Envoyer"></form>');       
  });

  $(document).on("submit","#givemyemail", function(e){
    e.preventDefault();
    console.log(grecaptcha.getResponse());
    
    if (grecaptcha.getResponse() === '') {
      $("#message").html("<p>Veuillez valider le reCAPTCHA pour vérifier que vous n'êtes pas un robot s'il vous plaît</p>");
    } else {
      $("#message").html("<a href='blin.alexandre76@gmail.com'>blin.alexandre76@gmail.com</a>");
    }
  });

  // S'active lors de la validation du formulaire
  $("#contactForm").submit(function(e){
    // On empêche l'envoi du formulaire
    e.preventDefault();
    // code obtenu sur https://emailregex.com/ qui nous permets une meilleure vérif car l'input type email acceptait tata@gmail par exemple
    var emailcheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Si l'adresse mail est bonne
    if (emailcheck.test($("input[name='email']").val())==true) {
      // console.log("adresse mail valide");
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
            // console.log(data);
            $("#message").html("<p><h2>Votre message a été correctement envoyé</h2></p>");
          }
        });
      }
    } else {
      $("#message").html("<p><h2>Adresse email invalide</h2></p>");
    }
  });
});
