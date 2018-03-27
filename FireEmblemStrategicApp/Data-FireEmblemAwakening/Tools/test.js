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
      $(classes).each(function(i) {
        // Si le nom de la classe issue du jeu contient un espace alors on supprime cet espace pour faire une seule classe et non 2 ou plus (ex : Great Knight donne normalement 2 class Great et Knight alors que l'on veut que ça soit une class unique GreatKnight)
        // Sinon et bien on ajoute tout simplement sans traitement anti espace
        if (/\s/.test(classes[i].attr("name"))) {
          var removeSpace = classes[i].attr("name")
          // On enlève les whitespace entre les mots (trim ne fonctionne qu'aux début et fin des strings)
          removeSpace = removeSpace.replace(/\s/, '');
          $(".wrapper table tbody").append("<tr class="+removeSpace+"></tr>")
          $("."+removeSpace).append("<td>"+ classes[i].children().text() +"</td>")
        } else {
          $(".wrapper table tbody").append("<tr class="+classes[i].attr("name")+"></tr>")
          $("."+classes[i].attr("name")).append("<td>"+ classes[i].children().text() +"</td>")
        }
      });
      // console.log(classes)
      var talents = classes.children();
      var talent1 = talents[0];
      var talent2 = talents[1];
      // console.log(talent1)
      // console.log(talent2)
    }
  });
});
