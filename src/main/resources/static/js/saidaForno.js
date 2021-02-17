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
$(document).ready(() => $("#nomePagina").text("Saída do forno"));

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------

function buscarPedidos() {
	pedidos = [];
	Tpedidos = 0;
	Tpizzas = 0;
	
	$.ajax({
		url: "/saidaForno/todosPedidos",
		type: 'GET'
	}).done(function(e){
		
		pedidos = e;
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
						
						if(Tpizzas == 1) linhaHtml += '<td colspan="2">Total: ' + Number(Tpizzas).toFixed(2) + ' pizza</td>';
						else linhaHtml += '<td colspan="2">Total: ' + Number(Tpizzas).toFixed(2) + ' pizzas</td>';
						
					}else {
						linhaHtml += '<td colspan="2"></td>';
					}
					
					linhaHtml += '<td>' + pizza.qtd + ' x ' + pizza.sabor + '</td>'
							+ (pizza.obs !== "" ? '<td class="fundoAlert">' + pizza.obs + '</td>' : '<td>' + pizza.obs + '</td>')
							+ '<td>' + pizza.borda + '</td>';
							
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
	if(linhaHtml != "") {
		$("#todosPedidos").html(linhaHtml);
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
