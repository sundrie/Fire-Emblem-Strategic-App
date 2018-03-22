$(document).ready(function(){
  $.ajax({
    url: 'TalentsList.xml',
    datatype : 'xml',
    success: function(data){
      var classes = $(data).find('class[name="Lord"]');
      console.log(classes)
    }
  });
});
