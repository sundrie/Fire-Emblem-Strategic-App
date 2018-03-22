$(document).ready(function(){

  $.ajax({
    url: 'TalentsList.xml',
    datatype : 'xml',
    success: function(data){
      var classes = $(data).find('class[name="Lord"]');
      console.log(classes)
      var talents = classes.children();
      var talent1 = talents[0];
      var talent2 = talents[1];
      console.log(talent1)
      console.log(talent2)
    }
  });
});
