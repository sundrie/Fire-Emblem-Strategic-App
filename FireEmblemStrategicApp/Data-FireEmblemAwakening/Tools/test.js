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
      console.log(classes[0].attr("name"))
      $(classes).each(function(i) {
        $(".wrapper table tbody").append("<tr class="+classes[i].attr("name")+"></tr>")
      });
      // var classes = $(data).find('[name="Lord"]');
      // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable
      console.log(classes)
      var talents = classes.children();
      var talent1 = talents[0];
      var talent2 = talents[1];
      console.log(talent1)
      console.log(talent2)
    }
  });
});
