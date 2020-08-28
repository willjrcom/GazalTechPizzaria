var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido em aberto!</td></tr>';
var Tpedidos = 0;
var tPizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/pronto/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if(e[i].status != "FINALIZADO" && e[i].status != "EXCLUIDO"){
			Tpedidos++;
			
			pedidos.unshift({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'status': e[i].status,
				'produtos': JSON.parse(e[i].produtos),
				'pizzas': JSON.parse(e[i].pizzas)
			});
		}
	}
	

	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
				tPizzas = 0;
			
			linhaHtml += '<tr>';
			linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
			for(var k = 0; k<pedidos[i].produtos.length; k++) {
				tPizzas += pedidos[i].produtos[k].qtd;
			}
			for(var k = 0; k<pedidos[i].pizzas.length; k++) {
				tPizzas += pedidos[i].pizzas[k].qtd;
			}
			
			linhaHtml +=	'<td>' + tPizzas + '</td>';
			linhaHtml +=	'<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].envio + '</td>';
			
			linhaHtml += '<td><div class="row">';
			
			linhaHtml +='<div class="col-md-1">'
							+'<a style="background-color: white" title="Ver">'
								+'<button style="background-color: white; border: none" onclick="verPedido()" value="'+ pedidos[i].id + '">'
									+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
										+'<path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h8a1.5 1.5 0 0 0 1.5-1.5V9a.5.5 0 0 0-1 0v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 5v8zm7-11a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.5H9a.5.5 0 0 1-.5-.5z"/>'
										+'<path fill-rule="evenodd" d="M14.354 1.646a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708-.708l8-8a.5.5 0 0 1 .708 0z"/>'
									+'</svg>'
								+'</button>'
							+'</a>'
						+'</div>';
					
			linhaHtml += '<div class="col-md-1">'
							+'<a style="background-color: white" title="Editar">'
								+'<button style="background-color: white; border: none" onclick="editarPedido()" value="'+ pedidos[i].id + '">'
									+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brush" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
										+'<path d="M15.213 1.018a.572.572 0 0 1 .756.05.57.57 0 0 1 .057.746C15.085 3.082 12.044 7.107 9.6 9.55c-.71.71-1.42 1.243-1.952 1.596-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.212-1.543.346-.542.887-1.273 1.642-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/>'
										+'<path d="M7 12a2 2 0 0 1-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 0 1 2 2z"/>'
									+'</svg>'
								+'</button>'
							+'</a>'
						+'</div>';
			
			linhaHtml += '<div class="col-md-1">'
							+'<a style="background-color: white" title="Excluir">'
								+'<button style="background-color: white; border: none" onclick="excluirPedido()" value="'+ pedidos[i].id + '">'
									+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
										+'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
									    +'<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>'
									    +'<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>'
									+'</svg>'
								+'</button>'
							+'</a>'
						+'</div>';
			
			linhaHtml += '</td></tr>';
			
			linhaHtml += '<tr>';
			linhaHtml += linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});	


//-----------------------------------------------------------------------------------------------------------
function verPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	Tpizzas = 0;
	for(var k = 0; k < pedidos[idBusca].produtos.length; k++) {
		Tpizzas += pedidos[idBusca].produtos[k].qtd;
	}
	for(var k = 0; k < pedidos[idBusca].pizzas.length; k++) {
		Tpizzas += pedidos[idBusca].pizzas[k].qtd;
	}
	
	linhaHtml = '<table>';
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml += '<tr>'
						+ '<th>Borda</th>'
						+ '<th>Sabor</th>'
						+ '<th>Obs</th>'
						+ '<th>Qtd</th>'
						+ '<th>Preço</th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].borda + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].pizzas[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
	}

	linhaHtml += '</table>';
	linhaHtml += '<table>';
	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<tr>'
						+ '<th>Sabor</th>'
						+ '<th>Obs</th>'
						+ '<th>Qtd</th>'
						+ '<th>Preço</th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].produtos[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
	}
	
	linhaHtml += '</table>';
	linhaHtml += '<hr>Total de Produtos: ' + Tpizzas + '<br><br>' + 'Total do Pedido: R$' + pedidos[idBusca].total.toFixed(2);	

	$.alert({
		type: 'green',
	    typeAnimated: true,
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
	    content: 'Produtos escolhidos:' + linhaHtml,
	    buttons: {
	        confirm: {
				text: 'Voltar',
	    		keys: ['enter'],
	            btnClass: 'btn-green',
			}
		}
	});
};


//-----------------------------------------------------------------------------------------------------------
function editarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/novoPedido/editar/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	var aviso;
	if(pedidos[idBusca].status == "PRONTO") {
		aviso = "O pedido está pronto";
	}else {
		aviso = "O pedido está em preparação";
	}
	
	$.confirm({
		type: 'red',
	    typeAnimated: true,
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido.split(' ')[0],
	    content: 'Tenha certeza do que você está fazendo!<br>' + aviso,
	    buttons: {
	        confirm: {
	            text: 'Editar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					
					$.ajax({
						url: urlEnviar,
						type: 'POST',
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
};


//-----------------------------------------------------------------------------------------------------------
function excluirPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/verpedido/excluirPedido/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    typeAnimated: true,
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido.split(' ')[0],
	    content: 'Deseja apagar o pedido?',
	    buttons: {
	        confirm: {
	            text: 'Apagar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    typeAnimated: true,
					    title: 'APAGAR PEDIDO!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar pedido',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									if(apagarSim === 'sim') {

										pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
										pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
										
										$.ajax({
											url: urlEnviar,
											type: 'PUT',
											data: pedidos[idBusca]
											
										}).done(function(){		
											$.alert({
												type: 'red',
											    typeAnimated: true,
											    title: 'Pedido apagado!',
											    content: 'Espero que dê tudo certo!',
											    buttons: {
											        confirm: {
														text: 'Voltar',
											    		keys: ['enter'],
											            btnClass: 'btn-green',
											            action: function(){
															window.location.href = "/verpedido";
														}
													}
												}
											});
										}).fail(function(){
											$.alert("Pedido não apagado!");
										});
									}else {
										$.alert({
											type: 'red',
										    typeAnimated: true,
										    title: 'Texto incorreto!',
										    content: 'Pense bem antes de apagar um pedido!',
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