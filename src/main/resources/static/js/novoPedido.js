
//var cliente
//------------------------------------------------------------------------------------------------------------------------
var cliente = {};
var produtos = [];
var buscaProdutos = [];
var op;
var string = '';

//var pedido
//------------------------------------------------------------------------------------------------------------------------
var Sabor;
var Preco;
var Qtd ;
var Borda;
var Obs;
var Custo;

var tPizzas = 0;
var tPedido = 0;
var linhaHtml = "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var produtosSelect = $("#novoProduto").html();
var buttonRemove = '<a class="removerProduto"><button type="button" class="btn btn-danger">Remover</button></a>';
var pedidoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';

var url_atual = window.location.href;

url_atual = url_atual.split("/")[5]; //pega o id de edicao do pedido

if(typeof url_atual == "undefined") {
	console.log("nao existe");
	$("#Ttotal").html('Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$0,00 &nbsp;&nbsp;&nbsp;');
}else {
	console.log(url_atual);
	
	urlNumero = "/novoPedido/editarPedido/" + url_atual.toString();
	console.log(urlNumero);
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	}).done(function(e){
		
		console.log(e);

		$("#divBuscar").hide();
		$("#enviarPedido").hide();
		$("#mostrarProdutos").show();
		$("#atualizarPedido").show();
		$(".mostrarPedidos").show();
		$("#mostrar").show();
		
		//mostrar entrega
		if(e.envio == 'ENTREGA' || e.envio == 'IFOOD') {
			$("#mostrar").show('slow'); //esconder tabelas

			cliente.id = e.id;
			cliente.nomePedido = e.nomePedido;
			cliente.celular = e.celular;
			cliente.endereco = e.endereco;
			cliente.envio = e.envio;
			cliente.total = e.total;
			cliente.troco = e.troco;
			cliente.pagamento =  e.pagamento;
			cliente.produtos = JSON.parse(e.produtos);
			cliente.taxa = e.taxa;
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeCliente").text(cliente.nomePedido).css('background-color', '#D3D3D3');
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa + ',00');
		}
		
		//mostrar entrega
		if(e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {

			$("#mostrar").hide();
			
			cliente.id = e.id;
			cliente.nomePedido = e.nomePedido;
			cliente.envio = e.envio;
			cliente.total = e.total;
			cliente.troco = e.troco;
			cliente.pagamento =  e.pagamento;
			cliente.produtos = JSON.parse(e.produtos);
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeBalcao").html('<h2>Cliente: ' + cliente.nomePedido + '</h2>');
		}
		
		console.log(cliente);
		for(var i = 0; i<cliente.produtos.length; i++) {
			tPizzas += cliente.produtos[i].qtd;
			produtos.unshift({
				'sabor' : cliente.produtos[i].sabor,
				'qtd' : cliente.produtos[i].qtd,
				'borda' : cliente.produtos[i].borda,
				'preco' : cliente.produtos[i].preco,
				'obs' : cliente.produtos[i].obs
			});
		}
		tPedido = cliente.total;
		
		mostrarProdutos();
		$("#Ttotal").html('Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + cliente.total.toFixed(2) +' &nbsp;&nbsp;&nbsp;');
		
	}).fail(function(){
		$.alert("falhou!");
	});	
}



//------------------------------------------------------------------------------------------------------------------------
$('#numeroCliente').on('blur', function(){

	if($.trim($("#numeroCliente").val()) % 2 == 1 || $.trim($("#numeroCliente").val()) % 2 == 0){
		var numero = $("#numeroCliente").val();
		urlNumero = "/novoPedido/numeroCliente/" + numero.toString();
		
		$.ajax({
			url: urlNumero,
			type: 'PUT'
		}).done(function(e){

			if(e.length != 0) {
				$("#mostrar").show('slow'); //mostrar tabelas
				
				console.log(e);
					
				$("#idCliente").text(e.id);
				cliente.codigoPedido = e.id;
				
				$("#nomeCliente").text(e.nome).css('background-color', '#D3D3D3');
				cliente.nomePedido = e.nome;
				
				$("#celCliente").text(e.celular);
				cliente.celular = e.celular;
				
				$("#enderecoCliente").text(e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro);
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
				
				$("#taxaCliente").text('Taxa: R$ ' + e.endereco.taxa + ',00');
				cliente.taxa = e.endereco.taxa;

				$("#divBuscar").hide('slow');
				$("#mostrarProdutos").show('slow');
			}else {
				window.location.href = "/cadastroCliente";
			}
		}).fail(function(){
			console.log("Cliente não encontrado!");
		});
		
	}else if(typeof $("#numeroCliente").val() == 'string'){
		$("#nomeBalcao").html('<h2>Cliente: ' + $("#numeroCliente").val() + '</h2>');
		cliente.nomePedido = $("#numeroCliente").val();
		cliente.envio = 1;
		
		$("#idCliente").text('0');
		$("#divBuscar").hide('slow');
		$("#mostrar").hide("slow");
		$("#mostrarProdutos").show('slow');
		$("#divEnvio").hide();
	}
});


