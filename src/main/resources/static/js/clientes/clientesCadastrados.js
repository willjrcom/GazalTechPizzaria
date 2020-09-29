
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
			linhaHtml += '<tr>'
						+ '<td>' + clientes[i].id + '</td>'
						+ '<td>' + clientes[i].nome + '</td>'
						+ '<td>' + clientes[i].celular + '</td>'
						+ '<td>' + clientes[i].endereco + '</td>'
						
						+ '<td><div class="row">'
							+ '<div class="col-md-1">'
								+'<a title="Ver">'
									+'<button class="botao" onclick="verCliente()" value="'+ clientes[i].id + '">'
										+'<span class="oi oi-magnifying-glass"></span>'
									+'</button>'
								+'</a>'
							+'</div>'
					
							+ '<div class="col-md-1">'
								+'<a title="Editar">'
									+'<button class="botao" onclick="editarCliente()" value="'+ clientes[i].id + '">'
										+'<span class="oi oi-pencil"></span>'
									+'</button>'
								+'</a>'
							+'</div>'
				
							+ '<div class="col-md-1">'
								+'<a title="Excluir">'
									+'<button class="botao" onclick="excluirCliente()" value="'+ clientes[i].id + '">'
										+'<span class="oi oi-trash"></span>'
									+'</button>'
								+'</a>'
							+'</div>'
						+'</div>'
					+ '</td></tr>'
					+ linhaCinza;
		}
		$("#todosClientes").html(linhaHtml);
		
	}).fail(function(){
		$.alert("Erro, Nenhum cliente encontrado!");
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

	linhaHtml = '<table><tr>'
					+ '<td><h4>Celular</h4></td>'
					+ '<td><h4>Cpf</h4></td>'
					+ '<td><h4>Endereco</h4></td>'
					+ '<td><h4>Referencia</h4></td>'
					+ '<td><h4>Taxa</h4></td>'
				+ '</tr>'
	
				+ '<tr>'
					+ '<td>' + clientes[idBusca].celular + '</td>'
					+ '<td>' + clientes[idBusca].cpf + '</td>'
					+ '<td>' + clientes[idBusca].endereco + '</td>'
					+ '<td>' + clientes[idBusca].referencia + '</td>'
					+ '<td> R$ ' + parseFloat(clientes[idBusca].taxa).toFixed(2) + '</td>'
				+ '</tr>'
			+ '</table>';
	
	$.alert({
		type: 'green',
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
						url: "/cadastroCliente/editar/" + idCliente.toString(),
						type: 'POST',
					}).done(function(){
						window.location.href = "/cadastroCliente/editar/" + idCliente.toString();
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
											url: "/clientesCadastrados/excluirCliente/" + idCliente.toString(),
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
											            btnClass: 'btn-green'
													}
												}
											});
										}).fail(function(){
											$.alert("Erro, Cliente nâo apagado!");
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