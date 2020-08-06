$(document).ready(function () {
	
	var clientes = [];
	var linhaHtml;
	var pedidoVazio = '<tr><td colspan="5">Nenhum cliente encontrado!</td></tr>';
	var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';

	$("#todosClientes").html(pedidoVazio);
	
	$("#buscar").click(function(){
		var nome = $("#nomeBusca").val();
		console.log(nome);
		
		$.ajax({
			url: '/clientesCadastrados/buscar/' + nome,
			type: 'PUT'
		}).done(function(e){
			console.log(e);
			clientes = [];
			for(var i = 0; i<e.length; i++) {
				clientes.unshift({
					'id': e[i].id,
					'nome': e[i].nome,
					'celular': e[i].celular,
					'endereco': e[i].endereco.rua + ' - ' + e[i].endereco.n  + ' - ' + e[i].endereco.bairro
				});
			}

			linhaHtml = "";
			for(var i=0; i<clientes.length; i++){
				linhaHtml += '<tr>';
				linhaHtml += 	'<td>' + clientes[i].id + '</td>';
				linhaHtml += 	'<td>' + clientes[i].nome + '</td>';
				linhaHtml += 	'<td>' + clientes[i].celular + '</td>';
				linhaHtml += 	'<td>' + clientes[i].endereco + '</td>';
				linhaHtml += 	'<td></td>';
				linhaHtml += '</tr>';
				linhaHtml += linhaCinza;
			}
			$("#todosClientes").html(linhaHtml);
			
		}).fail(function(){
			$.alert("Nenhum cliente encontrado!");
		});
	});
});