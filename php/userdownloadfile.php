<?php
        // if the cookie "myCookie" is set
        if(isset($_COOKIE['filename'])){
            echo "<p><b>PHP found this value for <i>filename</i>: " .  $_COOKIE['filename']."</b></p>";
            $file = $_COOKIE['filename'].".txt";
            echo $file;
        }
        else{
            echo "<p><b>PHP did not find a value for <i>filename</i>. Give it a value below.<b></p>";
        }


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
