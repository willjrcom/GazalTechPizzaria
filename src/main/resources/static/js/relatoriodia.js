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
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		Tpedidos++;
		
		pedidos.unshift({
			'id' : e[i].id,
			'nomePedido' : e[i].nomePedido,
			'celular' : e[i].celular,
			'endereco': e[i].endereco,
			'envio': e[i].envio,
			'total': e[i].total,
			'troco': e[i].troco,
			'status': e[i].status,
			'ac': e[i].ac,
			'motoboy': e[i].motoboy,
			'produtos': JSON.parse(e[i].produtos),
			'pizzas': JSON.parse(e[i].pizzas)
		});
	}

	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			linhaHtml += '<tr>';
			linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';

			Tpizzas = 0;
			for(var k = 0; k<pedidos[i].produtos.length; k++) {
				Tpizzas += pedidos[i].produtos[k].qtd;
			}
			for(var k = 0; k<pedidos[i].pizzas.length; k++) {
				Tpizzas += pedidos[i].pizzas[k].qtd;
			}
			
			linhaHtml +=	'<td>' + Tpizzas + '</td>';
			linhaHtml +=	'<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>';
			linhaHtml += '<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" title="finalizar" onclick="finalizarPedido()" class="botao"'
						+ 'value="'+ pedidos[i].id + '"><span class="oi oi-magnifying-glass"></span></button></a></td>';			
			linhaHtml += '</tr>';
			linhaHtml += linhaCinza;
		}
		
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});	

function finalizarPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/finalizar/finalizarPedido/" + idProduto.toString();
	console.log(urlEnviar);
	
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
	
	linhaHtml = '<table>';
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml += '<tr>'
						+ '<th>Borda</th>'
						+ '<th>Sabor</th>'
						+ '<th>Obs</th>'
						+ '<th>Qtd</th>'
						+ '<th>Preço</th>'
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
	}
	linhaHtml += '</table>';
	linhaHtml += '<table>';
	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<tr>'
						+ '<th>Sabor</th>'
						+ '<th>Obs</th>'
						+ '<th>Qtd</th>'
						+ '<th>Preço</th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].produtos[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
	}
	
	linhaHtml += '</table>';
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br><br>' + '<b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
			+ '<br><b>A/C:</b> ' + pedidos[idBusca].ac
			+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio;
	
	if(pedidos[idBusca].motoboy != null) {
		linhaHtml+= '<br><b>Motoboy:</b> ' + pedidos[idBusca].motoboy;
	}
	$.alert({
		type: 'green',
	    typeAnimated: true,
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