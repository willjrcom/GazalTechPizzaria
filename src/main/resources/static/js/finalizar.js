$("#filtro").selectmenu().addClass("overflow");
$("#filtroEnvio").selectmenu().addClass("overflow");
$(document).ready(() => $("#nomePagina").text("Finalizar pedidos"));
var pedidos = [];
var [funcionarios, top10Pizzas] = [[], []];
var pizzas = [];
var dado = {};
var linhaHtml = "";
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var [Tpedido, Tpizzas] = [0, 0];
var valorCupom;


if ($("#btnCadastrar").val() == 1) {
	$("#divCadastrar").show("slow");
	$("#divFiltro").hide("slow");
}


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");
$(document).ready(function() {
	$.ajax({
		url: "/u/finalizar/todosPedidos",
		type: 'GET'
	}).done(function(e) {
		pedidos = e;
		for (pedido of pedidos) {
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}

		mostrar(pedidos, "TODOS");
		carregarLoading("none");
	});
});


//--------------------------------------------------------------------------
function filtrar() {
	mostrar(pedidos, $("#filtroEnvio").val());
}


//----------------------------------------------------------------------------------------------------------
function mostrar(pedidos, filtro) {
	linhaHtml = "";
	for (pedido of pedidos) {
		if (filtro == pedido.envio || filtro == "TODOS") {
			linhaHtml += '<tr>'
				+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
				+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + mostrarTotalComTaxaOurServico(pedido, 10).toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">'
				+ (pedido.pago == 1
					? '<i style="color: green" class="fas fa-check-circle"></i>'
					: '<i style="color: red" class="fa fa-times-circle"></i>')
				+ '</td>'
				+ '<td class="text-center col-md-1">' + pedido.envio + '</td>'
				+ '<td class="text-center col-md-1">'
				+ '<a class="enviarPedido">'
				+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
				+ 'value="' + pedido.id + '"><i class="fas fa-cart-arrow-down"></i></button></a></td>'
				+ '<tr>';
		}
	}
	if (linhaHtml != '')
		$("#todosPedidos").html(linhaHtml);
	else
		$("#todosPedidos").html(pedidoVazio);
}


//---------------------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idPedido = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in pedidos) if (pedidos[i].id == idPedido) var idBusca = i;

	//setar valores
	Tpizzas = 0;
	dado.totalPizza = 0;
	dado.totalProduto = 0;
	dado.totalLucro = 0;
	top10Pizzas = [];

	//contar total do lucro e de pizzas
	for (pizza of pedidos[idBusca].pizzas) {
		top10Pizzas.push(pizza.sabor);
		dado.totalLucro += pizza.custo;
		dado.totalPizza += pizza.qtd;
	}
	Tpizzas = dado.totalPizza;

	//contar total do lucro e de produtos
	for (produto of pedidos[idBusca].produtos) {
		dado.totalLucro += produto.custo;
		dado.totalProduto += produto.qtd;
	}
	Tpizzas += dado.totalProduto;

	//teste para cupom desativado
	/*
	try{
		 valorCupom = Number(pedidos[idBusca].cupom.replace(",", ".").replace("%", "").replace("R$",""));
	}catch(Exception){}
	*/


	//modal jquery confirmar
	if ($("#filtro").val() == "--") {
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um atendente!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}

	jqueryFinalizar(pedidos[idBusca]);
};


