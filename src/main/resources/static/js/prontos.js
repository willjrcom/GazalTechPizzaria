var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="8">Nenhum pedido para entregar!</td></tr>';
var filtro;
var Tpedidos = 0;
var Tpizzas = 0;
var divisao;
//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/pronto/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if(e[i].status == "PRONTO" || e[i].status == "COZINHA"){
			Tpedidos++;
			
			pedidos.unshift({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'total': e[i].total,
				'troco': e[i].troco,
				'envio': e[i].envio,
				'status': e[i].status,
				'pagamento': e[i].pagamento,
				'produtos' : JSON.parse(e[i].produtos)
			});
		}
	}
	
	$("#todosPedidos").html("");
	filtro = $("#filtro").val();
	linhaHtml = "";
	console.log(filtro);
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			//filtrar para todos pedidos
			if(filtro == pedidos[i].status || filtro == "TODOS"){
				divisao = 1;
				
				linhaHtml += '<tr>';
				linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].borda + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].qtd + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].sabor + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].obs + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].envio + '</td>';
							
				//verificar a situacao do pedido
				if(pedidos[i].status == "PRONTO"){
					linhaHtml += '<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
						+ 'value="'+ pedidos[i].id + '">Pronto</button></a></td>';
				} else if(pedidos[i].status == "COZINHA"){
					linhaHtml += '<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" class="btn btn-danger" onclick="enviarPedido()"'
						+ 'value="'+ pedidos[i].id + '">Andamento</button></a></td>';
				}				
				
				linhaHtml += '<tr>';
				
				//verificar adicao de linha cinza
				if(divisao - pedidos[i].produtos[0].qtd <= 0) {
					linhaHtml += linhaCinza;
					divisao = 1;
				}else {
					divisao -= pedidos[i].produtos[0].qtd;
				}
				
				//mostrar mais que 1 produto
				if(pedidos[i].produtos.length > 1){
					for(var j = 1; j<pedidos[i].produtos.length; j++){	
						
						linhaHtml += '<tr>';
						
						//adicionar total de pizzas
						if(j == 1) {
							Tpizzas = 0;
							for(var k = 0; k<pedidos[i].produtos.length; k++) {
								Tpizzas += pedidos[i].produtos[k].qtd;
							}
							if(Tpizzas == 1) {
								linhaHtml += '<td colspan="2">' + Tpizzas + ' pizza</td>';
							}else {
								linhaHtml += '<td colspan="2">' + Tpizzas + ' pizzas</td>';
							}
						}else {
							linhaHtml +=	'<td colspan="2"></td>';
						}
						
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].borda + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].qtd + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].sabor + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].obs + '</td>';
						linhaHtml +=	'<td></td>';
						linhaHtml += '</tr>';	

						//verificar adicao de linha cinza
						if(divisao - pedidos[i].produtos[j].qtd <= 0) {
							linhaHtml += linhaCinza;
							divisao = 1;
						}else {
							divisao -= pedidos[i].produtos[j].qtd;
						}
					}
				}
				linhaHtml += linhaCinza;
				linhaHtml += linhaCinza;
			}
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});