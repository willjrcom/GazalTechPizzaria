var produtos = [], pizzas = [], mesa = {};
var linhaHtml = '';
var  preco, qtd, obs, custo;
var total = 0, tPizzas = 0, tPedido = 0;
var borda, bordaPreco, bordaCusto; 

//quantidade pizzas
var qtdPizzas = '<label>Quantidade: <span id="qtdInput">1</span></label><br>'
			+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
				+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
				    + '<button type="button" onclick="qtdProduto(0.5)" class="btn btn-link">0.5</button>'
				    + '<button type="button" onclick="qtdProduto(1)" class="btn btn-link">1</button>'
				    + '<button type="button" onclick="qtdProduto(2)" class="btn btn-link">2</button>'
				    + '<button type="button" onclick="qtdProduto(3)" class="btn btn-link">3</button>'
				    + '<button type="button" onclick="qtdProduto(4)" class="btn btn-link">4</button>'
				    + '<button type="button" onclick="qtdProduto(5)" class="btn btn-link">5</button>'
			  + '</div>'
			+ '</div>'
			
			+ '<label>Observação:</label>'
			+ '<input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" />';
	
	
//quantidade produtos
var qtdProdutos = '<label>Quantidade: <span id="qtdInput">1</span></label><br>'
			+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
				+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
				    + '<button type="button" onclick="qtdProduto(1)" class="btn btn-link">1</button>'
				    + '<button type="button" onclick="qtdProduto(2)" class="btn btn-link">2</button>'
				    + '<button type="button" onclick="qtdProduto(3)" class="btn btn-link">3</button>'
				    + '<button type="button" onclick="qtdProduto(4)" class="btn btn-link">4</button>'
				    + '<button type="button" onclick="qtdProduto(5)" class="btn btn-link">5</button>'
			  + '</div>'
			+ '</div>'
			
			+ '<label>Observação:</label>'
			+ '<input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" />';
//----------------------------------------------------------------
function mostrarOpcao(opcao) {
	
	$.ajax({
		url: '/novoPedidoTablet/escolher/' + opcao,
		type: 'PUT'
	}).done(function(e){
		linhaHtml = '<h4>'+ opcao +'</h4><hr>';
		
		for(produto of e) {
			linhaHtml += '<div class="blog-card">'
						+ '<div class="meta"><div class="photo" style="background-image: url(/img/mexicana.jpg)"></div></div>'
				  		+ '<div class="description">'
						+ '<h1>' + produto.nomeProduto +'</h1>';
						
						if(produto.descricao != '') {
							linhaHtml += '<p>' + produto.descricao + '</p>';
						}
						linhaHtml += '<p>R$ ' + parseFloat(produto.preco).toFixed(2) + '</p>'
									+ '<p class="read-more">'
								+ '<button class="btn" value="' + produto.id + '" onclick="adicionar()">+</button>'
							+ '</p>'
						+ '</div>'
					+ '</div>';
		}
		
		$("#cardapio").html(linhaHtml);
	}).fail(function(){
		$.alert({
			type: 'red',
			title: 'Sem sinal!',
			content: 'Conecte a internet ou chame o atendente.',
			buttons: {
				confirm: {
					text: 'Voltar',
					btnClass: 'btn-red',
				}
			}
		});
	});
}

mostrarOpcao('TODOS');


