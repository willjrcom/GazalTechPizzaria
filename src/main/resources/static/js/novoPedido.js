
//var cliente
//------------------------------------------------------------------------------------------------------------------------
var cliente = {};
var cliente_json;

var produtos = [];
var buscaProdutos = [];

//var pedido
//------------------------------------------------------------------------------------------------------------------------
var Sabor;
var Preco;
var Qtd ;
var Borda;
var Obs;

var tPizzas = 0;
var tPedido = 0;
var linhaHtml = "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var produtosSelect = $("#novoProduto").html();
var buttonRemove = '<a class="removerProduto"><button type="button" class="btn btn-danger">Remover</button></a>';
var pedidoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';
$("#mostrar").hide(); //esconder tabelas
$("#mostrarProdutos").hide();
$(".mostrarPedidos").hide();
$("#ConfirmarCliente").hide(); //esconder botao confirmar
$("#editarCliente").hide(); //esconder botao confirmar
$("#Ttotal").html('Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$0,00 &nbsp;&nbsp;&nbsp;');


//------------------------------------------------------------------------------------------------------------------------
$("#buscarCliente").click(function() {
	
	var numero = $("#numeroCliente").val();
	urlNumero = "/novoPedido/numeroCliente/" + numero.toString();
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	})
	
	.done(function(e){
		if(this.length == 0 || !this){
			window.location.href = "/cadastroCliente";
		}
		$("#mostrar").show('slow'); //esconder tabelas
		$("#ConfirmarCliente").show('slow'); //esconder botao confirmar
		
		console.log(e);
		let clientes = {};
			clientes.id = e.id;
			clientes.nome = e.nome;
			clientes.celular = e.celular;
			clientes.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
			clientes.taxa = e.endereco.taxa;
			
		$("#idCliente").text(clientes.id);
		$("#nomeCliente").text(clientes.nome).css('background-color', '#D3D3D3');
		$("#celCliente").text(clientes.celular);
		$("#enderecoCliente").text(clientes.endereco);
		$("#taxaCliente").text('Taxa: R$ ' + clientes.taxa + ',00');
	});	
})


//------------------------------------------------------------------------------------------------------------------------
$("#ConfirmarCliente").click(function(){
	cliente.codigoPedido = $("#idCliente").text();
	cliente.nomePedido = $("#nomeCliente").text();
	cliente.celular = $("#celCliente").text();
	cliente.endereco = $("#enderecoCliente").text();
	cliente.envio = $("#envioCliente").val();
	cliente.tempo = $("#tempoCliente").val();
	cliente.pagamento = $("#pagamentoCliente").val();
	
	console.log(cliente.tempo);
	console.log(cliente.pagamento);
	
	if($("#idCliente").text() == ""){
		alert("Nenhum Cliente adicionado!");
	}else{
		$("#divBuscar").hide('slow');
		$(".esconder1").hide("slow");
		$("#mostrar").hide("slow");
		$("#mostrarProdutos").show('slow');
		$("#editarCliente").show('slow');
		$("#dados").html(
				'<table style="width: 50%">'
					+ '<thead><tr><th colspan="4"><h5>Cliente</h5></th></tr></thead>'
					+ '<tr>'
						+ '<td class="text-left col-md-1 fundoList">' + cliente.codigoPedido + '</td>'
						+ '<td class="text-left col-md-1">' + cliente.nomePedido.split(' ')[0] + '</td>'
						+ '<td class="text-left col-md-1 fundoList">' + cliente.celular + '</td>'
						+ '<td class="text-left col-md-1">' + cliente.envio + '</td>'
					+ '</tr>'
				+ '</table>');

		$("#focusProduto").html('<input type="search" name="nomeProduto" class="form-control mb-2" id="nomeProduto"'
				+ 'style="text-indent: 10px" placeholder="Qual produto está procurando?"/>');
	}
})


//------------------------------------------------------------------------------------------------------------------------
$("#editarCliente").click(function(){
	$("#mostrar").show('slow');
	$(this).hide('slow');
	$("#ConfirmarCliente").show('slow');
});


