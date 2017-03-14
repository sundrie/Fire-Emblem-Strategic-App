<?php
/*
$array = array(
  0 => 'blue',
  1 => 'red',
  2 => 'green',
  3 => 'red');

if ($_POST) {
  $valuesearch = array_search($_POST['usersearch'], $array);
}*/
?>
<?php
// Connexion à la BDD
  $instance = new PDO("mysql:host=localhost;dbname=fea", "root", "");

  //$searchname = 

  $query = $instance->query("SELECT * FROM characters WHERE name LIKE '%".$searchname."%' ORDER BY name ASC");

  while ($row = $query->fetch()) {
    $data[] = $row['name'];
  }

  echo json_encode($data);

?>



<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Champ de recherche</title>
  </head>
  <body>
    <form action="index.php" method="post">
      <label for="searchchar">Heros à rechercher :</label>
      <input type="text" id="searchchar" name="usersearch">
      <input type="submit">
    </form>

    <?php
      /* if ($_POST) {
        if ($valuesearch != false) {
          echo "<p> valeur trouvée </p>";
        }
        elseif ($valuesearch == false) {
          echo "<p> valeur non trouvée </p>";
        }
      } */
    ?>
    <!-- Chargement de la librairie jQuery -->
     <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
     <script src="static/js/master.js" charset="utf-8"></script>
  </body>
</html>
