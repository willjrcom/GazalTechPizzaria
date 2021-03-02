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
						+ '<td class="text-center col-md-1">' + (pedido.total + pedido.taxa - pedido.troco).toFixed(2) + '</td>'	
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
	linhaHtml = '';
	if(typeof pedidos[idBusca].obs !== 'undefined'){
		linhaHtml = '<label><b>Observação do Pedido:</b></label>'
					+ '<textarea class="form-control" id="obs" style="border: 1px solid red" readonly></textarea><br>';
	}
	
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml + '<b>Deseja entregar?</b>',
		closeIcon: true,
		onContentReady: function(){
			$("#obs").val(pedidos[idBusca].obs);
		},
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
	impressaoPedido.motoboy = $("#filtro").val();
	
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


function verEntregasNaRua(){
	carregarLoading("block");
	$.ajax({
		url: '/motoboy/entregasNaRua',
		type: 'GET'
	}).done(pedidos => {
		let linhaHtml = "";
		
		if(pedidos.length == 0){
			linhaHtml = '<tr><td colspan="5">Nenhum pedido na rua!</td></tr>';
		}else{
			linhaHtml = '<table class="table table-striped table-hover">'
						+ '<tr>'
							+ '<td class="text-center col-md-1">Comanda</td>'
							+ '<td class="text-center col-md-1">Cliente</td>'
							+ '<td class="text-center col-md-2">Endereco</td>'
							+ '<td class="text-center col-md-1">Pagamento</td>'	
							+ '<td class="text-center col-md-1">Motoboy</td>'
						+ '</tr>';
							
			for(pedido of pedidos){
				linhaHtml += '<tr>'
							+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
							+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
							+ '<td class="text-center col-md-2">' + pedido.endereco + '</td>'
							+ '<td class="text-center col-md-1">' + pedido.modoPagamento + '</td>'	
							+ '<td class="text-center col-md-1">' + pedido.motoboy + '</td>'
							+ '</tr>'	
					+ linhaCinza;
			}
			linhaHtml += '</table>';
		}
		carregarLoading("none");
		$.alert({
			type: 'blue',
			title: 'Entregas na rua',
			content: linhaHtml,
			closeIcon: true,
	    	columnClass: 'col-md-12',
			buttons: {
				confirm: {
					isHidden: true,
					keys: ['esc', 'enter']
				}
			}
		});
	}).fail(() => {
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'Erro, nenhuma entrega encontrada!',
			buttons: {
				confirm: {
					text: 'voltar',
					btnClass: 'btn btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
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