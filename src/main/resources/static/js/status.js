var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido disponível!</td></tr>';
var pedidoSemPizza = '<tr><td colspan="7">Nenhum pedido com pizza disponível!</td></tr>';
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
		url: "/status/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){
		
		for(var i = 0; i< e.length; i++){
			if(e[i].status == "PRONTO" || e[i].status == "COZINHA" || e[i].status == "MOTOBOY"){
				Tpedidos++;
				
				pedidos.unshift({
					'id' : e[i].id,
					'comanda': e[i].comanda,
					'nomePedido' : e[i].nomePedido,
					'celular' : e[i].celular,
					'endereco': e[i].endereco,
					'pizzas': JSON.parse(e[i].pizzas),
					'produtos': JSON.parse(e[i].produtos),
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
		}
		
		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		
		if(pedidos.length == 0 ){
			$("#todosPedidos").html(pedidoVazio);
			
			for(var i = 0; i<pedidos.length; i++){
				if(pedidos[i].pizzas.length == 0 && (i+1 >= pedidos.length)) {
					$("#todosPedidos").html(pedidoSemPizza);
				}
			}
		}else{
			for(var i = 0; i<pedidos.length; i++){
				//filtrar para todos pedidos
				if(filtro == pedidos[i].status || filtro == "TODOS"){
					if(pedidos[i].pizzas.length != 0) {
						divisao = 1;
						
						linhaHtml += '<tr>';
						linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[0].borda + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[0].qtd + ' x ' + pedidos[i].pizzas[0].sabor + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[0].obs + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].envio + '</td>';
									
						//verificar a situacao do pedido
						if(pedidos[i].status == "PRONTO"){
							linhaHtml += '<td>' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" class="btn btn-success"'
								+ 'value="'+ pedidos[i].id + '">Pronto</button></a></td>';
						}else if(pedidos[i].status == "COZINHA"){
							linhaHtml += '<td>' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" class="btn btn-danger"'
								+ 'value="'+ pedidos[i].id + '">Andamento</button></a></td>';
						}else if(pedidos[i].status == "MOTOBOY"){
							linhaHtml += '<td>' 
									+ '<a class="enviarPedido">'
									+ '<button type="button" class="btn btn-primary"'
									+ 'value="'+ pedidos[i].id + '">Na Rua</button></a></td>';
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
										linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizza</td>';
									}else {
										linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizzas</td>';
									}
								}else {
									linhaHtml +=	'<td colspan="2"></td>';
								}
								
								linhaHtml +=	'<td>' + pedidos[i].pizzas[j].borda + '</td>';
								linhaHtml +=	'<td>' + pedidos[i].pizzas[j].qtd + ' x ' + pedidos[i].pizzas[j].sabor + '</td>';
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
	