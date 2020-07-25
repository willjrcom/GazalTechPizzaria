var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhuma entrega para receber!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
window.onload = function() {
	$("#todosPedidos").html(linhaCinza);
	
	$.ajax({
		url: "/motoboy/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);
		
		for(var i = 0; i< e.length; i++){
			if(e[i].status == "MOTOBOY"){
				Tpedidos++;
				
				pedidos.push({
					'id' : e[i].id,
					'nomePedido' : e[i].nomePedido,
					'celular' : e[i].celular,
					'endereco': e[i].endereco,
					'total': e[i].total,
					'troco': e[i].troco,
					'status': e[i].status
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
				linhaHtml +=	'<td>' + pedidos[i].endereco + '</td>';
				linhaHtml +=	'<td>Entregador</td>';
				linhaHtml +=	'<td>18:30</td>';
				linhaHtml +=	'<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>';
				linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Finalizar</button></a></td>';			
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	},100);
		
	
};

function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/receber/finalizar/" + idProduto.toString();
	console.log(urlEnviar);
	
	var confirmar = confirm("Deseja finalizar?");
	
	if(confirmar == true){
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
	}
};