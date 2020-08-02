var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhuma entrega para receber!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/motoboy/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	console.log(e);
	
	for(var i = 0; i< e.length; i++){
		if(e[i].status == "MOTOBOY"){
			Tpedidos++;
			
			pedidos.push({
				'id' : e[i].id,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'envio': e[i].envio,
				'total': e[i].total,
				'troco': e[i].troco,
				'status': e[i].status,
				'produtos': e[i].produtos,
				'motoboy': e[i].motoboy
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
				})
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
				linhaHtml +=	'<td>' + pedidos[i].endereco + '</td>';
				
				for(var j = 0; j<funcionarios.length; j++){
					if(funcionarios[j].id == pedidos[i].motoboy){
						linhaHtml +=	'<td>' + funcionarios[j].nome + '</td>';
					}
				}
				
				linhaHtml +=	'<td>18:30</td>';
				linhaHtml +=	'<td>R$ ' + pedidos[i].troco.toFixed(2) + '</td>';
				linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Finalizar</button></a></td>';			
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	});
});	
	

function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/receber/finalizar/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
			
	if($("#filtro").val() == "--"){
		$.alert("Escolha um funcionário!");
	}else{
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Pedido: ' + pedidos[idBusca].nomePedido.split(' ')[0],
		    content: 'Deseja finalizar?',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						pedidos[idBusca].ac = $("#filtro").val();
						$.ajax({
							url: urlEnviar,
							type: 'PUT',
							data: pedidos[idBusca], //dados completos do pedido enviado
						})
						.done(function(e){
							console.log(e);
							document.location.reload(true);
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