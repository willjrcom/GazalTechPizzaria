var pedidos = [];
var pizzas = [];
var produtos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido cancelado!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;
$(document).ready(() => $("#nomePagina").text("Pedidos excluídos"));

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");

$.ajax({
	url: "/pedidosExcluidos/todosPedidos",
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
			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			
			linhaHtml += '<tr>'
						+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
						+ '<td class="text-center col-md-1">' + Tpizzas + '</td>'
						+ '<td class="text-center col-md-1">' + pedido.modoPagamento + '</td>'
						+ '<td class="text-center col-md-1">'
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" class="botao" onclick="verPedido()"'
							+ 'value="'+ pedido.id + '"><i class="fas fa-search"></i></button></a></td>'			
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
	carregarLoading("none");
});	


//-------------------------------------------------------------------------------------------------------
function verPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	Tpizzas = 0;
	for(produto of pedidos[idBusca].produtos) Tpizzas += produto.qtd;
	
	for(pizza of pedidos[idBusca].pizzas) Tpizzas += pizza.qtd;
	
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
					+ '</tr>';
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + pizza.qtd + " x " + pizza.sabor + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + pizza.preco.toFixed(2) + '</td>'
						 +	'<td class="text-center col-md-1">' + pizza.borda + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + produto.qtd + " x " + produto.sabor + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	linhaHtml += '<hr>'
				+ '<div class="row">'
				+ '<div class="col-md-6"><b>Total de Produtos:</b><br>' + Tpizzas + '</div>'
				+ '<div class="col-md-6"><b>Total do Pedido:</b> R$<br>' + mostrarTotalComTaxa(pedidos[idBusca]).toFixed(2) + '</div>'
				+ '<div class="col-md-6"><b>Modo de pagamento:</b><br>' + pedidos[idBusca].modoPagamento + '</div>'
				+ '<div class="col-md-6"><b>Modo de Envio:</b><br>' + pedidos[idBusca].envio + '</div>'
				+ '<div class="col-md-6"><b>Hora do pedido:</b><br>' + pedidos[idBusca].horaPedido + '</div>';
	
	if(pedidos[idBusca].envio === 'ENTREGA') {
		linhaHtml += '<div class="col-md-6"><b>Motoboy:</b><br>' + pedidos[idBusca].motoboy + '</div>'
					+ '<div class="col-md-6"><b>Endereço:</b><br>' + pedidos[idBusca].endereco + '</div>';
	}
	
	if(pedidos[idBusca].envio === 'MESA') {
		linhaHtml += '<div class="col-md-6"><b>Garçon:</b><br>' + pedidos[idBusca].garcon + '</div>'
					+ '<div class="col-md-6"><b>Serviços:</b><br>' + pedidos[idBusca].servico + ' %</div>';
	}
	linhaHtml += '</div>';
		
	$.alert({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml,
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			tudo: {
			text: '<i class="fas fa-print"></i> Pedido',
	        btnClass: 'btn-success',
	        	action: function(){
					imprimirTudo(pedidos[idBusca]);
				}
			}
		},
	    cancel: {
            isHidden: true, // hide the button
            keys: ['esc']
		}
	});
};



//-------------------------------------------------
function imprimirTudo(cliente) {
			
	impressaoPedido = cliente;
	impressaoPedido.setor = "A";
	
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


function isNumber(str) {
    return !isNaN(parseFloat(str))
}


function mostrarTotalComTaxa(cliente){
	if(isNumber(cliente.taxa) == true)
		return (cliente.total + cliente.taxa);
	else
		return cliente.total;
}

