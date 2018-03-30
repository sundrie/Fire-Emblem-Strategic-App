$(document).ready(function(){

  $.ajax({
    url: 'TalentsList.xml',
    datatype : 'xml',
    success: function(data){
      // Variable qui liste toutes les classes
      var allclasses = $(data).children().children();
      // console.log(allclasses)
      // On déclare une variable de type Array pour pouvoir utiliser la méthode push()
      var classes = [];
      // Pour l'exemple j'utilise les classes de Chrom
      var HeroClassList = ["Lord","Great Lord","Cavalier","Paladin","Great Knight","Archer","Sniper","Bow Knight","Dread Fighter"];
      // On boucle sur chaque classes
      $(allclasses).each(function(i) {
        // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable classes
        if($.inArray($(this).attr("name"), HeroClassList) !== -1) {
          classes.push($(this));
        }
      });

      // Fonction qui va afficher les talents dans notre page pour cela on boucle sur notre variable array
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


  // Ce qui va charger toutes les datas des personnages
  $.ajax({
    url: 'PersosList.xml',
    datatype : 'xml',
    success: function(data){
      console.log(data);
    }
  });

});
