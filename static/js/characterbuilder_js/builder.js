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
    // On met ceci à la place de .show() sinon le display flex n'est pas remis ce qui fait gros bug d'affichage
    $(".HeroBuildCard ").css("display","flex");
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImgBuilder").attr('src','http://localhost/FEAcharapp/static/img/character/'+persoChoisi+'.png');
    // On met le nom du perso dans l'étiquette du builder
    $(".NomHerosBuilder").html(persoChoisi);
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
    $("#TalentsList table").remove();
    // $(".TalentsChoosenBuilder").html('<tbody><tr class="drop"><td>Uno</td></tr><tr class="drop"><td>Dos</td></tr><tr class="drop"><td>Tres</td></tr><tr class="drop"><td>Quatro</td><tr class="drop"><td>Cinquo</td></tr></tbody>');
    // On fait la requête pour récupérer la page html contenant le tableau des talents par classes
    $.ajax({
      url: 'http://localhost/FEAcharapp/pages/class_talents_list.html',
      type: 'GET',
      success: function(res){
        var tableau = res

        // On cache tout le tableau car on ne souhaite pas que toutes les classes apparaissent pour le perso, seulement celles qu'il peut avoir
        $('#TalentsList').append(tableau);









        $('#TalentsList').append("<table class='tableskill2 drag'><tbody></tbody></table>");
        $('#TalentsList').append("<table class='tableskill1 drag'><tbody></tbody></table>");

        // $('table tr').each(function(){
        //   // nous donne la class de la tr
        //   //console.log($(this).attr('class'))
        //
        //   //Ok alors pour decrypter on a une liste des td de notre tr actuelle on sélectionne le 3 et 4 enfant grâce à eq()
        //   var tdskill2 = $(this).children('td').eq(3);
        //   var tdskill2desc = $(this).children('td').eq(4);
        //
        //   $("<tr class='"+$(this).attr('class')+"'><td>"+tdskill2.html()+"</td><td>"+tdskill2desc.html()+"</td></tr>").appendTo(".tableskill2 tbody");
        //
        //   tdskill2.remove();
        //   tdskill2desc.remove();
        //
        //   //Ok alors pour decrypter on a une liste des td de notre tr actuelle on sélectionne le 1 et 2 enfant grâce à eq()
        //   var tdskill1 = $(this).children('td').eq(1);
        //   var tdskill1desc = $(this).children('td').eq(2);
        //
        //   $("<tr class='"+$(this).attr('class')+"'><td>"+tdskill1.html()+"</td><td>"+tdskill1desc.html()+"</td></tr>").appendTo(".tableskill1 tbody");
        //
        //   tdskill1.remove();
        //   tdskill1desc.remove();
        // });






        $("#TalentsList table tr").hide();
        // la variable qui récupèrera les classes que le perso peut avoir
        var classe;
        // Petite boucle pour parcourir le array des classes possibles pour le perso (souvent 9 classes excepté pour des persos spéciaux)
        for (var i = 0; i < listeClasses.length; i++) {
          // ici on enlève les espaces de nos strings pour pouvoir rechercher la classes correspondante (ex: Great Knight dans la variable classe or la class en html se nomme GreatKnight)
          classe = listeClasses[i].split(" ").join("");
          // Si notre page html contient une classe correspondant à la liste du perso alors on affichera cette classe qui était au départ masquée
          if ($("tableau:contains('."+classe+"')")){
            //console.log($("#message ."+classe));
            $("#TalentsList ."+classe).show();
            // On ajoute la classe drag pour changer les icônes du pointeur de la souris dans notre master.css
            $("#TalentsList ."+classe).addClass("drag");
            // Nous sommes obligé d'exécuter ce code ici au moment de la génération car en dehors ça ne fonctionne pas
            $("#TalentsList ."+classe).draggable({
              containment : '.wrapper',
              helper: "clone",    // Ne pas supprimer sinon le drag ne fonctionne pas
              start: function (){
                $(this).animate({
                  opacity: '0.5'
                }, 1000);
              },
              stop: function () {
                $(this).animate({
                  opacity: '1'
                }, 1000);
              }
            });
          }
        }
        //Utilisé lors du debug pour séparer les classes entre chaque perso
        //console.log('------------------------')
        //test pour drag
        // $("#message").append("<div class='drag'>Je suis un test</div>");
      }
    });
  }

  $('.drop').droppable({
    accept: '.drag',
    drop: function (event,ui) {
      var draggable = ui.draggable;
      $(this).replaceWith(draggable);
    }
  });

});
