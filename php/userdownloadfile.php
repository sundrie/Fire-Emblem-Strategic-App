<?php
  $message;
  // Si js a créé le cookie on récupère le nom du fichier
  if(isset($_COOKIE['filename'])){
    $file = $_COOKIE['filename'].".txt";
  }
  else{
    $message = "error=Cookies Error";
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
    echo "Une erreur est survenue veuillez réessayer de recréer votre build. Si le problème persiste veuillez contacter l'admin";
    die;
  }
?>
