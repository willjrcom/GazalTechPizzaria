
var produtos = [];

var linhaHtml;
var pedidoVazio = '<tr><td colspan="6">Nenhum produto encontrado!</td></tr>';
var linhaCinza = '<tr><td colspan="6" class="fundoList"></td></tr>';

$("#todosProdutos").html(pedidoVazio);

$("#buscar").click(function(){
	
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/produtosCadastrados/buscar/' + nome,
		type: 'PUT'
	}).done(function(e){
		
		produtos = [];
		
		for(var i = 0; i<e.length; i++) {
			produtos.unshift({
				'id': e[i].id,
				'codigoBusca': e[i].codigoBusca,
				'nomeProduto': e[i].nomeProduto,
				'preco': e[i].preco,
				'custo': e[i].custo,
				'estoque': e[i].estoque,
				'setor': e[i].setor,
				'descricao': e[i].descricao
			});
		}
		
		linhaHtml = '';
		
		if(produtos.length != 0) {
			for(var i = 0; i<produtos.length; i++) {
				linhaHtml += '<tr>'
							+'<td>' + produtos[i].id + '</td>'
							+'<td>' + produtos[i].codigoBusca + '</td>'
							+'<td>' + produtos[i].nomeProduto + '</td>'
							+'<td>R$ ' + parseFloat(produtos[i].preco).toFixed(2) + '</td>'
							+'<td>R$ ' + parseFloat(produtos[i].custo).toFixed(2) + '</td>';
				
linhaHtml += '<td><div class="row">';
				
				linhaHtml +='<div class="col-md-1">'
								+'<a style="background-color: white" title="Ver">'
									+'<button style="background-color: white; border: none" onclick="verProduto()" value="'+ produtos[i].id + '">'
										+'<span class="oi oi-magnifying-glass"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
						
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Editar">'
									+'<button style="background-color: white; border: none" onclick="editarProduto()" value="'+ produtos[i].id + '">'
										+'<span class="oi oi-pencil"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Excluir">'
									+'<button style="background-color: white; border: none" onclick="excluirProduto()" value="'+ produtos[i].id + '">'
										+'<span class="oi oi-trash"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '</td></tr>';
							
				linhaHtml += '</tr>'
							+ linhaCinza;
			}
			$("#todosProdutos").html(linhaHtml);
		}
	}).fail(function(){
		$.alert("Produto não encontrado!");
	});
});


//-----------------------------------------------------------------------------------------------------------
function verProduto() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<produtos.length; i++){//buscar dados completos do pedido enviado
		if(produtos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	linhaHtml = "";
	linhaHtml = '<table><tr>'
					+ '<td><h4>Codigo</h4></td>'
					+ '<td><h4>Nome</h4></td>'
					+ '<td><h4>Preço</h4></td>'
					+ '<td><h4>Setor</h4></td>'
					+ '<td><h4>Descrição</h4></td>'
				'</tr>';
	
	linhaHtml += '<tr>';
	linhaHtml += 	'<td>' + produtos[idBusca].codigoBusca + '</td>';
	linhaHtml += 	'<td>' + produtos[idBusca].nomeProduto + '</td>';
	linhaHtml += 	'<td>' + produtos[idBusca].preco + '</td>';
	linhaHtml += 	'<td>' + produtos[idBusca].setor + '</td>';
	linhaHtml += 	'<td>' + produtos[idBusca].descricao + '</td>';
	linhaHtml += '</tr>';
	linhaHtml += '</table>';
	
	$.alert({
		type: 'green',
	    title: 'Produto:' + produtos[idBusca].nomeProduto,
	    content: linhaHtml,
	    columnClass: 'col-md-12',
	    containerFluid: true,
	    buttons: {
	        confirm: {
				text: 'Voltar',
	    		keys: ['enter'],
	            btnClass: 'btn-green',
			}
		}
	});
};


//------------------------------------------------------------------------------------------
function editarProduto() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/cadastroProduto/editar/" + idProduto.toString();
	
	for(var i = 0; i<produtos.length; i++){//buscar dados completos do pedido enviado
		if(produtos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	$.confirm({
		type: 'red',
	    title: 'Produto: ' + produtos[idBusca].nomeProduto,
	    content: 'Tenha certeza do que você está fazendo!<br>',
	    buttons: {
	        confirm: {
	            text: 'Editar produto',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					
					$.ajax({
						url: urlEnviar,
						type: 'PUT',
					}).done(function(){
						window.location.href = urlEnviar;
					}).fail(function(){
						$.alert("Tente novamente!");
					});
				}
			},
	        cancel:{
				text: 'Voltar',
	            btnClass: 'btn-green',
	            keys: ['esc'],
			}
		}
	});
}


//-----------------------------------------------------------------------------------------------------------
function excluirProduto() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/produtosCadastrados/excluirProduto/" + idProduto.toString();
	
	for(var i = 0; i<produtos.length; i++){//buscar dados completos do pedido enviado
		if(produtos[i].id == idProduto){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Produto: ' + produtos[idBusca].nomeProduto,
	    content: 'Deseja apagar o produto?',
	    buttons: {
	        confirm: {
	            text: 'Apagar produto',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'APAGAR PRODUTO!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar produto',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									if(apagarSim === 'sim') {
										
										$.ajax({
											url: urlEnviar,
											type: 'PUT'
											
										}).done(function(){		
											$.alert({
												type: 'green',
											    title: 'Produto apagado!',
											    content: 'Espero que dê tudo certo!',
											    buttons: {
											        confirm: {
														text: 'Voltar',
											    		keys: ['enter'],
											            btnClass: 'btn-green',
											            action: function(){
														}
													}
												}
											});
										}).fail(function(){
											$.alert("Produto apagado!");
										});
									}else {
										$.alert({
											type: 'red',
										    title: 'Texto incorreto!',
										    content: 'Pense bem antes de apagar um produto!',
										    buttons: {
										        confirm: {
													text: 'Voltar',
										    		keys: ['enter'],
										            btnClass: 'btn-red',
												}
											}
										});
									}
								}
							},
					        cancel: {
								text: 'Voltar',
					            btnClass: 'btn-green',
					            keys: ['esc'],
							}
						}
					});
				}
			},
		    cancel: {
				text: 'Voltar',
		        btnClass: 'btn-green',
		        keys: ['esc'],
			}
		}
	});
}