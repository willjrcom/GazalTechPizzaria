$(document).ready(function () {
	var funcionarios = [];
	var linhaHtml;
	var pedidoVazio = '<tr><td colspan="5">Nenhum funcionario encontrado!</td></tr>';
	var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';
	
	$("#todosFuncionarios").html(pedidoVazio);
	
	$("#buscar").click(function(){
		var nome = $("#nomeBusca").val();
		console.log(nome);
		
		$.ajax({
			url: '/funcionariosCadastrados/buscar/' + nome,
			type: 'PUT'
		}).done(function(e){
			console.log(e);
			
			funcionarios = [];
			
			for(var i = 0; i<e.length; i++) {
				funcionarios.unshift({
					'id': e[i].id,
					'nome': e[i].nome,
					'celular': e[i].celular,
					'cargo': e[i].cargo
				});
			}
			
			linhaHtml = '';
			if(funcionarios.length == 0) {
				linhaHtml += pedidoVazio;
			}else {
				for(var i = 0; i<funcionarios.length; i++) {
					linhaHtml += '<tr>';
					linhaHtml += 	'<td>' + funcionarios[i].id + '</td>';
					linhaHtml += 	'<td>' + funcionarios[i].nome + '</td>';
					linhaHtml += 	'<td>' + funcionarios[i].celular + '</td>';
					linhaHtml += 	'<td>' + funcionarios[i].cargo + '</td>';
					linhaHtml += 	'<td></td>';
					linhaHtml += '</tr>';
					linhaHtml += linhaCinza;
				}
			}
			
			$("#todosFuncionarios").html(linhaHtml);
			
		}).fail(function(){
			$.alert("Nenhum funcionario encontrado!");
		});
	});
});