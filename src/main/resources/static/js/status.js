var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido disponível!</td></tr>';
var pedidoSemPizza = '<tr><td colspan="6">Nenhum pedido com pizza disponível!</td></tr>';
var filtro;
var Tpedidos = 0;
var Tpizzas = 0;
var divisao;


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

function buscarPedidos() {
	pedidos = [];
	Tpedidos = 0;
	Tpizzas = 0;
	
	$.ajax({
		url: "/status/todosPedidos",
		type: 'PUT'
	}).done(function(e){
		
		pedidos = e;
		for(var i = 0; i< e.length; i++){
			if(pedidos[i].pizzas != null) {
				Tpedidos++;
				pedidos[i].pizzas = JSON.parse(pedidos[i].pizzas);
			}
		}
		
		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = pedidos.length-1; i>=0; i--){//cada pedido
				
				if(filtro == pedidos[i].status || filtro == "TODOS"){//filtrar pedidos
					if(pedidos[i].pizzas != null) {
						divisao = 1;
						for([j, pizza] of pedidos[i].pizzas.entries()) {//cada pizza
							linhaHtml += '<tr>';
							
							//adicionar total de pizzas
							if(j == 0) {
								linhaHtml += '<td>' + pedidos[i].comanda + '</td>'
											+ '<td>' + pedidos[i].nome + '</td>'
								
							}else if(j == 1) {
								Tpizzas = 0;
								for(contPizza of pedidos[i].pizzas) Tpizzas += contPizza.qtd; //contar pizzas
								
								if(Tpizzas == 1) linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizza</td>';
								else linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizzas</td>';
								
							}else {
								linhaHtml += '<td colspan="2"></td>';
							}
							
							linhaHtml += '<td>' + pizza.borda + '</td>'
									+ '<td>' + pizza.qtd + ' x ' + pizza.sabor + '</td>'
									+ '<td>' + pizza.obs + '</td>';
									
							//verificar a situacao do pedido
							if(pedidos[i].status == "PRONTO" && j == 0){
								linhaHtml += '<td>' 
											+ '<a class="enviarPedido">'
											+ '<button type="button" class="btn btn-success"'
											+ 'value="'+ pedidos[i].id + '">Pronto</button></a></td>';
							}else if(pedidos[i].status == "COZINHA" && j == 0){
								linhaHtml += '<td>' 
											+ '<a class="enviarPedido">'
											+ '<button type="button" class="btn btn-danger"'
											+ 'value="'+ pedidos[i].id + '">Andamento</button></a></td>';
							}else if(pedidos[i].status == "MOTOBOY" && j == 0){
								linhaHtml += '<td>' 
											+ '<a class="enviarPedido">'
											+ '<button type="button" class="btn btn-primary"'
											+ 'value="'+ pedidos[i].id + '">Na Rua</button></a></td>';
							}				
							
							linhaHtml += '</tr>';
							
							//verificar adicao de linha cinza
							if(divisao - pizza.qtd <= 0) {
								linhaHtml += linhaCinza;
								divisao = 1;
							}else {
								divisao -= pizza.qtd;
							}
						}
						linhaHtml += linhaCinza + linhaCinza;
					}
				}
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	});
};

buscarPedidos();

setInterval(function (){
	buscarPedidos();
},3000);
	