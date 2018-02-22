<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/normalize.css">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/master.css">
		<link href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/fontawesome-all.min.css" rel="stylesheet">
		<title>Fire Emblem Strategic App | Me contacter</title>
	</head>
	<body>
    <header class="headerwebsite headerwebsiteabout">
      <a href="http://alexandreblin.ovh/index.html"><img src="http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/FireEmblemLogo - Menu.png" alt="Retour Accueil" class="ImgBackHome"></a>
      <h1>Fire Emblem Strategic App \ Me contacter</h1>
    </header>
    <div class="wrapper">
      <p>Vous souhaitez me contacter directement, remplissez le formulaire ci-dessous.</p>
      <p>N'oubliez pas d'indiquer votre adresse mail ou autres en fin de votre message pour que je puisse vous recontacter si besoin.</p>
      <form action="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/contactme.php" method="post">
        <p>Objet de votre message : <input type="text" name="objectmsg" /></p>
        <p>Votre message : <textarea name="textmsg" rows="8" cols="80"></textarea></p>
        <p><input type="submit" value="OK"></p>
      </form>
    </div>
		<footer>
      <p>Made with love by Alexandre Blin</p>
      <p>
				Retrouvez moi sur :
        <a href="https://www.linkedin.com/in/alexandre-blin-bb637ab7/"><i class="fab fa-linkedin"></i></a>
				<a href="https://github.com/sundrie"><i class="fab fa-github-square"></i></a>
				<a href="https://www.facebook.com/alexandre.blin.18"><i class="fab fa-facebook-square"></i></a>
      </p>
			<p><a href="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/contactme.php">Me contacter</a></p>
    </footer>
	</body>
</html>
<?php
  var_dump([$_POST]);
  $to = "blin.alexandre76@gmail.com";
  $subject = $_POST["objectmsg"];
  $message = $_POST["textmsg"];
  mail($to, $subject, $message);

?>
