var pedidos = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido disponível!</td></tr>';
var pedidoSemPizza = '<tr><td colspan="6">Nenhum pedido com pizza disponível!</td></tr>';

carregarLoading("block");

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

function buscarPedidos() {
	pedidos = [];
	
	$.ajax({
		url: "/statusEmpresa/todosPedidos",
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
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = pedidos.length-1; i>=0; i--){//cada pedido
			
				if(pedidos[i].pizzas != null && pedidos[i].status == "PRONTO") {
					prontoHtml += '<tr>'
									+ '<td class="text-center col-md-6"><h4>' + pedidos[i].comanda + '</h4></td>'
									+ '<td class="text-center col-md-6"><h4>' + limit(pedidos[i].nome) + '</h4></td>'
								+ '</tr>' + linhaCinza + linhaCinza;
					
				}else if(pedidos[i].pizzas != null && pedidos[i].status == "COZINHA") {
					andamentoHtml += '<tr>'
									+ '<td class="text-center col-md-6"><h4>' + pedidos[i].comanda + '</h4></td>'
									+ '<td class="text-center col-md-6"><h4>' + limit(pedidos[i].nome) + '</h4></td>'
								+ '</tr>' + linhaCinza + linhaCinza;
				}
			}
			$("#andamento").html(andamentoHtml);
			$("#pronto").html(prontoHtml);
		}
		carregarLoading("none");
	});
};

buscarPedidos();

setInterval(function (){
	buscarPedidos();
},20000); // recarregar a cada 20 segundos
	

//-------------------------------------
function limit(nome) {
	return nome.substr(0, 20);
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
