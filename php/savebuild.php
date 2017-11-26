<?php
if($_POST){
  // On récupère les datas venant de l'ajax de builder.js
  $build = $_POST['build'];
  $myfile = fopen("[".$build[0]."] ".$build[1].".txt", "w") or die("Unable to open file!");

  // Petite trad
  // $build[0] = nom du personnage
  // $build[1] = nom du build ou date du jour si non renseigné

  // On écrit le nom et tous les talents du perso PHP_EOL permet de sauter une ligne (voir https://stackoverflow.com/questions/15130289/php-fwrite-new-line)
  $txt = $build[0]. PHP_EOL .$build[2]. PHP_EOL .$build[3]. PHP_EOL .$build[4]. PHP_EOL .$build[5]. PHP_EOL .$build[6]. PHP_EOL .$build[7]. PHP_EOL .$build[8]. PHP_EOL .$build[9]. PHP_EOL .$build[10]. PHP_EOL .$build[11];
  fwrite($myfile, $txt);
  fclose($myfile);
}
?>
