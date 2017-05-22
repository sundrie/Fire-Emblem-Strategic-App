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
        //$('#message').html(saisieUser); //Pour afficher ce que l'utilisateur tappe
      }
    });
    // On appelle la fonction qui selon la saisie masque les choix qui ne correspondent pas
    interactiveList();
  });

  // Fonction gérant l'affichage de la liste selon la saisie de l'utilisateur
  function interactiveList(){
    // Pour chaque li (Perso)
    for (i = 0; i < $('#charList li').length; i++) {
      // filter est bien synchrone avec la saisie utilisateur
      var filter = saisieUser;
      a = $('#charList li')[i].getElementsByTagName("a")[0];
      // a renvoie <a href="#">Tharja</a> par exemple
      // le -1 est ce que renvoie la méthode indexof() si elle ne trouve rien
      // to lowercase() règle les soucis de case
      if (a.innerHTML.toLowerCase().indexOf(filter) > -1) {
        $('#charList li')[i].style.display = "";
      } else {
        $('#charList li')[i].style.display = "none";
      }
    }
  }

  // Fonction qui s'active lors d'un clic sur un personnage
  $('#charList li a').click(function(){
    var persoChoisi = $(this).text();
    // permet de copier coller le nom du perso dans l'input
    $('#searchchar').val(persoChoisi);
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImg").attr('src','http://localhost/FEAcharapp/static/img/character/'+persoChoisi+'.png');

    // On charge toutes les datas du perso
    $.get('http://localhost/FEAcharapp/HeroesData/'+persoChoisi+'.txt', function(data) {
      gestionAffichageData(data);
      //$('#HeroDesc').html(data);
    }, 'text');
  });

  // Ici on gère tout l'affichage du contenu brut obtenu par le document texte
  function gestionAffichageData(dataduHeros){
    $('.entete').show();  // On réaffiche les entetes vu que le contenu est chargé
    $('.enteteClass').show();
    // Dans le doc texte ont a séparé chaque catégorie par un '/' donc nous séparons chaque partie grâce à la fonction split()
    var dataduHerosSplit = dataduHeros.split('/');

    /* -------- Affichage de la description -------- */
    var descriptionHeros = dataduHerosSplit[0];
    $('#HeroDesc').html(descriptionHeros);
    /* -------- Affichage des classes -------- */
    // On supprime les lignes du tableau généré avant execution sinon à chaque choix de Heros on ajoute des nouvelles lignes supplémentaire (donc le tableau grossit indéfiniment)
    $( ".HeroClass tbody tr" ).remove();

    var listeClassesBrut = dataduHerosSplit[1];
    // Dans le doc texte chaque classes est séparé par un '-'
    var listeClasses = listeClassesBrut.split('-');
    for (var i = 0; i < listeClasses.length; i++) {
      $('.HeroClass tbody').append("<tr><td>"+listeClasses[i]+"</td></tr>");
    }



  }



});
