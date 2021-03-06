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
    url: 'https://alexandreblin.ovh/FireEmblemStrategicApp/Data-FireEmblemAwakening/Tools/PersosList.xml',
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
    url: 'https://alexandreblin.ovh/FireEmblemStrategicApp/Data-FireEmblemAwakening/Tools/TalentsList.xml',
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
  function childOrNot (heroChosen) {
    var genitor = heroChosen.children()[2]
    genitorName = $(genitor).text();
    var parentsList = heroChosen.children()[1]
    splittedParentsList = $(parentsList).text().split("-");
    // Si c'est vide alors ça veut dire que le personnage n'est pas un enfant car sinon il aurait le nom de sa mère généralement (par exemple le genitor de Severa est Cordelia, celui de Noire Tharja, celui de Yarne Palne, etc)
    if (genitorName === "") {
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

  // fonction qui parcourt la variable heroesList qui a été alimentée par notre requête ajax
  function searchThisName(findhim) {
    // Va contenir toutes les infos sur le personnage a trouver
    var targetLocked;
    // fonction qui va parcourir la liste des personnages et sauvegarder toutes ses données
    $(heroesList).each(function(i) {
      if ($(this).attr("name") === findhim) {
        targetLocked = $(this);
      }
    });
    return targetLocked;
  }


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
    $("#HeroImgBuilder").attr('src','https://alexandreblin.ovh/FireEmblemStrategicApp/static/img/character_portrait/'+persoChoisi+'_portrait.png');
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

    // On appelle la fonction qui va chercher le personnage choisi dans la liste et on stocke le résultat dans la variable
    theChosenOne = searchThisName(persoChoisi);

    // On appelle la fonction qui va tester si le personnage est un enfant ou non et on stocke le résultat dans la variable
    childTestResult = childOrNot(theChosenOne);

    // On test si le personnage cliqué par l'utilisateur est un enfant
    if (childTestResult === true){
      // On ajoute un select permettant de choisir 1er talent d'héritage (celui du parent inchangeable Cordelia pour Severa, Chrom pour Lucina, etc)
      $('.formulaireRecherche .legacyArea').append("<select id='myGenitorLegacy' class='myParentclass myGenitorLegacyclass'><option value='default' selected>1er talent hérité</option></select>");
      legacy_of_Parent(genitorName,"myGenitorLegacy")

      // On ajoute un select permettant de choisir le parent
      $('.formulaireRecherche .legacyArea').append("<select id='myParent' class='myParentclass'><option value='default' selected>Choisir parent</option></select>");

      /* Un message qui apparait pour indiquer à l'utilisateur ce qu'il doit faire */
      $('.chooseAParent').show();
      $('.chooseAParent').append("<p class='messageChooseParent'>Veuillez choisir un parent dans la liste qui se trouve sous la liste des personnages pour continuer</p><p class='messageChooseParent'>Il faudra choisir aussi les talents qu'il recevra en héritage de ses parents</p>");

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
  // Cette variable va nous permettre d'insérer le talent transmis par héritage du genitor
  var legacyFirstTalent;
  // Cette variable va nous permettre d'insérer le talent transmis par héritage du second Parent
  var legacySecondTalent;
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

    // Ces variables sont utilisées pour utiliser les instructions dans le if une seule fois
    var useOnce = 0;
    var useOnce2 = 0;
    $(classes).each(function(i) {
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
      // Si le talent transmis a été défini (voir fonction completeChildTalent())
      // On utilise la variable childTestResult pour éviter que les talents soient transmis à des personages parents. Ce problème arrivait si on faisait un build enfant puis qu'on cliquait directement sans refresh de page sur un perso parent
      if (childTestResult === true) {
        // Si le talent transmis a été défini (voir fonction completeChildTalent())
        if ((legacyFirstTalent !== undefined) && (useOnce === 0)) {
          var tmp = legacyFirstTalent.split('-');
          $("#TalentsList table tbody").append("<tr class="+tmp[0]+"><td><img src='https://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/"+$.trim(tmp[1])+".png'>"+tmp[1]+"</td><td>"+tmp[2]+"</td></tr>");
          $("#TalentsList ."+tmp[0]).addClass("drag");
          // Comme ça plus de soucis des multiples doublons
          useOnce = 1;
        }
        if ((legacySecondTalent !== undefined) && (useOnce2 === 0)) {
          var tmp2 = legacySecondTalent.split('-');
          $("#TalentsList table tbody").append("<tr class="+tmp2[0]+"><td><img src='https://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/"+$.trim(tmp2[1])+".png'>"+tmp2[1]+"</td><td>"+tmp2[2]+"</td></tr>");
          $("#TalentsList ."+tmp2[0]).addClass("drag");
          // Comme ça plus de soucis des multiples doublons
          useOnce2 = 1;
        }
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
      // WIP pour faire dl l'image 
      $.ajax({
        url: 'https://alexandreblin.ovh/FireEmblemStrategicApp/php/savebuild.php',
        method: 'POST',
        data:{data : encoderforAJAX},
        success : function(data){
          // Ceci est nécessaire pour que l'utilisateur sache que son build a été téléchargé sous format texte
          window.location.replace("https://alexandreblin.ovh/FireEmblemStrategicApp/php/userdownloadfile.php");
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
    // On reset les zones de drop
    $("#HeroBuild table tr").find("tr").replaceWith('<td></td>');
    $("#myParentLegacy").remove();
    // masque le message nous demandant de choisir un parent
    $('.chooseAParent').hide();
    // On récupère le nom du parent choisi dans la liste
    var parentName = $(this).val();
    $('.formulaireRecherche .legacyArea').append("<select id='myParentLegacy' class='myParentLegacyclass'><option value='default' selected>Choisir talent donné par "+parentName+"</option></select>");
    legacy_of_Parent(parentName,"myParentLegacy");
  });

  var parentTalents;
  // Cette fonction va créer un select pour permettre de choisir le talent hérité du parent
  function legacy_of_Parent(parentName,selectId) {
    // On stocke les datas du parent
    var dataParent = searchThisName(parentName);
    // On utilise cette fonction qui renvoie a chaque fois les talents disponibles pour le personnage entré et on stocke le retour dans une variable
    parentTalents = searchMyData(dataParent);
    var talent1;
    var talent2;
    // pour donner plus d'infos à l'utilisateur concernant les talents et ce qu'ils font
    var talentdesc;
    var classNameOfTalent;
    $.each((parentTalents), function(i){
      talent1 = $(parentTalents)[i].children()[0];
      talent2 = $(parentTalents)[i].children()[1];

      talentdesc = $(talent1).children()[1];
      classNameOfTalent = $(parentTalents)[i].attr("name");
      // Pour chaque talent du parent on créé une option dans notre liste
      $("#"+selectId).append("<option value="+classNameOfTalent+">"+$(talent1).attr("name")+" - "+$(talentdesc).text()+"</option>");

      talentdesc = $(talent2).children()[1];
      // Pour chaque talent du parent on créé une option dans notre liste
      $("#"+selectId).append("<option value="+classNameOfTalent+">"+$(talent2).attr("name")+" - "+$(talentdesc).text()+"</option>");

    })
  }

  $(".formulaireRecherche").on('change','#myGenitorLegacy',function(){
    // On reset les zones de drop
    $("#HeroBuild table tr").find("tr").replaceWith('<td></td>');
    // On appelle cette fonction a chaque changement pour qu'elle "écoute" les 2 select
    getBothSelectValue()
  })
  $(".formulaireRecherche").on('change','#myParentLegacy',function(){
    // On reset les zones de drop
    $("#HeroBuild table tr").find("tr").replaceWith('<td></td>');
    // On appelle cette fonction a chaque changement pour qu'elle "écoute" les 2 select
    getBothSelectValue()
  })

  // Permet de récupérer les 2 valeurs choisies de select pour appeler la fonction completeChildTalent
  function getBothSelectValue() {
    // On récupère le nom du talent choisi
    var tmp = $("#myGenitorLegacy option:selected").text().split('-');
    var genitorTalentGift = tmp[0];
    var tmp = $("#myParentLegacy option:selected").text().split('-');
    var secondParentTalentGift = tmp[0];

    // Toutes les datas des personnages impliqués dans la conception de l'enfant sont récupérées
    var genitorData = searchThisName(genitorName)
    var secondParentData = searchThisName($("#myParent").val())
    // Si les 2 select ont une valeur et qu'ils ne sont pas sur le choix par default
    if (($("#myGenitorLegacy option:selected").text() !="")&&!($("#myGenitorLegacy").val() === "default")&&($("#myParentLegacy option:selected").text() !="")&&!($("#myParentLegacy").val()==="default")){
      completeChildTalent(genitorTalentGift,$("#myGenitorLegacy").val(),genitorData,secondParentTalentGift,$("#myParentLegacy").val(),secondParentData)
    }

  }

  // fonction qui se chargera de concevoir l'arbre de talents de l'enfant à partir du sien de base et de celui de ses parents qui donnent leurs classes et 1 talent chacun en héritage
  function completeChildTalent(genitorTalentGift,genitorTalentOrigin,genitorData,secondParentTalentGift,secondParentTalentOrigin,secondParentData){

    // console.log(theChosenOne)
    // console.log(genitorTalentGift);
    // console.log(genitorTalentOrigin);
    // console.log(genitorData);
    // console.log(secondParentTalentGift);
    // console.log(secondParentTalentOrigin);
    // console.log(secondParentData);

    // Les 2 variables vont stocker sous formes de tableau d'objet le contenu de chaque classes auquel l'enfant et le second parent ont accès. Il n'y en a pas besoin pour le genitor car il a déjà transmis ses classes qu'on retrouve plus ou moins dans l'arbre des classes de l'enfant de base
    var childTalentsTree = searchMyData(theChosenOne);
    var secondParentTalentsTree = searchMyData(secondParentData);
    // console.log(childTalentsTree);
    // console.log(secondParentTalentsTree);
    /**
    * liste des classes à Changer :
    Priest <=> Cleric , War Monk <=> War Cleric
    * liste des classes M only :
    Barbarian , Berserker , Fighter , Warrior , Villager , Dread Fighter
    * liste des classes F only :
    Troubadour , Valkyrie , Pegasus Knight , Falcon Knight , Dark Flier , Manakete , Bride
    */
    // Ceci va supprimer la dernière classe (Bride pour parent F et Dread Fighter pour parent M) car on les a déjà inclus dans les classes de base des enfants
    secondParentTalentsTree.pop();
    //console.log($(secondParentTalentsTree).last());
    // console.log(secondParentTalentsTree);

    // Cette variable va contenir toutes les classes du parent qui vont être transmise à son enfant et pour celà il va y avoir des altérations (classse Priest transformée en Cleric si enfant fille par exemple)
    var alteredParentTalentsTree = [];
    // Va contenir la valeur de retour de la fonction searchThisClass()
    var replacementClass;
    // Si le sexe du second parent est Homme (obtenu à partir de PersosList.xml)
    if ($(secondParentData.children()[0]).text() === "Homme") {
      if ($(theChosenOne.children()[0]).text() === "Femme") {
        $.each((secondParentTalentsTree), function(i){
          if(secondParentTalentsTree[i].attr("name") === "Priest"){
            // On remplace l'attribut ("name") dans ce cas Priest par Cleric
            alteredParentTalentsTree.push(secondParentTalentsTree[i].attr("name","Cleric"));
          }
          else if(secondParentTalentsTree[i].attr("name") === "War_Monk"){
            // On remplace l'attribut ("name") dans ce cas War Monk par War Cleric
            alteredParentTalentsTree.push(secondParentTalentsTree[i].attr("name","War_Cleric"));
          } // Pour la suite des classes vu qu'on n'a pas besoin de remplacer par des classes ont les push juste pas vu que si c'est une femme elle ne peut avoir ces classes
          else if(secondParentTalentsTree[i].attr("name") === "Barbarian"){}
          else if(secondParentTalentsTree[i].attr("name") === "Berserker"){}
          else if(secondParentTalentsTree[i].attr("name") === "Fighter"){}
          else if(secondParentTalentsTree[i].attr("name") === "Villager"){}
          else if(secondParentTalentsTree[i].attr("name") === "Warrior"){}
          else if(secondParentTalentsTree[i].attr("name") === "Lord"){}
          else if(secondParentTalentsTree[i].attr("name") === "Great_Lord"){}
          else if(secondParentTalentsTree[i].attr("name") === "Tactician"){}
          else if(secondParentTalentsTree[i].attr("name") === "Grandmaster"){}
          else {
            // Si ce n'est pas une des classes précédente on push la valeur directement comme ça on a que les bonnes classes à insérer
            alteredParentTalentsTree.push(secondParentTalentsTree[i])
          }
        })
      }
      // console.log(alteredParentTalentsTree)
    }

    // Pour faire simple le code qui suit permet de dresser un tableau contenant les 2 arbres de talents fusionnés évitant ainsi les doublons
    // J'ai cherché sur stackoverflow et bien d'autres sites toute l'après midi + soirée à faire fonctionner et imaginer du code pour faire et bien ce que le code suivant fait. Fusionner 2 tableaux d'objets en supprimant les doublons ça m'a l'air impossible ou extrêment compliqué en jquery javascript
    // Liste le nom des classes du parent
    var compareA = [];
    // Ceci est un fix puisque alteredParentTalentsTree n'est rempli que si l'enfant est une femme sinon alteredParentTalentsTree est vide. Voila pourquoi secondParentTalentsTree est utilisé pour les enfant homme
    if ($(theChosenOne.children()[0]).text() === "Femme"){
      $.each(alteredParentTalentsTree, function(i){
        compareA.push($(alteredParentTalentsTree)[i].attr("name"));
      });
    } else {
      $.each(secondParentTalentsTree, function(i){
        compareA.push($(secondParentTalentsTree)[i].attr("name"));
      });
    }
    // Liste le nom des classes de l'enfant
    var compareB = [];
    $.each(childTalentsTree, function(i) {
      compareB.push($(childTalentsTree)[i].attr("name"));
    });
    // on donne l'arbre de talent de l'enfant comme base
    var mergedTalentsTreeList = compareB;
    $.each(compareA,function(i) {
      // Si la classe du parent n'est pas dans l'arbre de talents de l'enfant et bien on push
      if($.inArray(compareA[i], compareB) === -1){
        mergedTalentsTreeList.push(compareA[i])
      }
    })
    // Permets de corriger le bug qui faisait que des talents d'héritage étaient transmis d'un enfant à l'autre si la page n'était pas rechargée (F5) à chaque changement de personnage
    legacyFirstTalent = undefined;
    legacySecondTalent = undefined;
    // Ceci va nous permettre de voir si les talents donnés en héritages sont déjà présents ou non dans la liste des classes
    $.each(mergedTalentsTreeList,function(i) {
      // Si la classe dont le talent provient n'est pas déjà dans la liste alors on push (préviens de tout doublons de talents)
      if($.inArray(genitorTalentOrigin, mergedTalentsTreeList) === -1){
        // Affiche le contenu du select choisi
        legacyFirstTalent = genitorTalentOrigin + " - " + $("#myGenitorLegacy :selected").text();
      }
      // idem que pour le if du haut mais pour le second talent hérité
      else if($.inArray(secondParentTalentOrigin, mergedTalentsTreeList) === -1){
        // affiche le contenu du select choisi
        legacySecondTalent = secondParentTalentOrigin + " - " + $("#myParentLegacy :selected").text()
        // C'est un break pour sortir de la loop
        return false
      }
    });

    // On déclare une variable de type Array pour pouvoir utiliser la méthode push() celle ci contiendra la liste finale a envoyer à displayHeroData()
    var finalList = [];
    // On initialise cette variable à faux car de base on n'a pas besoin de trier et supprimer des doublons en temps normal
    var sortMyList = false;
    // On boucle sur chaque classes
    $(allclassesList).each(function(i) {
      // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable classes
      if($.inArray($(this).attr("name"), mergedTalentsTreeList) !== -1){
        finalList.push($(this));
        //
        if (($(this).attr("name") === "Cleric") || ($(this).attr("name") === "Cleric")) {
          sortMyList = true;
        }
      }
    })
    // Ce petit bout de code va supprimer les doublons trouvés par exemple avec Nah et un parent pouvant être Priest comme Kellam
    if (sortMyList === true) {
      // Cette variable va être à +1 par rapport à i pour pouvoir comparer la case de i et celle de
      var j;
      for (var i = 0; i < finalList.length; i++) {
        j = i+1;
        // pour empêcher j de dépasser la taille de finalList et donc de devenir undefined ce qui coupe le fonctionnement du code
        if (j === finalList.length) {
          break;
        }
        // si l'index de j qui est de +1 par rapport à i possède la même valeur que i alors on supprime tout simplement
        if (finalList[j].attr("name") === finalList[i].attr("name")) {
          // on éradique le doublon
          finalList.splice(j,1)
        }
      }
    }
    // !!!!!! Pour éviter liste infinie !!!!!!!!!
    $("#TalentsList table").remove();
    // Pour éviter l'apparition de la barre de scroll si on passait d'un perso non enfant à un enfant
    $("#TalentsList").hide();
    //Une fois le traitement fini ont envoi notre liste de classe finale de l'enfant à la fonction displayHeroData()
    displayHeroData(finalList);
  }

});
