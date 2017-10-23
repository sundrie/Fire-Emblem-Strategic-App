<?php
//********* veut dire à enlever une fois tests finis

if($_POST){
  // Pour les test on masque mais une fois ceux finis ont le réaffichera et supprimera la 'fake' variable
  $build = $_POST['build'];
  // $build = array ('Chrom','Aether','(Tec/2)% de faire 2 attaques consécutives, la première bénéficie de Sol et la seconde de Luna','Rightful King',"Augmente de 10% les chances d'activer les talents",'Aegis','(Tec)% Dégâts reçus par Arcs, Tomes et Dracopierres /2','Resistance+10','Resistance+10','Aggressor','Attaque+10 pendant le tour du joueur');
  // Pour avoir un retour sur notre page (data) à enlever une fois en ligne
  var_dump($build);

  // code w3C à modifié plus tard
  //******** La localisation sera a changer (propre à ma config PC) c'est juste pour le confort des tests
  $myfile = fopen("[".$build[0]."] ".$build[11].".txt", "w") or die("Unable to open file!");

  // On écrit le nom et tous les talents du perso PHP_EOL permet de sauter une ligne (voir https://stackoverflow.com/questions/15130289/php-fwrite-new-line)
  $txt = $build[0]. PHP_EOL .$build[1]. PHP_EOL .$build[2]. PHP_EOL .$build[3]. PHP_EOL .$build[4]. PHP_EOL .$build[5]. PHP_EOL .$build[6]. PHP_EOL .$build[7]. PHP_EOL .$build[8]. PHP_EOL .$build[9]. PHP_EOL .$build[10];
  fwrite($myfile, $txt);
  fclose($myfile);

}
?>
