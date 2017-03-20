$(function() {

  // On récupère en instantanée la saisie de l'utilisateur
  $('#searchchar').keyup(function() {
    var saisieUser = $('#searchchar').val();
    $.ajax({
      url: 'index.php',
      method: 'POST',
      data: {saisie: saisieUser},
      success: function(data){
        $('#message').html(saisieUser);
      }
    });
  });

  $('#charList li a').click(function() {
    var persoChoisi = $(this).text();
    $('#message').html(persoChoisi);
  });

  // $("#searchchar").autocomplete({
  //   source: 'index.php',
  //   minLength: 2
  // });

});
