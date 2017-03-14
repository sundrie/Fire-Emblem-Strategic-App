$(function() {

  $('#searchchar').keyup(function() {
    var saisieUser = $('#searchchar').val();
    console.log(saisieUser);
  });


  $( "#searchchar" ).autocomplete({
    source: 'index.php',
    minLength:2
  });


});
