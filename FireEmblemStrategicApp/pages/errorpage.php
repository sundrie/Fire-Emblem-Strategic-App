<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/normalize.css">
		<link rel="stylesheet" href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/master.css">
		<link href="http://alexandreblin.ovh/FireEmblemStrategicApp/static/css/fontawesome-all.min.css" rel="stylesheet">
		<title></title>
	</head>
	<body>
    <header class="headerwebsite">
      <a href="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/FEAHome.html"><img src="http://alexandreblin.ovh/FireEmblemStrategicApp/static/img/FireEmblemAwakeningLogo.png" alt="Retour Accueil" class="ImgBackHome"></a>
      <h1>Fire Emblem Strategic App \ Fire Emblem Awakening \ Builder Error</h1>
      <nav>
				<a href="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/characterbuilder.html">Character Builder</a>
        <a href="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/characterinfos.html">Character Infos</a>
        <a href="http://alexandreblin.ovh/FireEmblemStrategicApp/pages/about.html">À propos</a>
      </nav>
    </header>
    <div class="wrapper">
      <p class="errormessage">
				<?php
					// Si notre page php userdownloadfile.php nous a transmis que l'erreur venait des cookies alors on affiche le message d'erreur si dessous
					if ($_GET['error']=='Cookies Error') {
						echo "Une erreur est survenue assurez vous que votre navigateur accepte bien les cookies sur ce site.";
					}elseif ($_GET['error']=='Fatal error') {
						echo "Une erreur est survenue lors de la génération de votre fichier. Réessayez si le problème persiste à ce moment contactez l'admin du site.";
					}else{
						die;
					}
				?>
			</p>
  	</div>
		<footer>
      <p>Made with love by Alexandre Blin</p>
      <p>
        <a href="https://www.linkedin.com/in/alexandre-blin-bb637ab7/"><i class="fab fa-linkedin"></i></a>
				<a href="https://github.com/sundrie"><i class="fab fa-github-square"></i></a>
      </p>
    </footer>
	</body>
</html>
