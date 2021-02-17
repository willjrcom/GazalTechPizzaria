$("#filtro").selectmenu().addClass("overflow");
$(document).ready(() => $("#nomePagina").text("Finalizar pedidos"));
var pedidos = [];
var funcionarios = [];
var pizzas = [];
var dado = {};
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var [Tpedido, Tpizzas] = [0, 0];
var verificarTroco = 0;
var valorCupom;


if($("#btnCadastrar").val() == 1){
	$("#divCadastrar").show("slow");
	$("#divFiltro").hide("slow");
}


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");
$(document).ready(function(){
	$.ajax({
		url: "/finalizar/todosPedidos",
		type: 'GET'
	}).done(function(e){
		pedidos = e;
		for(pedido of pedidos){
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(pedido of pedidos){
				linhaHtml += '<tr>'
							+ '<td>' + pedido.comanda + '</td>'
							+ '<td>' + pedido.nome + '</td>'
							+ '<td>R$ ' + (Number(pedido.total) + ((pedido.taxa == null)
									? Number(0) : Number(pedido.taxa))).toFixed(2) + '</td>'
							+ '<td>' + pedido.pagamento + '</td>'
							+ '<td>' + pedido.envio + '</td>'
							+ '<td>' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
								+ 'value="'+ pedido.id + '"><i class="fas fa-cart-arrow-down"></i></button></a></td>'			
						+ '<tr>'
					+ linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
		}
		carregarLoading("none");
	});
});	


//---------------------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;	
	
	Tpizzas = 0;
	dado.totalPizza = 0;
	dado.totalProduto = 0;
	dado.totalLucro = 0;
	
	for(pizza of pedidos[idBusca].pizzas) {
		dado.totalLucro += pizza.custo;
		dado.totalPizza += pizza.qtd;
	}
	Tpizzas = dado.totalPizza;
	
	for(produto of pedidos[idBusca].produtos) {
		dado.totalLucro += produto.custo;
		dado.totalProduto += produto.qtd;
	}
	Tpizzas += dado.totalProduto;
	
	try{
		 valorCupom = Number(pedidos[idBusca].cupom.replace(",", ".").replace("%", "").replace("R$",""));
	}catch(Exception){}
	
	linhaHtml = '';
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table style="width:100%">'
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
		linhaHtml += '<table style="width:100%">'
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
	
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas.toFixed(2);	
	
	if(pedidos[idBusca].envio == "ENTREGA"){
		linhaHtml += '<br><b>Total do Pedido com taxa:</b> R$ ' 
						+ (Number(pedidos[idBusca].total) 
							+ ((pedidos[idBusca].taxa == null) 
								? Number(0) 
								: Number(pedidos[idBusca].taxa))).toFixed(2)
					+ '<br><b>Endereço:</b> ' + pedidos[idBusca].endereco
					+ '<br><b>Motoboy:</b> ' + pedidos[idBusca].motoboy;
	} else{
		linhaHtml += '<br><b>Total do Pedido:</b> R$' 
				+ Number(pedidos[idBusca].total).toFixed(2)
	}
	if(pedidos[idBusca].pagamento == "Não") 
				
		linhaHtml += '<br><b>Receber:</b>'
					+ '<div class="input-group mb-3">'
					+ '<span class="input-group-text">R$</span>'
					+ '<input class="form-control" id="troco" placeholder="Precisa de troco?" value="'
						+ (pedidos[idBusca].total + ((pedidos[idBusca].taxa == null) 
								? Number(0) : Number(pedidos[idBusca].taxa))) + '"/>'
				+ '</div>';
	
	linhaHtml += '<br>Deseja finalizar o pedido?';


	//modal jquery confirmar
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um funcionário!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
	}else {
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nome,
		    content: linhaHtml,
		    closeIcon: true,
		    columnClass: 'col-md-8',
		    buttons: {
		        confirm: {
		            text: 'finalizar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						carregarLoading("block");
						//pedidos[idBusca].ac = $("#filtro").val();
						pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);

						if(pedidos[idBusca].pagamento == "Não") {
							var troco = this.$content.find('#troco').val();

							troco = parseFloat(troco.toString().replace(",","."));
							
							if(Number.isFinite(troco) == false) {
								carregarLoading("none");
								
								$.alert({
									type: 'red',
									title: 'OPS...',
									content: "Digite um valor válido",
									buttons: {
										confirm:{
											text: 'Voltar',
											btnClass: 'btn-danger',
											keys: ['esc', 'enter']
										}
									}
								});
							}
							
							verificarTroco = 1;
						}
						
						dado.totalVendas = (Number(pedidos[idBusca].total) + ((pedidos[idBusca].taxa == null) 
								? Number(0) : Number(pedidos[idBusca].taxa)));
						
						if(pedidos[idBusca].envio == "ENTREGA") {
							dado.entrega = 1;
						}else if(pedidos[idBusca].envio == "BALCAO"){
							dado.balcao = 1;
						}else if(pedidos[idBusca].envio == "MESA"){
							dado.mesa = 1;
						}else if(pedidos[idBusca].envio == "DRIVE"){
							dado.drive = 1;
						}
						
						//salvar dados
						$.ajax({
							url: "/finalizar/dados/" + pedidos[idBusca].id,
							type: "PUT",
							beforeSend: function(){
								if(pedidos[idBusca].envio !== "ENTREGA")
									imprimir(pedidos[idBusca]);
							},
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(dado)
						});
						
						$.ajax({
							url: "/finalizar/finalizarPedido/" + idProduto + '/' + $("#filtro").val(),
							type: 'PUT'
						}).done(function(){
							document.location.href="/finalizar";
							
						}).fail(function(){
							carregarLoading("none");
							if(verificarTroco == 0) $.alert("Pedido não enviado!");
							
							else $.alert("Pedido não enviado!<br>Digite um valor válido.");
						});
					}
		        },
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
};


//----------------------------------------------------------------------------
function imprimir(cliente) {
	
	impressaoPedido = cliente;

	impressaoPedido.pizzas = JSON.parse(cliente.pizzas);
	impressaoPedido.produtos = JSON.parse(cliente.produtos);

	if(cliente.obs != "") impressaoPedido.obs = cliente.obs;
				
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