function jqueryFinalizar(cliente) {
	$.confirm({
		type: 'green',
		title: 'Pedido: ' + cliente.nome,
		content: mostrarTabela(cliente),
		closeIcon: true,
		columnClass: 'col-md-8',
		onContentReady: () => {
			if (cliente.envio == 'MESA') {
				$("#servico").mask('000.00', { reverse: true });
				$("#servico").keyup(() => {
					let pctServico = $("#servico").val();
					$("#troco").val(mostrarTotalComTaxaOurServico(cliente, pctServico));
					$("#totalPedido").text(mostrarTotalComTaxaOurServico(cliente, pctServico).toFixed(2));
					cliente.servico = pctServico;
				});
			}
			$("#modoPagamento").change(() => {
				selecionaModoPagamento();
			});
			$("#modoPagamentoCartao").change(() => {
				selecionarCartao(cliente);
			});
		},
		buttons: {
			mostrarPedido: {
				text: 'ver pedido',
				btnClass: 'btn btn-primary',
				action: () => mostrarProdutosPedido(cliente)
			},
			imprimir: {
				text: 'Imprimir',
				btnClass: 'btn btn-warning',
				action: () => imprimir(cliente)
			},
			confirm: {
				text: 'Finalizar',
				btnClass: 'btn-green',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");

					if (cliente.pago == false && cliente.envio != 'ENTREGA') {
						var troco = Number(this.$content.find('#troco').val().toString().replace(",", "."));

						if (cliente.envio === 'MESA')
							cliente.servico = Number((cliente.total / 100) * this.$content.find('#servico').val());

						if (Number.isFinite(troco) == false) {
							carregarLoading("none");

							$.alert({
								type: 'red',
								title: 'OPS...',
								content: "Digite um valor válido",
								buttons: {
									confirm: {
										text: 'Voltar',
										btnClass: 'btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
							return 300;
						}

						if (verificarPagamento(cliente) == 300) return 300;
					}

					//total do pedido OBS: sem a taxa
					dado.totalVendas = cliente.total;

					if (cliente.envio == "ENTREGA") {
						dado.entrega = 1;
					} else if (cliente.envio == "BALCAO") {
						dado.balcao = 1;
					} else if (cliente.envio == "MESA") {
						dado.mesa = 1;
					} else if (cliente.envio == "DRIVE") {
						dado.drive = 1;
					}

					//salvar dados
					$.ajax({
						url: "/u/finalizar/dados/" + cliente.id,
						type: "POST",
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(dado)
					});

					$.ajax({
						url: '/u/finalizar/top10Pizzas',
						type: "POST",
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(top10Pizzas)
					});

					$.ajax({
						url: "/u/finalizar/finalizarPedido/" + cliente.id + '/' + $("#filtro").val(),
						type: 'POST'
					}).done(function() {
						window.location.href = "/u/finalizar";

					}).fail(function() {
						carregarLoading("none");
						$.alert("Pedido não enviado!<br>Digite um valor válido.");
					});
				}
			}
		}
	});
}


//----------------------------------------------------------------------------
function imprimir(cliente) {

	impressaoPedido = cliente;
	impressaoPedido.ac = $("#filtro").val();
	imressaoPedido.setor = "A";

	$.ajax({
		url: "/imprimir/imprimirPedido",
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
}


//----------------------------------------------------------------------
function mostrarTabela(pedido) {
	linhaHtml = '';

	if (pedido.envio == "ENTREGA") {
		linhaHtml += '<div class="row">'
			+ '<div class="col-md-6"><b>Endereço:</b><br>' + pedido.endereco + '</div>'
			+ '<div class="col-md-6"><b>Motoboy:</b><br>' + pedido.motoboy + '</div>'
			+ '</div>';
	}

	if (pedido.pago == 0 && pedido.envio != 'ENTREGA') {
		if (pedido.envio === 'MESA') {
			linhaHtml += '<div class="row">'
				+ '<div class="col-md-4">'
				+ '<b>Serviços:</b>'
				+ '<div class="input-group mb-3">'
				+ '<span class="input-group-text">%</span>'
				+ '<input class="form-control" id="servico" value="10.00"/>'
				+ '</div>'
				+ '</div>'

				+ '<div class="col-md-8">'
				+ modoPagamento(pedido)
				+ '</div></div>';
		} else {
			linhaHtml += modoPagamento(pedido);
		}
	}


	linhaHtml += '<div class="row">'
		+ '<div class="col-md-6"><b>Total de Produtos:</b><br>' + Tpizzas + '</div>'
		+ '<div class="col-md-6"><b>Total do Pedido:</b><br>R$ '
		+ '<span id="totalPedido">' + mostrarTotalComTaxaOurServico(pedido, 10).toFixed(2) + '</span></div>'
		+ '</div>'
		+ '<br><b class="fRight">Deseja finalizar o pedido?</b>';

	return linhaHtml;
}


function mostrarProdutosPedido(pedido) {
	let linhaHtml = '';

	if (pedido.pizzas.length != 0) {
		linhaHtml += '<table class="table table-striped table-hover"">'
			+ '<thead><tr>'
			+ '<th class="col-md-1"><h5>Sabor</h5></th>'
			+ '<th class="col-md-1"><h5>Preço</h5></th>'
			+ '<th class="col-md-1"><h5>Borda</h5></th>'
			+ '</tr></thead>';

		for (pizza of pedido.pizzas) {
			linhaHtml += '<tr>'
				+ '<td class="text-center col-md-1">' + pizza.qtd + " x " + pizza.sabor + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + pizza.preco.toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">' + pizza.borda + '</td>'
				+ '</tr>';
		}
		linhaHtml += '</table>';
	}

	if (pedido.produtos.length != 0) {
		linhaHtml += '<table class="table table-striped table-hover">'
			+ '<thead><tr>'
			+ '<th class="col-md-1"><h5>Sabor</h5></th>'
			+ '<th class="col-md-1"><h5>Preço</h5></th>'
			+ '</tr></thead>';

		for (produto of pedido.produtos) {
			linhaHtml += '<tr>'
				+ '<td class="text-center col-md-1">' + produto.qtd + " x " + produto.sabor + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + produto.preco.toFixed(2) + '</td>'
				+ '</tr>';
		}
		linhaHtml += '</table>';
	}

	$.alert({
		type: 'blue',
		title: 'Pedido',
		content: linhaHtml,
		buttons: {
			confirm: {
				text: 'Voltar',
				btnClass: 'btn btn-success',
				keys: ['esc', 'enter'],
				action: () => jqueryFinalizar(pedido)
			}
		}
	});
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
	return !isNaN(parseFloat(str))
}


function mostrarTotalComTaxaOurServico(pedido, servico) {
	if (pedido.envio == 'MESA')
		return (pedido.total + ((pedido.total / 100) * servico));
	else if (isNumber(pedido.taxa) == true)
		return (pedido.total + pedido.taxa);
	else
		return pedido.total;
}


function modoPagamento(pedido) {
	return '<div class="row" id="divPagamentoGeral">'
		+ '<div class="col-md-6" id="divModoPagamento">'
		+ '<label><b>Pagamento:</b></label>'
		+ '<select class="form-control" id="modoPagamento">'
		+ '<option value="0">Dinheiro</option>'
		+ '<option value="1">Cartão</option>'
		+ '</select>'
		+ '</div>'

		+ '<div class="col-md-6 hidden" id="divModoPagamentoCartao">'
		+ '<label><b>Bandeira:</b></label>'
		+ '<select class="form-control" id="modoPagamentoCartao">'
		+ '<option value="--">---</option>'
		+ '<option value="Mastercard">Mastercard</option>'
		+ '<option value="Visa">Visa</option>'
		+ '<option value="Pix">Pix</option>'
		+ '<option value="American Express">American Express</option>'
		+ '<option value="Hipercard">Hipercard</option>'
		+ '<option value="Elo">Elo</option>'
		+ '<option value="Alelo">Alelo</option>'
		+ '<option value="Amex">Amex</option>'
		+ '<option value="Diners Club">Diners Club</option>'
		+ '<option value="VR Benefícios">VR Benefícios</option>'
		+ '<option value="Cirrus">Cirrus</option>'
		+ '<option value="Cielo">Cielo</option>'
		+ '<option value="Eletron">Eletron</option>'
		+ '<option value="Sorocred">Sorocred</option>'
		+ '<option value="Maestro">Maestro</option>'
		+ '<option value="Ticket">Ticket</option>'
		+ '<option value="Sodexo">Sodexo</option>'
		+ '</select>'
		+ '<span>&nbsp;</span>'
		+ '</div>'

		+ '<div class="col-md-6" id="divModoPagamentoDinheiro">'
		+ '<label><b>Receber:</b></label>'
		+ '<div class="input-group mb-3">'
		+ '<span class="input-group-text">R$</span>'
		+ '<input class="form-control" id="troco" placeholder="Precisa de troco?" value="'
		+ mostrarTotalComTaxaOurServico(pedido, 10) + '"/>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
}


function selecionaModoPagamento() {
	//dinheiro
	if ($("#modoPagamento").val() == 0) {
		$("#divModoPagamentoCartao").hide('show', () => {
			$("#divModoPagamentoDinheiro").show('show');
		});
	}

	//cartao
	if ($("#modoPagamento").val() == 1) {
		$("#divModoPagamentoDinheiro").hide('show', () => {
			$("#divModoPagamentoCartao").show('show');
		});
	}
}


function selecionarCartao(cliente) {
	if ($("#modoPagamentoCartao").val() === '--') {
		return 0;
	} else {
		$("#modoPagamentoCartao").val();
		cliente.modoPagamento = "Cartão -" + $("#modoPagamentoCartao").val();
		return 1;
	}
}


function verificarPagamento(cliente) {
	//verificar se for dinheiro
	if ($("#modoPagamento").val() == 0 && cliente.envio != 'MESA') {
		cliente.modoPagamento = "Dinheiro -R$ " + cliente.total.toFixed(2);
	} else if ($("#modoPagamento").val() == 0 && cliente.envio === 'MESA') {
		cliente.modoPagamento = "Dinheiro -R$ " + Number(cliente.total + cliente.servico).toFixed(2);
	}

	//verificar se for cartao
	else if ($("#modoPagamento").val() == 1 && selecionarCartao(cliente) == 0) {
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: "Escolha uma bandeira de cartão!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}
}