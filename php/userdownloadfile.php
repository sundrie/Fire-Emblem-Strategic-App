<?php

  $file = "test.txt";
  // var_dump($file);
  // var_dump($_POST['build']);
  // $file = ''"[".$_POST['build'][0]."] ".$_POST['build'][11].".txt";
  //
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
  }

 ?>
