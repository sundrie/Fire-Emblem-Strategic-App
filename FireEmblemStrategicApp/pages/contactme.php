<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/normalize.css">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/master.css">
		<link href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/fontawesome-all.min.css" rel="stylesheet">
		<script src='https://www.google.com/recaptcha/api.js'></script>
		<title>Fire Emblem Strategic App | Me contacter</title>
	</head>
	<body>
    <header class="headerwebsite headerwebsiteabout">
      <a href="http://alexandreblin.ovh/index.html"><img src="http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/FireEmblemLogo - Menu.png" alt="Retour Accueil" class="ImgBackHome"></a>
      <h1>Fire Emblem Strategic App \ Me contacter</h1>
    </header>
    <div class="wrapper">
			<div class="contactpagemaincontent">
				<p class="contactmeexplain">Vous souhaitez me contacter directement, remplissez le formulaire ci-dessous.</p>
				<p class="contactmeexplain">
					Pas envie d'utiliser le formulaire ? Voici mon adresse mail
					<button class="showemail">Voir adresse email</button>
				</p>
	      <form action="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/contactme.php" method="post" id="contactForm" class="formulaireContact">
	        <p class="p-objectmsg"><span class="inputdesc">Objet de votre message : </span><input type="text" name="objectmsg" class="class-objectmsg" required></p>
					<p class="p-email"><span class="inputdesc inputdescemail">Votre adresse mail : </span><input type="email" name="email" class="class-email" required></p>
	        <p class="p-textmsg">Votre message : <textarea name="textmsg" class="class-textmsg" rows="8" cols="80" required></textarea></p>
					<div class="validationform">
						<div class="g-recaptcha" data-sitekey="6LeCAkgUAAAAAM1LmVGYFYnL8hkpOjg_fjDBeZs-"></div>
					</div>
		      <p class="p-submitemail"><input type="submit" value="Envoyer" class="submitemail"></p>
	      </form>
				<div id="message" class="emailmessage"></div>
			</div>
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
		<!-- Chargement de la librairie jQuery -->
    <script type='text/javascript' src='http://alexandreblin.ovh/FireEmblemStrategicApp/libs/jquery-3.3.1.min.js'></script>
    <!-- Chargement de la librairie jQuery UI -->
    <link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/libs/jquery-ui.min.css">
<script src="http://alexandreblin.ovh/FireEmblemStrategicApp/libs/jquery-ui.min.js"></script>
		<script src="http://alexandreblin.ovh/FireEmblemStrategicApp/static/js/formValidator.js" charset="utf-8"></script>
	</body>
</html>
<?php
	if ($_POST) {
		// var_dump([$_POST]);
	  $to = "blin.alexandre76@gmail.com";
	  $subject = $_POST["objmsg"];
	  $message = $_POST["textmsg"];
		$headers = 'From: '.$_POST["email"];
	  mail($to, $subject, $message, $headers);
	}


?>
