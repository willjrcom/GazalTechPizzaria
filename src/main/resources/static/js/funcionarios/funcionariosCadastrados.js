
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
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h8a1.5 1.5 0 0 0 1.5-1.5V9a.5.5 0 0 0-1 0v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 5v8zm7-11a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.5H9a.5.5 0 0 1-.5-.5z"/>'
											+'<path fill-rule="evenodd" d="M14.354 1.646a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708-.708l8-8a.5.5 0 0 1 .708 0z"/>'
										+'</svg>'
									+'</button>'
								+'</a>'
							+'</div>';
						
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Editar">'
									+'<button style="background-color: white; border: none" onclick="editarFuncionario()" value="'+ funcionarios[i].id + '">'
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brush" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path d="M15.213 1.018a.572.572 0 0 1 .756.05.57.57 0 0 1 .057.746C15.085 3.082 12.044 7.107 9.6 9.55c-.71.71-1.42 1.243-1.952 1.596-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.212-1.543.346-.542.887-1.273 1.642-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/>'
											+'<path d="M7 12a2 2 0 0 1-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 0 1 2 2z"/>'
										+'</svg>'
									+'</button>'
								+'</a>'
							+'</div>';
				
				linhaHtml += '<div class="col-md-1">'
								+'<a style="background-color: white" title="Excluir">'
									+'<button style="background-color: white; border: none" onclick="excluirFuncionario()" value="'+ funcionarios[i].id + '">'
										+'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
											+'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
										    +'<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>'
										    +'<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>'
										+'</svg>'
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
	    typeAnimated: true,
	    title: 'Cliente:' + funcionarios[idBusca].nome,
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
	console.log(urlEnviar);
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idFuncionario){
			var idBusca = i;
		}
	}
	
	$.confirm({
		type: 'red',
	    typeAnimated: true,
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
	console.log(urlEnviar);
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idFuncionario){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    typeAnimated: true,
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
					    typeAnimated: true,
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
											    typeAnimated: true,
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
										    typeAnimated: true,
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