
//var contador
//------------------------------------------------------------------------------------------------------------------------
var contPizza = {};
var contProduto = [];

//var cliente
//------------------------------------------------------------------------------------------------------------------------
var cliente = {};
var pizzas = [];
var produtos = [];
var buscaProdutos = [];
var op;
var string = '';

//var pedido
//------------------------------------------------------------------------------------------------------------------------
var Sabor;
var Preco;
var Qtd ;
var Descricao;
var Borda;
var BordaPreco;
var BordaCusto;
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
	$("#enviarPedido").addClass("pula");
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$0,00');
}else {
	console.log(url_atual);
	
	urlNumero = "/novoPedido/editarPedido/" + url_atual.toString();
	console.log(urlNumero);
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	}).done(function(e){
		
		console.log(e);

		$("#atualizarPedido").addClass("pula");
		$("#divBuscar").hide();
		$("#enviarPedido").hide();
		$("#mostrarProdutos").show();
		$("#atualizarPedido").show();
		$(".mostrarPedidos").show();
		$("#mostrar").show(); 
		$("#cancelar").html('<span class="oi oi-ban"></span> Cancelar alteração');

		cliente.id = e.id;
		cliente.nomePedido = e.nomePedido;
		cliente.envio = e.envio;
		cliente.total = e.total;
		cliente.troco = e.troco;
		cliente.pagamento =  e.pagamento;
		cliente.status = e.status;
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);
		cliente.dataPedido = e.dataPedido;
		
		//mostrar entrega
		if(e.envio == 'ENTREGA' || e.envio == 'IFOOD') {
			$("#mostrar").show('slow'); //esconder tabelas

			cliente.celular = e.celular;
			cliente.endereco = e.endereco;
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
			$("#divEnvio").hide();
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeBalcao").html('<h2>Cliente: ' + cliente.nomePedido + '</h2>');
		}
		
		for(var i = 0; i<cliente.pizzas.length; i++) {
			tPizzas += cliente.pizzas[i].qtd;
			pizzas.unshift({
				'sabor' : cliente.pizzas[i].sabor,
				'qtd' : cliente.pizzas[i].qtd,
				'borda' : cliente.pizzas[i].borda,
				'obs' : cliente.pizzas[i].obs,
				'preco' : cliente.pizzas[i].preco,
				'custo' : cliente.pizzas[i].custo,
				'setor' : cliente.pizzas[i].setor,
				'descricao' : cliente.pizzas[i].descricao
			});
		}
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
		cliente.envio = "BALCAO";
		console.log(cliente);
	}
});


//------------------------------------------------------------------------------------------------------------------------
/*$('#nomeProduto').on('blur', function(){
	buscarProdutos();
});*/

$('#buscarProduto').click(function(){
	buscarProdutos();
});

