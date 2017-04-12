$(function() {



  var saisieUser;

  // On récupère en instantanée la saisie de l'utilisateur
  $('#searchchar').keyup(function() {
    saisieUser = $('#searchchar').val();
    $.ajax({
      url: 'index.php',
      method: 'POST',
      data: {saisie: saisieUser},
      success: function(data){
        $('#message').html(saisieUser);
      }
    });
    // On appelle la fonction qui selon la saisie masque les choix qui ne correspondent pas
    interactiveList();
  });

  $('#charList li a').click(function(){
    var persoChoisi = $(this).text();
    // nous affiche le nom du perso choisi dans la liste
    //$('#message').html(persoChoisi);

    if (persoChoisi === "Vaike") {
      $("#pageContent").html("Vaike est un tank OP qui peut selon ses talents faire énormément de coup critique");
    } else if (persoChoisi === "Tharja") {
      $("#pageContent").html("De grosse stats défensives une très bonne force de frappe magique seul bémol sa force est pas top");
    } else {
      $("#pageContent").html("Pas encore de top déso !");
    }
  });

  function interactiveList(){
    // Pour chaque li (Perso)
    for (i = 0; i < $('#charList li').length; i++) {
      // filter est bien synchrone avec la saisie utilisateur
      var filter = saisieUser;
      a = $('#charList li')[i].getElementsByTagName("a")[0];
      // a renvoie <a href="#">Tharja</a>
      if (a.innerHTML.indexOf(filter) > -1) {
        $('#charList li')[i].style.display = "";
      } else {
        $('#charList li')[i].style.display = "none";
      }
    }
  }

  // $("#searchchar").autocomplete({
  //   source: 'index.php',
  //   minLength: 2
  // });

});
