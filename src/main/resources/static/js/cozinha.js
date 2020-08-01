var pedidos = [];
var produtos = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para fazer!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;
var divisao;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/cozinha/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if(e[i].status == "COZINHA"){
			Tpedidos++;
			
			pedidos.push({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'pagamento': e[i].pagamento,
				'produtos' : JSON.parse(e[i].produtos)
			});
		}
	}
	
	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			divisao = 1;
			
			linhaHtml += '<tr>';
			linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].produtos[0].borda + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].produtos[0].qtd + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].produtos[0].sabor + '</td>';
			linhaHtml +=	'<td>' + pedidos[i].produtos[0].obs + '</td>';
			if(i == 0) {//adicionar autofocus
				linhaHtml +=	'<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" class="btn btn-success" autofocus="autofocus" onclick="enviarPedido()"'
						+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
			}else {
				linhaHtml +=	'<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
						+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
			}
			
			linhaHtml += '</tr>';
			
			if(divisao - pedidos[i].produtos[0].qtd <= 0) {
				linhaHtml += linhaCinza;
				divisao = 1;
			}else {
				divisao -= pedidos[i].produtos[0].qtd;
			}
			
			Tpizzas += 1;
			//mostrar produtos
			if(pedidos[i].produtos.length > 1){
				for(var j = 1; j<pedidos[i].produtos.length; j++){	
					linhaHtml += '<tr>';
					if(j == 1) {
						linhaHtml +=	'<td>Nº pizzas: </td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos.length + '</td>';
					}else {
						linhaHtml +=	'<td colspan="2"></td>';
					}
					linhaHtml +=	'<td>' + pedidos[i].produtos[j].borda + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].produtos[j].qtd + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].produtos[j].sabor + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].produtos[j].obs + '</td>';
					linhaHtml +=	'<td></td>';
					linhaHtml += '</tr>';	

					if(divisao - pedidos[i].produtos[0].qtd <= 0) {
						linhaHtml += linhaCinza;
						divisao = 1;
					}else {
						divisao -= pedidos[i].produtos[0].qtd;
					}
					
					Tpizzas += 1;
				}
			}

			linhaHtml += linhaCinza;
			linhaHtml += linhaCinza;
			linhaHtml += linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		
	}
	if(Tpedidos == 0) {
		$("#Tpedidos").text('0');
	}else {
		$("#Tpedidos").text(pedidos.length);
	}
	
	if(Tpizzas == 0) {
		$("#Tpizzas").text('0');
	}else {
		$("#Tpizzas").text(Tpizzas);
	}
});	
	

//----------------------------------------------------------------------------------------------------------
function enviarPedido() {

	if(confirm("Enviar pedido?") == true) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		var urlEnviar = "/cozinha/enviarPedido/" + idProduto.toString();
		console.log(urlEnviar);
		
		for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
			if(pedidos[i].id == idProduto){
				var idBusca = i;
			}
		}
		pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
		
		$.ajax({
			url: urlEnviar,
			type: 'PUT',
			data: pedidos[idBusca], //dados completos do pedido enviado
		})
		.done(function(e){
			console.log(e);
			document.location.reload(true);
		});
	}
};