//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		urlProduto = "/novoPedido/nomeProduto/" + produto.toString();
		
		$.ajax({
			url: urlProduto,
			type: 'PUT'
		}).done(function(e){
			
			console.log(e);
			$("#nomeProduto").val('');
			buscaProdutos = [];
			
			for(var i = 0; i < e.length; i++){
				buscaProdutos.push({
					'id': e[i].id,
					'nomeProduto': e[i].nomeProduto,
					'preco': e[i].preco,
					'setor': e[i].setor
				});
			};
	
			$("#listaProdutos").show('slow');
			$("#todosProdutos").html(" ");
			
			contPizza = 0;
			contProduto = 0;
			
			for(var i=0; i<buscaProdutos.length; i++){
				if(buscaProdutos[i].setor == 'PIZZA') {
					contPizza++;
				}else {
					contProduto++;
				}
			}
			linhaHtml = '';
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
			$.ajax({
				url: '/novoPedido/bordas',
				type: 'PUT'
			}).done(function(e){
				console.log(e);
				
				//buscar bordas
				var bordas = '';
				for(var k = 0; k<e.length; k++) {
					bordas += '<option value="' + e[k].id + '">' + e[k].nomeProduto + '</option>';
				}
				
				//abrir modal de produtos encontrados
				linhaHtml = '<div class="row">';
				
				if(contPizza != 0) {
					if(contProduto == 0) {
						linhaHtml += '<div class="col-md-12">';
					}else {
						linhaHtml += '<div class="col-md-6">';
					}
					linhaHtml +='<table class="w100">'
										+'<thead>'
											+ '<tr>'
												+ '<th class="col-md-1"><h5>Borda Recheada</h5></th>'
												+ '<th class="col-md-1"><h5>Qtd</h5></th>'
												+ '<th class="col-md-1"><h5>Observação</h5></th>'
											+'</tr>'
										+'</thead>'
					
										+ '<tbody>'
											+ '<tr>'
												+ '<td>'
													+ '<select class="form-control" name="borda" id="borda">'
														+ '<option value="0"></option>'
														+ bordas
													+ '</select>'
												+'</td>'
												+ '<td><input type="text" class="form-control preco" name="qtd" id="qtd" placeholder="qtd" value="1"/></td>'
												+ '<td><input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" /><br></td>'
											+'</tr>'
										+'</tbody>'
										
										+'<tfoot>';
					
					for(var i=0; i<buscaProdutos.length; i++){
						if(buscaProdutos[i].setor == 'PIZZA') {
							linhaHtml += '<tr>'
											+ '<td>' + buscaProdutos[i].nomeProduto + '</td>'
											+ '<td>R$ ' + buscaProdutos[i].preco + '</td>'
											+ '<td>'
												+ '<div>'
													+ '<button onclick="enviarProduto()"'
													+ 'title="Adicionar" class="enviarProduto botao" value="' + buscaProdutos[i].id + '">'
														+ '<span class="oi oi-plus"></span>'
													+ '</button>'
												+ '</div>'
											+ '</td>'
										+ '</tr>';
						}
					}	
					linhaHtml +='</tfoot>'
							+'</table>'
						+'</div>';
				}
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
				if(contProduto != 0) {
					if(contPizza == 0) {
						linhaHtml += '<div class="col-md-12">';
					}else {
						linhaHtml += '<div class="col-md-6">';
					}
					linhaHtml += '<table class="w100">'
									+'<thead>'
										+ '<tr>'
											+ '<th class="col-md-1"><h5>Qtd</h5></th>'
											+ '<th class="col-md-1"><h5>Observação</h5></th>'
										+'</tr>'
									+'</thead>'
									
									+'<tbody>'
										+'<tr>'
											+ '<td><input type="text" class="form-control preco" name="qtd1" id="qtd1" placeholder="qtd" value="1"/></td>'
											+'<td><input type="text" class="form-control" name="obs1" id="obs1" placeholder="Observação" /><br></td>'
										+'</tr>'
									+'</tbody>'
									+'<tfoot>';
				
					for(var i=0; i<buscaProdutos.length; i++){
						if(buscaProdutos[i].setor != 'PIZZA' && buscaProdutos[i].setor != 'BORDA') {
							linhaHtml += '<tr>'
											+ '<td>' + buscaProdutos[i].nomeProduto + '</td>'
											+ '<td>R$ ' + buscaProdutos[i].preco + '</td>'
											+ '<td>'
												+ '<div>'
													+ '<button onclick="enviarProduto()"'
													+ 'title="Adicionar" class="enviarProduto botao" value="' + buscaProdutos[i].id + '">'
														+ '<span class="oi oi-plus"></span>'
													+ '</button>'
												+ '</div>'
											+ '</td>'
										+ '</tr>';
					}
				}
				linhaHtml +='</tfoot>'
						+'</table>'
					+'</div>'
					+'<div>';
				
				}
				
				if(contPizza != 0 && contProduto != 0){
					$.confirm({
						type: 'blue',
					    columnClass: 'col-md-12',
						title: '<h4>Lista de Produtos</h4>',
						content: linhaHtml,
						buttons: {
					        confirm: {
					            text: 'Voltar',
					            btnClass: 'btn-green',
					            keys: ['enter','esc'],
							}
						}
					});
				}else if((contPizza != 0 && contProduto == 0) || (contPizza == 0 && contProduto != 0)){
					$.confirm({
						type: 'blue',
						title: '<h4>Lista de Produtos</h4>',
						content: linhaHtml,
						buttons: {
					        confirm: {
					            text: 'Voltar',
					            btnClass: 'btn-green',
					            keys: ['enter','esc'],
							}
						}
					});
				}else{
					$.alert("Nenhum produto encontrado!");
				}
				
				if(buscaProdutos.length == 0){
					$("#todosProdutos").html('<tr>'
												+ '<td colspan="6">Nenhum produto encontrado!</td>'
												+ '</tr>');
				}
			}).fail(function(){
				$.alert("Nenhuma borda cadastrada ou encontrada!")
			})
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------

function enviarProduto() {
	
	//zerar valores de borda
	BordaPreco = 0;
	BordaCusto = 0;
	Borda = '';
	
	
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
		Custo = parseFloat(e.custo);
		Setor = e.setor;
		Descricao = e.descricao;
		
		//pizza
		if(e.setor == 'PIZZA') {
			
			Qtd = parseFloat($("#qtd").val());
			Obs = $("#obs").val();
			
			//multiplica o preco da pizza
			Preco *= Qtd;
			
			//adiciona o valor da borda
			bordaId = parseFloat($("#borda").val());
			
			//com borda recheada
			if(bordaId != 0) {
				
				//buscar borda por id
				$.ajax({
					url: "/novoPedido/buscarBorda/" + bordaId,
					type: 'PUT'
				}).done(function(event){
					
					Borda = event.nomeProduto;
					BordaPreco = parseFloat(event.preco);
					BordaCusto = parseFloat(event.custo);
					Preco += (BordaPreco * Qtd);
					Custo += parseFloat(BordaCusto * Qtd);
					
					tPizzas += Qtd;
					tPedido += Preco;
					
					pizzas.unshift({
						'sabor' : Sabor,
						'qtd': Qtd,
						'borda': Borda,
						'obs': Obs,
						'preco': Preco,
						'custo': parseFloat(Custo),
						'setor': Setor,
						'descricao': Descricao,
					});

					mostrarProdutos();
				});
				
			//sem borda
			}else {
				tPizzas += Qtd;
				tPedido += Preco;
				
				pizzas.unshift({
					'sabor' : Sabor,
					'qtd': Qtd,
					'borda': Borda,
					'obs': Obs,
					'preco': Preco,
					'custo': parseFloat(Custo),
					'setor': Setor,
					'descricao': Descricao,
				});
			}
			
		//outros produtos
		}else {
			Qtd = parseFloat($("#qtd1").val());
			Obs = $("#obs1").val();
			Preco *= Qtd;
		
		
		tPizzas += Qtd;
		tPedido += Preco;

			produtos.unshift({
				'sabor' : Sabor,
				'qtd': Qtd,
				'obs': Obs,
				'preco': Preco,
				'custo': parseFloat(Custo),
				'setor': Setor
			});
		}
		mostrarProdutos();
	});//final do ajax
};


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {

	$("#novoProduto").html("");
	$("#novoPizza").html("");
	
	for(var i=0; i<pizzas.length; i++){
		linhaHtml = '<tr>'
					 +	'<td>' + pizzas[i].borda + '</td>'
					 +	'<td>' + pizzas[i].sabor + '</td>'
					 +	'<td>' + pizzas[i].obs + '</td>'
					 +	'<td>' + pizzas[i].qtd + '</td>'
					 +	'<td>R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
				 + '</tr>'
				 + linhaCinza;
		$("#novoPizza").append(linhaHtml);
	}
	for(var i=0; i<produtos.length; i++){
		linhaHtml = '<tr>'
				 +	'<td>' + produtos[i].sabor + '</td>'
				 +	'<td>' + produtos[i].obs + '</td>'
				 +	'<td>' + produtos[i].qtd + '</td>'
				 +	'<td>R$ ' + produtos[i].preco.toFixed(2) + '</td>'
			 + '</tr>'
			 + linhaCinza;
		$("#novoProduto").append(linhaHtml);
	}
	
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><hr>Total do Pedido: R$ ' + tPedido.toFixed(2));
}

