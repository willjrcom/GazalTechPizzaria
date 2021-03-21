var [dados, divulgar] = [{}, {}];

//-----------------------------------------------------
$("#escolherData").click(event => {
	event.preventDefault();
	
	//alterar data
	$.confirm({
		type: 'blue',
		title: 'Data de acesso:',
		content: 'Dia:<br><input type="date" name="dia" id="dia" class="form-control"/>',
		buttons: {
			confirm: {
				text: 'Acessar',
				btnClass: 'btn-green',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");

					dados.data = this.$content.find('#dia').val();

					$.ajax({
						url: '/menu/acessarData/' + dados.data,
						type: 'GET'
					}).done(function() {
						window.location.href = '/menu';
					}).fail(function() {
						carregarLoading("none");

						$.alert({
							type: 'red',
							title: 'Alerta',
							content: "Erro, Escolha uma data!",
							buttons: {
								confirm: {
									text: 'Tentar novamente',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					});
				}
			},
			cancel: {
				text: 'Voltar',
				btnClass: 'btn-danger',
				keys: ['esc']
			}
		}
	});
});


//------------------------------------------------------------
function ajuda() {
	$.alert({
		type: 'blue',
		title: 'Suporte',
		content: 'Caso ocorra algum erro no sistema envie um email para os desenvolvedores: '
			+ '<br><a href="mailto:williamjunior67@gmail.com?subject=Preciso%20de%20ajuda">Enviar email</a>'
			+ '<br><br>Ou envie uma mensagem atraves do nosso whatsapp: '
			+ '<br><a href="https://api.whatsapp.com/send/?phone=5511963849111&text=Preciso+de+ajuda+com+meu+sistema+para+pizzaria&app_absent=0"> Enviar mensagem</a>'
			+ '<br><br>Acesse nossa página instagram: '
			+ '<br><a href="https://www.instagram.com/gazal.tech">Acessar</a>',
		buttons: {
			confirm: {
				text: 'Voltar!',
				btnClass: 'btn-success',
				keys: ['esc', 'enter']
			}
		}
	});
}


window.addEventListener("beforeinstallprompt", function(event) {
	event.userChoice.then(function(result) {
		if (result.outcome == "dismissed") {
			// Usuário dispensou o banner, enviar para o nosso analytics
		} else {
			// User accepted! Send to analytics
			// Usuário aceitou o banner, enviar para o nosso analytics
		}
	});
});


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}

var bg = ['bg-success', 'bg-danger', 'bg-warning', 'bg-primary', 'bg-dark', 'bg-secondary'];
var colors = ['green', 'red', 'yellow', 'orange', 'black', 'blue', 'gray', 'purple'];
var [lastColors, lastBg] = ['', 'bg-primary'];

$("a").mouseenter(function() {
	//lastBg = bg[Math.floor(Math.random() * bg.length)];
	//lastColors = colors[Math.floor(Math.random() * colors.length)];
	$(this).fadeIn(5000, () => {
		$(this).addClass(lastBg).css({
			'color': 'white'
		});
	});
});

$("a").mouseout(function() {
	$(this).removeClass(lastBg).css({
		color: 'black'
	});
});


//------------------------------------------------------------
$("#suporte").click(event => {
	event.preventDefault();
	$.alert({
		type:'blue',
		title: 'Suporte',
		content:'Caso ocorra algum erro no sistema envie um email para os desenvolvedores: '
			+ '<br><a href="mailto:williamjunior67@gmail.com?subject=Preciso%20de%20ajuda">Enviar email</a>'
			+ '<br><br>Ou envie uma mensagem atraves do nosso whatsapp: '
			+ '<br><a href="https://api.whatsapp.com/send/?phone=5511963849111&text=Preciso+de+ajuda+com+meu+sistema+para+pizzaria&app_absent=0"> Enviar mensagem</a>'
			+ '<br><br><i class="fab fa-instagram"></i> Acesse nossa página instagram: '
			+ '<br><a href="https://www.instagram.com/gazal.tech">Acessar</a>',
		buttons:{
			confirm:{
				text:'Voltar!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
});
