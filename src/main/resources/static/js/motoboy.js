var pedidos = [];
var pizzas = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="8">Nenhum pedido para entregar!</td></tr>';
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
	
	pedidos = e;
	for(var i = 0; i< e.length; i++){
		Tpedidos++;
		pedidos[i].pizzas = JSON.parse(e[i].pizzas);
		pedidos[i].produtos = JSON.parse(e[i].produtos);
	}
});

$.ajax({
	url: "/motoboy/funcionarios",
	type: 'PUT'
})
.done(function(e){
	
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
		linhaFuncionarios += '<option value="' + funcionarios[i].nome + '">' + funcionarios[i].nome +'</option>';
	}
	$("#filtro").html(linhaFuncionarios);

	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(var i = 0; i<pedidos.length; i++){
			linhaHtml += '<tr>'
						+ '<td>' + pedidos[i].comanda + '</td>'
						+ '<td>' + pedidos[i].nomePedido + '</td>'
						+ '<td>' + pedidos[i].endereco + '</td>';
			
			Tpizzas = 0;
			for(var k = 0; k<pedidos[i].pizzas.length; k++) {
				Tpizzas += pedidos[i].pizzas[k].qtd;
			}
			for(var k = 0; k<pedidos[i].produtos.length; k++) {
				Tpizzas += pedidos[i].produtos[k].qtd;
			}
			
			linhaHtml += '<td>' + Tpizzas + '</td>'
						+ '<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>'
						+ '<td>R$ ' + pedidos[i].troco.toFixed(2) + '</td>'
						+ '<td>R$ ' + (pedidos[i].troco - pedidos[i].total).toFixed(2) + '</td>'	
						+ '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '"><span class="oi oi-location"></span> Entregar</button></a></td>'		
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});


//------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um motoboy!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
	}else{
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
		    content: 'Deseja entregar?',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						pedidos[idBusca].motoboy = $("#filtro").val();
						pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
						
						//ENVIAR PEDIDO
						$.ajax({
							url: "/motoboy/enviarMotoboy/" + idProduto.toString(),
							type: 'PUT',
							data: pedidos[idBusca], //dados completos do pedido enviado
						})
						.done(function(e){
							document.location.reload(true);
						});
					}
				},
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
};