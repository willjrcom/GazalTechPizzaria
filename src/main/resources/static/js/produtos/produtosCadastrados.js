$(document).ready(function(){
	var produtos = [];

	var linhaHtml;
	var pedidoVazio = '<tr><td colspan="5">Nenhum produto encontrado!</td></tr>';
	var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';

	$("#todosProdutos").html(pedidoVazio);
	
	$("#buscar").click(function(){
		
		var nome = $("#nomeBusca").val();
		console.log(nome);
		
		$.ajax({
			url: '/produtosCadastrados/buscar/' + nome,
			type: 'PUT'
		}).done(function(e){
			console.log(e);
			
			produtos = [];
			
			for(var i = 0; i<e.length; i++) {
				produtos.unshift({
					'id': e[i].id,
					'nomeProduto': e[i].nomeProduto,
					'preco': e[i].preco,
					'estoque': e[i].estoque
				});
			}
			
			linhaHtml = '';
			
			if(produtos.length != 0) {
				for(var i = 0; i<produtos.length; i++) {
					linhaHtml += '<tr>'
								+'<td>' + produtos[i].id + '</td>'
								+'<td>' + produtos[i].nomeProduto + '</td>'
								+'<td>' + produtos[i].preco + '</td>'
								+'<td>' + produtos[i].estoque + '</td>'
								+'<td></td>'
								+'</tr>'
								+ linhaCinza;
				}
				$("#todosProdutos").html(linhaHtml);
			}
		}).fail(function(){
			$.alert("Produto não encontrado!");
		});
	});
	
});