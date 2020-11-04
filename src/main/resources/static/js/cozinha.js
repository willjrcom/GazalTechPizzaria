var pedidos = [];
var produtos = [];
var pizzas = [];
var linhaHtml =  "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido a fazer!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;
var AllPizzas = 0;
var divisao;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);
	
function buscarPedido() {
	pedidos = [];
	produtos = [];
	pizzas = [];
	Tpedidos = 0;
	Tpizzas = 0;
	AllPizzas = 0;
	
	$.ajax({
		url: "/cozinha/todosPedidos",
		type: 'PUT'
	}).done(function(e){

		pedidos = e;
		for(var i = 0; i< e.length; i++){
			Tpedidos++;
			pedidos[i].pizzas = JSON.parse(pedidos[i].pizzas);
		}

		$("#todosPedidos").html("");
		filtro = $("#filtro").val();
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				if(filtro == pedidos[i].envio || filtro == "TODOS"){
					if(pedidos[i].pizzas.length != 0) {
						divisao = 1;
						
						linhaHtml += '<tr>'
								+ '<td>' + pedidos[i].comanda + '</td>'
								+ '<td>' + pedidos[i].nome + '</td>'
								+ '<td>' + pedidos[i].pizzas[0].borda + '</td>'
								+ '<td>' + pedidos[i].pizzas[0].qtd + ' x ' + pedidos[i].pizzas[0].sabor 
									+ '&nbsp;&nbsp;<button class="descricao" onclick="descricao()" value="' 
									+ pedidos[i].pizzas[0].descricao 
									+ '" title="Ingredientes: ' + pedidos[i].pizzas[0].descricao 
									+ '"><span class="oi oi-question-mark"></span></button></td>'
								+ '<td>' + pedidos[i].pizzas[0].obs + '</td>';
					
						if(i == 0) {//adicionar autofocus
							linhaHtml += '<td>' 
										+ '<a class="enviarPedido">'
										+ '<button type="button" class="btn btn-success" autofocus="autofocus" onclick="enviarPedido()"'
										+ 'value="'+ pedidos[i].id + '"><span class="oi oi-task"></span> Enviar</button></a></td>';
						}else {
							linhaHtml += '<td>' 
										+ '<a class="enviarPedido">'
										+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
										+ 'value="'+ pedidos[i].id + '"><span class="oi oi-task"></span> Enviar</button></a></td>';
						}
						linhaHtml += '</tr>';
						
						if(divisao - pedidos[i].pizzas[0].qtd <= 0) {
							linhaHtml += linhaCinza;
							divisao = 1;
						}else {
							divisao -= pedidos[i].pizzas[0].qtd;
						}
						
						//mostrar produtos
						if(pedidos[i].pizzas.length > 1){
							for(var j = 1; j<pedidos[i].pizzas.length; j++){
								linhaHtml += '<tr>';
								
								if(j == 1) {
									Tpizzas = 0;
									for(var k = 0; k<pedidos[i].pizzas.length; k++) {
										Tpizzas += pedidos[i].pizzas[k].qtd;
									}
									AllPizzas += Tpizzas;
									
									if(Tpizzas == 1) {
										linhaHtml += '<td colspan="2">' + Tpizzas + ' pizza</td>';
									}else {
										linhaHtml += '<td colspan="2">' + Tpizzas + ' pizzas</td>';
									}
									
								}else {
									linhaHtml +=	'<td colspan="2"></td>';
								}
								linhaHtml += '<td>' + pedidos[i].pizzas[j].borda + '</td>'
											+ '<td>' + pedidos[i].pizzas[j].qtd + ' x ' + pedidos[i].pizzas[j].sabor 
												+ '&nbsp;&nbsp;<button class="descricao" onclick="descricao()" value="' 
												+ pedidos[i].pizzas[j].descricao 
												+ '" title="Ingredientes: ' + pedidos[i].pizzas[j].descricao 
												+ '"><span class="oi oi-question-mark"></span></button></td>'
											+ '<td>' + pedidos[i].pizzas[j].obs + '</td>'
											+ '<td></td>'
											+ '</tr>';	
			
								if(divisao - pedidos[i].pizzas[j].qtd <= 0) {
									linhaHtml += linhaCinza;
									divisao = 1;
								}else {
									divisao -= pedidos[i].pizzas[j].qtd;
								}
							}
						}
						linhaHtml += linhaCinza + linhaCinza + linhaCinza;
					}
				}
			}
			$("#todosPedidos").html(linhaHtml);
		}
		if(Tpedidos == 0) {
			$("#Tpedidos").text('0');
		}else {
			$("#Tpedidos").text(pedidos.length);
		}
		
		if(AllPizzas == 0) {
			$("#Tpizzas").text('0');
		}else {
			$("#Tpizzas").text(AllPizzas);
		}
	});	
};


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
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
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
					
					for(var i = 0; i<pedidos[idBusca].pizzas; i++) {
						pedidos[idBusca].pizzas[i].status = "PRONTO";
					}
					
					pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);

					console.log(pedidos[idBusca]);
					$.ajax({
						url: "/cozinha/enviarPedido/" + idProduto.toString(),
						type: 'PUT',
						data: pedidos[idBusca], //dados completos do pedido enviado
					})
					.done(function(e){
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
/*
//ajax reverso
function init() {
	console.log("dwr init....");
	dwr.engine.setActiveReverseAjax(true);
};
*/

//recarregar a cada 5 segundos
buscarPedido();

setInterval(function (){
	buscarPedido();
},5000);


//----------------------------------------------------------------------------
function imprimir(cliente) {
	//salvar hora atual
	var data = new Date();
	console.log(data);
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
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			//dados da empresa
			console.log(cliente);
			imprimirTxt = '<h1 align="center">' + e.nomeEmpresa + '</h1>'
						+ '<h2 align="center"><b>' + cliente.envio + '</b></h2>'
						
						//numero da comanda e nome
						+ '<label>Comanda: ' + cliente.comanda + '</label><br>'
						+ '<label>Cliente: ' + cliente.nome + '</label><br>';
	
			//gerar tabela de produtos e pizzas
			mostrarTabela(cliente.pizzas);
			
			imprimirTxt += '<hr>' + linhaHtml + '<hr>'
					+ 'Pronto às: ' + hora + ':' + minuto + ':' + segundo
					+ '<br>Data: ' + dia + '/' + mes + '/' + ano;
				
			tela_impressao = window.open('about:blank');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
		}
	});
}


//-----------------------------------------------------------------------
function mostrarTabela(pizzas) {
	
	linhaHtml = '';
	if(pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Sabor ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Qtd ---- </h5></th>'
						+ '<th class="col-md-1"><h5>V. Uni ---- </h5></th>'
						+ '<th class="col-md-1"><h5>V. Total ---- </h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].sabor + '</td>'
						 +	'<td align="center">' + parseFloat(pizzas[i].qtd).toFixed(2) + ' ---- </td>'
						 +  '<td align="center">R$ ' + parseFloat(pizzas[i].preco).toFixed(2) + ' ---- </td>'
						 +  '<td align="center">R$ ' + (parseFloat(pizzas[i].preco) * pizzas[i].qtd).toFixed(2) + ' ---- </td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}