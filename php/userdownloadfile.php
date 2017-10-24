<?php
  // Si js a créé le cookie on récupère le nom du fichier
  if(isset($_COOKIE['filename'])){
    $file = $_COOKIE['filename'].".txt";
  }
  else{
    echo "Une erreur est survenue assurez vous que votre navigateur accepte bien les cookies sur ce site";
    die;
  }

  // Si savebuild.php a bien fait son boulot alors on peut accéder au fichier qu'il a créé
  if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment;filename="'.basename($file).'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
  } else {
    echo "Une erreur est survenue veuillez réessayer de recréer votre build. Si le problème persiste veuillez contacter l'admin";
    die;
  }

?>
