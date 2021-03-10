var [TnovosPedidos, TvelhosPedidos, Tpizzas, AllPizzas, divisao] = [0, 0, 0, 0, 0];
var [pedidos, produtos, pizzas] = [[], [], []];
var linhaHtml = "";
var impressaoPedido;

$(document).ready(() => $("#nomePagina").text("Bar"));
$("#filtro").selectmenu().addClass("overflow");
$("#setor").selectmenu().addClass("overflow");

//-------------------------------------------------------------------------------------------------------------------
$("#ativarAudio").on('click', () => {
	$("#ativarAudio").hide('slow');
});

function buscarPedido() {
	[produtos, pizzas] = [[], []];
	AllPizzas = 0;
	carregarLoading("block");

	$.ajax({
		url: "/bar/todosPedidos/",
		type: 'GET'
	}).done(function(e) {
		//se o pedido vazio
		if (e.length == 0) {
			$("#todosPedidos").html('<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>');
			return 300;
		}

		//salvar total de novos pedidos
		TnovosPedidos = e.length;

		//se houver diferenca de quantidade anterior e atual
		if (TvelhosPedidos != TnovosPedidos) {
			pedidos = salvarPedidos(e);

			for (pedido of pedidos) {
				pedido.pizzas = JSON.parse(pedido.pizzas);
				//contar total de pizzas
				for (pizza of pedido.pizzas) AllPizzas += pizza.qtd;

			}
			//mostrar total de pizzas a fazer
			if (AllPizzas == 1) $("#totalPizzas").val(AllPizzas + ' Item a fazer');
			else $("#totalPizzas").val(AllPizzas + ' Itens a fazer');

			tocarSom();
			mostrar();

			//atualizar total de pedidos
			TvelhosPedidos = TnovosPedidos;
		}

		try { $("#enviar")[0].focus(); } catch { }

		carregarLoading("none");
	});
};

buscarPedido();

setInterval(function() {
	buscarPedido();
}, 10000);//recarregar a cada 10 segundos


function salvarPedidos(e) {
	return pedidos = e;;
}


//--------------------------------------------------------------------------
function filtrar() {
	mostrar();
}


//----------------------------------------------------------------------------------------------------------
function mostrar() {
	linhaHtml = "";
	for ([i, pedido] of pedidos.entries()) {
		if ($("#filtro").val() == pedido.envio || $("#filtro").val() == 'TODOS') {
			divisao = 1;
			for ([j, pizza] of pedido.pizzas.entries()) {
				if ($("#setor").val() == pizza.setor) {
					linhaHtml += '<tr>';

					if (j == 0) {//se for a primeira linha de cada pedido
						linhaHtml += '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
							+ '<td class="text-center col-md-1">' + pedido.nome + '</td>';
					} else if (j == 1) {//se for a segunda linha de cada pedido
						Tpizzas = 0;
						for (contPizza of pedido.pizzas) Tpizzas += contPizza.qtd;//contar total de pizzas de cada pedido

						//singular
						if (Tpizzas == 1) linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizza</td>';
						//plural
						else linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizzas</td>';


					} else {//se for 3 linha a frente
						linhaHtml += '<td class="text-center col-md-1" colspan="2"></td>';
					}

					//mostrar pizza
					linhaHtml += '<td class="text-center col-md-1">' + pizza.qtd + ' x ' + pizza.sabor
						//descricao
						+ (pizza.descricao != '' ? '&nbsp;&nbsp;<button class="btn-link botao p-0" onclick="descricao()" value="'
							+ pizza.descricao + '"><i class="fas fa-question"></i></td>' : "")
						//obs
						+ (pizza.obs != ""
							? '<td class="text-center col-md-1 bg-danger text-white">' + pizza.obs + '</td>'
							: '<td class="text-center col-md-1"></td>');
					if (j == 0) {
						linhaHtml += '<td class="text-center col-md-1">'
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" id="enviar" onclick="enviarPedido()"'
							+ 'value="' + pedido.id + '"><i class="far fa-check-circle"></i></button></a></td>'
							+ '</tr>';
					} else {
						linhaHtml += '<td></td></tr>';
					}
				}
			}
			linhaHtml += '<tr><td colspan="6"></td></tr>';
		}
	}
	if (linhaHtml != "") $("#todosPedidos").html(linhaHtml);
	else $("#todosPedidos").html('<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>');
}


//----------------------------------------------------------------------------------------------------------
function descricao() {
	var botaoReceber = $(event.currentTarget);
	var descricao = botaoReceber.attr('value');

	$.alert({
		type: 'blue',
		title: 'Modo de preparo:',
		content: descricao,
		buttons: {
			confirm: {
				keys: ['enter', 'esc'],
				btnClass: 'btn-green',
				text: 'Voltar'
			}
		}
	});
}


//----------------------------------------------------------------------------------------------------------
function enviarPedido() {

	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in pedidos) if (pedidos[i].id == idProduto) var idBusca = i;

	$.confirm({
		type: 'green',
		title: 'Pedido: ' + pedidos[idBusca].nome,
		content: 'Enviar pedido?',
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Enviar',
				btnClass: 'btn-green',
				keys: ['enter'],
				action: function() {
					pedidos[idBusca].produtos = pedidos[idBusca].pizzas;
					imprimir(pedidos[idBusca]);

					$.ajax({
						url: "/bar/enviarPedido/" + idProduto,
						type: 'PUT'
					}).done(function() {
						document.location.href = "/bar";
					});
				},
			},
			cancel: {
				isHidden: true,
				keys: ['esc']
			},
		}
	});
};


buscarPedido();

setInterval(function() {
	buscarPedido();
}, 10000);//recarregar a cada 10 segundos


$("#alertaPedidos").on("click", function() {
	buscarPedido();
});


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


//----------------------------------------------------------------------------
function imprimir(cliente) {
	impressaoPedido = cliente;
	impressaoPedido.setor = "B";

	$.ajax({
		url: "/imprimir/imprimirProduto",
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
}


function tocarSom() {
	//ativar som de novos pedidos
	let startPlayPromise = document.getElementById('audio').play();

	if (startPlayPromise !== undefined) {
		startPlayPromise.then(() => {
			document.getElementById('audio').play();
		}).catch(error => {
			if (error.name === "NotAllowedError") {
				$("#ativarAudio").show('show');
			} else {
				$("#ativarAudio").show('show');
			}
		});
	}
}
