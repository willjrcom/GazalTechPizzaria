var pedidos = [];
var linhaHtml= "";
var pedidoVazio = '<tr><td colspan="2">Nenhum pedido disponível!</td></tr>';

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Retirada"));


//-------------------------------------------------------------------------------------------------------------------
function buscarPedidos() {
	pedidos = [];
	
	$.ajax({
		url: "/retirada/todosPedidos",
		type: 'GET'
	}).done(function(e){
		
		pedidos = e;
		for(var i = 0; i< e.length; i++){
			if(pedidos[i].pizzas != null) {
				pedidos[i].pizzas = JSON.parse(pedidos[i].pizzas);
			}
		}
		
		andamentoHtml = "";
		prontoHtml = "";
		
		if(pedidos.length == 0){
			$("#andamento").html(pedidoVazio);
			$("#pronto").html(pedidoVazio);
		}else{
			for(var i = pedidos.length-1; i>=0; i--){//cada pedido
			
				if(pedidos[i].pizzas != null && pedidos[i].status == "PRONTO") {
					prontoHtml += '<tr>'
									+ '<td class="text-center col-md-6"><h4>' + pedidos[i].comanda + '</h4></td>'
									+ '<td class="text-center col-md-6"><h4>' + limit(pedidos[i].nome) + '</h4></td>'
								+ '</tr>';
					
				}else if(pedidos[i].pizzas != null && pedidos[i].status == "COZINHA") {
					andamentoHtml += '<tr>'
									+ '<td class="text-center col-md-6"><h4>' + pedidos[i].comanda + '</h4></td>'
									+ '<td class="text-center col-md-6"><h4>' + limit(pedidos[i].nome) + '</h4></td>'
								+ '</tr>';
				}
			}
			
			if(andamentoHtml !== '') $("#andamento").html(andamentoHtml);
			if(prontoHtml !== '') $("#pronto").html(prontoHtml);
		}
		carregarLoading("none");
	});
};

buscarPedidos();

setInterval(function (){
	buscarPedidos();
},10000); // recarregar a cada 20 segundos
	

//-------------------------------------
function limit(nome) {
	return nome.substr(0, 20);
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
