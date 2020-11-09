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
	}).done(function(e){

		pedidos = e;
		for(pedido of pedidos){
			Tpedidos++;
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}
		
		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		
		if(pedidos.length == 0)	$("#todosPedidos").html(pedidoVazio);
		else{
			for(pedido of pedidos){
				if(filtro == pedido.pagamento || filtro == "TODOS"){
					tPizzas = 0;
					
					linhaHtml += '<tr>'
								+ '<td>' + pedido.comanda + '</td>'
								+ '<td>' + pedido.nome + '</td>';
								
					for(produto of pedido.produtos) tPizzas += produto.qtd;//total de produtos
							
					for(pizza of pedido.pizzas) tPizzas += pizza.qtd;//total de pizzas
					
					linhaHtml += '<td>' + tPizzas + '</td>'
								+ '<td>R$ ' + pedido.total.toFixed(2) + '</td>'
								+ '<td>' + pedido.envio + '</td>'
								+ '<td><div class="row">'
								+ '<div class="col-md-1">'
									+'<a title="Ver">'
										+'<button class="botao" onclick="verPedido()" value="'+ pedido.id + '">'
											+'<span class="oi oi-magnifying-glass"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
							
								+ '<div class="col-md-1">'
									+'<a title="Editar">'
										+'<button class="botao" onclick="editarPedido()" value="'+ pedido.id + '">'
											+'<span class="oi oi-pencil"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
					
								+ '<div class="col-md-1">'
									+'<a title="Excluir">'
										+'<button class="botao" onclick="excluirPedido()" value="'+ pedido.id + '">'
											+'<span class="oi oi-trash"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
					
							+ '</td></tr>'
						+ '<tr>'
					+ linhaCinza;
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
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	Tpizzas = 0;
	for(produto of pedidos[idBusca].produtos) Tpizzas += produto.qtd;
	
	for(pizza of pedidos[idBusca].pizzas) Tpizzas += pizza.qtd;
	
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td>' + pizza.borda + '</td>'
						 +	'<td>' + pizza.sabor + '</td>'
						 +	'<td>' + pizza.obs + '</td>'
						 +	'<td>' + pizza.qtd + '</td>'
						 +  '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td>' + produto.sabor + '</td>'
						 +	'<td>' + produto.obs + '</td>'
						 +	'<td>' + produto.qtd + '</td>'
						 +  '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br>' 
				+ '<br><b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
				+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio;
	
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml,
	    closeIcon: true,
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
			}
		}
	});
};


