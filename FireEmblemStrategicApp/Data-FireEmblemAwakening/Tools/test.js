$(document).ready(function(){
  // Ce qui va charger et nous sortir une liste des personnages avec toutes leurs datas (sexe,parents,genitor,classlist,description)
  $.ajax({
    url: 'PersosList.xml',
    datatype : 'xml',
    success: function(data){
      var chosenOne;
      // Liste de tous les personnages
      var characterList = $(data).children().children();
      // fonction pour chercher un nom dans notre liste de personnages fournie par le xml
      $(characterList).each(function(i) {
        if ($(this).attr("name") === "Owain") {
          chosenOne = $(this);
          searchMyData(chosenOne);
          // console.log($(this).attr("name"))
          // console.log($(this))
        }
      });
    }
  });

  // fonction qui va s'occuper de récupérer les datas du perso choisi
  function searchMyData(theChosen){
    // console.log(theChosen);
    // console.log(theChosen.attr("name"))
    var classList = theChosen.children()[3];
    // console.log(classList)
    // console.log($(classList).text())
    // On stocke dans une var chaque classe séparée par un -
    var splittedClassList = $(classList).text().split("-")
    // console.log(splittedClassList)

    // On charge notre document xml listant tous les talents
    $.ajax({
      url: 'TalentsList.xml',
      datatype : 'xml',
      success: function(data){
        // Variable qui liste toutes les classes
        var allclasses = $(data).children().children();
        // console.log(allclasses)
        // On déclare une variable de type Array pour pouvoir utiliser la méthode push()
        var classes = [];
        // On boucle sur chaque classes
        $(allclasses).each(function(i) {
          // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable classes
          if($.inArray($(this).attr("name"), splittedClassList) !== -1) {
            classes.push($(this));
          }
        });
        // Cette variable contiens le nom du genitor dans notre PersosList.xml (souvent la mère)
        var genitorName = theChosen.children()[2]
        console.log($(genitorName).text())
        // Cette variable contiens les noms des parents possibles pour le personnage choisi
        var parentsList = theChosen.children()[1]
        var splittedParentsList = $(parentsList).text().split("-");
        console.log(splittedParentsList)
        // Si c'est vide alors ça veut dire que le personnage n'est pas un enfant car sinon il aurait le nom de sa mère généralement (par exemple le genitor de Severa est Cordelia, celui de Noire Tharja, celui de Yarne Palne, etc)
        if ($(genitorName).text() === "") {
          console.log("C'est pas un enfant !")
          // On peut aller directement à la suite
          displayHeroData(classes);
        } else {
          console.log("C'est un enfant :o")
          displayHeroData(classes);
          // Alors on va devoir check l'héritage des classes, talents que le perso aura reçu de ses parents pour celà on va attendre une réponse de l'utilisateur car on ne peut pas deviner ce qu'il a choisi
        }
      }
    });
  }


  // Fonction qui va afficher les talents dans notre page pour cela on boucle sur notre variable array
  function displayHeroData(classes) {
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
        // On ajoute une row avec le nom de la classe du jeu en class
        $(".wrapper table tbody").append("<tr class="+removeSpace+"></tr>");

        // On attribue a imagelink la première "case" de notre variable qui contient l'url de l'image ,pareil que $(talent1) on fait ceci pour pouvoir utiliser .text() sinon $(talent1).children()[0].text() nous renverrait une erreur
        imagelink = $(talent1).children()[0];
        // Le $(talent1) est essentiel pour pouvoir intéragir avec cette variable objet
        // Affiche l'image et nom du 1er talent de la classe du personnage
        $("."+removeSpace).append("<td><img src='"+$(imagelink).text()+"'>"+$(talent1).attr("name")+"</td>");
        // Affiche la description du talent
        // On reprends le même principe que pour imagelink
        descTalent = $(talent1).children()[1];
        $("."+removeSpace).append("<td>"+$(descTalent).text()+"</td>");

        // On change juste le selecteur pour éviter de créer 2 variables imagelink
        imagelink = $(talent2).children()[0];
        // Affiche l'image et nom du 2ème talent de la classe du personnage
        $("."+removeSpace).append("<td><img src='"+$(imagelink).text()+"'>"+$(talent2).attr("name")+"</td>");
        // Affiche la description du talent
        descTalent = $(talent2).children()[1];
        $("."+removeSpace).append("<td>"+$(descTalent).text()+"</td>");
      } else {
        // Pour plus de visibilité j'ai attribué à nos variables les talents qu'ils représentent c'est plus clair que classes[i].children()[0] et plus concis
        talents = classes[i].children();
        talent1 = talents[0];
        talent2 = talents[1];
        // On ajoute une row avec le nom de la classe du jeu en class
        $(".wrapper table tbody").append("<tr class="+classes[i].attr("name")+"></tr>");

        // Affiche l'image et nom du 1er talent de la classe du personnage
        imagelink = $(talent1).children()[0];
        $("."+classes[i].attr("name")).append("<td><img src='"+$(imagelink).text()+"'>"+$(talent1).attr("name")+"</td>");
        // Affiche la description du talent
        descTalent = $(talent1).children()[1];
        $("."+classes[i].attr("name")).append("<td>"+$(descTalent).text()+"</td>");

        // Affiche l'image et nom du 2ème talent de la classe du personnage
        imagelink = $(talent2).children()[0];
        $("."+classes[i].attr("name")).append("<td><img src='"+$(imagelink).text()+"'>"+$(talent2).attr("name")+"</td>");
        // Affiche la description du talent
        descTalent = $(talent2).children()[1];
        $("."+classes[i].attr("name")).append("<td>"+$(descTalent).text()+"</td>");
      }
    });
  }

});
