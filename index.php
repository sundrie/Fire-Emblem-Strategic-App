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
    <title>Fire Emblem Strategic App</title>
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
      <!-- <input type="submit"> -->
    </form>

    <div id="message"></div>

    <!-- le contenu dynamique à afficher selon le choix de l'utilisateur -->
    <div id="pageContent">
      <img src="" id="HeroImg" class="imageHeros">
      <div class="entete">
        <h2>Description : </h2>
      </div>
      <p id="HeroDesc"></p>
    </div>

    <!-- Chargement de la librairie jQuery -->
     <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
     <script src="static/js/master.js" charset="utf-8"></script>
  </body>
</html>
