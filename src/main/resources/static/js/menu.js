var dados = {};

//-----------------------------------------------------
$("#data").click(function(){
	//alterar data
	$.confirm({
		type: 'blue',
		title: 'Data de acesso:',
		content: 'Dia: dd/mm/aaaa<br><input type="date" name="dia" id="dia" placeholder="Digite a data de acesso" required/>',
		buttons: {
	        confirm: {
	            text: 'Acessar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					
					dados.data = this.$content.find('#dia').val();
					console.log('dia: ' + dados.data);
					$.ajax({
						url: '/menu/verificarData/' + dados.data,
						type: 'PUT'
					}).done(function(e){
						console.log(e.length);
						
						if(e.length != 0) {
							$.ajax({
								url: '/menu/acessarData/' + dados.data,
								type: 'PUT'
							}).done(function(e){
								
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Data: ' + dados.data + ' acessado',
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
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Data: ' + dados.data + ' criado',
									buttons:{
										confirm:{
											text:'Continuar',
											btnClass: 'btn-green'
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
						$.alert("Falha no acesso!");
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
		content: '<input type="text" id="troco" value="0"/>',
		buttons:{
			confirm:{
				text:'Alterar troco',
				btnClass: 'btn-green',
				action: function(){	
	
					var troco = this.$content.find('#troco').val();
					console.log('troco: ' +troco);
					if(troco % 2 != 0 && troco % 2 != 1) {
						$.alert({
							type:'red',
							title:'Tente novamente!',
							content: 'Digite um valor válido.',
							buttons:{
								confirm:{
									text:'Voltar',
									btnClass: 'btn-danger',
									keys:['enter','esc'],
								}
							}
						});
						troco();
					}
					
					dados.trocoInicio = troco;
					
					//buscar id da data do sistema
					$.ajax({
						url: '/menu/buscarIdData/' + dados.data,
						type: 'PUT'
					}).done(function(e){
		
						dados.id = e.id;
						dados.balcao = e.balcao;
						dados.entregas = e.entregas;
						dados.totalLucro = e.totalLucro;
						dados.totalPedidos = e.totalPedidos;
						dados.totalVendas = e.totalVendas;
						dados.totalPizza = e.totalPizza;
						dados.totalProduto = e.totalProduto;
						dados.trocoFinal = e.trocoFinal;
						
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
						});
					});
				}
			}
		}
	});
}