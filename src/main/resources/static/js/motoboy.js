var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="6" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido para entregar!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
window.onload = function() {
	$("#todosPedidos").html(linhaCinza);
	
	$.ajax({
		url: "/motoboy/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);
		
		for(var i = 0; i< e.length; i++){
			if((e[i].status == "PRONTO" && e[i].envio == "ENTREGA") || (e[i].status == "PRONTO" && e[i].envio == "IFOOD")){
				Tpedidos++;
				
				pedidos.push({
					'id' : e[i].id,
					'nomePedido' : e[i].nomePedido,
					'celular' : e[i].celular,
					'endereco': e[i].endereco,
					'envio': e[i].envio,
					'total': e[i].total,
					'troco': e[i].troco,
					'status': e[i].status
					//criar for para produtos	
				});
			}
		}
	});	
	
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
	});
	
	
	setTimeout(function(){
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
				linhaHtml +=	'<td>'
								+ '<div class="distMargin">'
									+ '<select name="filtro" class="filtro">'
									+ '<option value="--">-----------</option>';
				
				for(var j = 0; j<funcionarios.length; j++){
					linhaHtml += '<option value="' + funcionarios[j].id + '">' + funcionarios[j].nome + '</option>';
				}
				linhaHtml += '</select></div></td>';
								
				linhaHtml += '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Entregar</button></a></td>';			
				linhaHtml += '<tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	},100);
		
	
};

function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/motoboy/enviarMotoboy/" + idProduto.toString();
	console.log(urlEnviar);
	
	if($(".filtro").val() == "--"){
		alert("Escolha um motoboy!");
	}else{
		var confirmar = confirm("Deseja entregar?");
		
		if(confirmar == true){
			for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
				if(pedidos[i].id == idProduto){
					var idBusca = i;
				}
			}
			
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
	}
};