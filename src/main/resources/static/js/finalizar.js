var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$("#enviarPedido").tooltip();

$.ajax({
	url: "/pronto/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if((e[i].status == "PRONTO" && e[i].envio == "BALCAO") || (e[i].status == "PRONTO" &&  e[i].envio == "MESA") || (e[i].status == "PRONTO" && e[i].envio == "DRIVE")){
			Tpedidos++;
			
			pedidos.push({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'status': e[i].status,
				'pagamento': e[i].pagamento,
				'produtos': JSON.parse(e[i].produtos)	
			});
		}
	}
	
	$.ajax({
		url: "/motoboy/funcionarios",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);
		
		for(var i = 0; i<e.length; i++){
			if(e[i].cargo == "MOTOBOY"){
				funcionarios.unshift({
					'id': e[i].id,
					'nome': e[i].nome
				});
			}
		}
		
		var linhaFuncionarios = '<option value="--">-------</option>';
		
		for(var i = 0; i<funcionarios.length; i++){
			linhaFuncionarios += '<option value="' + funcionarios[i].id + '">' + funcionarios[i].nome +'</option>';
		}
		
		$("#filtro").html(linhaFuncionarios);

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
				linhaHtml +=	'<td>' + pedidos[i].produtos.length + '</td>';
				linhaHtml +=	'<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pagamento + '</td>';
				linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Finalizar</button></a></td>';			
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
		}
	});
});	

function finalizarPedido() {
	if($("#filtro").val() == "--"){
		alert("Escolha um funcionario!");
	}else{
		var confirmar = confirm("Deseja finalizar?");
	
		if(confirmar == true){
			var botaoReceber = $(event.currentTarget);
			var idProduto = botaoReceber.attr('value');
			var urlEnviar = "/finalizar/finalizarPedido/" + idProduto.toString();
			console.log(urlEnviar);
			
			for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
				if(pedidos[i].id == idProduto){
					var idBusca = i;
				}
			}
			pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
			pedidos[idBusca].ac = $("#filtro").val();
			
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
	}
};