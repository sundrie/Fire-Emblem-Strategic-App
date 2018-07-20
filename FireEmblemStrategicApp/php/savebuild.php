<?php
// code et tuto trouvé sur https://openclassrooms.com/courses/concevez-votre-site-web-avec-php-et-mysql/creer-des-images-en-php

// Ceci va forcer le download
header('Content-Disposition: Attachment;filename=image.png'); 
// On indique que c'est une image qui est envoyée (ici png mais ça peut être jpeg aussi si photo par exemple)
header ("Content-type: image/png");
// On créé l'image avec 600 de large et 400 de haut
$destination = imagecreatefromjpeg("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/background.jpg");

// On charge d'abord les images
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/character_portrait/Cordelia_portrait.png");
// Les fonctions imagesx et imagesy renvoient la largeur et la hauteur d'une image
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$largeur_destination = imagesx($destination);
$hauteur_destination = imagesy($destination);

// On veut placer le portrait du personnage à gauche en haut
$destination_x = 0;
$destination_y = 50;

// On met le portrait dans l'image de destination (la carte du personnage)
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);

// La font utilisée le lien est relatif car absolu ça voulait pas (http://alex...)
$font = '../fonts/FOT-ChiaroStd-B.otf';

// On définit juste la couleur noire pour imagestring
$noir = imagecolorallocate($destination, 0, 0, 0);
// On définit juste la couleur pour nos fonds des talents
$beige = imagecolorallocate($destination, 241, 218, 168);
// Ceci créé une chaîne de caractères avec le nom du personnage
$nomHero = "Cordelia";
imagefttext($destination, 18, 0, 320, 30, $noir, $font, $nomHero);

// Un rectangle noir se créé qui accueillera les talents
// Il y a 80px en x pour chaque talent par rapport à son voisin du dessus
// 180 c'est l'axe x du 1er point, 50 l'axe y du 1er, 610 x 2ème point, 120 y 2ème point
// Ces 2 points une fois reliés font un rectangle
// Actuellement le rectangle fait 70px de haut (y)
ImagefilledRectangle ($destination, 180, 50, 610, 120, $beige);
$nomTalent = "Galeforce";
// Le utf 8 n'étant pas géré par imagestring (merci l'anglais qui n'a pas d'accent) cette fonction imagefttext le gère
// Le texte du talent. 12 correspond à la taille de font (police), 0 à l'angle, 210 à là où commence le texte (axe x (largeur)) et 70 (axe y (hauteur)) 
imagefttext($destination, 12, 0, 210, 70, $noir, $font, $nomTalent);
$descTalent = "Si l'unité bat un ennemi elle bénéficie d'un nouveau tour de jeu";
imagefttext($destination, 10, 0, 210, 90, $noir, $font, $descTalent);
// Concerne l'image du talent
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/".$nomTalent.".png");
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$destination_x = 185;
$destination_y = 73.5;  // L'image du talent fait 23x23, sachant que le bloc 70 donc au centre c'est y départ + 23.5  
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);


ImagefilledRectangle ($destination, 180, 130, 610, 200, $beige);
$nomTalent = "Sol";
imagefttext($destination, 12, 0, 210, 150, $noir, $font, $nomTalent);
$descTalent = "(Tec)% de régénérer ses HP de la moitié des dégats infligés";
imagefttext($destination, 10, 0, 210, 170, $noir, $font, $descTalent);
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/".$nomTalent.".png");
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$destination_x = 185;
$destination_y = 153.5;  // L'image du talent fait 23x23, sachant que le bloc 70 donc au centre c'est y départ + 23.5  
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);


ImagefilledRectangle ($destination, 180, 210, 610, 280, $beige);
$nomTalent = "Armsthrift";
imagefttext($destination, 12, 0, 210, 230, $noir, $font, $nomTalent);
$descTalent = "(Cha*2)% de ne pas utiliser une charge d'arme";
imagefttext($destination, 10, 0, 210, 250, $noir, $font, $descTalent);
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/".$nomTalent.".png");
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$destination_x = 185;
$destination_y = 233.5;  // L'image du talent fait 23x23, sachant que le bloc 70 donc au centre c'est y départ + 23.5  
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);


ImagefilledRectangle ($destination, 180, 290, 610, 360, $beige);
$nomTalent = "Bowbreaker";
imagefttext($destination, 12, 0, 210, 310, $noir, $font, $nomTalent);
$descTalent = "Précision et Esquive +50 si ennemi équipé d'un arc";
imagefttext($destination, 10, 0, 210, 330, $noir, $font, $descTalent);
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/".$nomTalent.".png");
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$destination_x = 185;
$destination_y = 313.5;  // L'image du talent fait 23x23, sachant que le bloc 70 donc au centre c'est y départ + 23.5  
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);


ImagefilledRectangle ($destination, 180, 370, 610, 440, $beige);
$nomTalent = "Axebreaker";
imagefttext($destination, 12, 0, 210, 390, $noir, $font, $nomTalent);
$descTalent = "Précision et Esquive +50 si ennemi équipé d'une hache";
imagefttext($destination, 10, 0, 210, 410, $noir, $font, $descTalent);
$source = imagecreatefrompng("http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/talents_icons/".$nomTalent.".png");
$largeur_source = imagesx($source);
$hauteur_source = imagesy($source);
$destination_x = 185;
$destination_y = 393.5;  // L'image du talent fait 23x23, sachant que le bloc 70 donc au centre c'est y départ + 23.5  
imagecopy($destination, $source, $destination_x, $destination_y, 0, 0, $largeur_source, $hauteur_source);

// Les crédits
$signature = "Generated by Fire Emblem Strategic App : http://alexandreblin.ovh";
imagefttext($destination, 8, 0, 210, 460, $noir, $font, $signature);


$path = "toto.png";
// Cette fonction envoie l'image une fois tout nos traitements faits
// imagepng($destination,$path);
imagepng($destination);
// if($_POST){
//   // On récupère les datas venant de l'ajax de builder.min.js
//   $build = $_POST['build'];
//   $myfile = fopen("[".$build[0]."] ".$build[1].".txt", "w") or die("Unable to open file!");
//
//   // Petite trad
//   // $build[0] = nom du personnage
//   // $build[1] = nom du build ou date du jour si non renseigné
//
//   // /!\ Si on met aucun talent ni nom la ça marche
//
//   // On écrit le nom et tous les talents du perso "\r\n" permet de sauter une ligne (voir https://stackoverflow.com/questions/15130289/php-fwrite-new-line)
//   fwrite($myfile,"Nom : ".$build[0]."\r\n"."\r\n"."");
//   fwrite($myfile,"Talent 1 : ".$build[2]."\r\n".$build[3]."\r\n"."\r\n"."");
//   fwrite($myfile,"Talent 2 : ".$build[4]."\r\n".$build[5]."\r\n"."\r\n"."");
//   fwrite($myfile,"Talent 3 : ".$build[6]."\r\n".$build[7]."\r\n"."\r\n"."");
//   fwrite($myfile,"Talent 4 : ".$build[8]."\r\n".$build[9]."\r\n"."\r\n"."");
//   fwrite($myfile,"Talent 5 : ".$build[10]."\r\n".$build[11]."");
//   fwrite($myfile, ""."\r\n"."-------------------------------------------"."\r\n"."Generated by Fire Emblem Strategic App"."\r\n"."http://alexandreblin.ovh/FireEmblemStrategicApp/pages/characterbuilder.html"."");
//   fclose($myfile);
// }


// echo '<img src="toto.png">'
?>