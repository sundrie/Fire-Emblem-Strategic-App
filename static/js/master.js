$(function() {

  // On récupère en instantanée la saisie de l'utilisateur
  $('#searchchar').keyup(function() {
    var saisieUser = $('#searchchar').val();
    $.ajax({
      url: 'index.php',
      method: 'GET',
      data: {saisie: saisieUser},
      success: function(data){
        $('#message').html(saisieUser);
      }
    });
  });


  $("#searchchar").autocomplete({
    source: 'index.php',
    minLength:2
  })


});
