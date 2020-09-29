var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido finalizado!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/relatoriodia/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	
	for(var i = 0; i< e.length; i++){
		Tpedidos++;
		
		pedidos.unshift({
			'id' : e[i].id,
			'comanda': e[i].comanda,
			'nomePedido' : e[i].nomePedido,
			'celular' : e[i].celular,
			'endereco': e[i].endereco,
			'pizzas': JSON.parse(e[i].pizzas),
			'produtos': JSON.parse(e[i].produtos),
			'motoboy': e[i].motoboy,
			'ac': e[i].ac,
			'status': e[i].status,
			'envio': e[i].envio,
			'pagamento': e[i].pagamento,
			'taxa': e[i].taxa,
			'total': e[i].total,
			'troco': e[i].troco,
			'horaPedido': e[i].horaPedido,
			'data': e[i].data
		});
	}

	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			linhaHtml += '<tr>'
						+ '<td>' + pedidos[i].id + '</td>'
						+ '<td>' + pedidos[i].nomePedido + '</td>';

			Tpizzas = 0;
			for(var k = 0; k<pedidos[i].produtos.length; k++) {
				Tpizzas += pedidos[i].produtos[k].qtd;
			}
			for(var k = 0; k<pedidos[i].pizzas.length; k++) {
				Tpizzas += pedidos[i].pizzas[k].qtd;
			}
			
			linhaHtml += '<td>' + Tpizzas + '</td>'
						+ '<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>'
						+ '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" onclick="finalizarPedido()" class="botao"'
							+ 'value="'+ pedidos[i].id + '"><span class="oi oi-magnifying-glass"></span></button></a></td>'		
					+ '</tr>'
				+ linhaCinza;
		}
		
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});	


//----------------------------------------------------------------------
function finalizarPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	Tpizzas = 0;
	if(pedidos[idBusca].produtos.length != 0) {
		for(var k = 0; k < pedidos[idBusca].produtos.length; k++) {
			Tpizzas += pedidos[idBusca].produtos[k].qtd;
		}
	}
	
	if(pedidos[idBusca].pizzas.length != 0) {
		for(var k = 0; k<pedidos[idBusca].pizzas.length; k++) {
			Tpizzas += pedidos[idBusca].pizzas[k].qtd;
		}
	}
	
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].borda + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].pizzas[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].produtos[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br><br>' + '<b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
				+ '<br><b>A/C:</b> ' + pedidos[idBusca].ac
				+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio;
	
	if(pedidos[idBusca].motoboy != null) {
		linhaHtml += '<br><b>Motoboy:</b> ' + pedidos[idBusca].motoboy;
	}
	$.alert({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
	    content: 'Produtos escolhidos' + linhaHtml,
	    buttons: {
	        confirm: {
				text: 'Voltar',
	    		keys: ['enter','esc'],
	            btnClass: 'btn-green'
			}
		}
	});
};