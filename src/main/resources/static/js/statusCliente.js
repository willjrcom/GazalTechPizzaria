var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido disponível!</td></tr>';
var pedidoSemPizza = '<tr><td colspan="6">Nenhum pedido com pizza disponível!</td></tr>';


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

function buscarPedidos() {
	pedidos = [];
	
	$.ajax({
		url: "/statusEmpresa/todosPedidos",
		type: 'GET'
	}).done(function(e){
		
		pedidos = e;
		for(var i = 0; i< e.length; i++){
			if(pedidos[i].pizzas != null) {
				pedidos[i].pizzas = JSON.parse(pedidos[i].pizzas);
			}
		}
		
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = pedidos.length-1; i>=0; i--){//cada pedido
			
				if(pedidos[i].pizzas != null) {
					linhaHtml += '<tr>'
								+ '<td>' + pedidos[i].comanda + '</td>'
								+ '<td>' + pedidos[i].nome + '</td>'
							
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
					}
					
					linhaHtml += '</tr>';
					linhaHtml += linhaCinza + linhaCinza;
				}
			}
			$("#todosPedidos").html(linhaHtml);
		}
	});
};

buscarPedidos();

setInterval(function (){
	buscarPedidos();
},20000); // recarregar a cada 20 segundos
	