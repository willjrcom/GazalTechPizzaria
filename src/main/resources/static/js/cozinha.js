$("#filtro").selectmenu().addClass("overflow");
var pedidos = [];
var produtos = [];
var pizzas = [];
var linhaHtml =  "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>';
var Tpedidos = 0, totalPedidos = 0;
var Tpizzas = 0;
var AllPizzas = 0;
var divisao;

carregarLoading("block");


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------

function buscarPedido() {
	pedidos = [];
	produtos = [];
	pizzas = [];
	Tpedidos = 0;
	Tpizzas = 0;
	AllPizzas = 0;
	
	$.ajax({
		url: "/cozinha/todosPedidos",
		type: 'GET',
		beforeSend: function(){
			$("#alertaPedidos").hide();
		}
	}).done(function(e){

		pedidos = e;
		for(pedido of pedidos){
			Tpedidos++;
			if(pedido.pizzas != null) {
				pedido.pizzas = JSON.parse(pedido.pizzas);
				for(pizza of pedido.pizzas) {
					AllPizzas += pizza.qtd;
				}
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
		}
			
		if(Tpedidos == 0) $("#Tpedidos").text('0');
		
		else $("#Tpedidos").text(pedidos.length);
		
		if(AllPizzas == 0) $("#Tpizzas").text('0');
		
		else $("#Tpizzas").text(AllPizzas);

		try {$("#enviar")[0].focus();}catch{}

		totalPedidos = Tpedidos;
		carregarLoading("none");
	});	
};


//--------------------------------------------------------------------------
function filtrar() {
	mostrar(pedidos, $("#filtro").val());
}


//----------------------------------------------------------------------------------------------------------
function mostrar(pedidos, filtro) {
	linhaHtml = "";
	for([i, pedido] of pedidos.entries()){
		if(filtro == pedido.envio || filtro == "TODOS"){
			if(pedido.pizzas != null) {
				divisao = 1;
				for([j, pizza] of pedido.pizzas.entries()) {
					linhaHtml += '<tr>';
					
					if(j == 0) {//se for a primeira linha de cada pedido
						linhaHtml += '<td>' + pedido.comanda + '</td>'
								+ '<td>' + pedido.nome + '</td>';
					}else if(j == 1) {//se for a segunda linha de cada pedido
						Tpizzas = 0;
						for(contPizza of pedido.pizzas) Tpizzas += contPizza.qtd;//contar total de pizzas de cada pedido
						
						//singular
						if(Tpizzas == 1) linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizza</td>';
						//plural
						else linhaHtml += '<td colspan="2">Total: ' + Tpizzas + ' pizzas</td>';
						
						
					}else {//se for 3 linha a frente
						linhaHtml += '<td colspan="2"></td>';
					}
					
					//mostrar pizza
					linhaHtml += '<td>' + pizza.qtd + ' x ' + pizza.sabor 
							+ '&nbsp;&nbsp;<button class="descricao" onclick="descricao()" value="' 
							+ pizza.descricao 
							+ '" title="Ingredientes: ' + pizza.descricao 
							+ '"><span class="oi oi-question-mark"></span></button></td>'
							+ (pizza.obs !== "" ? '<td class="fundoAlert">' + pizza.obs + '</td>' : '<td>' + pizza.obs + '</td>')
							+ '<td>' + pizza.borda + '</td>';
					if(j == 0)
						linhaHtml += '<td>' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" class="btn btn-success" id="enviar" onclick="enviarPedido()"'
								+ 'value="'+ pedido.id + '"><span class="oi oi-task"></span></button></a></td>'
							+'</tr>';

					if(divisao - pizza.qtd <= 0) {
						linhaHtml += linhaCinza;
						divisao = 1;
					}else {
						divisao -= pizza.qtd;
					}
				}
				linhaHtml += linhaCinza + linhaCinza + linhaCinza;
			}
		}
	}
	if(linhaHtml != "") {
		$("#todosPedidos").html(linhaHtml);
	}else {
		$("#todosPedidos").html(pedidoVazio);
	}
}


//----------------------------------------------------------------------------------------------------------
function descricao() {
	var botaoReceber = $(event.currentTarget);
	var descricao = botaoReceber.attr('value');
	
	$.alert({
		type: 'blue',
		title: 'Ingredientes:',
		content: descricao,
		buttons:{
			confirm:{
				keys: ['enter','esc'],
	            btnClass: 'btn-green',
				text: 'Voltar'
			}
		}
	});
}


//----------------------------------------------------------------------------------------------------------
function enviarPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	imprimir(pedidos[idBusca]);
			
	$.confirm({
		icon: 'fa fa-spinner fa-spin',
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Enviar pedido?',
	    buttons: {
	        confirm: {
	            text: 'Enviar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);

					$.ajax({
						url: "/cozinha/enviarPedido/" + idProduto,
						type: 'PUT'
					}).done(function(){
						document.location.reload(true);
					});
			    },
			},
			cancel: {
	        	text: 'Voltar',
	            btnClass: 'btn-red',
	            keys: ['esc'],
	        },
		}
	});
};


