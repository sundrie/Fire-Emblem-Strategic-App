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

  $('#charList li a').click(function(){
    var persoChoisi = $(this).text();
    // nous affiche le nom du perso choisi
    $('#message').html(persoChoisi);
    if (persoChoisi === "Vaike") {
      $("#pageContent").html("Vaike est un tank OP qui peut selon ses talents faire énormément de coup critique");
    } else if (persoChoisi === "Tharja") {
      $("#pageContent").html("De grosse stats défensives une très bonne force de frappe magique seul bémol sa force est pas top");
    } else {
      $("#pageContent").html("Pas encore de top déso !");
    }
  });



  // $("#searchchar").autocomplete({
  //   source: 'index.php',
  //   minLength: 2
  // });

});