//------------------------------------------------------------------------------------------------------------------------
$('#nomeProduto').on('blur', function(){

	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		urlProduto = "/novoPedido/nomeProduto/" + produto.toString();
		
		$.ajax({
			url: urlProduto,
			type: 'PUT'
		}).done(function(e){
			$("#nomeProduto").val('');
			buscaProdutos = [];
			
			for(var i = 0; i < e.length; i++){
				buscaProdutos.push({
					'id': e[i].id,
					'nomeProduto': e[i].nomeProduto,
					'preco': e[i].preco
				});
			};
	
			$("#listaProdutos").show('slow');
			$("#todosProdutos").html(" ");
			
			linhaHtml = '<table class="w100">'
							+'<thead>'
								+'<tr>'
								+'<th class="col-md-1"><h5>Borda Recheada</h5></th>'
								+'<th class="col-md-1"><h5>Qtd</h5></th>'
								+'<th class="col-md-1"><h5>Observação</h5></th>'
								+'</tr>'
							+'</thead>'
		
							+'<tbody>'
								+'<tr>'
									+'<td>'
										+'<select class="form-control" name="borda" id="borda">'
											+'<option th:each="borda : ${TipoBorda}" th:value="${borda}"'
											+'th:text="${borda.descricao}"></option>'
										+'</select>'
									+'</td>'
									
									+'<td><input type="text" class="form-control" name="qtd" id="qtd" placeholder="qtd" value="1"/></td>'
									+'<td><input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" /><br></td>'
								+'</tr>'
							+'</tbody>'
							
						+'<tfoot>';
							+'<tr><th colspan="3"><h4>Lista de Produtos</h4></th></tr>';
						
			for(var i=0; i<buscaProdutos.length; i++){
				linhaHtml += '<tr>'
								+ '<td class="col-md-1">' + buscaProdutos[i].nomeProduto + '</td>'
								+ '<td class="col-md-1">R$ ' + buscaProdutos[i].preco + '</td>'
								+ '<td class="col-md-1">'
									+ '<div>'
										+ '<button type="submit" style="background-color: white; border: none" onclick="enviarProduto()"'
										+ 'title="Adicionar" class="enviarProduto" value="' + buscaProdutos[i].id + '">'
											+ '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+ '<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>'
											+ '<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>'
											+ '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'
											+ '</svg>'
										+ '</button>'
									+ '</div>'
								+ '</td>';
							+ '</tr>';
					
			}
			linhaHtml += '</tfoot></table>';
			
			if(buscaProdutos.length != 0){
				$.confirm({
					title: '<h4>Lista de Produtos</h4>',
					content: linhaHtml
				});
			}else {
				$.alert("Nenhum produto encontrado!");
			}
			
			if(buscaProdutos.length == 0){
				$("#todosProdutos").html('<tr>'
											+ '<td colspan="6" th:if="${#lists.isEmpty(produtos)}">Nenhum produto encontrado!</td>'
											+ '</tr>');
			}
		});
	}
});



