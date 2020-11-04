var pedidos = [];
var funcionarios = [];
var pizzas = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var Tpedido = 0;
var Tpizzas = 0;
var verificarTroco = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$(document).ready(function(){
	$.ajax({
		url: "/finalizar/todosPedidos",
		type: 'PUT'
	}).done(function(e){
		pedidos = e;
		
		for(var i = 0; i< e.length; i++){
			pedidos[i].pizzas = JSON.parse(e[i].pizzas);
			pedidos[i].produtos = JSON.parse(e[i].produtos);
		}
		
		$.ajax({
			url: "/motoboy/funcionarios",
			type: 'PUT'
		}).done(function(e){
			
			for(var i = 0; i<e.length; i++){
				funcionarios.unshift({
					'id': e[i].id,
					'nome': e[i].nome
				});
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
								+ '<td>' + pedidos[i].nomePedido + '</td>';
					
					Tpizzas = 0;
					for(var k = 0; k<pedidos[i].pizzas.length; k++) {
						Tpizzas += pedidos[i].pizzas[k].qtd;
					}
					for(var k = 0; k < pedidos[i].produtos.length; k++) {
						Tpizzas += pedidos[i].produtos[k].qtd;
					}
					linhaHtml += '<td>' + Tpizzas + '</td>'
								+ '<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>'
								+ '<td>' + pedidos[i].pagamento + '</td>'
								+ '<td>' + pedidos[i].envio + '</td>'
								+ '<td>' 
									+ '<a class="enviarPedido">'
									+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
									+ 'value="'+ pedidos[i].id + '"><span class="oi oi-timer"></span> Finalizar</button></a></td>'			
							+ '<tr>'
						+ linhaCinza;
				}
				$("#todosPedidos").html(linhaHtml);
			}
		});
	});	
});



//---------------------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	Tpizzas = 0;
	for(var k = 0; k < pedidos[idBusca].pizzas.length; k++) {
		Tpizzas += pedidos[idBusca].pizzas[k].qtd;
	}
	for(var k = 0; k < pedidos[idBusca].produtos.length; k++) {
		Tpizzas += pedidos[idBusca].produtos[k].qtd;
	}
	linhaHtml = '';
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table style="width:100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].borda + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].pizzas[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].pizzas[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table style="width:100%">'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pedidos[idBusca].produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td>' + pedidos[idBusca].produtos[i].sabor + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].obs + '</td>'
						 +	'<td>' + pedidos[idBusca].produtos[i].qtd + '</td>'
						 +  '<td>R$ ' + pedidos[idBusca].produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	linhaHtml += '<hr>Total de Produtos: ' + Tpizzas + '<br><br>' + 'Total do Pedido: R$' + pedidos[idBusca].total.toFixed(2);	
	
	if(pedidos[idBusca].pagamento == "Não") {
		linhaHtml += '<br>Troco:<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + pedidos[idBusca].total + '" required />';
	}
	linhaHtml += '<br>Deseja enviar o pedido?';


//modal jquery confirmar
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um funcionário!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
	}else {
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
		    content: linhaHtml,
		    closeIcon: true,
		    columnClass: 'col-md-8',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						pedidos[idBusca].ac = $("#filtro").val();
						pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);

						if(pedidos[idBusca].pagamento == "Não") {
							var troco = this.$content.find('#troco').val();

							troco = troco.toString().replace(",",".");
							
							verificarTroco = 1;
						}
						
						$.ajax({
							url: "/finalizar/finalizarPedido/" + idProduto.toString(),
							type: 'PUT',
							data: pedidos[idBusca]
							
						}).done(function(e){
							document.location.reload(true);
							
						}).fail(function(e){
							if(verificarTroco == 0) {
								$.alert("Pedido não enviado!");
							}else {
								$.alert("Pedido não enviado!<br>Digite um valor válido.");
							}
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