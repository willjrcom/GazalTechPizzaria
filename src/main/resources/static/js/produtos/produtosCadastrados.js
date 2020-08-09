
var produtos = [];

var linhaHtml;
var pedidoVazio = '<tr><td colspan="5">Nenhum produto encontrado!</td></tr>';
var linhaCinza = '<tr><td colspan="5" class="fundoList"></td></tr>';

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
							+'<td>' + produtos[i].estoque + '</td>';
				
linhaHtml += '<td><div class="row">';
				
				linhaHtml +='<div class="col-md-1">'
								+'<a style="background-color: white" title="Ver">'
									+'<button style="background-color: white; border: none" onclick="verCliente()" value="'+ produtos[i].id + '">'
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h8a1.5 1.5 0 0 0 1.5-1.5V9a.5.5 0 0 0-1 0v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 5v8zm7-11a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.5H9a.5.5 0 0 1-.5-.5z"/>'
											+'<path fill-rule="evenodd" d="M14.354 1.646a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708-.708l8-8a.5.5 0 0 1 .708 0z"/>'
										+'</svg>'
									+'</button>'
								+'</a>'
							+'</div>';
						
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Editar">'
									+'<button style="background-color: white; border: none" onclick="editarCliente()" value="'+ produtos[i].id + '">'
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brush" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path d="M15.213 1.018a.572.572 0 0 1 .756.05.57.57 0 0 1 .057.746C15.085 3.082 12.044 7.107 9.6 9.55c-.71.71-1.42 1.243-1.952 1.596-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.212-1.543.346-.542.887-1.273 1.642-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/>'
											+'<path d="M7 12a2 2 0 0 1-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 0 1 2 2z"/>'
										+'</svg>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Excluir">'
									+'<button style="background-color: white; border: none" onclick="excluirCliente()" value="'+ produtos[i].id + '">'
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
										    +'<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>'
										    +'<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>'
										+'</svg>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '</td></tr>';
							
				linhaHtml += '</tr>'
							+ linhaCinza;
			}
			$("#todosProdutos").html(linhaHtml);
		}
	}).fail(function(){
		$.alert("Produto não encontrado!");
	});
});