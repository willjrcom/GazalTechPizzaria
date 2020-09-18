
var clientes = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="5">Nenhum cliente encontrado!</td></tr>';
var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';

$("#todosClientes").html(pedidoVazio);

$("#buscar").click(function(){
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/clientesCadastrados/buscar/' + nome,
		type: 'PUT'
	}).done(function(e){
		clientes = [];
		for(var i = 0; i<e.length; i++) {
			clientes.unshift({
				'id': e[i].id,
				'nome': e[i].nome,
				'cpf': e[i].cpf,
				'celular': e[i].celular,
				'endereco': e[i].endereco.rua + ' - ' + e[i].endereco.n  + ' - ' + e[i].endereco.bairro + ' - ' + e[i].endereco.cidade,
				'referencia' : e[i].endereco.referencia,
				'taxa' : e[i].endereco.taxa
			});
		}

		linhaHtml = "";
		for(var i=0; i<clientes.length; i++){
			linhaHtml += '<tr>';
			linhaHtml += 	'<td>' + clientes[i].id + '</td>';
			linhaHtml += 	'<td>' + clientes[i].nome + '</td>';
			linhaHtml += 	'<td>' + clientes[i].celular + '</td>';
			linhaHtml += 	'<td>' + clientes[i].endereco + '</td>';
			
			linhaHtml += '<td><div class="row">';
			
			linhaHtml +='<div class="col-md-1">'
							+'<a style="background-color: white" title="Ver">'
								+'<button style="background-color: white; border: none" onclick="verCliente()" value="'+ clientes[i].id + '">'
									+'<span class="oi oi-magnifying-glass"></span>'
								+'</button>'
							+'</a>'
						+'</div>';
					
			linhaHtml += '<div class="col-md-1">'
							+'<a style="background-color: white" title="Editar">'
								+'<button style="background-color: white; border: none" onclick="editarCliente()" value="'+ clientes[i].id + '">'
									+'<span class="oi oi-pencil"></span>'
								+'</button>'
							+'</a>'
						+'</div>';
			
			linhaHtml += '<div class="col-md-1">'
							+'<a style="background-color: white" title="Excluir">'
								+'<button style="background-color: white; border: none" onclick="excluirCliente()" value="'+ clientes[i].id + '">'
									+'<span class="oi oi-trash"></span>'
								+'</button>'
							+'</a>'
						+'</div>';
			
			linhaHtml += '</td></tr>';
			linhaHtml += '</tr>';
			linhaHtml += linhaCinza;
		}
		$("#todosClientes").html(linhaHtml);
		
	}).fail(function(){
		$.alert("Nenhum cliente encontrado!");
	});
});



//-----------------------------------------------------------------------------------------------------------
function verCliente() {
	
	var botaoReceber = $(event.currentTarget);
	var idCliente = botaoReceber.attr('value');
	
	for(var i = 0; i<clientes.length; i++){//buscar dados completos do pedido enviado
		if(clientes[i].id == idCliente){
			var idBusca = i;
		}
	}
	
	linhaHtml = "";
	linhaHtml = '<table><tr>'
					+ '<td><h4>Celular</h4></td>'
					+ '<td><h4>Cpf</h4></td>'
					+ '<td><h4>Endereco</h4></td>'
					+ '<td><h4>Referencia</h4></td>'
					+ '<td><h4>Taxa</h4></td>'
				'</tr>';
	
	linhaHtml += '<tr>';
	linhaHtml += 	'<td>' + clientes[idBusca].celular + '</td>';
	linhaHtml += 	'<td>' + clientes[idBusca].cpf + '</td>';
	linhaHtml += 	'<td>' + clientes[idBusca].endereco + '</td>';
	linhaHtml += 	'<td>' + clientes[idBusca].referencia + '</td>';
	linhaHtml += 	'<td> R$ ' + parseFloat(clientes[idBusca].taxa).toFixed(2) + '</td>';
	linhaHtml += '</tr>';
	linhaHtml += '</table>';
	
	$.alert({
		type: 'green',
	    typeAnimated: true,
	    title: 'Cliente: ' + clientes[idBusca].nome,
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
function editarCliente() {
	var botaoReceber = $(event.currentTarget);
	var idCliente = botaoReceber.attr('value');
	var urlEnviar = "/cadastroCliente/editar/" + idCliente.toString();
	
	for(var i = 0; i<clientes.length; i++){//buscar dados completos do pedido enviado
		if(clientes[i].id == idCliente){
			var idBusca = i;
		}
	}
	
	$.confirm({
		type: 'red',
	    title: 'Cliente: ' + clientes[idBusca].nome,
	    content: 'Tenha certeza do que você está fazendo!<br>',
	    buttons: {
	        confirm: {
	            text: 'Editar Cliente',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					
					$.ajax({
						url: urlEnviar,
						type: 'POST',
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
function excluirCliente() {
	var botaoReceber = $(event.currentTarget);
	var idCliente = botaoReceber.attr('value');
	var urlEnviar = "/clientesCadastrados/excluirCliente/" + idCliente.toString();
	
	for(var i = 0; i<clientes.length; i++){//buscar dados completos do pedido enviado
		if(clientes[i].id == idCliente){
			var idBusca = i;
		}
	}
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Cliente: ' + clientes[idBusca].nome,
	    content: 'Deseja apagar o cliente?',
	    buttons: {
	        confirm: {
	            text: 'Apagar cliente',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'APAGAR CLIENTE!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar cliente',
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
											    title: 'Cliente apagado!',
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
											$.alert("Cliente apagado!");
										});
									}else {
										$.alert({
											type: 'red',
										    title: 'Texto incorreto!',
										    content: 'Pense bem antes de apagar um cliente!',
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