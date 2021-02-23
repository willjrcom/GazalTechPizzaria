$("#filtro").selectmenu().addClass("overflow");
var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido em aberto!</td></tr>';
var Tpedidos = 0, totalPedidos = 0;
var totalTodosProdutos = 0;
var imprimirTxt;
$(document).ready(() => $("#nomePagina").html("Ver pedidos"));
//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");
function buscarPedido() {
	Tpedidos = 0;

	$.ajax({
		url: "/verpedido/todosPedidos",
		type: 'GET'
	}).done(function(e){

		pedidos = e;

		for(pedido of pedidos){
			Tpedidos++;
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}
		
		if(pedidos.length == 0)	
			$("#todosPedidos").html(pedidoVazio);
		
		if(totalPedidos != Tpedidos) {
			if(totalPedidos == 0) {
				mostrar(pedidos, "TODOS");
			}else {
				mostrar(pedidos, $("#filtro").val());
			}
			totalPedidos = Tpedidos;
		}
		carregarLoading("none");
	});	
}


//--------------------------------------------------------------------------------------
function filtrar() {
	mostrar(pedidos, $("#filtro").val());
}


//--------------------------------------------------------------------------------------
function mostrar(pedidos, filtro) {
	linhaHtml = "";
	for(pedido of pedidos){
		if(filtro == pedido.pago || filtro == "TODOS"){
			totalTodosProdutos = 0;
			
			linhaHtml += '<tr>'
						+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.nome + '</td>';
						
			for(produto of pedido.produtos) totalTodosProdutos += produto.qtd;//total de produtos
					
			for(pizza of pedido.pizzas) totalTodosProdutos += pizza.qtd;//total de pizzas

			linhaHtml += '<td class="text-center col-md-1">' + totalTodosProdutos + '</td>'
						+ '<td class="text-center col-md-1">R$ ' + mostrarTotalComTaxa(pedido).toFixed(2) + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.envio + '</td>'
						+ '<td class="text-center col-md-1"><div class="row">'
						+ '<div class="col-md-1">'
							+'<a title="Ver">'
								+'<button class="botao" onclick="verPedido()" value="'+ pedido.id + '">'
									+'<i class="fas fa-search"></i>'
								+'</button>'
							+'</a>'
						+'</div>'
					
						+ '<div class="col-md-1">'
							+'<a title="Editar">'
								+'<button class="botao" onclick="editarPedido()" value="'+ pedido.id + '">'
									+'<i class="fas fa-edit"></i>'
								+'</button>'
							+'</a>'
						+'</div>'
			
						+ '<div class="col-md-1">'
							+'<a title="Excluir">'
								+'<button class="botao" onclick="excluirPedido()" value="'+ pedido.id + '">'
									+'<i class="fas fa-trash"></i>'
								+'</button>'
							+'</a>'
						+'</div>'
			
					+ '</td></tr>'
				+ '<tr>'
			+ linhaCinza;
		}
	}

	if(linhaHtml != "") {
		$("#todosPedidos").html(linhaHtml);
	}else {
		$("#todosPedidos").html(pedidoVazio);
	}
}


//-------------------------------------------------
buscarPedido();

setInterval(function(){
	buscarPedido();
},10000); // recarregar a cada 10 segundos


//-----------------------------------------------------------------------------------------------------------
function verPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	linhaHtml = '<div class="row">'
				+ '<div class="col-md-6"><b>Total de Produtos:</b><br>' + totalTodosProdutos + '</div>'
				+ '<div class="col-md-6"><b>Modo de Envio:</b><br>' + pedidos[idBusca].envio + '</div>'
				+ '<div class="col-md-6"><b>Hora do pedido:</b><br>' + pedidos[idBusca].horaPedido + '</div>'
				+ '<div class="col-md-6"><b>Total do Pedido:</b><br>R$ ' + mostrarTotalComTaxa(pedidos[idBusca]).toFixed(2) + '</div>';
				
	if(pedidos[idBusca].envio != 'MESA')
		linhaHtml += '<div class="col-md-6"><b>Forma de pagamento:</b><br>' + pedidos[idBusca].modoPagamento + '</div>';
				
	
	if(pedidos[idBusca].obs != null) linhaHtml += '<div class="col-md-6"><b>Observação:</b> ' + pedidos[idBusca].obs + '</div>';
	
	linhaHtml += '</div>';
	
	jqueryFinalizar(pedidos[idBusca]);
};


function jqueryFinalizar(cliente){
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + cliente.nome,
	    content: linhaHtml,
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			mostrarPedido:{
				text: 'ver pedido',
		        btnClass: 'btn btn-primary',
		        action: function(){
					mostrarProdutosPedido(cliente);
				}
			},
			tudo: {
				text: '<i class="fas fa-print"></i> Pedido',
		        btnClass: 'btn-success',
		        action: function(){
					imprimirTudo(cliente);
				}
			},
			pizzas: {
				text: '<i class="fas fa-print"></i> Pizzas',
		        btnClass: 'btn-orange',
		        action: function(){
					imprimirPizzas(cliente);
				}
			},
			produtos: {
				text: '<i class="fas fa-print"></i> Produtos',
		        btnClass: 'btn-primary',
		        action: function(){
					imprimirProdutos(cliente);
				}
			},
			cancel: {
	            isHidden: true, // hide the button
	            keys: ['esc']
			}
		}
	});
}


