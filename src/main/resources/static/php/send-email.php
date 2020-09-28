<?php
	  	$nome = $_POST['nome'];
		$email = $_POST['email'];
		$opcao = $_POST['opcao'];
 	 	$mensagem = $_POST['mensagem'];
  		$to = "williamjunior67@gmail.com";
  		$assunto = "Mensagem de ".$email.com
  		mail($to,$assunto,$mensagem);
	?>