buscarPedido();

setInterval(function (){
	buscarPedido();
}, 10000);//recarregar a cada 10 segundos


$("#alertaPedidos").on("click",function(){
	buscarPedido();
});


//----------------------------------------------------------------------------
function imprimir(cliente) {
	//salvar hora atual
	var data = new Date();
	hora = data.getHours();
	hora = (hora.length == 0) ? '00' : hora;
	hora = (hora <= 9) ? '0'+hora : hora;
	minuto = data.getMinutes();
	minuto = (minuto.length == 0) ? '00' : minuto;
	minuto = (minuto <= 9) ? '0'+minuto : minuto;
	segundo = data.getSeconds();
	segundo = (segundo.length == 0) ? '00' : segundo;
	segundo = (segundo <= 9) ? '0'+segundo : segundo;
    dia  = data.getDate().toString();
    dia = (dia.length == 1) ? '0'+dia : dia;
    mes  = (data.getMonth()+1).toString();
    mes = (mes.length == 1) ? '0'+mes : mes;
    ano = data.getFullYear();
    
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'GET'
	}).done(function(e){
		if(e.length != 0 && e.imprimir == 1) {
			
			var impressaoPedido = {};
			impressaoPedido.nomeEstabelecimento = e.nomeEstabelecimento;//nome do estabelecimento
			impressaoPedido.envio = cliente.envio; //forma de envio
			impressaoPedido.setor = "C";
			
			//numero da comanda e nome
			impressaoPedido.comanda = cliente.comanda;
			impressaoPedido.nome = cliente.nome;
			impressaoPedido.pizzas = cliente.pizzas;

			//salvar hora
			impressaoPedido.hora = hora + ':' + minuto + ':' + segundo;
			impressaoPedido.data = dia + '/' + mes + '/' + ano;
			
			$.ajax({
				url: "/imprimir/imprimirPizza",
				type: 'POST',
				dataType : 'json',
				contentType: "application/json",
				data: JSON.stringify(impressaoPedido)
			});
		}
	});
}


//-----------------------------------------------------------------------
function mostrarTabela(pizzas) {
	
	linhaHtml = '';
	if(pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>V. Uni</h5></th>'
						+ '<th class="col-md-1"><h5>V. Total</h5></th>'
					+ '</tr>';
		
		for(pizza of pizzas){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizza.borda + '</td>'
						 +	'<td align="center">' + pizza.sabor + '</td>'
						 +	'<td align="center">' + parseFloat(pizza.qtd).toFixed(2) + '</td>'
						 +  '<td align="center">R$ ' + parseFloat(pizza.preco).toFixed(2) + '</td>'
						 +  '<td align="center">R$ ' + (parseFloat(pizza.preco) * pizza.qtd).toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


//ajax reverso
/*
//---------------------------------------
$(document).ready(function(){
	init();
});


function init() {
	console.log("dwr init....");
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setErrorHandler(error);
	DwrAlertaPedidos.init();
};


//----------------------------------------
function error(exception) {
	console.log("dwr error: " + exception);
}


//-----------------------------------------
function showButton(count) {
	totalPedidos += count;
	$("#alertaPedidos").show(function(){
		$(this)
		.attr("style","display: block")
		.text(totalPedidos + " novos pedidos!");
	});
}
*/