function mostrarProdutosPedido(cliente){
	Tpizzas = 0;
	let linhaHtml = '';
	for(produto of cliente.produtos) Tpizzas += produto.qtd;
	
	for(pizza of cliente.pizzas) Tpizzas += pizza.qtd;
	
	if(cliente.pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
					+ '</tr>';
		
		for(pizza of cliente.pizzas){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + pizza.qtd + " x " + pizza.sabor + '</td>'
						 +	'<td class="text-center col-md-1">' + pizza.obs + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + pizza.preco.toFixed(2) + '</td>'
						 +	'<td class="text-center col-md-1">' + pizza.borda + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	if(cliente.produtos.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of cliente.produtos){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + produto.qtd + " x " + produto.sabor + '</td>'
						 +	'<td class="text-center col-md-1">' + produto.obs + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	$.alert({
		type: 'blue',
		title: 'Pedido',
		content: linhaHtml,
	    columnClass: 'col-md-8',
		buttons: {
			confirm: {
				text: 'Voltar',
				btnClass: 'btn btn-success',
				keys: ['esc', 'enter'],
				action: () => jqueryFinalizar(cliente)
			}
		}
	});
}
//-----------------------------------------------------------------------------------------------------------
function editarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	$.confirm({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Tenha certeza do que você está fazendo!',
	    buttons: {
	        confirm: {
	            text: 'Editar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					//verificar permissao adm
					$.ajax({
						url: "/verpedido/autenticado"
					}).done(function(e){
						if(e[0].authority === "ADM" || e[0].authority === "DEV") {
							
							window.location.href = "/novoPedido/editar/" + idProduto;
						}else {
							//se nao for ADM
							$.alert({
								type: 'red',
							    title: 'Permissão de usuário!',
							    content: 'Você não tem permissão para cancelar um pedido<br>Utilize um usuário ADM!',
							    buttons: {
							        confirm: {
										text: 'Voltar',
							    		keys: ['enter'],
							            btnClass: 'btn-red',
									}
								}
							});
						}
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
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;

	var inputApagar = '<input type="text" placeholder="Digite SIM para cancelar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Deseja cancelar o pedido?',
	    buttons: {
	        confirm: {
	            text: 'Cancelar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'CANCELAR PEDIDO!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Cancelar pedido',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									//verificar permissao adm
									$.ajax({
										url: "/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM" || e[0].authority === "DEV") {
											
											if(apagarSim === 'sim' || apagarSim === 'SIM' || apagarSim === 'Sim') {
												
												$.ajax({
													url: "/verpedido/excluirPedido/" + idProduto,
													type: 'POST'
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
													$.alert("Erro, Pedido não apagado!");
												});
											}else {
												$.alert({
													type: 'red',
												    title: 'Texto incorreto!',
												    content: 'Pense bem antes de cancelar um pedido!',
												    buttons: {
												        confirm: {
															text: 'Voltar',
												    		keys: ['enter'],
												            btnClass: 'btn-red',
														}
													}
												});
											}
										}else {//se nao for ADM
											$.alert({
												type: 'red',
											    title: 'Permissão de usuário!',
											    content: 'Você não tem permissão para cancelar um pedido<br>Utilize um usuário ADM!',
											    buttons: {
											        confirm: {
														text: 'Voltar',
											    		keys: ['enter'],
											            btnClass: 'btn-red',
													}
												}
											});
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
function imprimirTudo(cliente) {
    
	if(cliente.obs != "") cliente.obs = cliente.obs;
				
	//salvar hora
	cliente.hora = cliente.horaPedido;
	cliente.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];

	$.ajax({
		url: "/imprimir/imprimirPedido",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(cliente)
	});
}


//------------------------------------------------------------------------------------
function imprimirPizzas(cliente) {
	    
	if(cliente.pizzas != 0){
		cliente.setor = "A";
		
		//salvar hora
		cliente.hora = cliente.horaPedido;
		cliente.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];

		$.ajax({
			url: "/imprimir/imprimirPizza",
			type: 'POST',
			dataType : 'json',
			contentType: "application/json",
			data: JSON.stringify(cliente)
		});
	}else{
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'O pedido não contem pizzas!',
			buttons:{
				confirm:{
					text: 'Voltar',
					btnClass: 'btn-success',
					keys: ['enter', 'esc']
				}
			}
		});
	}
}


//------------------------------------------------------------------------------------
function imprimirProdutos(cliente) {
	    
	if(cliente.produtos != 0){
		cliente.setor = "A";
	
		//salvar hora
		cliente.hora = cliente.horaPedido;
		cliente.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];

		$.ajax({
			url: "/imprimir/imprimirProduto",
			type: 'POST',
			dataType : 'json',
			contentType: "application/json",
			data: JSON.stringify(cliente)
		});
	}else{
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'O pedido não contem produtos!',
			buttons:{
				confirm:{
					text: 'Voltar',
					btnClass: 'btn-success',
					keys: ['enter', 'esc']
				}
			}
		});
	}
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
    return !isNaN(parseFloat(str))
}


function mostrarTotalComTaxa(cliente){
	if(isNumber(cliente.taxa) == true)
		return (cliente.total + cliente.taxa);
	else
		return cliente.total;
}