/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Code js spécifique à la page character builder
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

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
         $("#charList").append("<li><a href=#>"+nomPerso[2]+"</a></li>");
       });
     }
  });

  var saisieUser;

  // On récupère en instantanée la saisie de l'utilisateur
  $('#searchchar').keyup(function() {
    saisieUser = $('#searchchar').val();
    $.ajax({
      url: 'characterbuilder.html',
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
  $('#charList').on("click", "a", function(){
    var persoChoisi = $(this).text();
    // permet de copier coller le nom du perso dans l'input
    $('#searchchar').val(persoChoisi);
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImg").attr('src','http://localhost/FEAcharapp/static/img/character/'+persoChoisi+'.png');
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
      TraitementData(data);
      //$('#message').html(data);
    }, 'text');
  });

  // Ici on gère tout l'affichage du contenu brut obtenu par le document texte
  function TraitementData(dataduHeros){
    // Dans le doc texte ont a séparé chaque catégorie par un '/' donc nous séparons chaque partie grâce à la fonction split()
    var dataduHerosSplit = dataduHeros.split('/');
    var listeClassesBrut = dataduHerosSplit[1];
    // Dans le doc texte chaque classes est séparé par un '-'
    var listeClasses = listeClassesBrut.split('-');
    // !!!!!! Pour éviter liste infinie !!!!!!!!!
    $("#message table").remove();
    $.ajax({
      url: 'http://localhost/FEAcharapp/pages/class_talents_list.html',
      type: 'GET',
      success: function(res){
        // $(""+res+":contains('"+listeClasses[0]+"')").each(function(){
        //   $('#message').append($(this));
        // });

        var tableau = res
        if ($(tableau).find("."+$.trim(listeClasses[0])+"")) {
          $('#message').append(tableau);
          $('table tr').not(".Lord").hide();
        }

        test(listeClasses);

      }
    });

  }

  function test(myClass){
    // Code qui colore bien en rouge toute la ligne Cavalier
    // $('td:contains(Cavalier)').each(function(){
    //   var lignefound = $(this).closest('tr')
    //   $(lignefound).css("color", "red");
    // })

    for (var i = 0; i < $("table tr").length; i++) {
      if ($("table tr:contains(#"+$.trim(myClass[0])+")")) {
        $(this).closest('tr').css("color", "red");
      }

    }


  }






});
