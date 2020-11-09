//var cliente
//------------------------------------------------------------------------------------------------------------------------
var cliente = {};
var pizzas = [], produtos = [], buscaProdutos = [];
var op;
var string = '';
var totalUnico; // valor fixo mesmo depois do sistema atualizar o pedido antigo com o novo
//var pedido
//------------------------------------------------------------------------------------------------------------------------
var Sabor, Preco, Qtd, Descricao, Custo, Obs;
var Borda, BordaPreco, BordaCusto;
var tPizzas = 0, tPedido = 0;

var linhaHtml = "", imprimirTxt = '';
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var buttonRemove = '<a class="removerProduto"><button type="button" class="btn btn-danger">Remover</button></a>';
var pedidoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';
var url_atual = window.location.href;

//quantidade
var qtdHtml = '<label>Quantidade: <span id="qtdInput">1</span></label><br>'
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

var celular = url_atual.split("/")[4];//pega o id de novo cadastro
celular = parseInt(celular);
url_atual = url_atual.split("/")[5]; //pega o id de edicao do pedido

if(celular % 2 == 1 || celular % 2 == 0) $("#numeroCliente").val(celular);

if(typeof url_atual == "undefined") {
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$0,00');
}else {
	
	urlNumero = "/novoPedido/editarPedido/" + url_atual.toString();
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	}).done(function(e){
		
		$("#divBuscarCliente").hide();
		$("#divBuscarProdutos").show();
		$("#BotaoEnviarPedido").html('<span class="oi oi-cart"></span> Atualizar pedido');
		$(".divListaGeral").show();
		$("#mostrarDadosCliente").show(); 
		$("#cancelar").html('<span class="oi oi-ban"></span> Cancelar alteração');

		op = "ATUALIZAR";
		cliente = e;
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);
		cliente.taxa = parseFloat(cliente.taxa);
		console.log(cliente);
		//mostrar entrega
		if(e.envio == 'ENTREGA') {
			$("#mostrarDadosCliente").show('slow'); //esconder tabelas
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeCliente").text(cliente.nome);
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
		}
		
		//mostrar entrega
		if(e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {

			$("#mostrarDadosCliente").hide();
			$("#divEnvio").hide();
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeBalcao").html('<h2>Cliente: ' + cliente.nome + '</h2>');
		}
		
		for(pizza of cliente.pizzas) tPizzas += pizza.qtd;
	
		for(produto of cliente.produtos) tPizzas += produto.qtd;
		
		pizzas = cliente.pizzas;
		produtos = cliente.produtos;
		tPedido = cliente.total;
		
		mostrarProdutos();
		$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + cliente.total.toFixed(2));
		
	}).fail(function(){
		$.alert("Erro, cliente não encontrado!");
	});	
}


