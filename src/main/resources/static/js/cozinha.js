$("#filtro").selectmenu().addClass("overflow");
var [pedidos, produtos, pizzas] = [[], [], []];
var linhaHtml =  "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>';
var [Tpedidos, totalPedidos, Tpizzas, AllPizzas] = [0, 0, 0, 0];
var divisao, impressaoPedido;

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Cozinha"));

//-------------------------------------------------------------------------------------------------------------------
$("#ativarAudio").on('click',() => {
	$("#ativarAudio").hide('slow');
});


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
		if(AllPizzas == 1){
			$("#totalPizzas").val(AllPizzas + ' Pizza a fazer');
		}else{
			$("#totalPizzas").val(AllPizzas + ' Pizzas a fazer');
		}
		
		
		if(pedidos.length == 0)
			$("#todosPedidos").html(pedidoVazio);
			
		if(totalPedidos != Tpedidos) {
			//ativar so de novos pedidos
			let startPlayPromise = document.getElementById('audio').play();

			if(startPlayPromise !== undefined) {
				startPlayPromise.then(() => {
			    	document.getElementById('audio').play();
			  }).catch(error => {
			    if(error.name === "NotAllowedError") {
			    	$("#ativarAudio").show('show');
			    }else {
					$("#ativarAudio").show('show');
			    }
			  });
			}
			
			if(totalPedidos == 0) {
				mostrar(pedidos, "TODOS");
			}else {
				mostrar(pedidos, $("#filtro").val());
			}
		}

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
						linhaHtml += '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
								+ '<td class="text-center col-md-1">' + pedido.nome + '</td>';
					}else if(j == 1) {//se for a segunda linha de cada pedido
						Tpizzas = 0;
						for(contPizza of pedido.pizzas) Tpizzas += contPizza.qtd;//contar total de pizzas de cada pedido
						
						//singular
						if(Tpizzas == 1) linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizza</td>';
						//plural
						else linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' pizzas</td>';
						
						
					}else {//se for 3 linha a frente
						linhaHtml += '<td class="text-center col-md-1" colspan="2"></td>';
					}
					
					//mostrar pizza
					linhaHtml += '<td class="text-center col-md-1">' + pizza.qtd + ' x ' + pizza.sabor 
							+ (pizza.descricao != ''?'&nbsp;&nbsp;<button class="descricao botao" onclick="descricao()" value="' 
							+ pizza.descricao 
							+ '" title="Ingredientes: ' + pizza.descricao 
							+ '"><i class="fas fa-question"></i></td>' : "")
							+ (pizza.obs !== "" ? '<td class="text-center col-md-1" class="fundoAlert">' + pizza.obs + '</td>' : '<td class="text-center col-md-1">' + pizza.obs + '</td>')
							+ '<td class="text-center col-md-1">' + pizza.borda + '</td>';
					if(j == 0)
						linhaHtml += '<td class="text-center col-md-1">' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" class="btn btn-success" id="enviar" onclick="enviarPedido()"'
								+ 'value="'+ pedido.id + '"><i class="far fa-check-circle"></i></button></a></td>'
							+'</tr>';

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
			
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: 'Enviar pedido?',
		closeIcon: true,
	    buttons: {
	        confirm: {
	            text: 'Enviar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					imprimir(pedidos[idBusca]);
					pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);

					$.ajax({
						url: "/cozinha/enviarPedido/" + idProduto,
						type: 'PUT'
					}).done(function(){
						document.location.href = "/cozinha";
					});
			    },
			},
			cancel: {
				isHidden: true,
	            keys: ['esc']
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
	impressaoPedido = cliente;
	impressaoPedido.setor = "C";
	
	$.ajax({
		url: "/imprimir/imprimirPizza",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
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