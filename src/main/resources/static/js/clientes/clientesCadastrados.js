
var clientes = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="5">Nenhum cliente encontrado!</td></tr>';
var linhaCinza = '<tr id="linhaCinza"><td colspan="5" class="fundoList"></td></tr>';

$("#todosClientes").html(pedidoVazio);

$("#buscar").click(function(){
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/clientesCadastrados/buscar/' + nome,
		type: 'GET'
	}).done(function(e){
		clientes = [];
		for(cliente of e) {
			clientes.unshift({
				'id': cliente.id,
				'nome': cliente.nome,
				'cpf': cliente.cpf,
				'celular': cliente.celular,
				'endereco': cliente.endereco.rua + ' - ' + cliente.endereco.n  + ' - ' + cliente.endereco.bairro,
				'referencia' : cliente.endereco.referencia,
				'taxa' : cliente.endereco.taxa
			});
		}

		linhaHtml = "";
		for(cliente of clientes){
			linhaHtml += '<tr>'
						+ '<td>' + cliente.id + '</td>'
						+ '<td>' + cliente.nome + '</td>'
						+ '<td>' + cliente.celular + '</td>'
						+ '<td>' + cliente.endereco + '</td>'
						
						+ '<td><div class="row">'
							+ '<div class="col-md-1">'
								+'<a title="Ver">'
									+'<button class="botao" onclick="verCliente()" value="'+ cliente.id + '">'
										+'<span class="oi oi-magnifying-glass"></span>'
									+'</button>'
								+'</a>'
							+'</div>'
					
							+ '<div class="col-md-1">'
								+'<a title="Editar">'
									+'<button class="botao" onclick="editarCliente()" value="'+ cliente.id + '">'
										+'<span class="oi oi-pencil"></span>'
									+'</button>'
								+'</a>'
							+'</div>'
				
							+ '<div class="col-md-1">'
								+'<a title="Excluir">'
									+'<button class="botao" onclick="excluirCliente()" value="'+ cliente.id + '">'
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
	
	//buscar dados completos do pedido enviado
	for(i in clientes) if(clientes[i].id == idCliente) var idBusca = i;

	linhaHtml = '<table><tr>'
					+ '<td><h4>Celular</h4></td>'
					+ '<td><h4>Cpf</h4></td>'
					+ '<td><h4>Endereco</h4></td>'
					+ '<td><h4>Referência</h4></td>'
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
		type: 'blue',
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
	
	//buscar dados completos do pedido enviado
	for(i in clientes) if(clientes[i].id == idCliente) var idBusca = i;
	
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
					window.location.href = "/cadastroCliente/editar/" + idCliente;
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
	
	//buscar dados completos do pedido enviado
	for(i in clientes) if(clientes[i].id == idCliente) var idBusca = i;

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
									
									//verificar permissao adm
									$.ajax({
										url: "/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM" || e[0].authority === "DEV") {
											if(apagarSim === 'sim' || apagarSim === 'SIM') {
												
												$.ajax({
													url: "/clientesCadastrados/excluirCliente/" + idCliente,
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
																	window.location.href = "/clientesCadastrados";
																}
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
										}else {//se nao for ADM
											$.alert({
												type: 'red',
											    title: 'Permissão de usuário!',
											    content: 'Você não tem permissão para apagar um pedido<br>Utilize um usuário ADM!',
											    buttons: {
											        confirm: {
														text: 'Voltar',
											    		keys: ['enter'],
											            btnClass: 'btn-red',
													}
												}
											});
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
			},
		    cancel: {
				text: 'Voltar',
		        btnClass: 'btn-green',
		        keys: ['esc'],
			}
		}
	});
}