<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://localhost/FEAcharapp/static/css/normalize.css">
		<link rel="stylesheet" href="http://localhost/FEAcharapp/static/css/master.css">
		<title></title>
	</head>
	<body>
    <header class="headerwebsite">
      <a href="http://localhost/FEAcharapp/pages/FEAHome.html"><img src="http://localhost/FEAcharapp/static/img/FireEmblemAwakeningLogo.png" alt="Retour Accueil" class="ImgBackHome"></a>
      <h1>Fire Emblem Strategic App \ Fire Emblem Awakening \ Builder</h1>
      <nav>
        <a href="http://localhost/FEAcharapp/pages/characterinfos.html">Character Infos</a>
        <a href="http://localhost/FEAcharapp/pages/about.html">À propos</a>
      </nav>
    </header>
    <div class="wrapper">
      <p><?php
			// var_dump($_GET);
			if ($_GET['error']=='Cookies Error') {
				echo "Une erreur est survenue assurez vous que votre navigateur accepte bien les cookies sur ce site.";
			}else{
				die;
			}
			?></p>
    </div>
	</body>
</html>
