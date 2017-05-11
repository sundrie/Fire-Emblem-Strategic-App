<?php
// AJAX nous envoie bien les datas (onglet network) XHR

?>
<?php
// Connexion à la BDD
  $instance = new PDO("mysql:host=localhost;dbname=fea", "root", "");

  // On veut pour l'instant uniquement les noms des persos dans la BDD
  $query = $instance->query("SELECT name FROM characters ORDER BY name ASC");
  $listeChar = $query->fetchAll();
?>



<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Champ de recherche</title>
    <link rel="stylesheet" href="static/css/master.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

  </head>
  <body>
    <form action="index.php" method="post">
      <label for="searchchar">Heros à rechercher :</label>
      <input type="text" id="searchchar" name="usersearch" autocomplete="off">
      <ul id="charList">
        <?php
          for ($i=0; $i < count($listeChar) ; $i++) {
            echo "<li><a href=#>".$listeChar[$i]['name']."</a></li>";
          }

        ?>
      </ul>
      <input type="submit">
    </form>

    <div id="message"></div>

    <!-- le contenu dynamique à afficher selon le choix de l'utilisateur -->
    <div id="pageContent">
      <img src="" id="HeroImg" class="imageHeros">
      <p id="HeroDesc">

        <?php
          //si on reçoit du ajax le nom choisi
          if (isset($_POST['nom'])){
            // $_POST['nom'] provient du js il nous renvoie le nom sélectionné dans la liste
            $nomHeros = $_POST['nom'];
            $query = $instance->query("SELECT * FROM characters WHERE name = '".$nomHeros."'");
            $infosPerso = $query->fetch();

            // A partir d'ici on génère du code js (mettre des balises script n'execute pas le code) pour envoyer le résultat de la BDD au js pour affichage

            echo "<script>";
              //envoi des datas au js
              echo "var dataHeros = '<?php echo json_encode($infosPerso); ?>'";
              echo "afficheDescription();";
            echo "</script>";

        ?>
          <script type="text/javascript">
            <?php echo json_encode($infosPerso); ?>
            <?php echo "afficheDescription();"; ?>
            afficheDescription();
          </script>
        <?php

            // On affiche la description du personnage depuis la BDD
            echo json_encode($infosPerso);
            echo $infosPerso['description'];

            // variable pour executer le code en dessous
            $go = true;
          }

        ?>

        <script type="text/javascript">
          <?php if (isset($go)){ ?>
          <?php echo json_encode($infosPerso); ?>
          <?php echo "afficheDescription();";
            }
          ?>
        </script>
        <script type="text/javascript">
        // setInterval( function() { $('#HeroDesc').load('moreheroinfo.php').fadeIn("slow"); }, 1000); // refreshing after every 15000 milliseconds
          function load(){
            $('#HeroDesc').load('moreheroinfo.php');
          }

        $('#charList li a').click(function(){

          setTimeout(load, 5000);

          //$('#HeroDesc').load('moreheroinfo.php');
        });
        </script>

      </p>
    </div>

    <!-- Chargement de la librairie jQuery -->
     <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
     <script src="static/js/master.js" charset="utf-8"></script>
  </body>
</html>