//------------------------------------------------------------------------------------------------------------------------
$("#buscarProduto").click(function(){
	var produto = $("#nomeProduto").val();
	urlProduto = "/novoPedido/nomeProduto/" + produto.toString();
	
	$.ajax({
		url: urlProduto,
		type: 'PUT'
	})
	.done(function(e){
		buscaProdutos = [];
		
		for(var i = 0; i < e.length; i++){
			buscaProdutos.push({
				'id': e[i].id,
				'nomeProduto': e[i].nomeProduto,
				'preco': e[i].preco
			});
		};

		$("#listaProdutos").show('slow');
		$("#todosProdutos").html(" ");
		
		for(var i=0; i<buscaProdutos.length; i++){
			linhaHtml = "";
			linhaHtml += '<tr>';
			linhaHtml += 	'<td class="col-md-1">' + buscaProdutos[i].nomeProduto + '</td>';
			linhaHtml += 	'<td class="col-md-1">R$ ' + buscaProdutos[i].preco + '</td>';
			linhaHtml += '<td class="col-md-1">'
							+ '<div>'
							+ '<button type="submit" style="background-color: white; border: none" onclick="enviarProduto()"'
							+ 'title="Adicionar" class="enviarProduto" value="' + buscaProdutos[i].id + '">'
								+ '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
								+ '<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>'
								+ '<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>'
								+ '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'
								+ '</svg>'
							+ '</button>'
						+ '</div>'
					+'</td>';
			linhaHtml += '</tr>';
			
			$("#todosProdutos").append(linhaHtml);
		}
		
		if(buscaProdutos.length == 0){
			$("#todosProdutos").html('<tr>'
			+ '<td colspan="6" th:if="${#lists.isEmpty(produtos)}">Nenhum produto encontrado!</td>'
			+ '</tr>');
		}
	});
});


//------------------------------------------------------------------------------------------------------------------------

function enviarProduto() {


	Qtd = parseFloat($("#qtd").val());
	
	if(isNaN(Qtd) == false){
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		var urlReceber = "/novoPedido/addProduto/" + idProduto.toString();
		
		$.ajax({
			url: urlReceber,
			type: 'PUT'
		})
		.done(function(e){
			
			$(".mostrarPedidos").show('slow');
			
			Sabor = e.nomeProduto;
			Preco = e.preco;
			Qtd = parseFloat($("#qtd").val());
			Borda = $("#borda").val();
			Obs = $("#obs").val();
		
			Preco *= Qtd;
			tPizzas += Qtd;
			tPedido += Preco;
			
			produtos.unshift({
				'sabor' : Sabor,
				'qtd': Qtd,
				'borda': Borda,
				'obs': Obs,
				'preco': Preco
			});
			
			$("#novoProduto").html("");
			
			for(var i=0; i<produtos.length; i++){
				linhaHtml = "";
				linhaHtml += '<tr>';
				linhaHtml += 	'<td>' + produtos[i].borda + '</td>';
				linhaHtml += 	'<td>' + produtos[i].sabor + '</td>';
				linhaHtml += 	'<td>' + produtos[i].obs + '</td>';
				linhaHtml += 	'<td>' + produtos[i].qtd + '</td>';
				linhaHtml += 	'<td>R$ ' + produtos[i].preco + '</td>';
				linhaHtml += '</tr>';
				$("#novoProduto").append(linhaHtml + '<tr>' + linhaCinza + '</tr>');
			}
		
			$("#Ttotal").html('Total de Pizzas:  ' + tPizzas + '<br><br>' + 'Total do Pedido:  R$' + tPedido + '&nbsp;&nbsp;&nbsp;');
		});
	}else{
		Qtd = $("qtd").val("1");
		alert("Valor incorreto na quantidade");
	}
};


//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(e){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	produtos.shift();
	
	$("#novoProduto").html("");
	
	if(produtos.length == 0) {
		$("#novoProduto").append(pedidoVazio);
		$(".mostrarPedidos").hide('slow');	
	} else {
		for(var i=0; i<produtos.length; i++){
			linhaHtml = "";
			linhaHtml += '<tr>';
			linhaHtml += 	'<td>' + produtos[i].borda + '</td>';
			linhaHtml += 	'<td>' + produtos[i].sabor + '</td>';
			linhaHtml += 	'<td>' + produtos[i].obs + '</td>';
			linhaHtml += 	'<td>' + produtos[i].qtd + '</td>';
			linhaHtml += 	'<td>R$ ' + produtos[i].preco + '</td>';
			linhaHtml += '</tr>';
			$("#novoProduto").append(linhaHtml + '<tr>' + linhaCinza + '</tr>');
		}
	}
	$("#Ttotal").html('Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + tPedido + '&nbsp;&nbsp;&nbsp;');	
});


//------------------------------------------------------------------------------------------------------------------------
$("#enviarPedido").click(function() {
	
	if(Object.keys(produtos).length === 0 && $("#idCliente").text() == ""){
		alert("Nenhum produto adicionado!\nNenhum cliente adicionado!");
	}else if($("#idCliente").text() == ""){
		alert("Nenhum cliente adicionado!");
	}else if(Object.keys(produtos).length === 0){
		alert("Nenhum produto adicionado!");	
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		alert("Apenas valores inteiros!");	
	}else{
		cliente.total = tPedido;
		cliente.produtos = JSON.stringify(produtos);
		cliente.status = "COZINHA";
		
		console.log(cliente);
		
		$.ajax({
			url: "/novoPedido/salvarPedido",
			type: "PUT",
			dataType : 'json',
			contentType: "application/json",
			data: JSON.stringify(cliente)
			
		}).done(function(e){
			alert("Pedido enviado!");
			//window.location.href = "/novoPedido"; 
			
		}).fail(function(e){
			alert("Pedido não enviado!");
		});
	}
});

