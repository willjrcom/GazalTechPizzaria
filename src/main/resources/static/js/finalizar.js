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
		for(pedido of pedidos){
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}
		
		$.ajax({
			url: "/motoboy/funcionarios",
			type: 'PUT'
		}).done(function(motoboys){
			
			for(motoboy of motoboys){
				funcionarios.unshift({
					'id': motoboy.id,
					'nome': motoboy.nome
				});
			}
			
			var linhaFuncionarios = '<option value="--">-------</option>';
			
			for(funcionario of funcionarios) linhaFuncionarios += '<option value="' + funcionario.nome + '">' + funcionario.nome +'</option>';
			
			$("#filtro").html(linhaFuncionarios);
			$("#todosPedidos").html("");
			linhaHtml = "";
			
			if(pedidos.length == 0){
				$("#todosPedidos").html(pedidoVazio);
			}else{
				for(pedido of pedidos){
					linhaHtml += '<tr>'
								+ '<td>' + pedido.comanda + '</td>'
								+ '<td>' + pedido.nomePedido + '</td>';
					
					Tpizzas = 0;
					for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
					
					for(produto of pedido.produtos) Tpizzas += produto.qtd;
					
					linhaHtml += '<td>' + Tpizzas + '</td>'
								+ '<td>R$ ' + pedido.total.toFixed(2) + '</td>'
								+ '<td>' + pedido.pagamento + '</td>'
								+ '<td>' + pedido.envio + '</td>'
								+ '<td>' 
									+ '<a class="enviarPedido">'
									+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
									+ 'value="'+ pedido.id + '"><span class="oi oi-timer"></span> Finalizar</button></a></td>'			
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
	
	for(i in pedidos){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	Tpizzas = 0;
	for(pizza of pedidos[idBusca].pizzas) Tpizzas += pizza.qtd;
	
	for(produto of pedidos[idBusca].produtos) Tpizzas += produto.qtd;
	
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
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td>' + pizza.borda + '</td>'
						 +	'<td>' + pizza.sabor + '</td>'
						 +	'<td>' + pizza.obs + '</td>'
						 +	'<td>' + pizza.qtd + '</td>'
						 +  '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
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
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td>' + produto.sabor + '</td>'
						 +	'<td>' + produto.obs + '</td>'
						 +	'<td>' + produto.qtd + '</td>'
						 +  '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	linhaHtml += '<hr>Total de Produtos: ' + Tpizzas + '<br><br>' + 'Total do Pedido: R$' + pedidos[idBusca].total.toFixed(2);	
	
	if(pedidos[idBusca].pagamento == "Não") linhaHtml += '<br>Troco:<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + pedidos[idBusca].total + '" required />';
	
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
							if(verificarTroco == 0) $.alert("Pedido não enviado!");
							
							else $.alert("Pedido não enviado!<br>Digite um valor válido.");
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