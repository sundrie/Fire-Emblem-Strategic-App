<?php


$array = array(
  0 => 'blue',
  1 => 'red',
  2 => 'green',
  3 => 'red');

if ($_POST) {
  $valuesearch = array_search($_POST['usersearch'], $array);
}


?>


<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Champ de recherche</title>
  </head>
  <body>
    <form action="index.php" method="post">
      <input type="text" name="usersearch">
      <input type="submit">
    </form>
    <?php
      if ($_POST) {
        if ($valuesearch != false) {
          echo "<p> valeur trouvée </p>";
        }
        elseif ($valuesearch == false) {
          echo "<p> valeur non trouvée </p>";
        }
      }
    ?>
  </body>
</html>
