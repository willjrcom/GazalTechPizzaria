
if (window.location.href.split("/")[3] == "login-erro" || window.location.href.split("/")[3] == "expired") {
	$("#erro").show('slow');
}

$("button").click(() => {
	$(".loading").css({
		"display": "block"
	});
});


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


$("#esqueciSenha").click(event => {
	event.preventDefault();

	$.confirm({
		type: 'blue',
		title: 'Enviar email de recuperação',
		content: 'Digite seu email:<br>'
			+ '<input type="email" class="form-control" id="novoEmail" />',
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Enviar email',
				btnClass: 'btn btn-success',
				keys: ['esc', 'enter'],
				action: function() {
					var novoEmail = this.$content.find('#novoEmail').val();
					carregarLoading("block");

					$.ajax({
						url: '/email/novaSenha/' + novoEmail.replace("/", ""),
						type: 'GET'
					}).done(status => {
						carregarLoading("none");

						if (status == 200) {
							$.alert({
								type: 'green',
								title: 'Sucesso',
								content: 'Email de recuperação enviado!',
								buttons: {
									confirm: {
										text: 'Continuar',
										btnClass: 'btn btn-success',
										keys: ['esc', 'enter']
									}
								}
							});
						} else if (status == 500) {
							$.alert({
								type: 'red',
								title: 'OPS...',
								content: 'Email não encontrado!',
								buttons: {
									confirm: {
										text: 'Continuar',
										btnClass: 'btn btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
						} else {
							$.alert({
								type: 'red',
								title: 'Falhou',
								content: 'Email de recuperação não enviado!',
								buttons: {
									confirm: {
										text: 'Continuar',
										btnClass: 'btn btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
						}

					}).fail(() => {
						carregarLoading("none");

						$.alert({
							type: 'red',
							title: 'Falhou',
							content: 'Email de recuperação não enviado!',
							buttons: {
								confirm: {
									text: 'Continuar',
									btnClass: 'btn btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					});
				}
			}
		}
	});
});


$("#novoUsuario").click(event => {
	event.preventDefault();
	let senhasIguais = 0;
	linhaHtml = '<label><b>Perfil:</b> Gratuito</label><br>'
		+ '<div>'
		+ '<label><b>Nome:</b></label>'
		+ '<input type="text" class="form-control" id="novoNome" placeholder="Digite seu nome"/>'
		+ '</div><br>'

		+ '<div>'
		+ '<label><b>Email:</b></label>'
		+ '<input type="email" class="form-control" id="novoEmail" placeholder="Digite seu email"/>'
		+ '</div><br>'

		+ '<p id="avisoSenha">As senhas não conferem!</p>'
		+ '<div>'
		+ '<label><b>Senha:</b></label>'
		+ '<input type="password" class="form-control pass" id="novoSenha" placeholder="Digite sua senha"/>'
		+ '</div><br>'

		+ '<div>'
		+ '<label><b>Repetir:</b></label>'
		+ '<input type="password" class="form-control pass" id="confSenha" placeholder="Repita sua senha"/>'
		+ '</div><br>';

	$.confirm({
		type: 'blue',
		title: 'Novo usuário',
		content: linhaHtml,
		closeIcon: true,
		onContentReady: () => {
			$(".pass").keyup(() => {
				if ($("#novoSenha").val() == $("#confSenha").val()) {
					$("#avisoSenha").hide();
					$("#novoSenha").css({
						'border': '1px solid #ccc'
					});
					$("#confSenha").css({
						'border': '1px solid #ccc'
					});
					senhasIguais = 1;
				} else {
					$("#avisoSenha").show().css({
						'color': 'red'
					});
					$("#novoSenha").css({
						'border': '1px solid red'
					});
					$("#confSenha").css({
						'border': '1px solid red'
					});
					senhasIguais = 0;
				}
			});
		},
		buttons: {
			confirm: {
				text: 'Cadastrar',
				btnClass: 'btn btn-success',
				keys: ['enter'],
				action: function() {
					if(senhasIguais == 1)
						cadastrarUsuario()
				}
			}
		}
	});
});


function cadastrarUsuario() {
	let novoUsuario = {};
	novoUsuario.email = $('#novoEmail').val();
	novoUsuario.nome = $("#novoNome").val();
	novoUsuario.senha = $("#novoSenha").val();

	carregarLoading("block");
	
	$.ajax({
		url: '/criarUsuario',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(novoUsuario)
	}).done(status => {
		carregarLoading("none");

		if (status == 200) {
			$.alert({
				type: 'green',
				title: 'Sucesso',
				content: 'Usuário cadastrado!',
				buttons: {
					confirm: {
						text: 'Continuar',
						btnClass: 'btn btn-success',
						keys: ['esc', 'enter']
					}
				}
			});
		} else if (status == 404) {
			$.alert({
				type: 'red',
				title: 'Erro',
				content: 'Erro ao realizar cadastro!',
				buttons: {
					confirm: {
						text: 'Continuar',
						btnClass: 'btn btn-danger',
						keys: ['esc', 'enter']
					}
				}
			});
		} else {
			$.alert({
				type: 'red',
				title: 'OPS...',
				content: 'Email já cadastrado!',
				buttons: {
					confirm: {
						text: 'Continuar',
						btnClass: 'btn btn-danger',
						keys: ['esc', 'enter']
					}
				}
			});
		}
	});
}