//-----------------------------------------------------------------------------------------------------------
function editarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	var aviso;
	if(pedidos[idBusca].status == "PRONTO") aviso = "O pedido está pronto";
	else aviso = "O pedido está em preparação";
	
	
	$.confirm({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Tenha certeza do que você está fazendo!<br>' + aviso,
	    buttons: {
	        confirm: {
	            text: 'Editar pedido',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					
					$.ajax({
						url: "/novoPedido/editar/" + idProduto.toString(),
						type: 'POST',
					}).done(function(){
						window.location.href = "/novoPedido/editar/" + idProduto.toString();
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
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;

	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
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
									
									//verificar permissao adm
									$.ajax({
										url: "/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM") {
											
											if(apagarSim === 'sim') {

												pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
												pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
												
												$.ajax({
													url: "/verpedido/excluirPedido/" + idProduto.toString(),
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
													$.alert("Erro, Pedido não apagado!");
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
										}else {//se nao for ADM
											$.alert({
												type: 'red',
											    title: 'Permissão de usuário!',
											    content: 'Você não tem permissão para apagar um pedido<br>Utilize um usuário ADM!',
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
buscarPedido();


//-------------------------------------------------
setInterval(function (){
	buscarPedido();
},5000);


//-------------------------------------------------
function imprimirTudo(cliente) {
	//salvar hora atual
	var data = new Date();
	hora = data.getHours();
	hora = (hora.length == 0) ? '00' : hora;
	hora = (hora <= 9) ? '0'+hora : hora;
	minuto = data.getMinutes();
	minuto = (minuto.length == 0) ? '00' : minuto;
	minuto = (minuto <= 9) ? '0'+minuto : minuto;
	segundo = data.getSeconds();
	segundo = (segundo.length == 0) ? '00' : segundo;
	segundo = (segundo <= 9) ? '0'+segundo : segundo;
    dia  = data.getDate().toString();
    dia = (dia.length == 1) ? '0'+dia : dia;
    mes  = (data.getMonth()+1).toString();
    mes = (mes.length == 1) ? '0'+mes : mes;
    ano = data.getFullYear();
    
    
    //buscar dados da empresa
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			
			imprimirTxt = '<html><h2 align="center">' + e.nomeEstabelecimento + '</h2>'//nome da empresa
						+ '<h3 align="center"><b>' + cliente.envio + '</b></h3>'//forma de envio
						+ '<p>' + e.texto1 + '</p>'//texto1 gerado pela empresa
						
						//numero da comanda e nome
						+ '<label>Comanda: ' + cliente.comanda + '</label><br>'
						+ '<label>Cliente: ' + cliente.nome + '</label><br>';
			
			//mostrar endereco do cliente
			if(cliente.envio == 'ENTREGA') {
				imprimirTxt += '<p>Celular: ' + cliente.celular + '<br>'
							+ 'Endereço: ' + cliente.endereco + '</p><br>';
			}
			
	        //gerar tabela de produtos e pizzas
			mostrarImpressao(cliente.pizzas, cliente.produtos);

			//salvar hora
			imprimirTxt += '<hr>' + linhaHtml + '<hr><br>';
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				imprimirTxt += '<label>Taxa de entrega: ' + parseFloat(cliente.taxa).toFixed(2) + '</label><br>'
				 			+ '<label>Total com taxa: R$ ' + parseFloat(cliente.total).toFixed(2) + '</label><br>';
				
			}else {//total sem taxa
				imprimirTxt += '<label>Total: R$ ' + parseFloat(cliente.total).toFixed(2) + '</label><br>'
			}

			//total a levar de troco
			imprimirTxt += '<label>Levar: R$ ' + (cliente.troco - cliente.total).toFixed(2) + '</label><br>'
						+ '<label>Observação: ' + cliente.obs + '</label><br>';
						
			//texto2 e promocao
			imprimirTxt += '<p>Horário de funcionamento:<br>' + e.texto2 + '</p><hr><br>' 
						+ '<label>Promoção </label><br>' + '<p>' + e.promocao + '</p>';
						
				
			//salvar hora
			imprimirTxt += 'Data do pedido: ' + cliente.data.split('-')[2] + '/'
											  + cliente.data.split('-')[1] + '/'
											  + cliente.data.split('-')[0];
			
			tela_impressao = window.open('about:blank');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
		}
	});
}


//------------------------------------------------------------------------------------
function imprimirPizzas(cliente) {
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			imprimirTxt = '<h1 align="center">' + e.nomeEstabelecimento + '</h1>'
						+ '<h2 align="center"><b>' + cliente.envio + '</b></h2>'
						
						//numero da comanda e nome
						+ '<label>Comanda: ' + cliente.comanda + '</label><br>'
						+ '<label>Cliente: ' + cliente.nome + '</label><br>';
			
			mostrar(cliente);
			
			imprimirTxt += '<hr><b>Total de Produtos:</b> ' + Tpizzas;
			
			tela_impressao = window.open('about:blank');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
		}
	});
}


//-------------------------------------------------------------
function mostrar(cliente) {
	if(cliente.pizzas.length != 0) {
		imprimirTxt += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(pizza of cliente.pizzas){
			imprimirTxt += '<tr>'
						 +	'<td align="center">' + pizza.borda + '</td>'
						 +	'<td align="center">' + pizza.sabor + '</td>'
						 +	'<td align="center">' + pizza.obs + '</td>'
						 +	'<td align="center">' + pizza.qtd + '</td>'
						 +  '<td align="center">R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		imprimirTxt += '</table>';
	}

	if(cliente.produtos.length != 0) {
		imprimirTxt += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of cliente.produtos){
			imprimirTxt += '<tr>'
						 +	'<td align="center">' + produto.sabor + '</td>'
						 +	'<td align="center">' + produto.obs + '</td>'
						 +	'<td align="center">' + produto.qtd + '</td>'
						 +  '<td align="center">R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		imprimirTxt += '</table>';
	}
}

//-------------------------------------------------------------------------
function mostrarImpressao(pizzas, produtos) {
	
	linhaHtml = '';
	if(pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(pizza of pizzas){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizza.borda + '</td>'
						 +	'<td align="center">' + pizza.sabor + '</td>'
						 +	'<td align="center">' + pizza.obs + '</td>'
						 +	'<td align="center">' + pizza.qtd + '</td>'
						 +  '<td align="center">R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	if(produtos.length != 0) {
		linhaHtml += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of produtos){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + produto.sabor + '</td>'
						 +	'<td align="center">' + produto.obs + '</td>'
						 +	'<td align="center">' + produto.qtd + '</td>'
						 +  '<td align="center">R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}