<?php
  // Cette variable en cas d'erreur va contenir le message d'erreur à transmettre à l'utilisateur
  $message;
  // Si js a créé le cookie on récupère le nom du fichier
  if(isset($_COOKIE['filename'])){
    $file = $_COOKIE['filename'].".txt";
  }
  else{
    // On transmet à la page d'erreur que c'est une erreur liée aux cookies
    $message = "error=Cookies Error";
    // On utilise la methode GET pour transmettre notre code d'erreur
    header('Location: http://localhost/FEAcharapp/pages/errorpage.php?'.$message.'');
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
    //exécute le fichier cleartxt.php pour supprimer le fichier et éviter de surcharger notre espace avec des milliards de fichiers txt
    include("cleartxt.php");
    exit;
  } else {
    // On transmet à la page d'erreur que c'est une erreur liée au fichier créé en lui même
    $message = "error=Fatal error";
    // On utilise la methode GET pour transmettre notre code d'erreur
    header('Location: http://localhost/FEAcharapp/pages/errorpage.php?'.$message.'');
    die;
    die;
  }
?>
