<?php $instance = new PDO("mysql:host=localhost;dbname=fea", "root", "");

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

  // On affiche la description du personnage depuis la BDD
  //echo json_encode($infosPerso);
  echo $infosPerso['description'];
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <!-- <script type="text/javascript">
      afficheDescription();
      <?php //echo json_encode($infosPerso); ?>
      <?php //echo "afficheDescription();"; ?>
      // setInterval(function () { $("#pageContent").load("http://localhost/FEAcharapp/index.php #pageContent"); }, 1000);
      $("#pageContent").load("http://localhost/FEAcharapp/index.php #pageContent");
    </script> -->
    <p>totor le roi des dinosaures</p>
    <?php echo"<p>".$infosPerso['description']."</p>"; ?>

  </body>
</html>
