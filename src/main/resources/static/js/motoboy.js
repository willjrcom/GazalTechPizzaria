var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido para entregar!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/motoboy/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if((e[i].status == "PRONTO" && e[i].envio == "ENTREGA") || (e[i].status == "PRONTO" && e[i].envio == "IFOOD")){
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
				'produtos': JSON.parse(e[i].produtos)
			});
		}
	}
});

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
			})
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
			linhaHtml +=	'<td>' + pedidos[i].endereco + '</td>';
			
			Tpizzas = 0;
			for(var k = 0; k<pedidos[i].produtos.length; k++) {
				Tpizzas += pedidos[i].produtos[k].qtd;
			}
			linhaHtml +=    '<td>' + Tpizzas + '</td>';
			linhaHtml +=    '<td>R$ ' + pedidos[i].troco + '</td>';
							
			linhaHtml += '<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
						+ 'value="'+ pedidos[i].id + '">Entregar</button></a></td>';			
			linhaHtml += '<tr>';
			linhaHtml += linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});

function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/motoboy/enviarMotoboy/" + idProduto.toString();
	console.log(urlEnviar);
	
	if($("#filtro").val() == "--"){
		alert("Escolha um motoboy!");
	}else{
		var confirmar = confirm("Deseja entregar?");
		
		if(confirmar == true){
			for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
				if(pedidos[i].id == idProduto){
					var idBusca = i;
				}
			}
			
			pedidos[idBusca].motoboy = $("#filtro").val();
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
	}
};