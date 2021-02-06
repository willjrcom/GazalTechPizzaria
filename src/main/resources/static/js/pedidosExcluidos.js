var pedidos = [];
var pizzas = [];
var produtos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido cancelado!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");

$.ajax({
	url: "/pedidosExcluidos/todosPedidos",
	type: 'GET'
}).done(function(e){
	pedidos = e;
	
	for(pedido of pedidos){
		Tpedidos++;
		pedido.pizzas = JSON.parse(pedido.pizzas);
		pedido.produtos = JSON.parse(pedido.produtos);
	}
	
	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(pedido of pedidos){
			Tpizzas = 0;
			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			
			linhaHtml += '<tr>'
						+ '<td>' + pedido.comanda + '</td>'
						+ '<td>' + pedido.nome + '</td>'
						+ '<td>' + Tpizzas.toFixed(2) + '</td>'
						+ '<td>R$ ' + pedido.total.toFixed(2) + '</td>'
						+ '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" class="botao" onclick="verPedido()"'
							+ 'value="'+ pedido.id + '"><i class="fas fa-search"></i></button></a></td>'			
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
	carregarLoading("none");
});	


//-------------------------------------------------------------------------------------------------------
function verPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	Tpizzas = 0;
	for(produto of pedidos[idBusca].produtos) Tpizzas += produto.qtd;
	
	for(pizza of pedidos[idBusca].pizzas) Tpizzas += pizza.qtd;
	
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
					+ '</tr>';
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td>' + pizza.qtd + " x " + pizza.sabor + '</td>'
						 +  '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
						 +	'<td>' + pizza.borda + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td>' + produto.qtd + " x " + produto.sabor + '</td>'
						 +  '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas.toFixed(2) + '<br><br>'
			+ '<b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
			+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio
			+ '<br><b>Hora do pedido:</b> ' + pedidos[idBusca].horaPedido;

	$.alert({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml,
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			tudo: {
			text: '<i class="fas fa-print"></i> Pedido',
	        btnClass: 'btn-success',
	        	action: function(){
					imprimirTudo(pedidos[idBusca]);
				}
			}
		},
	    cancel: {
            isHidden: true, // hide the button
            keys: ['esc']
		}
	});
};



//-------------------------------------------------
function imprimirTudo(cliente) {

	//buscar dados da empresa
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'GET'
	}).done(function(e){
		if(e.length != 0) {
			
			impressaoPedido = {};
			impressaoPedido.nomeEstabelecimento = e.nomeEstabelecimento;//nome do estabelecimento
			impressaoPedido.envio = cliente.envio; //forma de envio
			impressaoPedido.texto1 = e.texto1;//texto1 gerado pela empresa
			impressaoPedido.cnpj = e.cnpj;
			impressaoPedido.enderecoEmpresa = e.endereco.rua + " " + e.endereco.n + "\n" + e.endereco.bairro;
					
					//numero da comanda e nome
			impressaoPedido.comanda = cliente.comanda;
			impressaoPedido.nome = cliente.nome;
		
			//mostrar endereco do cliente
			if(cliente.envio == 'ENTREGA') {
				impressaoPedido.celular = cliente.celular
				impressaoPedido.endereco =  cliente.endereco;
			}
			impressaoPedido.pizzas = cliente.pizzas;
			impressaoPedido.produtos = cliente.produtos;
	
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				impressaoPedido.total = cliente.total;
				impressaoPedido.taxa = cliente.taxa;
				
				//total sem taxa
			}else impressaoPedido.total = cliente.total;
	
			//total a levar de troco
			impressaoPedido.troco = cliente.troco;

			if(cliente.obs != "") impressaoPedido.obs = cliente.obs;
						
			//texto2 e promocao
			impressaoPedido.texto2 = e.texto2;
			impressaoPedido.promocao = e.promocao;
						
			//salvar hora
			impressaoPedido.hora = cliente.horaPedido;
			impressaoPedido.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];
			
			$.ajax({
				url: "/imprimir/imprimirPedido",
				type: 'POST',
				dataType : 'json',
				contentType: "application/json",
				data: JSON.stringify(impressaoPedido)
			});
		}
	});
}

	
function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
