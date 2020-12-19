
if(window.location.href.split("/")[4] == "erro") {
	alerta = '<div class="alert alert-danger" role="alert">'
				+ 'Usuário e/ou senha incorretos!'
			+ '</div>';
	$("#erro").html(alerta);
}