var dados = {};

//-----------------------------------------------------
function verData() {
	$.ajax({
		url: '/menu/mostrarDia',
		type: 'PUT'
	}).done(function(e){
		var hoje = new Date();
		
		if(	(hoje.getDate() == e.dia.split('-')[2])
		&&	((hoje.getMonth() + 1) == e.dia.split('-')[1])
		&&	(hoje.getFullYear() == e.dia.split('-')[0])) {
			$("#data").text('Hoje');
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
		content: 'Dia:<br><input type="date" name="dia" id="dia" class="form-control" placeholder="Digite a data de acesso"/>',
		buttons: {
	        confirm: {
	            text: 'Acessar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					
					dados.data = this.$content.find('#dia').val();

					$.ajax({
						url: '/menu/verificarData/' + dados.data,
						type: 'PUT'
					}).done(function(e){
						
						if(e.length != 0) {
							$.ajax({
								url: '/menu/acessarData/' + dados.data,
								type: 'PUT'
							}).done(function(e){
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
									title: 'Tente novamente!',
									content: 'Não foi possivel acessar uma data',
									buttons:{
										confirm:{
											text:'Voltar',
											btnClass: 'btn-danger'
										}
									}
								});
							});
						}else {
							$.ajax({
								url: '/menu/criarData/' + dados.data,
								type: 'PUT'
							}).done(function(e){
								verData();
								
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Data: ' + dados.data.split('-')[2] + '/'
													  + dados.data.split('-')[1] + '/'
													  + dados.data.split('-')[0] + ' criada',
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
									btnClass: 'btn-danger'
								}
									}
								});
							}).fail(function(){
								$.alert({
									type: 'red',
									title: 'Tente novamente!',
									content: 'Não foi possivel criar uma data',
									buttons:{
										confirm:{
											text:'Voltar',
											btnClass: 'btn-danger'
										}
									}
								});
							});
						}
						
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

					troco = troco.toString().replace(",",".");
					
					dados.trocoInicio = troco;
					
					//buscar id da data do sistema
					$.ajax({
						url: '/menu/buscarIdData/' + dados.data,
						type: 'PUT'
					}).done(function(e){
		
						dados.id = e.id;
						dados.comanda = e.comanda;
						dados.balcao = e.balcao;
						dados.entregas = e.entregas;
						dados.totalLucro = e.totalLucro;
						dados.totalPedidos = e.totalPedidos;
						dados.totalVendas = e.totalVendas;
						dados.totalPizza = e.totalPizza;
						dados.totalProduto = e.totalProduto;
						dados.trocoFinal = e.trocoFinal;
						dados.compras = e.compras;
						
						//alterar troco inicial
						$.ajax({
							url: '/menu/troco/' + dados.id,
							type: 'PUT',
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(dados)
						}).done(function(e){
							$.alert({
								type:'green',
								title: 'Troco alterado',
								content:'Boas vendas!',
								buttons:{
									confirm:{
										text:'Obrigado',
										btnClass: 'btn-success'
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
					});
				}
			}
		}
	});
}
