$(function() {

  // code trouvé sur https://stackoverflow.com/questions/22061073/how-do-i-get-images-file-name-from-a-given-folder
  //Ceci va générer notre liste de perso comme ça plus besoin de PHP qui n'était en soit suite aux changements plus très utile

  $.ajax({
    url: 'http://localhost/FEAcharapp/HeroesData/',
    success: function(data) {
       // on cherche tous les éléments qui contiennent .txt (donc logiquement seul le nom de fichier est trouvé) le a fait référence au href où on trouve cette info (voir console.log(data))
       $(data).find("a:contains(.txt)").each(function () {
         //this correspond aux a href trouvé qui contiennent .txt
         var filename = this.href.replace(window.location.host, "").replace("http:///", "");
         var nomPerso = filename.split(/[\/+.]/g);
         $("#charList").append("<li><a href=#>"+nomPerso[1]+"</a></li>");
       });
     }
  });

  var saisieUser;

  $("#searchchar").on("click",function(){
    // On "nettoie" l'input
    $('#searchchar').val('');
    // On remontre toute la liste qui aurait pût être diminué selon la saisie de l'utilisateur
    $("#charList li").show();
  });

  $("#searchchar").on("keyup", function(){
    // On passe la saisie en minuscule pour éviter les soucis
    var saisieUser = $(this).val().toLowerCase();
    // Cette boucle va masquer les noms qui ne correspondent pas à la saisie de l'utilisateur
    $("#charList li a").each(function(index){
      if($(this).text().toLowerCase().indexOf(saisieUser) === -1){
        $(this).parent().hide();
      }
      else{
        $(this).parent().show();
      }
    });
  });

  // Fonction qui s'active lors d'un clic sur un personnage
  $('#charList').on("click", "a", function(){
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