//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(e){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	produtos.shift();
	
	if(produtos.length == 0) {
		$("#novoProduto").append(pedidoVazio);
	}
	
	if(pizzas.length == 0 && produtos.length == 0) {
		$(".mostrarPedidos").hide('slow');
	} else {
		mostrarProdutos();
	}
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function(e){
	
	tPizzas -= pizzas[0].qtd;
	tPedido -= pizzas[0].preco;
	
	pizzas.shift();
	
	if(pizzas.length == 0) {
		$("#novoPizza").append(pedidoVazio);
	} 
	
	if(pizzas.length == 0 && produtos.length == 0) {
		$(".mostrarPedidos").hide('slow');	
	}else {
		mostrarProdutos();
	}
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$("#enviarPedido").click(function() {
	
	if((Object.keys(produtos).length === 0 && $("#idCliente").text() == "") || (Object.keys(pizzas).length === 0 && $("#idCliente").text() == "")){
		alert("Nenhum produto adicionado!\nNenhum cliente adicionado!");
	}else if($("#idCliente").text() == ""){
		alert("Nenhum cliente adicionado!");
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		alert("Nenhum produto adicionado!");	
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		alert("Apenas valores inteiros!");	
	}else{
		
		if(cliente.envio == '' || cliente.envio == null) {
			cliente.envio = $("#envioCliente").val();
		}
		cliente.pagamento = $("#pagamentoCliente").val();
		linhaHtml = '<table>';
		if(pizzas.length != 0) {
			linhaHtml += '<tr>'
							+ '<th class="col-md-1"><h5>Borda</h5></th>'
							+ '<th class="col-md-1"><h5>Sabor</h5></th>'
							+ '<th class="col-md-1"><h5>Obs</h5></th>'
							+ '<th class="col-md-1"><h5>Qtd</h5></th>'
							+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '</tr>';
			
			for(var i=0; i<pizzas.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + pizzas[i].borda + '</td>'
							 +	'<td>' + pizzas[i].sabor + '</td>'
							 +	'<td>' + pizzas[i].obs + '</td>'
							 +	'<td>' + pizzas[i].qtd + '</td>'
							 +  '<td>R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
						 +  '</tr>';
			}
		}

		linhaHtml += '</table>';
		linhaHtml += '<table>';
		if(produtos.length != 0) {
			linhaHtml += '<tr>'
							+ '<th class="col-md-1"><h5>Sabor</h5></th>'
							+ '<th class="col-md-1"><h5>Obs</h5></th>'
							+ '<th class="col-md-1"><h5>Qtd</h5></th>'
							+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '</tr>';
			
			for(var i=0; i<produtos.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + produtos[i].sabor + '</td>'
							 +	'<td>' + produtos[i].obs + '</td>'
							 +	'<td>' + produtos[i].qtd + '</td>'
							 +  '<td>R$ ' + produtos[i].preco.toFixed(2) + '</td>'
						 +  '</tr>';
			}
		}
		linhaHtml += '</table>';
		
		cliente.taxa = parseFloat(cliente.taxa);
		
		if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
						+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><b>Taxa:</b> R$ ' + cliente.taxa.toFixed(2)
						+ '<br><b>Total:</b> R$ ' + (tPedido + cliente.taxa).toFixed(2)
						+'<br><br><b>Troco:</b>'
						 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + (tPedido + cliente.taxa) + '"/>'
						 + '<br><b>Deseja enviar o pedido?</b>';
		}else {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
					+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
					+'<br><br><b>Troco:</b>'
					+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '"/>'
					+ '<br><b>Deseja enviar o pedido?</b>';
		}
		
		linhaHtml +=
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + cliente.nomePedido,
		    content: linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						var troco = this.$content.find('#troco').val();
						
						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							$("#troco").val(tPedido);
						}

						if(pizzas.length != 0) {
							cliente.status = "COZINHA";
						}else {
							cliente.status = "PRONTO";
						}
						
						//buscar data do sistema
						$.ajax({
							url: '/novoPedido/data',
							type: 'PUT'
						}).done(function(e){
							cliente.data = e.dia;
						
						
							cliente.troco = parseFloat(troco);
							cliente.total = tPedido;
							cliente.produtos = JSON.stringify(produtos);
							cliente.pizzas = JSON.stringify(pizzas);
							cliente.horaPedido = new Date;

							if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
								cliente.total += cliente.taxa;
							}
							
							//salvar pedido
							$.ajax({
								url: "/novoPedido/salvarPedido",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(cliente)
								
							}).done(function(e){
								tela_impressao = window.open('about:blank');
								   tela_impressao.document.write(linhaHtml);
								   tela_impressao.window.print();
								   tela_impressao.window.close();
								   
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
								if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
									cliente.troco -= cliente.taxa;
								}
							});
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
	
	if((Object.keys(produtos).length === 0 && $("#idCliente").text() == "") || (Object.keys(pizzas).length === 0 && $("#idCliente").text() == "")){
		alert("Nenhum produto adicionado!\nNenhum cliente adicionado!");
	}else if($("#idCliente").text() == ""){
		alert("Nenhum cliente adicionado!");
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		alert("Nenhum produto adicionado!");	
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		alert("Apenas valores inteiros!");	
	}else{

		console.log('pizzas: ' + pizzas.length);
		
		if($('#envioCliente').is(':visible'))
		{
			cliente.envio = $("#envioCliente").val();
			console.log("foi");
		}
		
		linhaHtml = '<table>';
		if(pizzas.length != 0) {
			linhaHtml += '<tr>'
							+ '<th>Borda</th>'
							+ '<th>Sabor</th>'
							+ '<th>Obs</th>'
							+ '<th>Qtd</th>'
							+ '<th>Preço</th>'
						+ '</tr>';
			
			for(var i=0; i<pizzas.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + pizzas[i].borda + '</td>'
							 +	'<td>' + pizzas[i].sabor + '</td>'
							 +	'<td>' + pizzas[i].obs + '</td>'
							 +	'<td>' + pizzas[i].qtd + '</td>'
							 +  '<td>R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
						 +  '</tr>';
			}
		}
		linhaHtml += '</table>';
		linhaHtml += '<table>';
		if(produtos.length != 0) {
			linhaHtml += '<tr>'
							+ '<th>Sabor</th>'
							+ '<th>Obs</th>'
							+ '<th>Qtd</th>'
							+ '<th>Preço</th>'
						+ '</tr>';
			
			for(var i=0; i<produtos.length; i++){
				linhaHtml += '<tr>'
							 +	'<td>' + produtos[i].sabor + '</td>'
							 +	'<td>' + produtos[i].obs + '</td>'
							 +	'<td>' + produtos[i].qtd + '</td>'
							 +  '<td>R$ ' + produtos[i].preco.toFixed(2) + '</td>'
						 +  '</tr>';
			}
		}
		linhaHtml += '</table>'
				 + '<hr>Total de Produtos: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + tPedido.toFixed(2) + '<br>Troco:'
				 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '" required />'
				 + '<br><label>Enviar para cozinha? &nbsp;</label>'
				 + '<select name="filtro" id="cozinha">'
				 	+ '<option value="sim">Sim</option>'
					+ '<option value="nao">Não</option>'
				+'</select>'
				 + '<br>Deseja enviar o pedido?';
		
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + cliente.nomePedido.split(' ')[0],
		    content: 'Produtos escolhidos: ' + linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						var troco = this.$content.find('#troco').val();
						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							$("#troco").val(tPedido);
						}
						
						var cozinha = this.$content.find('#cozinha').val();
						if(cozinha == 'sim') {
							cliente.status = 'COZINHA';
						}
						
						cliente.troco = parseFloat(troco);
						cliente.total = tPedido;
						cliente.produtos = JSON.stringify(produtos);
						cliente.pizzas = JSON.stringify(pizzas);
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
							            text: 'Continuar',
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