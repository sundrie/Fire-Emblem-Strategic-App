/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Code js spécifique à la page character builder
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
$(function() {

  // On récupère dans ces variables la liste des personnages pour heroesList et la liste des classes (et ce qu'elles contiennent à savoir des talents) pour allclassesList. attention ajax est async donc il peut arriver que undefined arrive selon l'endroit où on utilise ces variables
  var heroesList;
  var allclassesList;

  // Ce qui va charger et nous sortir une liste des personnages avec toutes leurs datas (sexe,parents,genitor,classlist,description)
  $.ajax({
    url: 'http://alexandreblin.ovh/FireEmblemStrategicApp/Data-FireEmblemAwakening/Tools/PersosList.xml',
    datatype : 'xml',
    success: function(data){
      // Liste de tous les personnages
      var characterList = $(data).children().children();
      //Ceci va générer notre liste de perso
      $(characterList).each(function(i) {
        $("#charList").append("<li><a href=#>"+$(this).attr("name")+"</a></li>");
      });
      // On rend "global" le résultat de notre requête ajax
      heroesList = characterList;
    }
  });

  // On charge notre document xml listant tous les talents
  $.ajax({
    url: 'http://alexandreblin.ovh/FireEmblemStrategicApp/Data-FireEmblemAwakening/Tools/TalentsList.xml',
    datatype : 'xml',
    success: function(data){
      // Variable qui liste toutes les classes
      var allclasses = $(data).children().children();
      // On rend "global" le résultat de notre requête ajax
      allclassesList = allclasses;
    }
  });

  // Le code suivant gère la saisie dans le champ de recherche au dessus de la liste des personnages
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

  // Cette variable contiens le nom du genitor dans notre PersosList.xml (souvent la mère)
  var genitorName;
  // Cette variable contiens les noms des parents possibles pour le personnage choisi
  var splittedParentsList;
  // stocke le booléen nous indiquant si c'est un enfant (true) ou pas un enfant (false)
  var childTestResult;

  // retourne un booléen pour si le personnage cliqué est un enfant ou non
  function childOrNot (TheChosenOne) {
    genitorName = TheChosenOne.children()[2]
    var parentsList = TheChosenOne.children()[1]
    splittedParentsList = $(parentsList).text().split("-");
    // Si c'est vide alors ça veut dire que le personnage n'est pas un enfant car sinon il aurait le nom de sa mère généralement (par exemple le genitor de Severa est Cordelia, celui de Noire Tharja, celui de Yarne Palne, etc)
    if ($(genitorName).text() === "") {
      return false
    } else {
      return true
    }
  }

  // fonction qui va s'occuper de récupérer les datas du perso choisi
  function searchMyData(theChosen){
    var classList = theChosen.children()[3];
    // On stocke dans une var chaque classe séparée par un -
    var splittedClassList = $(classList).text().split("-");
    // On déclare une variable de type Array pour pouvoir utiliser la méthode push()
    var classes = [];
    // On boucle sur chaque classes
    $(allclassesList).each(function(i) {
      // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable classes
      if($.inArray($(this).attr("name"), splittedClassList) !== -1){
        classes.push($(this));
      }
    });
    return classes
  }

  // C'est le contenu xml correspondant au personnage choisi par l'utilisateur
  var theChosenOne;

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
    $(".HeroBuildCard").css("display","flex");
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImgBuilder").attr('src','http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/character_portrait/'+persoChoisi+'_portrait.png');
    // On met le nom du perso dans l'étiquette du builder
    $(".NomHerosBuilder").html(persoChoisi);

    // !!!!!! Pour éviter liste infinie !!!!!!!!!
    $("#TalentsList table").remove();
    // Pour éviter l'apparition de la barre de scroll si on passait d'un perso non enfant à un enfant
    $("#TalentsList").hide();
    // On évite la multiplication des select
    $("#myParent").remove();
    $("#myParentLegacy").remove();
    $("#myGenitorLegacy").remove();
    // On évite la multiplication du message
    $('.chooseAParent').hide();
    $('.chooseAParent p').remove();

    // fonction qui va parcourir la liste des personnages et trouver celui sélectionné par l'utilisateur
    $(heroesList).each(function(i) {
      if ($(this).attr("name") === persoChoisi) {
        theChosenOne = $(this);
        // On appelle la fonction qui va tester si le personnage est un enfant ou non et on stocke le résultat dans la variable
        childTestResult = childOrNot(theChosenOne);
      }
    });

    // On test si le personnage cliqué par l'utilisateur est un enfant
    if (childTestResult === true){

      // On ajoute un select permettant de choisir 1er talent d'héritage (celui du parent inchangeable Cordelia pour Severa, Chrom pour Lucina, etc)
      $('.formulaireRecherche').append("<select id='myGenitorLegacy' class='myParentclass myGenitorLegacyclass'><option value='default' selected>1er talent hérité</option></select>");

      // On ajoute un select permettant de choisir le parent
      $('.formulaireRecherche').append("<select id='myParent' class='myParentclass'><option value='default' selected>Choisir parent</option></select>");

      /* Un message qui apparait pour indiquer à l'utilisateur ce qu'il doit faire */
      $('.chooseAParent').show();
      $('.chooseAParent').append("<p class='messageChooseParent'>Veuillez choisir un parent dans la liste qui se trouve sous la liste des personnages pour continuer</p>");

      // On appelle la fonction nous permettant de remplir dynamiquement le select
      fillSelectParent();
    }else{
      // contient un tableau d'objet qui sont les classes disponibles du personnage
      var theClassesList = searchMyData(theChosenOne);
      displayHeroData(theClassesList);
    }

    // On évite la multiplication des boutons
    $('.buildsave').remove();
    // On évite la multiplication des input
    $('.OptionsMenu input').remove();
    // On évite la multiplication de la div
    $('.specialChara').remove();
    // Sert pour si un caractère spécial a été entré à afficher un message d'erreur
    $('.OptionsMenu').append('<div class="specialChara"></div>');
    // On ajoute une zone pour que l'utilisateur nomme son build
    $('.OptionsMenu').append('<input type="text" name="filenamebyuser" class="namefilebuildsave" placeholder="nom du build">');
    // On fait l'appel de notre fonction pour vérifier qu'un charactère spécial n'est pas rentré pour éviter au script de bug et renvoyer vers la page errorpage avec erreur fatale.
    // code de base trouvé sur http://www.tutorialsmade.com/restrict-special-characters-textbox-jquery/ mais que j'ai modifié et adapté à mon cas (changement regex, suppression variable inutile dans le if, etc.)
    $('.namefilebuildsave').on("keyup", function(){
      // Cette variable récupère ce que l'utilisateur tappe pour faire son nom de fichier
      var UserTyping = $(this).val();
      // console.log(UserTyping);
      // Cette regex cherche si les charactères suivants /\:*?"<>| ont été tappé car ils ne peuvent être utilisés pour un nom de fichier dans notre cas
      var reg = /([/\\:*?"<>|])/g;
      // Cette variable renvoie true si un caractère spécial est dans le string tappé par l'utilisateur et restera true tant qu'un caractère y sera
  		var isASpecialCharacter = reg.test(UserTyping);
      //console.log(isASpecialCharacter);
      // Dès que notre variable passe à true
      if(isASpecialCharacter){
        // On supprime le caractère entré
  			$(this).val(UserTyping.replace(reg, ''));
        // Ce qui suit est uniquement pour avertir que l'utilisateur a fait une erreur
        $('.namefilebuildsave').css("border","3px solid rgb(255, 27, 0)");
        $('.specialChara').append("<p>Vous avez entré un caractère spécial qui ne peut être utilisé pour un nom de fichier");
        // Si il y a déjà un message on supprime ceux qui sont plus grand que 0 (1 en vrai vu que en informatique ont commence à compter à partir de 0 et non 1)
        // Sinon si il n'y a pas de message supplémentaire le setTimeout s'execute et le message disparait bien au bout de 3 sec peut importe le spam sa ne "reset" pas le timer
        if ($(".specialChara p").length > 1) {
          $('.specialChara p:gt(0)').remove();
        }else{
          // après 3 secondes ont supprime le message en même temps que remettre les bordures normales
          setTimeout(function(){
            $('.namefilebuildsave').css("border","1px solid rgb(85, 57, 36)");
            $('.specialChara p').fadeOut('slow', function() {
              $('.specialChara p').remove();
            });
          },3000);
        }
      }
    });
    // Nous ajoutons un bouton pour que l'utilisateur puisse sauvegarder son build
    $('.OptionsMenu').append('<button class="buildsave"><i class="far fa-arrow-alt-circle-down"></i> Sauvegarder mon build</button>');
    // On appelle la fonction à ce moment pour que celle ci fonctionne sur l'élément généré via code
    saveMyBuild();
  });


  // Fonction qui va afficher les talents dans notre page pour cela on boucle sur notre variable array
  function displayHeroData(classes) {
    // On cache le bouton goback pour éviter les soucis
    $(".goback").hide();
    $('#TalentsList').show();
    $('#TalentsList').append("<table class='drag'><tbody></tbody></table>");
    // console.log(classes[0].attr("name"))
    // On déclare nos variables ici en dehors de la boucle pour éviter de la génération inutile de variable en boucle et consommer inutilement nos ressources en calcul
    var talents;
    var talent1;
    var talent2;
    var imagelink;
    var descTalent
    $(classes).each(function(i) {
      // Si le nom de la classe issue du jeu contient un espace alors on supprime cet espace pour faire une seule classe et non 2 ou plus (ex : Great Knight donne normalement 2 class Great et Knight alors que l'on veut que ça soit une class unique GreatKnight)
      // Sinon et bien on ajoute tout simplement sans traitement anti espace
      if (/\s/.test(classes[i].attr("name"))) {
        var removeSpace = classes[i].attr("name");
        // On enlève les whitespace entre les mots (trim ne fonctionne qu'aux début et fin des strings)
        removeSpace = removeSpace.replace(/\s/, '');
        // Pour plus de visibilité j'ai attribué à nos variables les talents qu'ils représentent c'est plus clair que classes[i].children()[0] et plus concis
        talents = classes[i].children();
        talent1 = talents[0];
        talent2 = talents[1];
        // On attribue a imagelink la première "case" de notre variable qui contient l'url de l'image ,pareil que $(talent1) on fait ceci pour pouvoir utiliser .text() sinon $(talent1).children()[0].text() nous renverrait une erreur
        imagelink = $(talent1).children()[0];
        // Affiche la description du talent
        // On reprends le même principe que pour imagelink
        descTalent = $(talent1).children()[1];
        // Le $(talent1) est essentiel pour pouvoir intéragir avec cette variable objet
        $("#TalentsList table tbody").append("<tr class="+removeSpace+"><td><img src='"+$(imagelink).text()+"'>"+$(talent1).attr("name")+"</td><td>"+$(descTalent).text()+"</td></tr>");

        // On change juste le selecteur pour éviter de créer 2 variables imagelink
        imagelink = $(talent2).children()[0];
        // Affiche la description du talent
        descTalent = $(talent2).children()[1];
        // Affiche l'image et nom du 2ème talent de la classe du personnage
        $("#TalentsList table tbody").append("<tr class="+removeSpace+"><td><img src='"+$(imagelink).text()+"'>"+$(talent2).attr("name")+"</td><td>"+$(descTalent).text()+"</td></tr>");
        $("#TalentsList ."+removeSpace).addClass("drag");
      } else {
        // Pour plus de visibilité j'ai attribué à nos variables les talents qu'ils représentent c'est plus clair que classes[i].children()[0] et plus concis
        talents = classes[i].children();
        talent1 = talents[0];
        talent2 = talents[1];

        // Affiche l'image et nom du 1er talent de la classe du personnage
        imagelink = $(talent1).children()[0];
        // Affiche la description du talent
        descTalent = $(talent1).children()[1];
        $("#TalentsList table tbody").append("<tr class="+classes[i].attr("name")+"><td><img src='"+$(imagelink).text()+"'>"+$(talent1).attr("name")+"</td><td>"+$(descTalent).text()+"</td></tr>");

        // Affiche l'image et nom du 2ème talent de la classe du personnage
        imagelink = $(talent2).children()[0];
        // Affiche la description du talent
        descTalent = $(talent2).children()[1];
        $("#TalentsList table tbody").append("<tr class="+classes[i].attr("name")+"><td><img src='"+$(imagelink).text()+"'>"+$(talent2).attr("name")+"</td><td>"+$(descTalent).text()+"</td></tr>");
      }
      $("#TalentsList ."+classes[i].attr("name")).addClass("drag");
      // Nous sommes obligé d'exécuter ce code ici au moment de la génération car en dehors ça ne fonctionne pas
      $("#TalentsList table tbody .drag").draggable({
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
    });
  }


  // fonction nous permettant de rendre les zones droppables si la class est drop
  function dropTalents(){
    $('.drop').droppable({
      accept: '.drag',
      drop: function (event,ui) {
        var droppable = $(this);
        var draggable = ui.draggable;
        var droppablechild = $(droppable).children();

        // Si la zone de drop contient un td (donc aucun autre talent(pour rappel sans ce test on pouvait mettre plusieurs talents dans une seule zone de drop ce qui était très problématique)) alors tout s'effectue normalement sinon et bien le talent retourne avec les autres, si on voulait gérer le sinon alors il faut ajouter ceci if ($(droppablechild[0]).is(':not(td)'))
        if($(droppablechild[0]).is('td')){
          // Move draggable into droppable
          $(droppable).find('td').remove()
          draggable.appendTo(droppable);

          // On desactive le draggable pour éviter les soucis
          $(draggable).draggable('disable');
          // On retire la classe drag pour qu'on ne puisse plus bouger le talent une fois dans la zone de drop.
          $(draggable).removeClass("drag");
          // On ajoute un bouton pour pouvoir modifier les talents de la zone de drop
          $($(draggable).children().first()).append("<i class='fas fa-times goback'></i>");
          // On affiche le bouton goback précedemment masqué plus haut dans le code pour éviter qu'ils aparaissent lorsqu'on choisi un autre perso alors qu'on a pas vidé la zone de drop
          $(".goback").show();

          // Fonction qui s'active lors d'un clic sur la classe goback (qui sert à enlever un talent de la zone de drop pour qu'il revienne dans le tableau avec tous les autres talents)
          $(".goback").on("click",function(){
            var trVoyager = $(this).parent().parent();
            var trDropOriginelle = $(this).parent().parent().parent();

            //supprime le bouton goback
            $(this).remove();

            $(".drag tbody").append(trVoyager[0]);
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
        // Corrige le bug qui lorsqu'on mettait un espace au début et/ou la fin de ce qui était tappé pour le nom de fichier nous renvoyais vers la page erreur fatale
        var stringWhitespaceToClean = $(".namefilebuildsave").val();
        var userFilename = $.trim(stringWhitespaceToClean);
        // Sinon le nom du fichier entré par l'utilisateur à la place de la date
        encoderforAJAX.push(userFilename);
        // On créé un cookie avec le nom du fichier pour le script PHP userdownloadfile
        document.cookie = 'filename=['+encoderforAJAX[0]+'] '+userFilename+';'+date.toGMTString()+';path=/';
      }

      // Pour chaque talents choisis on push dans le tableau qui sera envoyé
      $(chosenOnes.children('td')).each(function() {
        encoderforAJAX.push($(this).text());
      });
      // Notre requête Ajax qui envoie toutes les données à notre script savebuild.php
      $.ajax({
        url: 'http://alexandreblin.ovh/FireEmblemStrategicApp/php/savebuild.php',
        method: 'POST',
        data:{build : encoderforAJAX},
        success : function(data){
          // Ceci est nécessaire pour que l'utilisateur sache que son build a été téléchargé sous format texte
          window.location.replace("http://alexandreblin.ovh/FireEmblemStrategicApp/php/userdownloadfile.php");

          // Pour avoir un retour du script php
          // $('#message').html('voilà ce qui a été envoyé : '+ data);
        }
      });
    });
  }

  // Cette fonction va nous remplir le select sous la liste des personnages avec les noms des parents possibles
  function fillSelectParent(){
    // Pour chaque parent on créé une option dans notre liste
    $.each((splittedParentsList), function(i){
      $("#myParent").append("<option value="+splittedParentsList[i]+">"+splittedParentsList[i]+"</option>")
    })
  }

  // Lors d'un changement dans le select pour choisir le parent sous la liste des persos
  $(".formulaireRecherche").on('change','#myParent',function(){
    $('.chooseAParent').hide();
    // On récupère le nom du parent choisi dans la liste
    var parentName = $(this).val();
    // On stocke le nom de l'enfant pour charger ses datas
    var childName = $('.NomHerosBuilder').text();
    // On charge toutes les datas du perso (enfant)
    $.get('http://alexandreblin.ovh/FireEmblemStrategicApp/HeroesData/Childrens/'+childName+'.txt', function(data){
      data = data.split("/");
      var childClass = data[1];
      // On envoie le nom du parent, les classes de l'enfant à notre fonction pour récupérer les data du parent par la suite (à cause du asynchronous on charge les datas de l'enfant maintenant car pour l'instant nous ne l'avions pas fait (changement ordre code suite à la gestion des enfants (voir commits de la branch childrens_arc)))
      getParentData(childName,parentName,childClass);
    }, 'text');
  });

  // Cette fonction se chargera de récupérer les data du parent choisi depuis son text file
  function getParentData(childName,parentName,childClass){
    // On charge toutes les datas du parent
    $.get('http://alexandreblin.ovh/FireEmblemStrategicApp/HeroesData/'+parentName+'.txt', function(data) {
      // On sépare le data brut du txt à l'endroit du / et on écrase le data pour le transformer en tableau
      data = data.split("/");
      // De ce tableau on prend la 2ème partie qui contient nos classes
      var parentClass = data[1];
      // On appelle notre fonction qui se chargera de donner un talent en héritage à l'enfant
      legacy_of_Parent(parentName,parentClass);
      // On envoie les 2 listes à notre fonction
      completeChildTalent(childName,parentName,childClass,parentClass);
    }, 'text');
  }

  function legacy_of_Parent(parentName,parentClass) {
    // Si il y a plus d'un seul select pour sélectionner le talent du parent alors on supprime le select (la multiplication des select arrivait si on changait de parent tout en restant sur le même perso)
    if ($("#myParentLegacy").length > 0) {
      $("#myParentLegacy").remove();
    }
    $('.formulaireRecherche').append("<select id='myParentLegacy' class='myParentLegacyclass'><option value='default' selected>Choisir talent donné par "+parentName+"</option></select>");
  }

  // fonction qui se chargera de concevoir l'arbre de talents de l'enfant à partir du sien de base et de celui du parent qui donne ses classes en héritage
  function completeChildTalent(childName,parentName,rawChildClass, rawParentClass){
    // Ces variables servent à déterminer qui est un Homme ou une Femme parmis tous les personnages de Fire Emblem Awakening
    var FEAMale = "Avatar(M),Basilio,Brady,Chrom,Donnel,Frederick,Gaius,Gangrel,Gerome,Gregor,Henry,Inigo,Kellam,Laurent,Libra,Lon'zu,Owain,Priam,Ricken,Stahl,Vaike,Virion,Walhart,Yarne,Yen'fay";
    var FEAFemale = "Cynthia,Kjelle,Lucina,Nah,Noire,Severa";
    // Pour avoir un retour des noms et vérifier si il n'y a pas d'erreurs
    // console.log('Nom enfant : '+childName+" - Nom parent : "+parentName);

    // On initalise ces variables à faux, elles passeront à vrai grâce aux if et nous indiquerons si l'enfant est M ou F
    var childMale = false;
    var childFemale = false;

    // On vérifie si le nom de l'enfant est dans la liste des personnages M ou F
    if((FEAMale.indexOf(childName))>=0){
      childMale = true;
    }else if((FEAFemale.indexOf(childName))>=0){
      childFemale = true;
    }

    // On initalise ces variables à faux, elles passeront à vrai grâce aux if et nous indiquerons si le parent est M ou F
    var parentMale = false;
    var parentFemale = false;
    // On vérifie si le nom du parent est dans la liste des personnages M ou F
    if((FEAMale.indexOf(parentName))>=0){
      parentMale = true;
    }else if((FEAFemale.indexOf(parentName))>=0){
      parentFemale = true;
    }
    // Pour avoir un retour et vérifier si pas de fautes
    // console.log("parent M ? : "+parentMale+" - parent F ? : "+parentFemale);
    // console.log("enfant M ? : "+childMale+" - enfant F ? : "+childFemale);

    // On stocke chaque classes séparé par - dans un tableau
    var listeClassesChild = rawChildClass.split('-');
    var listeClassesParent = rawParentClass.split('-');
    // console.log(listeClassesChild);
    // console.log(listeClassesParent);

    // On transmet notre liste à notre fonction fait tout qui va faire du nettoyage
    var parentClassClean = listCleaner(listeClassesParent,childMale,childFemale,parentMale,parentFemale);

    //console.log(parentClassClean)

    for (var i = 0; i < listeClassesParent.length; i++){
      // Si la classe n'est pas déjà dans la liste des classes de l'enfant
      if (listeClassesChild.indexOf(parentClassClean[i])=== -1){
        // On push la classe dans les classes de l'enfant
        listeClassesChild.push(parentClassClean[i]);
      }
    }
    // console.log(listeClassesChild);

    // !!!!!! Pour éviter liste infinie !!!!!!!!!
    $("#TalentsList table").remove();
    // Pour éviter l'apparition de la barre de scroll si on passait d'un perso non enfant à un enfant
    $("#TalentsList").hide();
    //Une fois le traitement fini ont envoi notre liste de classe finale de l'enfant à la fonction TraitementData()
    TraitementData(listeClassesChild);
  }

  // Cette fonction va s'occuper de nettoyer les incohérences dût au règles du jeu (Une femme dans le jeu ne peut devenir barbarian par exemple) et nous renvoyer la liste corrigée
  function listCleaner(listParent,childMale,childFemale,parentMale,parentFemale){
    /**
     * liste des classes à Changer :
     Priest <=> Cleric , War Monk <=> War Cleric
     * liste des classes M only :
     Barbarian , Berserker , Fighter , Warrior , Villager , Dread Fighter
     * liste des classes F only :
     Troubadour , Valkyrie , Pegasus Knight , Falcon Knight , Dark Flier , Manakete , Bride
    */
    // Ceci va supprimer la dernière classe (Bride pour parent F et Dread Fighter pour parent M) car on les a déjà inclus dans les classes de base des enfants
    listParent.splice(-1,1);

    if (parentMale == true){
      if (childFemale == true){
        if(listParent.indexOf("Priest")>=0){
          // On recherche les mot Priest et War Monk (vu qu'elles sont liées War Monk est l'une des upgrades possible de Priest) dans notre tableau pour les supprimer et push la valeur Cleric et War Cleric en remplacement
          listParent.splice($.inArray("Priest", listParent),1);
          listParent.push("Cleric");
          listParent.splice($.inArray("War Monk", listParent),1);
          listParent.push("War Cleric");
        }
        if(listParent.indexOf("Barbarian")>=0){
          listParent.splice($.inArray("Barbarian", listParent),1);
          listParent.splice($.inArray("Berserker", listParent),1);
        }
        if (listParent.indexOf("Fighter")>=0){
          listParent.splice($.inArray("Fighter", listParent),1);
        }
        // Cas spécial Warrior est une classe accessible à la fois par Barbarian et Fighter pour éviter les soucis on fait sa suppression à part plutôt que de faire comme les cas précédents
        if (listParent.indexOf("Warrior")>=0) {
          listParent.splice($.inArray("Warrior", listParent),1);
        }
      }
    }
    if (parentFemale == true){

    }

    return listParent;


  }

});
