$("#filtro").selectmenu().addClass("overflow");
var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido disponível!</td></tr>';
var pedidoSemPizza = '<tr><td colspan="6">Nenhum pedido com pizza disponível!</td></tr>';
var Tpedidos = 0, totalPedidos = 0;
var Tpizzas = 0;
var divisao;

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Saída do bar"));

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------

function buscarPedidos() {
	pedidos = [];
	Tpedidos = 0;
	Tpizzas = 0;
	
	$.ajax({
		url: "/saidaBar/todosPedidos",
		type: 'GET'
	}).done(function(e){
		
		pedidos = e.reverse();
		for(var i = 0; i< e.length; i++){
			if(pedidos[i].pizzas != null) {
				Tpedidos++;
				pedidos[i].pizzas = JSON.parse(pedidos[i].pizzas);
			}
		}

		if(pedidos.length == 0)
			$("#todosPedidos").html(pedidoVazio);
			
		if(totalPedidos != Tpedidos) {
			if(totalPedidos == 0) {
				mostrar(pedidos, "TODOS");
			}else {
				mostrar(pedidos, $("#filtro").val());
			}
				
			totalPedidos = Tpedidos;
		}
		carregarLoading("none");
	});
};


//----------------------------------------------
function filtrar() {
	mostrar(pedidos, $("#filtro").val());
}


//-----------------------------------------------
function mostrar(pedidos, filtro) {
	linhaHtml = "";
	for([i, pedido] of pedidos.entries()){//cada pedido
		
		if(filtro == pedido.status || filtro == "TODOS"){//filtrar pedidos
			if(pedido.pizzas != null) {
				divisao = 1;
				for([j, pizza] of pedido.pizzas.entries()) {//cada pizza
					linhaHtml += '<tr>';
					
					//adicionar total de pizzas
					if(j == 0) {
						linhaHtml += '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
									+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
						
					}else if(j == 1) {
						Tpizzas = 0;
						for(contPizza of pedido.pizzas) Tpizzas += contPizza.qtd; //contar pizzas
						
						if(Tpizzas == 1) linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizza</td>';
						else linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizzas</td>';
						
					}else {
						linhaHtml += '<td class="text-center col-md-1" colspan="2"></td>';
					}
					
					linhaHtml += '<td class="text-center col-md-1">' + pizza.qtd + ' x ' + pizza.sabor + '</td>'
							+ (pizza.obs !== "" ? '<td class="text-center col-md-1" class="fundoAlert">' + pizza.obs + '</td>' 
								: '<td class="text-center col-md-1">' + pizza.obs + '</td>');
							
					//verificar a situacao do pedido
					if(pedido.status == "PRONTO" && j == 0){
						linhaHtml += '<td class="text-center col-md-1">'
									+ '<a class="enviarPedido">'
									+ '<button type="button" class="btn btn-success"'
									+ 'value="'+ pedido.id + '">Pronto</button></a></td>';
					}else if(pedido.status == "COZINHA" && j == 0){
						linhaHtml += '<td class="text-center col-md-1">'
									+ '<a class="enviarPedido">'
									+ '<button type="button" class="btn btn-danger"'
									+ 'value="'+ pedido.id + '">Andamento</button></a></td>';
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
				linhaHtml += linhaCinza;
			}
		}
	}
	if(linhaHtml != "") {
		$("#todosPedidos").html(linhaHtml);
	}else{
		$("#todosPedidos").html(pedidoVazio);
	}
}


//-----------------------------------------------------------
buscarPedidos();

setInterval(function (){
	buscarPedidos();
},10000); // recarregar a cada 10 segundos
	


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
