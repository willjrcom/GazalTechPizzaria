$("#filtro").selectmenu().addClass("overflow");
$(document).ready(() => $("#nomePagina").text("Entregas"));
var pedidos = [];
var pizzas = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="8">Nenhum pedido para entregar!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

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
						+ '<td class="text-center col-md-1">' + Tpizzas.toFixed(2) + '</td>'
						+ '<td class="text-center col-md-1">R$ ' + (Number(pedido.troco) - Number(pedido.total) - Number(pedido.taxa)).toFixed(2) + '</td>'	
						+ '<td class="text-center col-md-1">'
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedido.id + '"><i class="fas fa-location-arrow"></i></button></a></td>'		
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
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
	}else{
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nome,
		    content: 'Deseja entregar?',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						//pedidos[idBusca].motoboy = $("#filtro").val();
						pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
						
						var objeto = {};

						objeto.motoboy = $("#filtro").val();
						objeto.taxa = pedidos[idBusca].taxa;
						objeto.comanda = pedidos[idBusca].comanda;
						objeto.endereco = pedidos[idBusca].endereco;
						objeto.nome = pedidos[idBusca].nome;
						
						
						//buscar tabela de motoboys do dia
						$.ajax({
							url: "/motoboy/logMotoboys",
							type: "GET"
						}).done(function(e){
							logmotoboys = e;
							if(logmotoboys != '') logmotoboys = JSON.parse(logmotoboys);
							else logmotoboys = [];
							
							log = {};
							logmotoboys.unshift(objeto);
							log.pizzas = JSON.stringify(logmotoboys);

							$.ajax({
								url: "/motoboy/salvarMotoboys",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(log)
							});
						});
						
						//ENVIAR PEDIDO
						$.ajax({
							url: "/motoboy/enviarMotoboy/" + idProduto + '/' + $("#filtro").val(),
							beforeSend: function(){
								imprimir(pedidos[idBusca]);
							},
							type: 'PUT'
						}).done(function(){
							document.location.href="/motoboy";
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
};


//----------------------------------------------------------------------------
function imprimir(cliente) {
	
	impressaoPedido = cliente;
	impressaoPedido.setor = "M";

	impressaoPedido.pizzas = JSON.parse(cliente.pizzas);
	impressaoPedido.produtos = JSON.parse(cliente.produtos);

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

