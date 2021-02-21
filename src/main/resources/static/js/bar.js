
var [pedidos, produtos, pizzas] = [[], [], []];
var linhaHtml =  "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>';
var [Tpedidos, totalPedidos] = [0, 0];
var divisao;

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Bar"));

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
		url: "/bar/todosPedidos",
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
			$("#totalPizzas").val(AllPizzas + ' Bebida a fazer');
		} else{
			$("#totalPizzas").val(AllPizzas + ' Bebidas a fazer');
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
			
			linhaHtml = "";
			for([i, pedido] of pedidos.entries()){
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
							if(Tpizzas == 1) linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' bebida</td>';
							//plural
							else linhaHtml += '<td class="text-center col-md-1" colspan="2">Total: ' + Tpizzas + ' bebidas</td>';
							
							
						}else {//se for 3 linha a frente
							linhaHtml += '<td class="text-center col-md-1" colspan="2"></td>';
						}
						
						//mostrar pizza
						linhaHtml += '<td class="text-center col-md-1">' + pizza.qtd + ' x ' + pizza.sabor 
								+ (pizza.descricao != ''?'&nbsp;&nbsp;<button class="descricao" onclick="descricao()" value="' 
								+ pizza.descricao 
								+ '" title="Ingredientes: ' + pizza.descricao 
								+ '"><i class="fas fa-question"></i></td>' : "")
								+ (pizza.obs !== "" ? '<td class="text-center col-md-1" class="fundoAlert">' + pizza.obs + '</td>' : '<td class="text-center col-md-1">' + pizza.obs + '</td>');
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
					linhaHtml += linhaCinza + linhaCinza + linhaCinza;
				}
			}
			if(linhaHtml != "") {
				$("#todosPedidos").html(linhaHtml);
			}else {
				$("#todosPedidos").html(pedidoVazio);
			}
		}

		try {$("#enviar")[0].focus();}catch{}

		totalPedidos = Tpedidos;
		carregarLoading("none");
	});	
};


//----------------------------------------------------------------------------------------------------------
function descricao() {
	var botaoReceber = $(event.currentTarget);
	var descricao = botaoReceber.attr('value');
	
	$.alert({
		type: 'blue',
		title: 'Modo de preparo:',
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
					pedidos[idBusca].produtos = pedidos[idBusca].pizzas;
					imprimir(pedidos[idBusca]);

					$.ajax({
						url: "/bar/enviarPedido/" + idProduto,
						type: 'PUT'
					}).done(function(){
						document.location.href="/bar";
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


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
			
	var impressaoPedido = cliente;
	impressaoPedido.setor = "B";

	//salvar hora
	impressaoPedido.hora = hora + ':' + minuto + ':' + segundo;
	impressaoPedido.data = dia + '/' + mes + '/' + ano;
	
	$.ajax({
		url: "/imprimir/imprimirProduto",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
}