//------------------------------------------------------------------------------------------------------------------------
function adicionar() {
	
	//zerar valores de borda
	BordaPreco = 0;
	BordaCusto = 0;
	Borda = '';
	
	//resetar valor anterior
	Qtd = 1;
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	$.ajax({
		url: '/novoPedido/addProduto/' + idProduto,
		type: 'PUT'
	})
	.done(function(e){
		
		Sabor = e.nomeProduto;
		Preco = e.preco;
		Custo = parseFloat(e.custo);
		Setor = e.setor;
		Descricao = e.descricao;
		
		//pizza
		if(Setor == 'PIZZA') {
			
			//buscar borda recheada
			$.ajax({
				url: '/novoPedido/bordas',
				type: 'PUT'
			}).done(function(e){
				
				//buscar bordas
				var bordas = '';
				for(var k = 0; k<e.length; k++) {
					bordas += '<option value="' + e[k].id + '">' + e[k].nomeProduto + '</option>';
				}
				
				var bordasHtml = '<label>Borda Recheada:</label>'
								+ '<select class="form-control" name="borda" id="borda">'
									+ '<option value="0"></option>'
									+ bordas
								+ '</select><br>';
			
				$.confirm({
					type: 'blue',
					title: Setor + ': ' + Sabor,
					content: bordasHtml + qtdPizzas,
				    closeIcon: true,
					buttons: {
						confirm: {
							text: 'adicionar',
							btnClass: 'btn-success',
							keys: ['enter'],
							action: function(){
					
								console.log(Qtd);
								Obs = $("#obs").val();
								
								//multiplica o preco da pizza
								Preco *= Qtd;
								
								//adiciona o valor da borda
								bordaId = parseFloat($("#borda").val());
								
								//se for escolhido uma borda
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
										
										$("#meuCarrinho").text(tPizzas);
										$("#item").text((tPizzas == 1) ? ' Item' : ' Itens');
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

									$("#meuCarrinho").text(tPizzas);
									$("#item").text((tPizzas == 1) ? ' Item' : ' Itens');
								}

							}
						}
					}
				});
			}).fail(function(){
				$.alert("Nenhuma borda cadastrada ou encontrada!")
			});
			
		//outros produtos do cardapio
		}else {
			$.confirm({
				type: 'blue',
				title: Setor + ': ' + Sabor,
				content: qtdProdutos,
			    closeIcon: true,
				buttons: {
					confirm: {
						text: 'adicionar',
						btnClass: 'btn-success',
						keys: ['enter'],
						action: function(){
				
							Obs = $("#obs").val();
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

							$("#meuCarrinho").text(tPizzas);
							$("#item").text((tPizzas == 1) ? ' Item' : ' Itens');
						}
					}
				}
			});
		}
	});//final do ajax principal
};


//---------------------------------------------------------------
function qtdProduto(qtd) {
	$("#qtdInput").text(qtd);
	Qtd = qtd;
}


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {

	console.table(produtos);
	var carrinho = '';
	if(pizzas.length != 0) {
		carrinho += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pizzas.length; i++){
			carrinho += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + '</td>'
						 +	'<td align="center">' + pizzas[i].sabor + '</td>'
						 +	'<td align="center">' + pizzas[i].obs + '</td>'
						 +	'<td align="center">' + pizzas[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + parseFloat(pizzas[i].preco).toFixed(2) + '</td>'
					 +  '</tr>';
		}
		carrinho += '</table>';
	}

	if(produtos.length != 0) {
		carrinho += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<produtos.length; i++){
			carrinho += '<tr>'
						 +	'<td align="center">' + produtos[i].sabor + '</td>'
						 +	'<td align="center">' + produtos[i].obs + '</td>'
						 +	'<td align="center">' + produtos[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + parseFloat(produtos[i].preco).toFixed(2) + '</td>'
					 +  '</tr>';
		}
		carrinho += '</table>';
	}
	
	if(pizzas.length == 0 && produtos.length == 0) {
		$.confirm({
			type: 'blue',
			title: 'Carrinho vazio',
			content: 'Seu carrinho está vazio<br>Adicione produtos nele!',
		    closeIcon: true,
			buttons: {
				confirm: {
					text: 'Voltar',
					btnClass: 'btn-success',
				}
			}
		});
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		$.confirm({
			type: 'blue',
			title: 'Erro de valores',
			content: 'Apenas valores inteiros!',
		    closeIcon: true,
			buttons: {
				confirm: {
					text: 'Voltar',
					btnClass: 'btn-success',
				}
			}
		});
	}else {
		$.confirm({
			type: 'blue',
			title: 'Meu Carrinho',
			content: carrinho,
		    closeIcon: true,
		    columnClass: 'col-md-12',
			buttons: {
				confirm: {
					text: 'Confirmar',
					btnClass: 'btn-success',
					action: function(){
						$.ajax({
							url: '/novoPedido/data',
							type: 'PUT'
						}).done(function(event){
							mesa.data = event.dia;
							mesa.envio = 'MESA';
							mesa.horaPedido = new Date();
							mesa.nomePedido = 'Mesa';
							mesa.pagamento = 'Não';
							mesa.pizzas = JSON.stringify(pizzas);
							mesa.produtos = JSON.stringify(produtos);
							mesa.status = 'COZINHA';
							mesa.total = tPedido;
							
							console.log(mesa);
							//salvar pedido
							$.ajax({
								url: "/novoPedido/salvarPedido",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(mesa)
							}).done(function(e){
								   
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Pedido enviado!',
									buttons: {
								        confirm: {
								            text: 'Obrigado!',
								            btnClass: 'btn-green',
								            keys: ['enter','esc'],
								            action: function(){
												window.location.href = "/menuTablet";
											}
										}
									}
								});
								
							}).fail(function(e){
								$.alert("Erro, Pedido não enviado!");
							});
						});
					}
				}
			}
		});
	}
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
		//mostrarProdutos();
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
		//mostrarProdutos();
	}	
});