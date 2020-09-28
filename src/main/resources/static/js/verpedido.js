var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido em aberto!</td></tr>';
var Tpedidos = 0;
var tPizzas = 0;
var imprimirTxt;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

function buscarPedido() {
	$.ajax({
		url: "/verpedido/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){

		pedidos = [];
		for(var i = 0; i< e.length; i++){
			Tpedidos++;
			
			pedidos.unshift({
				'id' : e[i].id,
				'comanda': e[i].comanda,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'pizzas': JSON.parse(e[i].pizzas),
				'produtos': JSON.parse(e[i].produtos),
				'motoboy': e[i].motoboy,
				'ac': e[i].ac,
				'status': e[i].status,
				'envio': e[i].envio,
				'pagamento': e[i].pagamento,
				'taxa': e[i].taxa,
				'total': e[i].total,
				'troco': e[i].troco,
				'horaPedido': e[i].horaPedido,
				'data': e[i].data
			});
		}
		
		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		
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
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
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
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
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
	
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
	    content: linhaHtml,
	    columnClass: 'col-md-8',
	    buttons: {
			confirm: {
				text: 'Imprimir tudo',
		        btnClass: 'btn-warning',
		        action: function(){
					imprimirTudo(pedidos[idBusca]);
				}
			},
			print: {
				text: 'Imprimir Pizzas',
		        btnClass: 'btn-orange',
		        action: function(){
					imprimirPizzas(pedidos[idBusca]);
				}
			},
	        cancel: {
				text: 'Voltar',
	    		keys: ['enter','esc'],
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
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
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
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
	    content: 'Deseja apagar o pedido?',
	    buttons: {
	        confirm: {
	            text: 'Apagar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
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


//-------------------------------------------------
buscarPedido();


//-------------------------------------------------
setInterval(function (){
	buscarPedido();
},5000);


//-------------------------------------------------
function imprimirTudo(cliente) {
	console.log(linhaHtml);
	imprimirTxt = '<h1 align="center">Gazal Tech</h1>'
				+ '<h2 align="center"><b>' + cliente.envio + '</b></h2>'
				+ '<h3>Cliente: ' + cliente.nomePedido + '</h3>';
	if(cliente.envio == 'ENTREGA') {
		imprimirTxt += '<p>Celular: ' + cliente.celular
					+ '<br>Endereço: ' + cliente.endereco
					+ '<br>Taxa de entrega: ' + cliente.taxa + '</p>';
	}
	
	cliente.horaPedido = cliente.horaPedido.split('T')[0]
	imprimirTxt += 'Data do pedido: ' + cliente.horaPedido.split('-')[2] + '/'
									  + cliente.horaPedido.split('-')[1] + '/'
									  + cliente.horaPedido.split('-')[0] + '<hr>';
	
	mostrar(cliente);
	
	imprimirTxt += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br>' 
			+ '<br><b>Total do Pedido:</b> R$' + cliente.total.toFixed(2);
	
	tela_impressao = window.open('about:blank');
	   tela_impressao.document.write(imprimirTxt);
	   tela_impressao.window.print();
	   tela_impressao.window.close();
}


//------------------------------------------------------------------------------------
function imprimirPizzas(cliente) {

	imprimirTxt = '<h2 align="center"><b>' + cliente.envio + '</b></h2>'
				+ '<h3>Cliente: ' + cliente.nomePedido + '</h3><hr>'
	
	mostrar(cliente);
	
	imprimirTxt += '<hr><b>Total de Produtos:</b> ' + Tpizzas;
	
		
	
	tela_impressao = window.open('about:blank');
	   tela_impressao.document.write(imprimirTxt);
	   tela_impressao.window.print();
	   tela_impressao.window.close();
}


//-------------------------------------------------------------
function mostrar(cliente) {
	imprimirTxt += '<table style="width: 100%">';
	if(cliente.pizzas.length != 0) {
		imprimirTxt += '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<cliente.pizzas.length; i++){
			imprimirTxt += '<tr>'
						 +	'<td>' + cliente.pizzas[i].borda + '</td>'
						 +	'<td>' + cliente.pizzas[i].sabor + '</td>'
						 +	'<td>' + cliente.pizzas[i].obs + '</td>'
						 +	'<td>' + cliente.pizzas[i].qtd + '</td>'
						 +  '<td>R$ ' + cliente.pizzas[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
	}

	imprimirTxt += '</table>';
	imprimirTxt += '<table>';
	
	if(cliente.produtos.length != 0) {
		imprimirTxt += '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<cliente.produtos.length; i++){
			imprimirTxt += '<tr>'
						 +	'<td>' + cliente.produtos[i].sabor + '</td>'
						 +	'<td>' + cliente.produtos[i].obs + '</td>'
						 +	'<td>' + cliente.produtos[i].qtd + '</td>'
						 +  '<td>R$ ' + cliente.produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
	}
	
	imprimirTxt += '</table>';
}