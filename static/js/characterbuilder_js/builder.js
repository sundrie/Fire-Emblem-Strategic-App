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

  // stocke tous les noms provenant du folder Childrens
  var itsAChild = [];

  //Concerne les enfants qui sont un cas à part
  $.ajax({
    url: 'http://localhost/FEAcharapp/HeroesData/Childrens',
    success: function(data) {
       // on cherche tous les éléments qui contiennent .txt (donc logiquement seul le nom de fichier est trouvé) le a fait référence au href où on trouve cette info (voir console.log(data))
       $(data).find("a:contains(.txt)").each(function () {
         //this correspond aux a href trouvé qui contiennent .txt
         var filename = this.href.replace(window.location.host, "").replace("http:///", "");
         var nomPerso = filename.split(/[\/+.]/g);
         $("#charList").append("<li><a href=#>"+nomPerso[2]+"</a></li>");
         //On push le nom de l'enfant dans la variable définie plus haut
         itsAChild.push(nomPerso[2]);
       });
     }
  });

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
    // On vide les talents que l'utilisateur a possiblement déposer dans les réceptacles drop
    $("#HeroBuild table tr td").empty();
    // Corrige ce problème (Si on change de perso alors qu'un talent ou plusieurs talent sont encore dedans ça bug (impossibilité d'utiliser la zone et si on drop dans une autre case le bouton go back apparait et une fois clické la zone redeviens utilisable)
    $("#HeroBuild table tr").find("tr").replaceWith('<td></td>');

    // On redonne la classe drop pour contrer la methode replaceWith (voir droppable() juste en dessous)
    $("#HeroBuild table tr").removeClass().addClass("drop");

    // On apelle la fonction nous permettant de rendre les zones droppables
    dropTalents();

    var persoChoisi = $(this).text();
    // permet de copier coller le nom du perso dans l'input
    $('#searchchar').val(persoChoisi);
    // On met ceci à la place de .show() sinon le display flex n'est pas remis ce qui fait gros bug d'affichage
    $(".HeroBuildCard ").css("display","flex");
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImgBuilder").attr('src','http://localhost/FEAcharapp/static/img/character_portrait/'+persoChoisi+'_portrait.png');
    // On met le nom du perso dans l'étiquette du builder
    $(".NomHerosBuilder").html(persoChoisi);
    // Si le nom que l'utilisateur a cliqué apparait dans le tableau listant les enfants
    if (jQuery.inArray(persoChoisi, itsAChild) !== -1){
      // Pour dire à la suite du programme que c'est un enfant
      var Child = true;
      var nameChild = persoChoisi
      // On charge toutes les datas du perso (enfant)
      $.get('http://localhost/FEAcharapp/HeroesData/Childrens/'+persoChoisi+'.txt', function(data) {
        TraitementData(data,nameChild,Child);
        //$('#HeroDesc').html(data);
      }, 'text');
    }else{
      // On charge toutes les datas du perso
      $.get('http://localhost/FEAcharapp/HeroesData/'+persoChoisi+'.txt', function(data) {
        TraitementData(data);
        //$('#HeroDesc').html(data);
      }, 'text');
    }

    // On évite la multiplication des select
    $("#myParent").remove();
    // On évite la multiplication des boutons
    $('.buildsave').remove();
    // On évite la multiplication des input
    $('.OptionsMenu input').remove();
    // On ajoute une zone pour que l'utilisateur nomme son build
    $('.OptionsMenu').append('<input type="text" name="filenamebyuser" class="namefilebuildsave" placeholder="nom du build">');
    // Nous ajoutons un bouton pour que l'utilisateur puisse sauvegarder son build
    $('.OptionsMenu').append('<button class="buildsave">Sauvegarder mon build</button>');
    // On appelle la fonction à ce moment pour que celle ci fonctionne sur l'élément généré via code
    saveMyBuild();
  });

  // Ici on gère tout l'affichage du contenu brut obtenu par le document texte
  function TraitementData(dataduHeros,nameChild,Child){
    // Si le perso est un enfant
    if (Child == true){
      // On ajoute un select permettant de choisir le parent
      $('.formulaireRecherche').append("<select id='myParent'><option value='default' selected>Choisissez un parent</option></select>");
      // On appelle la fonction nous permettant de remplir dynamiquement la liste depuis un fichier txt ()
      fillParentList(nameChild);
    }
    // Dans le doc texte ont a séparé chaque catégorie par un '/' donc nous séparons chaque partie grâce à la fonction split()
    var dataduHerosSplit = dataduHeros.split('/');
    var listeClassesBrut = dataduHerosSplit[1];
    // Dans le doc texte chaque classes est séparé par un '-'
    var listeClasses = listeClassesBrut.split('-');
    // !!!!!! Pour éviter liste infinie !!!!!!!!!
    $("#TalentsList table").remove();
    // On cache le bouton goback pour éviter les soucis
    $(".goback").hide();
    // $(".TalentsChoosenBuilder").html('<tbody><tr class="drop"><td>Uno</td></tr><tr class="drop"><td>Dos</td></tr><tr class="drop"><td>Tres</td></tr><tr class="drop"><td>Quatro</td><tr class="drop"><td>Cinquo</td></tr></tbody>');
    // On fait la requête pour récupérer la page html contenant le tableau des talents par classes
    $.ajax({
      url: 'http://localhost/FEAcharapp/pages/class_talents_list.html',
      type: 'GET',
      success: function(res){
        var tableau = res
        // On cache tout le tableau car on ne souhaite pas que toutes les classes apparaissent pour le perso, seulement celles qu'il peut avoir
        $('#TalentsList').append(tableau);

        //On créé 2 tableaux qui recevront les futurs skills 1 et 2
        $('#TalentsList').append("<table class='tableskill2 drag'><tbody></tbody></table>");
        $('#TalentsList').append("<table class='tableskill1 drag'><tbody></tbody></table>");
        // On ajoute une bordure pour bien identifier la zone où on peut interragir
        $(".TalentsListclass").css("border","2px solid rgb(110, 108, 93)");
        // Pour éviter qu'on voit les 12 px manquant une fois la barre disparant du coup bah elle disparait plus comme ça
        $(".TalentsListclass").css("overflow-y", "scroll");

        // Cette fonction nous permet de faire 2 tableaux 1 pour chaque skill
        $('#TalentsList table tr').each(function(){
          //Ok alors pour decrypter .children() nous renvoie un tableau contenant chaque td de notre tr actuelle on sélectionne le 3ème et 4ème enfant grâce à eq()
          var tdskill2 = $(this).children('td').eq(3);
          var tdskill2desc = $(this).children('td').eq(4);

          // Pour info $(this).attr('class') nous donne la class de la tr en cours
          $("<tr class='"+$(this).attr('class')+"'><td>"+tdskill2.html()+"</td><td>"+tdskill2desc.html()+"</td></tr>").appendTo(".tableskill2 tbody");

          // On supprime les lignes du tableau original vu que le déplacement a été fait histoire de pas avoir de doublons
          tdskill2.remove();
          tdskill2desc.remove();

          // ~~~~~~ A partir d'ici on fait la même chose qu'au dessus mais pour le skill 1 cette fois. /!\ IMPORTANT /!\ On fait dans le sens inverse car dans l'autre sens le code fonctionnerait pas comme on le voudrait.

          //Ok alors pour decrypter .children() nous renvoie un tableau contenant chaque td de notre tr actuelle on sélectionne le 1er et 2ème enfant grâce à eq()
          var tdskill1 = $(this).children('td').eq(1);
          var tdskill1desc = $(this).children('td').eq(2);

          // Pour info $(this).attr('class') nous donne la class de la tr en cours
          $("<tr class='"+$(this).attr('class')+"'><td>"+tdskill1.html()+"</td><td>"+tdskill1desc.html()+"</td></tr>").appendTo(".tableskill1 tbody");

          // On supprime les lignes du tableau original vu que le déplacement a été fait histoire de pas avoir de doublons
          tdskill1.remove();
          tdskill1desc.remove();
        });

        // On cache tout le tableau car on ne souhaite pas que toutes les classes apparaissent pour le perso, seulement celles qu'il peut avoir
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
                var row_index1 = $(this).parent().index();
                var col_index1 = $(this).index();
                //console.log("row_index1 : "+row_index1+" col_index1 : "+col_index1 )
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
        // On enlève le premier tableau contenant le nom des classes
        $("#TalentsList table").first().remove();
      }
    });
  }

  // fonction nous permettant de rendre les zones droppables si la class est drop
  function dropTalents(){
    $('.drop').droppable({
      accept: '.drag',
      drop: function (event,ui) {
        var droppable = $(this);
        // console.log(droppable);
        var draggable = ui.draggable;
        // console.log(draggable);
        var droppablechild = $(droppable).children();
        // console.log(droppablechild);


        // Si la zone de drop contient un td (donc aucun autre talent(pour rappel sans ce test on pouvait mettre plusieurs talents dans une seule zone de drop ce qui était très problématique)) alors tout s'effectue normalement sinon et bien le talent retourne avec les autres, si on voulait gérer le sinon alors il faut ajouter ceci if ($(droppablechild[0]).is(':not(td)'))
        if($(droppablechild[0]).is('td')){

          var row_index = $(draggable).parent().index();
          var col_index = $(draggable).index();
          // Nous donne la classe de la table d'où provient l'élément
          var tableOrigin = $(draggable).closest('table').attr('class').split(' ')[0];
          //console.log(tableOrigin);
          //console.log("row_index : "+row_index+" col_index : "+col_index);

          // Move draggable into droppable
          $(droppable).find('td').remove()
          draggable.appendTo(droppable);

          // On desactive le draggable pour éviter les soucis
          $(draggable).draggable('disable');
          // On retire la classe drag pour qu'on ne puisse plus bouger le talent une fois dans la zone de drop.
          $(draggable).removeClass("drag");

          // On ajoute un bouton pour pouvoir modifier les talents de la zone de drop
          $(draggable).append("<button class='goback'>X</button>");
          // On affiche le bouton goback précedemment masqué plus haut dans le code pour éviter qu'ils aparaissent lorsqu'on choisi un autre perso alors qu'on a pas vidé la zone de drop
          $(".goback").show();

          // Fonction qui s'active lors d'un clic sur la classe goback (qui sert à enlever un talent de la zone de drop pour qu'il revienne dans le tableau avec tous les autres talents)
          $(".goback").on("click",function(){

            // var tableOrigin2 = $(draggable).closest('table').attr('class').split(' ')[0];
            // console.log(tableOrigin2);
            var trVoyager = $(this).parent();
            var trDropOriginelle = $(this).parent().parent();

            //supprime le bouton goback
            $(this).remove();

            //console.log(trVoyager);
            // console.log(("."+tableOrigin+" tbody"))

            $("."+tableOrigin+" tbody").after(trVoyager[0]);
            // On réactive la fonction draggable après que celui ci soit retourné avec ses autres amis talents
            $(trVoyager[0]).draggable('enable');
            $(draggable).addClass("drag");
            // Nous permet de remplir la zone de drop une fois le transfert fait pour éviter la dsparition vu que tr vide
            $(trDropOriginelle).append('<td></td>');
          });
        }
      }
    });
  }

  // Fonction nous permettant de sauvegarder le build du personnage lors du clic sur le bouton
  function saveMyBuild(){
    $('.buildsave').on("click",function(){
      // On récupère tous les tr(talents) que l'utilisateur a mit dans les zones de drop
      var alltr = $(".TalentsChoosenBuilder tbody tr");
      // Ceci nous permet de ne pas récupérer les zones de drop (voir fonctionnement du code)(remplir les 5 zones et vous verrez 10 éléments dans la variable (c'est normal nous n'effacons rien voir commits précédents pour comprendre))
      var chosenOnes = alltr.filter(':not(.drop)');
      //console.log($(chosenOnes.children('td')));

      // On créé une variable qui contiendra le texte de chaque élément dans la zone de drop pour que AJAX puisse comprendre
      var encoderforAJAX = [];

      // Ceci est utilisé pour définir le expires du cookie généré plus bas
      var date = new Date();
      // (expire dans 30 sec)
      date.setTime(date.getTime()+(30*1000));
      var expires = "; expires="+date.toGMTString();

      // On ajoute le nom du perso pour que PHP sache de qui il s'agit
      encoderforAJAX.push($('.NomHerosBuilder').text());

      // Si l'utilisateur n'a pas mis de nom de build on met le jour et date
      if ($(".namefilebuildsave").val()=="") {
        var Zawarudo = new Date($.now());
        var defaultfilename = Zawarudo.getDate() +"/"+ Zawarudo.getMonth() +"/"+ Zawarudo.getFullYear() +"-"+ Zawarudo.getHours() + ":" + Zawarudo.getMinutes() + ":" + Zawarudo.getSeconds();
        var reg = /([^a-zA-Z0-9_])/g;
        var validdefaultfilename = defaultfilename.replace(reg,"");
        encoderforAJAX.push(validdefaultfilename);

        // On créé un cookie avec le nom du fichier pour le script PHP userdownloadfile
        document.cookie = 'filename=['+encoderforAJAX[0]+'] '+validdefaultfilename+';'+date.toGMTString()+';path=/';
      } else {
        // Sinon le nom du fichier entré par l'utilisateur a la place de la date
        encoderforAJAX.push($(".namefilebuildsave").val());
        // On créé un cookie avec le nom du fichier pour le script PHP userdownloadfile
        document.cookie = 'filename=['+encoderforAJAX[0]+'] '+$(".namefilebuildsave").val()+';'+date.toGMTString()+';path=/';
      }

      // Pour chaque talents choisis on push dans le tableau qui sera envoyé
      $(chosenOnes.children('td')).each(function() {
        encoderforAJAX.push($(this).text());
      });

      // Notre requête Ajax qui envoie toutes les données à notre script savebuild.php
      $.ajax({
        url: 'http://localhost/FEAcharapp/php/savebuild.php',
        method: 'POST',
        data:{build : encoderforAJAX},
        success : function(data){
          // Ceci est nécessaire pour que l'utilisateur sache que son build a été téléchargé sous format texte
          window.location.replace("http://localhost/FEAcharapp/php/userdownloadfile.php");

          // Pour avoir un retour du script php
          //$('#message').html('voilà ce qui a été envoyé : '+ data);
        }
      });
      // On appel notre script pour qu'il nettoie les fichiers txt (à voir une fois en ligne si cette méthode ne pose pas des problèmes mais en local ça fonctionne correctement). En l'état actuel seul le fichier que l'on créé juste après le clic reste sur le serveur
      $.get("http://localhost/FEAcharapp/php/cleartxt.php");
      return false;

    });
  }

  // Cette fonction va nous extraire les parents du fichier parentsList.txt pour remplir le select sous la liste des personnages
  function fillParentList(nameChild){
    var Parents;
    $.get('http://localhost/FEAcharapp/HeroesData/Tools/parentsList.txt', function(data) {
      // On sépare chaque ligne du doc txt
      var lignes = data.split("+")
      for (var i = 0; i < lignes.length; i++) {
        // Si on trouve le prénom du Héros parmis le tableau des lignes du doc txt
        if (lignes[i].indexOf(nameChild) !== -1){
          // Dans le doc texte chaque parent est séparé par un '-'
          Parents = lignes[i].split('-');
        }
      }
      // Petit fix pour enlever ce qui précède le ":" (le nom du perso) (par exemple avant ça nous faisait Lucina:Avatar(F))
      var removeMyName = Parents[0].split(":");
      // On écrase le contenu par notre fix
      Parents[0] = removeMyName[1];

      // Pour chaque parent on créé une option dans notre liste
      $.each((Parents), function(i){
        $("#myParent").append("<option value="+Parents[i]+">"+Parents[i]+"</option>")
      })
    }, 'text');
  }


});