//------------------------------------------------------------------------------------------------------------------------
$('#buscarProduto').click(function(){

	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		urlProduto = "/novoPedido/nomeProduto/" + produto.toString();
		
		$.ajax({
			url: urlProduto,
			type: 'PUT'
		}).done(function(e){
			
			buscaProdutos = [];
			$("#nomeProduto").val('');
			for(var i = 0; i < e.length; i++){
				buscaProdutos.push({
					'id': e[i].id,
					'nomeProduto': e[i].nomeProduto,
					'preco': e[i].preco
				});
			};
	
			$("#listaProdutos").show('slow');
			$("#todosProdutos").html("");
			
			linhaHtml = '<table class="w100">'
							+'<thead>'
								+'<tr>'
								+'<th class="col-md-1"><h5>Borda Recheada</h5></th>'
								+'<th class="col-md-1"><h5>Qtd</h5></th>'
								+'<th class="col-md-1"><h5>Observação</h5></th>'
								+'</tr>'
							+'</thead>'
		
							+'<tbody>'
								+'<tr>'
									+'<td>'
										+'<select class="form-control" name="borda" id="borda">'
											+'<option th:each="borda : ${TipoBorda}" th:value="${borda}"'
											+'th:text="${borda.descricao}"></option>'
										+'</select>'
									+'</td>'
									
									+'<td><input type="text" class="form-control" name="qtd" id="qtd" placeholder="qtd" value="1"/></td>'
									+'<td><input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" /><br></td>'
								+'</tr>'
							+'</tbody>'
							
						+'<tfoot>';
							+'<tr><th colspan="3"><h4>Lista de Produtos</h4></th></tr>';
						
			for(var i=0; i<buscaProdutos.length; i++){
				linhaHtml += '<tr>'
								+ '<td class="col-md-1">' + buscaProdutos[i].nomeProduto + '</td>'
								+ '<td class="col-md-1">R$ ' + buscaProdutos[i].preco + '</td>'
								+ '<td class="col-md-1">'
									+ '<div>'
										+ '<button type="submit" style="background-color: white; border: none" onclick="enviarProduto()"'
										+ 'title="Adicionar" class="enviarProduto" value="' + buscaProdutos[i].id + '">'
											+ '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+ '<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>'
											+ '<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>'
											+ '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'
											+ '</svg>'
										+ '</button>'
									+ '</div>'
								+ '</td>';
							+ '</tr>';
					
			}
			linhaHtml += '</tfoot></table>';
			
			if(buscaProdutos.length != 0){
				$.confirm({
					title: '<h4>Lista de Produtos</h4>',
					content: linhaHtml
				});
			}else {
				$.alert("Nenhum produto encontrado!");
			}
			
			if(buscaProdutos.length == 0){
				$("#todosProdutos").html('<tr>'
											+ '<td colspan="6" th:if="${#lists.isEmpty(produtos)}">Nenhum produto encontrado!</td>'
											+ '</tr>');
			}
		});
	}
});


//------------------------------------------------------------------------------------------------------------------------

function enviarProduto() {

	Qtd = parseFloat($("#qtd").val());
	
	if(isNaN(Qtd) == false){
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		var urlReceber = "/novoPedido/addProduto/" + idProduto.toString();
		
		$.ajax({
			url: urlReceber,
			type: 'PUT'
		})
		.done(function(e){
			
			$(".mostrarPedidos").show('slow');
			
			Sabor = e.nomeProduto;
			Preco = e.preco;
			Qtd = parseFloat($("#qtd").val());
			Borda = $("#borda").val();
			Obs = $("#obs").val();
			Custo = e.custo;
			Preco *= Qtd;
			tPizzas += Qtd;
			tPedido += Preco;
			
			produtos.unshift({
				'sabor' : Sabor,
				'qtd': Qtd,
				'borda': Borda,
				'obs': Obs,
				'preco': Preco,
				'custo': Custo
			});
			
			$("#novoProduto").html("");
			mostrarProdutos();
			
		});
	}else{
		Qtd = $("qtd").val("1");
		alert("Valor incorreto na quantidade");
	}
};


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {
	linhaHtml = "";
	for(var i=0; i<produtos.length; i++){
		linhaHtml += '<tr>'
					 +	'<td>' + produtos[i].borda + '</td>'
					 +	'<td>' + produtos[i].sabor + '</td>'
					 +	'<td>' + produtos[i].obs + '</td>'
					 +	'<td>' + produtos[i].qtd + '</td>'
					 +	'<td>R$ ' + produtos[i].preco.toFixed(2) + '</td>'
				 + '</tr>'
				 + linhaCinza;
	}
	
	$("#novoProduto").html(linhaHtml);
	$("#Ttotal").html('Total de Pizzas:  ' + tPizzas + '<br><br>' + 'Total do Pedido:  R$' + tPedido + '&nbsp;&nbsp;&nbsp;');
}

//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(e){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	produtos.shift();
	
	$("#novoProduto").html("");
	
	if(produtos.length == 0) {
		$("#novoProduto").append(pedidoVazio);
		$(".mostrarPedidos").hide('slow');	
	} else {
		mostrarProdutos();
	}
	$("#Ttotal").html('Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + tPedido + '&nbsp;&nbsp;&nbsp;');	
});


