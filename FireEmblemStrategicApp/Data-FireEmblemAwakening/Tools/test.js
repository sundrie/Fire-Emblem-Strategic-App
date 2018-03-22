$(document).ready(function(){

  $.ajax({
    url: 'TalentsList.xml',
    datatype : 'xml',
    success: function(data){
      // Variable qui liste toutes les classes
      var allclasses = $(data).children().children();
      console.log(allclasses)
      var classes
      // On boucle sur chaque classes
      $(allclasses).each(function(i) {
        // Si il trouve l'attribut name (correspond dans le fichier xml à <class name="">) alors il le stocke dans la variable
        if ($(this).attr("name") === "Lord") {
          // console.log($(this))
          classes = $(this);
        }
      });
      // var classes = $(data).find('[name="Lord"]');
      console.log(classes)
      var talents = classes.children();
      var talent1 = talents[0];
      var talent2 = talents[1];
      console.log(talent1)
      console.log(talent2)
    }
  });
});
