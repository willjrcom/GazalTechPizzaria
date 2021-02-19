
if(window.location.href.split("/")[3] == "login-erro" || window.location.href.split("/")[3] == "expired") {
	$("#erro").show('slow');
}

$("button").click(() => {
	$(".loading").css({
		"display": "block"
	});
});
			

function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


$("#novaSenha").click(event => {
	event.preventDefault();
	
	$.confirm({
		type: 'blue',
		title: 'Enviar email de recuperação',
		content: 'Digite seu email:<br>'
				+ '<input type="email" class="form-control" id="novoEmail" />',
		closeIcon: true,
		buttons: {
			confirm:{
				text: 'Enviar email',
				btnClass: 'btn btn-success',
				keys: ['esc', 'enter'],
				action: function(){	
					var novoEmail = this.$content.find('#novoEmail').val();
					carregarLoading("block");
					
					$.ajax({
						url: '/email/novaSenha/' + novoEmail.replace("/", ""),
						type: 'GET'
					}).done(status => {
						carregarLoading("none");
						
						if(status == 200){
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
						}else if(status == 500){
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
						}else{
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
	})	
});
