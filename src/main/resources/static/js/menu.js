var dados = {};

if(document.referrer.split("/")[3] == "index") {//acessar pagina anterior
	var tela = $.alert({type: "blue", title: "Carregando", content: "Carregando data atual..."});
	tela.open();
	$.ajax({
		url: "/menu/login"
	}).done(function(){
		tela.close();
		verData();
	});
}


//-----------------------------------------------------
function verData() {
	$.ajax({
		url: '/menu/mostrarDia',
		type: 'GET'
	}).done(function(e){
		var hoje = new Date();
		
		if(	(hoje.getDate() == e.dia.split('-')[2])
		&&	((hoje.getMonth() + 1) == e.dia.split('-')[1])
		&&	(hoje.getFullYear() == e.dia.split('-')[0])) {
			$("#data").html('<span class="oi oi-calendar"></span> Hoje');
		}else {
			$("#data").text(e.dia.split('-')[2] + '/' + e.dia.split('-')[1] + '/' + e.dia.split('-')[0]);
		}
	});
}
verData();


//----------------------------------------------------------------
function tablet() {

	$.confirm({
		type: 'blue',
		title: 'Acessar Tablet',
		content: 'Tem certeza?',
		buttons:{
			confirm:{
				text: 'Acessar',
				btnClass: 'btn-success',
				keys: ['enter'],
				action: function(){
					window.location.href = "/menuTablet";
				}
			},
			cancel:{
				text: 'Voltar',
				btnClass: 'btn-danger',
				keys: ['esc']
			}
		}
	})
}


//-----------------------------------------------------
$("#data").click(function(){
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
	            action: function(){
					
					dados.data = this.$content.find('#dia').val();

					$.ajax({
						url: '/menu/verificarData/' + dados.data,
						type: 'GET'
					}).done(function(){
						
						verData();
						
						$.alert({
							type: 'green',
							title: 'Sucesso!',
							content: 'Data: ' + dados.data.split('-')[2] + '/'
									          + dados.data.split('-')[1] + '/'
									          + dados.data.split('-')[0] + ' acessado',
							buttons:{
								confirm:{
									text:'Alterar troco',
									btnClass: 'btn-green',
									action: function(){
										troco();
									}
								},
								cancel:{
									text:'Continuar',
									btnClass: 'btn-primary'
								}
							}
						});
					}).fail(function(){
						$.alert({
							type: 'red',
							title: 'Alerta',
							content: "Escolha uma data!",
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
	        cancel:{
				text: 'Voltar',
				btnClass: 'btn-danger',
				keys: ['esc']
			}
		}
	});
});


//-----------------------------------------------------
function troco() {
	$.alert({
		type: 'blue',
		title: '<span class="oi oi-dollar"></span>Alterar troco',
		content: '<input type="text" class="form-control" id="troco"/>',
		buttons:{
			confirm:{
				text:'Alterar troco',
				btnClass: 'btn-green',
				action: function(){	
	
					var troco = this.$content.find('#troco').val();

					troco = parseFloat(troco.toString().replace(",","."));
					
					if(Number.isFinite(troco) == false) {
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm:{
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					}else {

						//alterar troco inicial						
						$.ajax({
							url: '/menu/troco/' + dados.data + "/" + troco,
							type: 'GET'
						}).done(function(){
							$.alert({
								type:'green',
								title: 'Troco alterado',
								content:'Boas vendas!',
								buttons:{
									confirm:{
										text:'Obrigado',
										btnClass: 'btn-success',
										keys: ['esc', 'enter'],
										action: function(){
											window.location.href= "/menu";
										}
									}
								}
							});
						}).fail(function(){
							$.alert({
								type: 'red',
								title: 'Alerta',
								content: "Digite um valor válido!",
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
				}
			}
		}
	});
}


//------------------------------------------------------------
function ajuda() {
	$.alert({
		type:'blue',
		title: 'Suporte',
		content:'Caso ocorra algum erro no sistema envie um email para os desenvolvedores: '
			+ '<br><a href="mailto:williamjunior67@gmail.com?subject=Preciso%20de%20ajuda">Enviar email</a>'
			+ '<br><br>Ou envie uma mensagem atraves do nosso whatsapp: '
			+ '<br><a href="https://api.whatsapp.com/send/?phone=5511963849111&text=Preciso+de+ajuda+com+meu+sistema+para+pizzaria&app_absent=0"> Enviar mensagem</a>'
			+ '<br><br>Acesse nossa página instagram: '
			+ '<br><a href="https://www.instagram.com/gazal.tech">Acessar</a>',
		buttons:{
			confirm:{
				text:'Voltar!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}