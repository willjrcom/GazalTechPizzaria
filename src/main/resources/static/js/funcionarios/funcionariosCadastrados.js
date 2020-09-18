
var funcionarios = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="5">Nenhum funcionario encontrado!</td></tr>';
var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';

$("#todosFuncionarios").html(pedidoVazio);

$("#buscar").click(function(){
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/funcionariosCadastrados/buscar/' + nome,
		type: 'PUT'
	}).done(function(e){
		
		funcionarios = [];
		
		for(var i = 0; i<e.length; i++) {
			funcionarios.unshift({
				'id': e[i].id,
				'nome': e[i].nome,
				'cpf': e[i].cpf,
				'celular': e[i].celular,
				'cargo': e[i].cargo,
				'endereco': e[i].endereco.rua + ', ' + e[i].endereco.n + ' - ' + e[i].endereco.bairro,
				'referencia': e[i].endereco.referencia
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

				linhaHtml += '<td><div class="row">';
				
				linhaHtml +='<div class="col-md-1">'
								+'<a style="background-color: white" title="Ver">'
									+'<button style="background-color: white; border: none" onclick="verFuncionario()" value="'+ funcionarios[i].id + '">'
										+'<span class="oi oi-magnifying-glass"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
						
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Editar">'
									+'<button style="background-color: white; border: none" onclick="editarFuncionario()" value="'+ funcionarios[i].id + '">'
										+'<span class="oi oi-pencil"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Excluir">'
									+'<button style="background-color: white; border: none" onclick="excluirFuncionario()" value="'+ funcionarios[i].id + '">'
										+'<span class="oi oi-trash"></span>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '</td></tr>';
				linhaHtml += '</tr>';
				linhaHtml += linhaCinza;
			}
		}
		
		$("#todosFuncionarios").html(linhaHtml);
		
	}).fail(function(){
		$.alert("Nenhum funcionario encontrado!");
	});
});



//-----------------------------------------------------------------------------------------------------------
function verFuncionario() {
	
	var botaoReceber = $(event.currentTarget);
	var idFuncionarios = botaoReceber.attr('value');
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idFuncionarios){
			var idBusca = i;
		}
	}
	
	linhaHtml = "";
	linhaHtml = '<table><tr>'
					+ '<td><h4>Celular</h4></td>'
					+ '<td><h4>Cpf</h4></td>'
					+ '<td><h4>Endereco</h4></td>'
					+ '<td><h4>Referencia</h4></td>'
				'</tr>';
	
	linhaHtml += '<tr>';
	linhaHtml += 	'<td>' + funcionarios[idBusca].celular + '</td>';
	linhaHtml += 	'<td>' + funcionarios[idBusca].cpf + '</td>';
	linhaHtml += 	'<td>' + funcionarios[idBusca].endereco + '</td>';
	linhaHtml += 	'<td>' + funcionarios[idBusca].referencia + '</td>';
	linhaHtml += '</tr>';
	linhaHtml += '</table>';
	
	$.alert({
		type: 'green',
	    title: 'Funcionario: ' + funcionarios[idBusca].nome,
	    content: linhaHtml,
	    columnClass: 'col-md-12',
	    containerFluid: true,
	    buttons: {
	        confirm: {
				text: 'Voltar',
	    		keys: ['enter'],
	            btnClass: 'btn-green',
			}
		}
	});
};


//------------------------------------------------------------------------------------------
function editarFuncionario() {
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');
	var urlEnviar = "/cadastroFuncionario/editar/" + idFuncionario.toString();
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idFuncionario){
			var idBusca = i;
		}
	}
	
	$.confirm({
		type: 'red',
	    title: 'Funcionario: ' + funcionarios[idBusca].nome,
	    content: 'Tenha certeza do que você está fazendo!<br>',
	    buttons: {
	        confirm: {
	            text: 'Editar funcionario',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					
					$.ajax({
						url: urlEnviar,
						type: 'PUT',
					}).done(function(){
						window.location.href = urlEnviar;
					}).fail(function(){
						$.alert("Tente novamente!");
					});
				}
			},
	        cancel:{
				text: 'Voltar',
	            btnClass: 'btn-green',
	            keys: ['esc'],
			}
		}
	});
}


//-----------------------------------------------------------------------------------------------------------
function excluirFuncionario() {
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');
	var urlEnviar = "/funcionariosCadastrados/excluirFuncionario/" + idFuncionario.toString();
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idFuncionario){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Funcionario: ' + funcionarios[idBusca].nome.split(' ')[0],
	    content: 'Deseja apagar o funcionario?',
	    buttons: {
	        confirm: {
	            text: 'Apagar funcionario',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'APAGAR FUNCIONARIO!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar funcionario',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									if(apagarSim === 'sim') {
										
										$.ajax({
											url: urlEnviar,
											type: 'PUT'
											
										}).done(function(){		
											$.alert({
												type: 'green',
											    title: 'Funcionario apagado!',
											    content: 'Espero que dê tudo certo!',
											    buttons: {
											        confirm: {
														text: 'Voltar',
											    		keys: ['enter'],
											            btnClass: 'btn-green',
											            action: function(){
														}
													}
												}
											});
										}).fail(function(){
											$.alert("uncionario apagado!");
										});
									}else {
										$.alert({
											type: 'red',
										    title: 'Texto incorreto!',
										    content: 'Pense bem antes de apagar um funcionario!',
										    buttons: {
										        confirm: {
													text: 'Voltar',
										    		keys: ['enter'],
										            btnClass: 'btn-red',
												}
											}
										});
									}
								}
							},
					        cancel: {
								text: 'Voltar',
					            btnClass: 'btn-green',
					            keys: ['esc'],
							}
						}
					});
				}
			},
		    cancel: {
				text: 'Voltar',
		        btnClass: 'btn-green',
		        keys: ['esc'],
			}
		}
	});
}