//------------------------------------------------------------------------------------------------------------------------
$('#buscarCliente').on('click', function(){

	if($("#numeroCliente").val() == ''){
		//voltar campo para digitar numero
		var campo = $(".pula");
		indice = $(".pula").index(this);
		campo[indice - 1].focus();
		
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'O campo está vazio, digite um telefone ou um nome!',
			buttons:{
				confirm:{
					text: 'Ok',
					btnClass: "btn-success",
					keys: ['esc', 'enter']
				}
			}
		});
		
	}else if($("#numeroCliente").val() % 2 == 1 || $("#numeroCliente").val() % 2 == 0){
		var numero = $("#numeroCliente").val();

		$.ajax({
			url: "/novoPedido/numeroCliente/" + numero,
			type: 'PUT'
		}).done(function(e){

			if(e.length != 0) {
				cliente.nome = e.nome;
				cliente.celular = e.celular;
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
				cliente.taxa = parseFloat(e.endereco.taxa);
				
				$("#mostrarDadosCliente").show('slow'); //mostrar dados do cliente
				$("#nomeCliente").text(cliente.nome).css('background-color', '#D3D3D3');
				$("#celCliente").text(cliente.celular);
				$("#enderecoCliente").text(cliente.endereco);
				$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
				$("#divBuscarCliente").hide('slow');
				$("#divBuscarProdutos").show('slow');

				$("#divEnvio").html('<label>Envio:</label>'
							+'<select name="opcao" class="form-control" id="envioCliente">'
								+'<option value="ENTREGA">Entrega</option>'
								+'<option value="BALCAO">Balcão</option>'
								+'<option value="MESA">Mesa</option>'
								+'<option value="DRIVE">Drive-Thru</option>'
							+'</select>');
				
				$(".pula")[2].focus();//focar no campo de buscar pedido
			}else {
				window.location.href = "/cadastroCliente/" + numero;
			}
		});
	
	}else if(typeof $("#numeroCliente").val() == 'string'){
		cliente.nome = $("#numeroCliente").val();
		cliente.envio = "BALCAO";
		
		$("#divBuscarCliente").hide('slow');
		$("#mostrarDadosCliente").hide("slow");
		$("#divBuscarProdutos").show('slow');
		$("#nomeBalcao").html('<h2>Cliente: ' + $("#numeroCliente").val() + '</h2>');
		$("#divEnvio").html('<label>Envio:</label>'
					+'<select name="opcao" class="form-control" id="envioCliente">'
						+'<option value="BALCAO">Balcão</option>'
						+'<option value="MESA">Mesa</option>'
						+'<option value="DRIVE">Drive-Thru</option>'
					+'</select>');
		$(".pula")[2].focus();//focar no campo de buscar pedido
	}
});


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		$("#nomeProduto").val('');
		buscaProdutos = [];
		
		$.ajax({
			url: "/novoPedido/nomeProduto/" + produto,
			type: 'PUT'
		}).done(function(e){
			
			if(e.length == 0) {//se nao encontrar nenhum produto
				$.confirm({
					type: 'red',
					title: 'OPS...',
					content: '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>',
				    closeIcon: true,
					buttons: {
				        confirm: {
							isHidden: true,
				            text: 'Voltar',
				            btnClass: 'btn-green',
				            keys: ['enter','esc'],
						}
					}
				});
			}else if(e[0].id == -1) {//se o produto estiver indisponivel
				$.confirm({
					type: 'red',
					title: '<h4 align="center">Produto: ' + e[0].nomeProduto + '</h4>',
					content: '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>',
				    closeIcon: true,
					buttons: {
				        confirm: {
							isHidden: true,
				            text: 'Voltar',
				            btnClass: 'btn-green',
				            keys: ['enter','esc'],
						}
					}
				});
			}else if(e.length == 1) {//se existir apenas um resultado vai direto ao produto
				enviarProduto(e[0].id);
			}else{//senao vai para lista de produtos
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
				
				
				linhaHtml = '<table class="h-100">'
							+ '<thead>'
								+ '<tr>'
									+ '<th class="col-md-1"><h5>Produto</h5></th>'
									+ '<th class="col-md-1"><h5>Preço</h5></th>'
									+ '<th class="col-md-1"><h5>Adicionar</h5></th>'
								+ '</tr>'
							+ '</thead>'
							+ '<tbody>';
				
	
				if(buscaProdutos.length != 0) {
					//abrir modal de produtos encontrados
					for(produto of buscaProdutos){
						linhaHtml += '<tr>'
									+ '<td align="center">' + produto.nomeProduto + '</td>'
									+ '<td align="center">R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
									+ '<td align="center">'
										+ '<div>'
											+ '<button onclick="enviarProduto()"'
											+ 'title="Adicionar" onclick="enviarProduto()" class="botao" value="' + produto.id + '">'
												+ '<span class="oi oi-plus"></span>'
											+ '</button>'
										+ '</div>'
									+ '</td>'
								+ '</tr>';
					}
						
				}else {
					linhaHtml += '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>';
				}
				linhaHtml += '</tbody>'
							+ '<table>';
				
				$.confirm({
					type: 'blue',
					title: '<h4 align="center">Lista de Produtos</h4>',
					content: linhaHtml,
				    closeIcon: true,
					buttons: {
				        confirm: {
							isHidden: true,
				            text: 'Voltar',
				            btnClass: 'btn-green',
				            keys: ['enter','esc'],
						}
					}
				});
			}
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto(idUnico) {
	
	//zerar valores de borda
	BordaPreco = 0, BordaCusto = 0, Borda = '';
	
	//resetar valor anterior
	Qtd = 1;
	
	if(idUnico == null) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
	}else var idProduto = idUnico;	
	
	$.ajax({
		url: '/novoPedido/addProduto/' + idProduto,
		type: 'PUT'
	}).done(function(e){
		
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
			}).done(function(todasBordas){
				
				//buscar bordas
				var bordas = '';
				for(borda of todasBordas) bordas += '<option value="' + borda.id + '">' + borda.nomeProduto + '</option>';
				
				var bordasHtml = '<label>Borda Recheada:</label>'
								+ '<select class="form-control" name="borda" id="borda">'
									+ '<option value="0"></option>'
									+ bordas
								+ '</select><br>';
			
				$.confirm({
					type: 'blue',
					title: Setor + ': ' + Sabor,
					content: bordasHtml + qtdHtml,
				    closeIcon: true,
					buttons: {
						confirm: {
							text: 'adicionar',
							btnClass: 'btn-success pula',
							keys: ['enter'],
							action: function(){
					
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
										
										//setar valores da borda escolhida
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
										$("#divListaGeral").show('slow');
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

									mostrarProdutos();
									$(".divListaGeral").show('slow');
								}

							}
						}
					}
				});
			}).fail(function(){
				$.alert("Erro, Nenhuma borda cadastrada ou encontrada!")
			});
			
		//outros produtos do cardapio
		}else {
			$.confirm({
				type: 'blue',
				title: Setor + ': ' + Sabor,
				content: qtdHtml,
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
								'setor': Setor,
								'descricao': Descricao,
							});

							mostrarProdutos();
							$(".divListaGeral").show('slow');
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


//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(e){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	produtos.shift();
	
	if(produtos.length == 0) $("#listaProduto").html(pedidoVazio);
	
	if(pizzas.length == 0 && produtos.length == 0) $(".divListaGeral").hide('slow');
	
	else mostrarProdutos();

	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function(e){
	
	tPizzas -= pizzas[0].qtd;
	tPedido -= pizzas[0].preco;
	
	pizzas.shift();
	
	if(pizzas.length == 0) $("#listaPizza").html(pedidoVazio);
	
	if(pizzas.length == 0 && produtos.length == 0) $(".divListaGeral").hide('slow');	
	
	else mostrarProdutos();

	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$("#BotaoEnviarPedido").click(function() {
	if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Apenas valores inteiros!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});	
	}else{
		if(cliente.nome.indexOf("Mesa") > -1) {//se existir a palavra Mesa
			cliente.envio = "MESA";
		}else if(cliente.nome.indexOf("mesa") > -1){//se existir a palavra mesa
			cliente.envio = "MESA";
		}else if((cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 1)){
			cliente.envio = "MESA";
		}else if((cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 1)){
			cliente.envio = "MESA";
		}else if(cliente.envio == '' || cliente.envio == null) {//se for nulo o campo
			cliente.envio = $("#envioCliente").val();
		}
		
		mostrarTabela(pizzas, produtos);
		
		linhaHtml += '<hr>';
		
		if(cliente.envio == 'ENTREGA') {
			linhaHtml += '<b>Tº Produtos:</b> ' + tPizzas 
						+ '<br><b>Total sem Taxa:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><b>Taxa de Entrega:</b> R$ ' + cliente.taxa.toFixed(2)
						+ '<br><b>Total do Pedido:</b> R$ ' + (parseFloat(tPedido) + cliente.taxa).toFixed(2)
						+ '<br><div class="row"><div class="col-md-6">'
						+ '<b>Receber:</b>'
						+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' 
						+ (parseFloat(tPedido) + cliente.taxa).toFixed(2) + '"/></div>';
		}else {
			linhaHtml += '<div class="col-md-4">'
						+ '<b>Tº Produtos:</b> ' + tPizzas 
						+ '<br><b>Total do Pedido:</b> R$ ' + tPedido.toFixed(2) +
						+ '<br><div class="row"><div class="col-md-6">'
						+ '<b>Receber:</b>'
						+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' 
						+ tPedido.toFixed(2) + '"/></div>';
		}
		
		linhaHtml += '<div class="col-md-6">'
					+'<label>O pedido foi pago:</label>'
					+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
						+'<option value="Não">Não</option>'
						+'<option value="Sim">Sim</option>'
					+ '</select></div>'
					+ '<label>Observação do Pedido:</label>'
					+ '<textarea type="area" id="obs" name="obs" class="form-control" placeholder="Observação do pedido" />'
					+ '<br><br><hr><b class="fRight">Deseja enviar o pedido?</b>';

		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nome,
		    content: linhaHtml,
		    closeIcon: true,
		    columnClass: 'col-md-12',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						var troco = this.$content.find('#troco').val();
						var obs = this.$content.find('#obs').val();
						if(obs != '') cliente.obs = obs;
						cliente.pagamento = this.$content.find("#pagamentoCliente").val();

						troco = parseFloat(troco.toString().replace(",","."));
						
						//buscar data do sistema
						$.ajax({
							url: '/novoPedido/data',
							type: 'PUT'
						}).done(function(e){

							var temp = {};
							
							temp.data = cliente.data = e.dia;
							temp.pizzas = cliente.pizzas = JSON.stringify(pizzas);
							temp.nome = cliente.nome;
							temp.envio = cliente.envio;
							temp.status = "COZINHA";
							cliente.status = "PRONTO";
							cliente.produtos = JSON.stringify(produtos);
							cliente.total = tPedido;
							cliente.horaPedido = hora + ':' + minuto + ':' + segundo;
							cliente.troco = parseFloat(troco);
							
							//salvar pedido
							$.ajax({
								url: "/novoPedidoTablet/atualizar",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(cliente)
							}).done(function(e){

								if(e.id != null && op != "ATUALIZAR") {
									cliente.id = e.id;
									cliente.total += e.total;
									cliente.troco += e.troco;
									cliente.comanda = e.comanda;
									cliente.horaPedido = e.horaPedido;
									cliente.data = e.data;
									
									if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) if(e.taxa == '' || e.taxa == null) troco = cliente.total + cliente.taxa;
									
									//converter pedido atual para objeto
									cliente.pizzas = JSON.parse(cliente.pizzas);
									cliente.produtos = JSON.parse(cliente.produtos);
									
									//converter pedido antigo para objeto
									e.pizzas = JSON.parse(e.pizzas);
									e.produtos = JSON.parse(e.produtos);

									//concatenar pizzas
									for(pizza of e.pizzas) cliente.pizzas.unshift(pizza);

											//concatenar produtos
									for(produto of e.produtos) cliente.produtos.unshift(produto);
									
									//converter pedido atual em JSON
									cliente.pizzas = JSON.stringify(cliente.pizzas);
									cliente.produtos = JSON.stringify(cliente.produtos);
								}else {
									//excluir temporarios para nao duplicar
									$.ajax({
										url: "/novoPedido/excluirPedidosTemp/" + cliente.id,
										type: 'PUT',
										data: cliente,
									});
								}
								
								//salvar pedido
								$.ajax({
									url: "/novoPedido/salvarPedido",
									type: "PUT",
									dataType : 'json',
									contentType: "application/json",
									data: JSON.stringify(cliente)
									
								}).done(function(e){
									
									cliente.comanda = e.comanda; //recebe numero do servidor
									console.log(cliente);
									//salvar pedido no temp
									$.ajax({
										url: '/novoPedido/salvarTemp',
										type: 'PUT',
										dataType : 'json',
										contentType: "application/json",
										data: JSON.stringify(temp)
									});
									
									imprimir();
									   
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
													window.location.href = "/novoPedido";
												}
											}
										}
									});
								}).fail(function(e){
									$.alert("Erro, Pedido não enviado!");
								});
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

