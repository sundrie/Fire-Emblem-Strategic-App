$(function() {

  var saisieUser;

  // On récupère en instantanée la saisie de l'utilisateur
  $('#searchchar').keyup(function() {
    saisieUser = $('#searchchar').val();
    $.ajax({
      url: 'index.php',
      method: 'POST',
      data: {saisie: saisieUser},
      success: function(data){
        $('#message').html(saisieUser);
      }
    });
    // On appelle la fonction qui selon la saisie masque les choix qui ne correspondent pas
    interactiveList();
  });

  $('#charList li a').click(function(){
    var persoChoisi = $(this).text();
    // permet de copier coller le nom du perso dans l'input
    $('#searchchar').val(persoChoisi);
    // permet de dynamiquement afficher l'image du perso choisi
    $("#HeroImg").attr('src','http://localhost/FEAcharapp/static/img/character/'+persoChoisi+'.png');

    askInfoBDD(persoChoisi);

    // Un essai avec une autre page executant le script de recherche
    getBDDInfo(persoChoisi);
  });

  function interactiveList(){
    // Pour chaque li (Perso)
    for (i = 0; i < $('#charList li').length; i++) {
      // filter est bien synchrone avec la saisie utilisateur
      var filter = saisieUser;
      a = $('#charList li')[i].getElementsByTagName("a")[0];
      // a renvoie <a href="#">Tharja</a> par exemple
      // le -1 est ce que renvoie la méthode indexof() si elle ne trouve rien
      // to lowercase() règle les soucis de case
      if (a.innerHTML.toLowerCase().indexOf(filter) > -1) {
        $('#charList li')[i].style.display = "";
      } else {
        $('#charList li')[i].style.display = "none";
      }
    }
  }

  // Cette fonction va permettre de chercher dans la BDD toutes les infos concernant le perso à partir de son nom
  function askInfoBDD(nomHeros){
    $.ajax({
      url : 'http://localhost/FEAcharapp/index.php',
      //url : 'http://localhost/FEAcharapp/index.php', // On fait appel au script PHP
      method : 'POST',
      data : {
        nom : nomHeros
      }
    });
  }

  // $.ajax({
  //       type: 'POST',
  //       url: 'http://localhost/FEAcharapp/Herodesc.php',
  //       dataType : 'json',
  //       data: msg,
  //       success: function(msg){
  //         $("#HeroDesc").load("http://localhost/FEAcharapp/index.php #HeroDesc");
  //       }
  //   });


  // code pour "capter" un signal de reload de contenu émis par php via une variable $reloadMe
  function afficheDescription() {
    $.ajax({
       url : 'http://localhost/FEAcharapp/index.php',
       type : 'POST',
       dataType : 'json',
       data : data,
       success : function (data) {
         $("#HeroDesc").load("index.php #HeroDesc");
         $("#HeroDesc").html(data);
       },error : function (){
         alert("error");
       }
    });
  }


  // ajax pour reload le result provenant de la BDD
  //$("#pageContent").load("index.php #pageContent");


  function getBDDInfo(nomHeros){
    $.ajax({
      url : 'http://localhost/FEAcharapp/moreheroinfo.php',
      //url : 'http://localhost/FEAcharapp/index.php', // On fait appel au script PHP
      method : 'POST',
      data : {
        nom : nomHeros
      }
    });

  }




});
