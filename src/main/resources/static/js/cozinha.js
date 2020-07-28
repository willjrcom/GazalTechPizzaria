var pedidos = [];
var produtos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para fazer!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

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
				'produtos' : JSON.parse(e[i].produtos)
			});
		}
	}
	console.log(pedidos.length);

	setTimeout(function(){
		$("#todosPedidos").html("");
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				linhaHtml += '<tr>';
				linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].borda + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].qtd + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].sabor + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].produtos[0].obs + '</td>';
				linhaHtml +=	'<td>' 
									+ '<a class="enviarPedido">'
									+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
									+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
				linhaHtml += '</tr>';
				
				//mostrar produtos
				if(pedidos[i].produtos.length > 1){
					for(var j = 1; j<pedidos[i].produtos.length; j++){	
						linhaHtml += linhaCinza;
						linhaHtml += '<tr>';	
						linhaHtml +=	'<td colspan="2"></td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].borda + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].qtd + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].sabor + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].produtos[j].obs + '</td>';
						linhaHtml +=	'<td></td>';
						linhaHtml += '</tr>';	
					}
				}
				
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	},100);
});	
	

function enviarPedido() {

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
	
};