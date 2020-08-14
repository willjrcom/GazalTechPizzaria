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

function buscarPedidos() {
	pedidos = [];
	Tpedidos = 0;
	Tpizzas = 0;
	
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
					'produtos' : e[i].produtos,
					'pizzas' : JSON.parse(e[i].pizzas)
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
					linhaHtml +=	'<td>' + pedidos[i].pizzas[0].borda + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].pizzas[0].qtd + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].pizzas[0].sabor + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].pizzas[0].obs + '</td>';
					linhaHtml +=	'<td>' + pedidos[i].envio + '</td>';
								
					//verificar a situacao do pedido
					if(pedidos[i].status == "PRONTO"){
						linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success"'
							+ 'value="'+ pedidos[i].id + '">Pronto</button></a></td>';
					} else if(pedidos[i].status == "COZINHA"){
						linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-danger"'
							+ 'value="'+ pedidos[i].id + '">Andamento</button></a></td>';
					}				
					
					linhaHtml += '<tr>';
					
					//verificar adicao de linha cinza
					if(divisao - pedidos[i].pizzas[0].qtd <= 0) {
						linhaHtml += linhaCinza;
						divisao = 1;
					}else {
						divisao -= pedidos[i].pizzas[0].qtd;
					}
					
					//mostrar mais que 1 produto
					if(pedidos[i].pizzas.length > 1){
						for(var j = 1; j<pedidos[i].pizzas.length; j++){	
							
							linhaHtml += '<tr>';
							
							//adicionar total de pizzas
							if(j == 1) {
								Tpizzas = 0;
								for(var k = 0; k<pedidos[i].pizzas.length; k++) {
									Tpizzas += pedidos[i].pizzas[k].qtd;
								}
								if(Tpizzas == 1) {
									linhaHtml += '<td colspan="2">' + Tpizzas + ' pizza</td>';
								}else {
									linhaHtml += '<td colspan="2">' + Tpizzas + ' pizzas</td>';
								}
							}else {
								linhaHtml +=	'<td colspan="2"></td>';
							}
							
							linhaHtml +=	'<td>' + pedidos[i].pizzas[j].borda + '</td>';
							linhaHtml +=	'<td>' + pedidos[i].pizzas[j].qtd + '</td>';
							linhaHtml +=	'<td>' + pedidos[i].pizzas[j].sabor + '</td>';
							linhaHtml +=	'<td>' + pedidos[i].pizzas[j].obs + '</td>';
							linhaHtml +=	'<td></td>';
							linhaHtml += '</tr>';	
	
							//verificar adicao de linha cinza
							if(divisao - pedidos[i].pizzas[j].qtd <= 0) {
								linhaHtml += linhaCinza;
								divisao = 1;
							}else {
								divisao -= pedidos[i].pizzas[j].qtd;
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
};

buscarPedidos();

setInterval(function (){
	buscarPedidos();
},3000);
	