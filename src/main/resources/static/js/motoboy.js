$("#filtro").selectmenu().addClass("overflow");
$(document).ready(() => $("#nomePagina").text("Entregas"));
var [pedidos, pizzas, funcionarios] = [[], [], []];
var [Tpedidos, Tpizzas] = [0, 0];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="8">Nenhum pedido para entregar!</td></tr>';

if($("#btnCadastrar").val() == 1){
	$("#divCadastrar").show("slow");
	$("#divFiltro").hide("slow");
}


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");
$.ajax({
	url: "/motoboy/todosPedidos",
	type: 'GET'
}).done(function(e){
	pedidos = e;
	for(pedido of pedidos){
		Tpedidos++;
		pedido.pizzas = JSON.parse(pedido.pizzas);
		pedido.produtos = JSON.parse(pedido.produtos);
	}
	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(pedido of pedidos){
			Tpizzas = 0;
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			linhaHtml += '<tr>'
						+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
						+ '<td class="text-center col-md-2">' + pedido.endereco + '</td>'
						+ '<td class="text-center col-md-1">' + Tpizzas + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.modoPagamento + '</td>'	
						+ '<td class="text-center col-md-1">' + (pedido.total - pedido.troco).toFixed(2) + '</td>'	
						+ '<td class="text-center col-md-1">'
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedido.id + '"><i class="fas fa-location-arrow"></i></button></a></td>'		
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
	}
	carregarLoading("none");
});


//------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
		
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um motoboy!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
		return 0;
	}
	
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Deseja entregar?',
		closeIcon: true,
	    buttons: {
	        confirm: {
	            text: 'Enviar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					
					gerarLogMotoboy(pedidos[idBusca]);
					
					//ENVIAR PEDIDO
					$.ajax({
						url: "/motoboy/enviarMotoboy/" + idProduto + '/' + $("#filtro").val(),
						beforeSend: function(){
							imprimir(pedidos[idBusca]);
						},
						type: 'PUT'
					}).done(function(){
						document.location.href = "/motoboy";
					});
					
				}
			},
	        cancel: {
				isHidden: true,
	            keys: ['esc']
	        },
		}
	});
};


//----------------------------------------------------------------------------
function imprimir(cliente) {
	
	impressaoPedido = cliente;
	impressaoPedido.setor = "M";

	impressaoPedido.pizzas = cliente.pizzas;
	impressaoPedido.produtos = cliente.produtos;

	if(cliente.obs != "") impressaoPedido.obs = cliente.obs;
				
	//salvar hora
	impressaoPedido.hora = cliente.horaPedido;
	impressaoPedido.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];
	
	$.ajax({
		url: "/imprimir/imprimirPedido",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


function gerarLogMotoboy(pedido){
	var objeto = {};

	objeto.motoboy = $("#filtro").val();
	objeto.taxa = pedido.taxa;
	objeto.comanda = pedido.comanda;
	objeto.endereco = pedido.endereco;
	objeto.nome = pedido.nome;
	
	$.ajax({
		url: "/motoboy/salvarLogMotoboy",
		type: "POST",
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(objeto)
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