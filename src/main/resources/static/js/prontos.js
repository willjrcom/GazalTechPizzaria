var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para entregar!</td></tr>';
var filtro;
var Tpedidos = 0;
var Tpizzas = 0;

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
				'status': e[i].status,
				'produtos' : JSON.parse(e[i].produtos)
			});
		}
	}
	
	$("#todosPedidos").html("");
	filtro = $("#filtro").val();
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			if(filtro == pedidos[i].status || filtro == "TODOS"){
				linhaHtml += '<tr>';
				linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].qtd + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].sabor + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].obs + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].status + '</td>';
							
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
				linhaHtml += linhaCinza;
			}
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});