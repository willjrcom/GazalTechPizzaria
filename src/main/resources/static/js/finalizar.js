var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var Tpedido = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$("#enviarPedido").tooltip();

$.ajax({
	url: "/pronto/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if((e[i].status == "PRONTO" && e[i].envio == "BALCAO") || (e[i].status == "PRONTO" &&  e[i].envio == "MESA") || (e[i].status == "PRONTO" && e[i].envio == "DRIVE")){
			
			pedidos.push({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'status': e[i].status,
				'pagamento': e[i].pagamento,
				'produtos': JSON.parse(e[i].produtos)	
			});
		}
	}
	
	$.ajax({
		url: "/motoboy/funcionarios",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);
		
		for(var i = 0; i<e.length; i++){
			if(e[i].cargo == "MOTOBOY"){
				funcionarios.unshift({
					'id': e[i].id,
					'nome': e[i].nome
				});
			}
		}
		
		var linhaFuncionarios = '<option value="--">-------</option>';
		
		for(var i = 0; i<funcionarios.length; i++){
			linhaFuncionarios += '<option value="' + funcionarios[i].id + '">' + funcionarios[i].nome +'</option>';
		}
		
		$("#filtro").html(linhaFuncionarios);

		$("#todosPedidos").html("");
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				linhaHtml += '<tr>';
				linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
				linhaHtml +=	'<td></td>';
				
				Tpizzas = 0;
				for(var k = 0; k<pedidos[i].produtos.length; k++) {
					Tpizzas += pedidos[i].produtos[k].qtd;
				}
				
				linhaHtml +=	'<td>' + Tpizzas + '</td>';
				linhaHtml +=	'<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pagamento + '</td>';
				linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Finalizar</button></a></td>';			
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
		}
	});
});	

function finalizarPedido() {
				
//---------------------------------------------------------------------------------
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/finalizar/finalizarPedido/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	Tpizzas = 0;
	for(var k = 0; k < pedidos[idBusca].produtos.length; k++) {
		Tpizzas += pedidos[idBusca].produtos[k].qtd;
	}
	
	linhaHtml = "";
	linhaHtml = '<table><tr>'
					+ '<td>Borda</td>'
					+ '<td>Sabor</td>'
					+ '<td>Obs</td>'
					+ '<td>Qtd</td>'
					+ '<td>Preço</td>'
				'</tr>';
	
	for(var i=0; i<pedidos[idBusca].produtos.length; i++){
		linhaHtml += '<table><tr>';
		linhaHtml += 	'<td>' + pedidos[idBusca].produtos[i].borda + '</td>';
		linhaHtml += 	'<td>' + pedidos[idBusca].produtos[i].sabor + '</td>';
		linhaHtml += 	'<td>' + pedidos[idBusca].produtos[i].obs + '</td>';
		linhaHtml += 	'<td>' + pedidos[idBusca].produtos[i].qtd + '</td>';
		linhaHtml += 	'<td>R$ ' + pedidos[idBusca].produtos[i].preco + '</td>';
		linhaHtml += '</tr>';
	}
	linhaHtml += '</table>';
	linhaHtml += 'Total de Pizzas: ' + Tpizzas + '<br><br>' + 'Total do Pedido: R$' + pedidos[idBusca].total;	
	linhaHtml += '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" required />';
	linhaHtml += '<br>Deseja enviar o pedido?';


//modal jquery confirmar
	if($("#filtro").val() == "--"){
		$.alert("Escolha um funcionário!");
	}else {
		$.confirm({
			icon: 'fa fa-spinner fa-spin',
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + pedidos[idBusca].nomePedido.split(' ')[0],
		    content: 'Produtos escolhidos' + linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						pedidos[idBusca].ac = $("#filtro").val();
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
						
						var troco = this.$content.find('#troco').val();
						console.log(troco);
						
						pedidos[idBusca].troco = parseFloat(troco);
						
						$.ajax({
							url: urlEnviar,
							type: "PUT",
							dataType : 'json',
							contentType: "application/json",
							data: pedidos[idBusca]
							
						}).done(function(e){
							document.location.reload(true);; 
							
						}).fail(function(e){
							$.alert("Pedido não enviado!");
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