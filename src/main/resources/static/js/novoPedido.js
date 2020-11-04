
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
var totalUnico; // valor fixo mesmo depois do sistema atualizar o pedido antigo com o novo
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
var imprimirTxt = '';
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

if(celular % 2 == 1 || celular % 2 == 0) {
	$("#numeroCliente").val(celular);
}
if(typeof url_atual == "undefined") {
	$("#enviarPedido").addClass("pula");
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$0,00');
}else {
	
	urlNumero = "/novoPedido/editarPedido/" + url_atual.toString();
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	}).done(function(e){

		$("#atualizarPedido").addClass("pula");
		$("#divBuscar").hide();
		$("#enviarPedido").hide();
		$("#mostrarProdutos").show();
		$("#atualizarPedido").show();
		$(".mostrarPedidos").show();
		$("#mostrar").show(); 
		$("#cancelar").html('<span class="oi oi-ban"></span> Cancelar alteração');
		cliente = e
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);
		
		//mostrar entrega
		if(e.envio == 'ENTREGA') {
			$("#mostrar").show('slow'); //esconder tabelas
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeCliente").text(cliente.nomePedido);
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + parseFloat(cliente.taxa).toFixed(2));
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
		}
		for(var i = 0; i<cliente.produtos.length; i++) {
			tPizzas += cliente.produtos[i].qtd;
		}
		pizzas = cliente.pizzas;
		produtos = cliente.produtos;
		tPedido = cliente.total;
		
		mostrarProdutos();
		$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + cliente.total.toFixed(2));
		
	}).fail(function(){
		$.alert("falhou!");
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
				$("#mostrar").show('slow'); //mostrar tabelas
				
				$("#nomeCliente").text(e.nome).css('background-color', '#D3D3D3');
				cliente.nomePedido = e.nome;
				
				$("#celCliente").text(e.celular);
				cliente.celular = e.celular;
				
				$("#enderecoCliente").text(e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro);
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
				
				$("#taxaCliente").text('Taxa: R$ ' + parseFloat(e.endereco.taxa).toFixed(2));
				cliente.taxa = e.endereco.taxa;

				$("#divBuscar").hide('slow');
				$("#mostrarProdutos").show('slow');

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
		$("#nomeBalcao").html('<h2>Cliente: ' + $("#numeroCliente").val() + '</h2>');
		cliente.nomePedido = $("#numeroCliente").val();
		
		$("#idCliente").text('0');
		$("#divBuscar").hide('slow');
		$("#mostrar").hide("slow");
		$("#mostrarProdutos").show('slow');
		$("#divEnvio").html('<label>Envio:</label>'
					+'<select name="opcao" class="form-control" id="envioCliente">'
						+'<option value="BALCAO">Balcão</option>'
						+'<option value="MESA">Mesa</option>'
						+'<option value="DRIVE">Drive-Thru</option>'
					+'</select>');
		cliente.envio = "BALCAO";
		campo[2].focus();//focar no campo de buscar pedido
	}
});


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		
		$.ajax({
			url: "/novoPedido/nomeProduto/" + produto,
			type: 'PUT'
		}).done(function(e){
			console.log(e);
			$("#nomeProduto").val('');
			buscaProdutos = [];
			
			if(e[0].id == -1) {
				$.confirm({
					type: 'blue',
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
			}else if(e.length == 1) {
				enviarProduto(e[0].id);
			}else{
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
	BordaPreco = 0;
	BordaCusto = 0;
	Borda = '';
	
	//resetar valor anterior
	Qtd = 1;
	
	if(idUnico == null) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
	}else {
		var idProduto = idUnico;
		
	}
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
										$(".mostrarPedidos").show('slow');
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
									$(".mostrarPedidos").show('slow');
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
							$(".mostrarPedidos").show('slow');
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
	

	if($("#nomeCliente").text() == "" && $("#nomeBalcao").text() == ""){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum cliente adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum produto adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
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
		cliente.envio = $("#envioCliente").val();
		
		if(cliente.nomePedido.indexOf("Mesa") > -1) {//se existir a palavra mesa
			cliente.envio = "MESA";
		}else if(cliente.envio == '' || cliente.envio == null) {//se for nulo o campo
			cliente.envio = $("#envioCliente").val();
		}
		mostrarTabela(pizzas, produtos);

		if(cliente.envio == 'ENTREGA') {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
						+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><b>Taxa:</b> R$ ' + parseFloat(cliente.taxa).toFixed(2)
						+ '<br><b>Total:</b> R$ ' + (parseFloat(tPedido) + parseFloat(cliente.taxa)).toFixed(2)
						+'<br><br><b>Receber:</b>'
						 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + (parseFloat(tPedido) + parseFloat(cliente.taxa)).toFixed(2) + '"/>';
		}else {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
					+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
					+'<br><br><b>Receber:</b>'
					+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '"/>';
		}
		
		linhaHtml += '<br><label>O pedido foi pago:</label>'
					+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
						+'<option value="Não">Não</option>'
						+'<option value="Sim">Sim</option>'
					+ '</select>'
					+ '<br><b>Deseja enviar o pedido?</b>';
	
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nomePedido,
		    content: linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						var troco = this.$content.find('#troco').val();
						cliente.pagamento = this.$content.find("#pagamentoCliente").val();

						troco = troco.toString().replace(",",".");
						troco = parseFloat(troco);

						cliente.status = "PRONTO";
						
						//buscar data do sistema
						$.ajax({
							url: '/novoPedido/data',
							type: 'PUT'
						}).done(function(e){

							cliente.data = e.dia;
							cliente.total = tPedido;
							cliente.produtos = JSON.stringify(produtos);
							cliente.pizzas = JSON.stringify(pizzas);
							cliente.horaPedido = new Date;

							if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
								cliente.total += parseFloat(cliente.taxa);
							}
							
							if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
								troco = cliente.total;
							}

							cliente.troco = parseFloat(troco);
							
							//----------------------------------------------------------------------
							var temp = {};
							temp.nome = cliente.nomePedido;
							temp.pizzas = cliente.pizzas;
							temp.produtos = cliente.produtos;
							temp.status = "COZINHA";
							temp.data = cliente.data;
							
							//salvar pedido
							$.ajax({
								url: "/novoPedidoTablet/atualizar",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(cliente)
							}).done(function(e){

								if(e.id != null) {
									cliente.totalUnico = cliente.total; //valor antigo nao se altera
									cliente.id = e.id;
									cliente.total += e.total;
									cliente.comanda = e.comanda;
									cliente.horaPedido = e.horaPedido;
									cliente.data = e.data;
									
									//converter pedido atual para objeto
									cliente.pizzas = JSON.parse(cliente.pizzas);
									cliente.produtos = JSON.parse(cliente.produtos);
									
									//converter pedido antigo para objeto
									e.pizzas = JSON.parse(e.pizzas);
									e.produtos = JSON.parse(e.produtos);
									
									for(pizza of e.pizzas) {
										//concatenar pizzas
										cliente.pizzas.unshift(pizza);
									}
									
									for(produto of e.produtos) {
										//concatenar produtos
										cliente.produtos.unshift(produto);
									}
									
									//converter pedido atual em JSON
									cliente.pizzas = JSON.stringify(cliente.pizzas);
									cliente.produtos = JSON.stringify(cliente.produtos);
								}
								
								//salvar pedido
								$.ajax({
									url: "/novoPedido/salvarPedido",
									type: "PUT",
									dataType : 'json',
									contentType: "application/json",
									data: JSON.stringify(cliente)
									
								}).done(function(e){
									
									if(parseFloat(e) == 200) {
										
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
									}else if(parseFloat(e) == 404) {
										$.alert({
											type: 'red',
											title: 'Atenção!',
											content: 'É necessário alterar a chave de validação na empresa<br>Entre em contato com a Gazal Tech!',
											buttons: {
										        confirm: {
										            text: 'Obrigado!',
										            btnClass: 'btn-danger'
												}
											}
										});
									}
									
									
								}).fail(function(e){
									$.alert("Pedido não enviado!");
									if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
										cliente.troco -= parseFloat(cliente.taxa);
									}
								});
							});
						}).fail(function(){
							$.alert({
								type: 'red',
								title: 'Erro...',
								content: 'É necessário escolher o dia de acesso no menu inicial!',
								buttons:{
									confirm:{
										text: 'Menu',
										btnClass: 'btn-success',
										keys: ['enter', 'esc'],
										action: function(){
											window.location.href= "/menu";
										}
									}
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
	
	if($("#nomeCliente").text() == "" && $("#nomeBalcao").text() == ""){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum cliente adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum produto adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){	
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
		
		if($('#envioCliente').is(':visible'))
		{
			cliente.envio = $("#envioCliente").val();
		}
		mostrarTabela(pizzas, produtos);

		linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
				+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
				+'<br><br><b>Receber:</b>'
				+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '"/>'
				
				+'<br><label>O pedido foi pago:</label>'
				+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
					+'<option value="Não">Não</option>'
					+'<option value="Sim">Sim</option>'
				+'</select>'
				+ '<br><b>Deseja enviar o pedido?</b>';
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nomePedido,
		    content: linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						var troco = this.$content.find('#troco').val();
						cliente.pagamento = this.$content.find("#pagamentoCliente").val();
						
						troco = troco.toString().replace(",",".");
						
						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							$("#troco").val(tPedido);
						}
						
						cliente.total = parseFloat(tPedido);
						cliente.produtos = JSON.stringify(produtos);
						cliente.pizzas = JSON.stringify(pizzas);

						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							troco = cliente.total;
						}

						cliente.troco = parseFloat(troco);
						
						//apagar pedido temporario relacionado
						$.ajax({
							url: "/novoPedido/apagarTemp/" + cliente.comanda,
							type: 'PUT'
						});
						
						$.ajax({
							url: "/novoPedido/atualizarPedido/" + url_atual,
							type: "PUT",
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							imprimir();
							
							var temp = {};
							temp.nome = cliente.nomePedido;
							temp.pizzas = cliente.pizzas;
							temp.produtos = cliente.produtos;
							temp.status = "COZINHA";
							temp.envio = cliente.envio;
							temp.data = cliente.data;
							
							//salvar pedido no temp
							$.ajax({
								url: '/novoPedido/salvarTemp',
								type: 'PUT',
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(temp)
							});
							
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: 'Pedido atualizado!',
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
							$.alert("Pedido não enviado!");
							if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
								cliente.troco -= ParseFloat(cliente.taxa);
							}
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
		
		for(var i=0; i<pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + '</td>'
						 +	'<td align="center">' + pizzas[i].sabor + '</td>'
						 +	'<td align="center">' + pizzas[i].obs + '</td>'
						 +	'<td align="center">' + pizzas[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
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
		
		for(var i=0; i<produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + produtos[i].sabor + '</td>'
						 +	'<td align="center">' + produtos[i].obs + '</td>'
						 +	'<td align="center">' + produtos[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}


//-------------------------------------------------------------------------
function mostrarImpressao(pizzas, produtos) {
	
	linhaHtml = '';
	if(pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Sabor ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Obs ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Qtd ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Preço ---- </h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].sabor + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].obs + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].qtd + ' ---- </td>'
						 +  '<td align="center">R$ ' + pizzas[i].preco.toFixed(2) + ' ---- </td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	if(produtos.length != 0) {
		linhaHtml += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Obs ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Qtd ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Preço ---- </h5></th>'
					+ '</tr>';
		
		for(var i=0; i<produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + produtos[i].sabor + ' ---- </td>'
						 +	'<td align="center">' + produtos[i].obs + ' ---- </td>'
						 +	'<td align="center">' + produtos[i].qtd + ' ---- </td>'
						 +  '<td align="center">R$ ' + produtos[i].preco.toFixed(2) + ' ---- </td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}

//----------------------------------------------------------------------------
function imprimir() {
	
	//salvar hora atual
	var data = new Date();
	console.log(data);
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
		if(e.length != 0 && e.imprimir == 1) {
			
			imprimirTxt = '<html><h2 align="center">' + e.nomeEmpresa + '</h2>'//nome da empresa
						+ '<h3 align="center"><b>' + cliente.envio + '</b></h3>'//forma de envio
						+ '<p>' + e.texto1 + '</p>'//texto1 gerado pela empresa
						
						//numero da comanda e nome
						+ '<label>Comanda: ' + cliente.comanda + '</label><br>'
						+ '<label>Cliente: ' + cliente.nomePedido + '</label><br>';
			
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
				imprimirTxt += '<label>Taxa de entrega: ' + parseFloat(cliente.taxa).toFixed(2) + '</label><br>'
				 			+ '<label>Total com taxa: R$ ' + parseFloat(cliente.totalUnico).toFixed(2) + '</label><br>';
				
			}else {//total sem taxa
				imprimirTxt += '<label>Total: R$ ' + parseFloat(cliente.totalUnico).toFixed(2) + '</label><br>'
			}

			//total a levar de troco
			imprimirTxt += '<label>Levar: R$ ' + (cliente.troco - parseFloat(cliente.totalUnico)).toFixed(2) + '</label><br>'
						
			//texto2 e promocao
			imprimirTxt += '<p>' + e.texto2 + '</p><hr><br>' 
						+ '<label>Promoção</label><br>' + '<p>' + e.promocao + '</p>';
						
				
			//salvar hora
			imprimirTxt += '<p>Hora: ' + hora + ':' + minuto + ':' + segundo + '<br>'
						+ 'Data: ' + dia + '/' + mes + '/' + ano + '</p>'
						+ '</html>'; 
			
			tela_impressao = window.open('about:pedido');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
		}
	});
}


//-------------------------------------------------------
function recarregar() {
	window.location.href= "/novoPedido";
}