var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para fazer!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
window.onload = function() {
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
					'total': e[i].total,
					'troco':e[i].troco
					//criar for para produtos	
				});
			}
		}
	});	
	
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
				linhaHtml +=	'<td></td>';
				linhaHtml +=	'<td></td>';
				linhaHtml +=	'<td></td>';
				linhaHtml +=	'<td></td>';
				linhaHtml +=	'<td>' 
									+ '<a class="enviarPedido">'
									+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
									+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	},100);
	
	
};

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