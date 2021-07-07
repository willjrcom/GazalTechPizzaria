$("#filtroEnvio, #filtroSetor, #filtroStatus").selectmenu().addClass("overflow");
var [TnovosPedidos, TvelhosPedidos, Tpizzas, AllPizzas, divisao] = [0, 0, 0, 0, 0];
var [pedidos, produtos, pizzas] = [[], [], []];
var linhaHtml = "";
var impressaoPedido;

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Produtos Prontos"));

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------

function buscarPedidos() {
	[produtos, pizzas] = [[], []];

	$.ajax({
		url: "/u/produtosProntos/todosPedidos",
		type: 'GET'
	}).done(function(e) {
		//se o pedido vazio
		if (e.length == 0) {
			$("#todosPedidos").html('<tr><td colspan="5">Nenhum pedido a fazer!</td></tr>');
			return 300;
		}

		//salvar total de novos pedidos
		TnovosPedidos = e.length;

		//se houver diferenca de quantidade anterior e atual
		if (TvelhosPedidos != TnovosPedidos) {
			pedidos = e;

			for (pedido of pedidos) {
				pedido.pizzas = JSON.parse(pedido.pizzas);
				//contar total de pizzas
				for (pizza of pedido.pizzas) AllPizzas += pizza.qtd;

			}
			//mostrar total de pizzas a fazer
			if (AllPizzas == 1) $("#totalPizzas").val(AllPizzas + ' Item a fazer');
			else $("#totalPizzas").val(AllPizzas + ' Itens a fazer');

			mostrar();

			//atualizar total de pedidos
			TvelhosPedidos = TnovosPedidos;
		}

		try { $("#enviar")[0].focus(); } catch { }

		carregarLoading("none");
	});
};


//----------------------------------------------
function filtrar() {
	mostrar();
}


//-----------------------------------------------
function mostrar() {
	if ($("#filtroSetor").val() == 'PIZZA') $("#colBorda").show();
	else $("#colBorda").hide();
	linhaHtml = "";

	for ([i, pedido] of pedidos.entries()) {//cada pedido
		if (($("#filtroStatus").val() == pedido.status || $("#filtroStatus").val() == "TODOS")
		&& ($("#filtroEnvio").val() == pedido.envio || $("#filtroEnvio").val() == "TODOS")) {
			divisao = 1;
			for ([j, pizza] of pedido.pizzas.entries()) {//cada pizza
				if ($("#filtroSetor").val() == pizza.setor || $("#filtroSetor").val() == "TODOS") {
					linhaHtml += '<tr>';

					//adicionar total de pizzas
					if (j == 0) {
						linhaHtml += '<td class="text-left col-md-1">' + pedido.comanda + ' - ' + pedido.nome + '</td>'

					} else if (j == 1) {
						Tpizzas = 0;
						for (contPizza of pedido.pizzas) Tpizzas += contPizza.qtd; //contar pizzas

						if (Tpizzas == 1)
							linhaHtml += '<td>Total: '
								+ Tpizzas + ' Item</td>';
						else
							linhaHtml += '<td>Total: '
								+ Tpizzas + ' Itens</td>';

					} else {
						linhaHtml += '<td></td>';
					}

					linhaHtml += '<td>' + pizza.qtd + ' x ' + pizza.sabor + '</td>'
						//obs
						+ (pizza.obs != ""
							? '<td class="text-center col-md-1 bg-danger text-white">' + pizza.obs + '</td>'
							: '<td></td>');

					if ($("#filtroSetor").val() == "PIZZA") {
						linhaHtml += '<td>' + pizza.borda + '</td>';
					}

					//verificar a situacao do pedido
					if (pedido.status == "PRONTO" && j == 0) {
						linhaHtml += '<td>'
							+ '<button type="button" class="btn btn-success">Pronto</button></td>';

					} else if (pedido.status == "COZINHA" && j == 0) {
						linhaHtml += '<td>'
							+ '<button type="button" class="btn btn-danger">Andamento</button></td>';
					} else {
						linhaHtml += '<td></td>';
					}

					linhaHtml += '</tr>';
					/*
					//verificar adicao de linha cinza
					if (divisao - pizza.qtd <= 0) {
						divisao = 1;
					} else {
						divisao -= pizza.qtd;
					}*/
				}
			}
		}
	}
	if (linhaHtml != "") {
		$("#todosPedidos").html(linhaHtml);
	} else {
		$("#todosPedidos").html('<tr><td colspan="5">Nenhum pedido a fazer!</td></tr>');
	}
}


//-----------------------------------------------------------
buscarPedidos();

setInterval(function() {
	buscarPedidos();
}, 10000); // recarregar a cada 10 segundos



function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}
