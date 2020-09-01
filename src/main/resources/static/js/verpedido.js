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

function buscarPedido() {
	$.ajax({
		url: "/verpedido/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);

		pedidos = [];
		for(var i = 0; i< e.length; i++){
			Tpedidos++;
			
			pedidos.unshift({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'codigoPedido': e[i].codigoPedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'taxa': e[i].taxa,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'status': e[i].status,
				'produtos': JSON.parse(e[i].produtos),
				'pizzas': JSON.parse(e[i].pizzas),
				'horaPedido': e[i].horaPedido,
				'pagamento': e[i].pagamento,
				'data': e[i].data
			});
		}
		
		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		console.log(filtro);
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				if(filtro == pedidos[i].pagamento || filtro == "TODOS"){
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
											+'<span class="oi oi-magnifying-glass"></span>'
										+'</button>'
									+'</a>'
								+'</div>';
							
					linhaHtml += '<div class="col-md-1">'
									+'<a style="background-color: white" title="Editar">'
										+'<button style="background-color: white; border: none" onclick="editarPedido()" value="'+ pedidos[i].id + '">'
											+'<span class="oi oi-pencil"></span>'
										+'</button>'
									+'</a>'
								+'</div>';
					
					linhaHtml += '<div class="col-md-1">'
									+'<a style="background-color: white" title="Excluir">'
										+'<button style="background-color: white; border: none" onclick="excluirPedido()" value="'+ pedidos[i].id + '">'
											+'<span class="oi oi-trash"></span>'
										+'</button>'
									+'</a>'
								+'</div>';
					
					linhaHtml += '</td></tr>';
					
					linhaHtml += '<tr>';
					linhaHtml += linhaCinza;
				}
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	});	
}

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
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br>' 
				+ '<br><b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
				+ '<br><b>Status:</b> ' + pedidos[idBusca].status
				+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio;
	
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

buscarPedido();

setInterval(function (){
	buscarPedido();
},5000);