//------------------------------------------------------------------------------------------------------------------------
$("#enviarPedido").click(function() {
	console.log(cliente);
	
	if(Object.keys(produtos).length === 0 && $("#idCliente").text() == ""){
		alert("Nenhum produto adicionado!\nNenhum cliente adicionado!");
	}else if($("#idCliente").text() == ""){
		alert("Nenhum cliente adicionado!");
	}else if(Object.keys(produtos).length === 0){
		alert("Nenhum produto adicionado!");	
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		alert("Apenas valores inteiros!");	
	}else{
		
		cliente.envio = $("#envioCliente").val();
		
		if(produtos.length != 0) {
			linhaHtml = '<table>'
						+ '<tr>'
							+ '<td>Borda</td>'
							+ '<td>Sabor</td>'
							+ '<td>Obs</td>'
							+ '<td>Qtd</td>'
							+ '<td>Preço</td>'
						+ '</tr>';
			
			for(var i=0; i<produtos.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + produtos[i].borda + '</td>'
							 +	'<td>' + produtos[i].sabor + '</td>'
							 +	'<td>' + produtos[i].obs + '</td>'
							 +	'<td>' + produtos[i].qtd + '</td>'
							 +  '<td>R$ ' + produtos[i].preco + '</td>'
						 +  '</tr>';
			}
			linhaHtml += '</table>'
						 + 'Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + tPedido + '<br>Troco:'
						 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '" required />'
						 + '<br>Deseja enviar o pedido?';
		}
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + cliente.nomePedido.split(' ')[0],
		    content: 'Produtos escolhidos' + linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						var troco = this.$content.find('#troco').val();
						console.log(troco);
						
						if(troco % 2 != 0 && troco % 2 != 1) {
							$("#troco").val('0');
						}
						
						cliente.troco = parseFloat(troco);
						cliente.total = tPedido;
						cliente.produtos = JSON.stringify(produtos);
						cliente.status = "COZINHA";
						console.log(cliente);
						
						$.ajax({
							url: "/novoPedido/salvarPedido",
							type: "PUT",
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							$.alert({
								type: 'green',
							    typeAnimated: true,
								title: 'Sucesso!',
								content: 'Pedido enviado!',
								buttons: {
							        confirm: {
							            text: 'Ok',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
									window.location.href = "/novoPedido";
										}
									}
								}
							});
							
						}).fail(function(e){
							$.alert("Pedido não enviado!");
						});
					}
		        },
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
});



//------------------------------------------------------------------------------------------------------------------------
$("#atualizarPedido").click(function() {
	console.log(cliente);
	
	if(Object.keys(produtos).length === 0 && $("#idCliente").text() == ""){
		alert("Nenhum produto adicionado!\nNenhum cliente adicionado!");
	}else if($("#idCliente").text() == ""){
		alert("Nenhum cliente adicionado!");
	}else if(Object.keys(produtos).length === 0){
		alert("Nenhum produto adicionado!");	
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		alert("Apenas valores inteiros!");	
	}else{
		
		if(produtos.length != 0) {
			linhaHtml = '<table>'
					    + '<tr>'
							+ '<td>Borda</td>'
							+ '<td>Sabor</td>'
							+ '<td>Obs</td>'
							+ '<td>Qtd</td>'
							+ '<td>Preço</td>'
						'</tr>';
			
			for(var i=0; i<produtos.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + produtos[i].borda + '</td>'
							 +	'<td>' + produtos[i].sabor + '</td>'
							 + 	'<td>' + produtos[i].obs + '</td>'
							 + 	'<td>' + produtos[i].qtd + '</td>'
							 + 	'<td>R$ ' + produtos[i].preco + '</td>'
						 +  '</tr>';
			}
			linhaHtml += '</table>'
						 + 'Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + tPedido + '<br>Troco:'
						 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '" required />'
						 + '<br>Deseja enviar o pedido?';
		}
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + cliente.nomePedido.split(' ')[0],
		    content: 'Produtos escolhidos' + linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						var troco = this.$content.find('#troco').val();
						if(troco % 2 != 0 && troco % 2 != 1) {
							$("#troco").val('0');
						}
						
						cliente.troco = parseFloat(troco);
						cliente.total = tPedido;
						cliente.produtos = JSON.stringify(produtos);
						cliente.status = "COZINHA";
						console.log(cliente);
						
						$.ajax({
							url: "/novoPedido/atualizarPedido/" + url_atual,
							type: "PUT",
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							$.alert({
								type: 'green',
							    typeAnimated: true,
								title: 'Sucesso!',
								content: 'Pedido atualizado!',
								buttons: {
							        confirm: {
							            text: 'Ok',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
									window.location.href = "/novoPedido";
										}
									}
								}
							});
							
						}).fail(function(e){
							$.alert("Pedido não enviado!");
						});
					}
		        },
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
});