//----------------------------------------------------------------------------
function mostrarTabela(pizzas, produtos) {
	
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


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {//todos

	$("#listaProduto").html("");
	$("#listaPizza").html("");
	
	for(pizza of pizzas){
		linhaHtml = '<tr>'
					 +	'<td>' + pizza.borda + '</td>'
					 +	'<td>' + pizza.sabor + '</td>'
					 +	'<td>' + pizza.obs + '</td>'
					 +	'<td>' + pizza.qtd + '</td>'
					 +	'<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
				 + '</tr>'
				 + linhaCinza;
		$("#listaPizza").append(linhaHtml);
	}
	for(produto of produtos){
		linhaHtml = '<tr>'
				 +	'<td>' + produto.sabor + '</td>'
				 +	'<td>' + produto.obs + '</td>'
				 +	'<td>' + produto.qtd + '</td>'
				 +	'<td>R$ ' + produto.preco.toFixed(2) + '</td>'
			 + '</tr>'
			 + linhaCinza;
		$("#listaProduto").append(linhaHtml);
	}
	
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><hr>Total do Pedido: R$ ' + tPedido.toFixed(2));
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


//----------------------------------------------------------------------------
function imprimir() {
    
    
    //buscar dados da empresa
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0 && e.imprimir == 1) {
			
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
			mostrarImpressao(pizzas, produtos);

			//salvar hora
			imprimirTxt += '<hr>' + linhaHtml + '<hr><br>';
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				imprimirTxt += '<label>Total sem taxa: R$ ' + cliente.total.toFixed(2) + '</label><br>';
							+ '<label>Taxa de entrega: R$ ' + cliente.taxa.toFixed(2) + '</label><br>'
				 			+ '<label>Total com taxa: R$ ' + (cliente.total + cliente.taxa).toFixed(2) + '</label><br>';
				
				//total sem taxa
			}else imprimirTxt += '<label>Total do Pedido: R$ ' + cliente.total.toFixed(2) + '</label><br>';

			//total a levar de troco
			imprimirTxt += '<label>Levar: R$ ' + (cliente.troco - cliente.total).toFixed(2) + '</label><br>';
			
			if(cliente.obs != '') imprimirTxt += '<label>Observação: ' + cliente.obs + '</label><br>';
						
			//texto2 e promocao
			imprimirTxt += '<p>Horário de funcionamento:<br>' + e.texto2 + '</p><hr><br>' 
						+ '<label>Promoção:</label><br>' + '<p>' + e.promocao + '</p>';
						
				
			//salvar hora
			imprimirTxt += '<p>Hora: ' + hora + ':' + minuto + ':' + segundo + '<br>'
						+ 'Data: ' + dia + '/' + mes + '/' + ano + '</p>'
						+ '</html>'; 
			
			tela_impressao = window.open('about:blank');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
			
			/*
			imprimirTxt = e.nomeEstabelecimento//nome da empresa
					+ '\n' + cliente.envio //forma de envio
					+ '\n' + e.texto1//texto1 gerado pela empresa
					
					//numero da comanda e nome
					+ '\n' + 'Comanda: ' + cliente.comanda
					+ '\n' + 'Cliente: ' + cliente.nome;
		
			//mostrar endereco do cliente
			if(cliente.envio == 'ENTREGA') {
				imprimirTxt += '\n' + 'Celular: ' + cliente.celular
							+ '\n' + 'Endereço: ' + cliente.endereco;
			}
			
	        //gerar tabela de produtos e pizzas
			mostrarImpressao(pizzas, produtos);
	
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				imprimirTxt += '\n' + 'Total sem taxa: R$ ' + cliente.total.toFixed(2)
							+ '\n' + 'Taxa de entrega: R$ ' + cliente.taxa.toFixed(2)
				 			+ '\n' + 'Total com taxa: R$ ' + (cliente.total + cliente.taxa).toFixed(2);
				
				//total sem taxa
			}else imprimirTxt += '\n' + 'Total do Pedido: R$ ' + cliente.total.toFixed(2);
	
			//total a levar de troco
			imprimirTxt += '\n' + 'Levar: R$ ' + (cliente.troco - cliente.total).toFixed(2);

			if(cliente.obs != '') imprimirTxt += '\n' + 'Observação: ' + cliente.obs;
						
			//texto2 e promocao
			imprimirTxt += '\n' + 'Horário de funcionamento: ' + e.texto2 
						+ '\n' + 'Promoção: ' + e.promocao;
						
				
			//salvar hora
			imprimirTxt += '\n' + 'Hora: ' + hora + ':' + minuto + ':' + segundo
						+ '\n' + 'Data: ' + dia + '/' + mes + '/' + ano;
			
			cliente.pizzas = imprimirTxt;
			
			$.ajax({
				url: "/novoPedido/imprimir",
				type: 'PUT',
				dataType : 'json',
				contentType: "application/json",
				data: JSON.stringify(cliente)
			});
			*/
		}
	});
}


//-------------------------------------------------------
function recarregar() {
	window.location.href= "/novoPedido";
}


//Método para pular campos teclando ENTER
$('.pula').on('keypress', function(e){
     var tecla = (e.keyCode?e.keyCode:e.which);

     if(tecla == 13){
         campo = $('.pula');
     indice = campo.index(this);
     
     if(campo[indice+1] != null){
     	if(indice == 3) proximo = campo[indice - 1];
     	else proximo = campo[indice + 1];
         proximo.focus();
         //console.log("indice: " + indice);
     }
 }
});


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