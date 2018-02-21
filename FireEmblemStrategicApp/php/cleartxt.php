<?php
  // Si js a créé le cookie on récupère le nom du fichier
  if(isset($_COOKIE['filename'])){
    $file = $_COOKIE['filename'].".txt";
  }

  // code trouvé sur http://stackoverflow.com/questions/2641667/deleting-a-file-after-user-download-it
  ignore_user_abort(true);
  if (connection_aborted()){
    unlink($file);
  }else{
    unlink($file);
  }
?>
