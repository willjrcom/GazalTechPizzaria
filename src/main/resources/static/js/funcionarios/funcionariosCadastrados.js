
var funcionarios = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="4">Nenhum funcionario encontrado!</td></tr>';
var linhaCinza = '<tr id="linhaCinza"><td colspan="4" class="fundoList"></td></tr>';

$("#todosFuncionarios").html(pedidoVazio);

$("#buscar").click(function(){
	carregarLoading("block");
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/adm/funcionariosCadastrados/buscar/' + nome,
		type: 'PUT'
	}).done(function(e){
		
		if(e.length == 0) {
			$("#todosFuncionarios").html(pedidoVazio);
		}else {
			funcionarios = [];
		
			for(funcionario of e) {
				funcionarios.unshift({
					'id': funcionario.id,
					'nome': funcionario.nome,
					'cpf': funcionario.cpf,
					'celular': funcionario.celular,
					'cargo': funcionario.cargo,
					'endereco': funcionario.endereco.rua + ', ' + funcionario.endereco.n + ' - ' + funcionario.endereco.bairro,
					'referencia': funcionario.endereco.referencia
				});
			}
			
			linhaHtml = '';
			
			for(funcionario of funcionarios) {
				linhaHtml += '<tr>'
							+ '<td>' + funcionario.nome + '</td>'
							+ '<td>' + funcionario.celular + '</td>'
							+ '<td>' + funcionario.cargo + '</td>'

							+ '<td><div class="row">'
								+'<div class="col-md-1">'
									+'<a title="Ver">'
										+'<button class="botao" onclick="verFuncionario()" value="'+ funcionario.id + '">'
											+'<span class="oi oi-magnifying-glass"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
						
								+ '<div class="col-md-1">'
									+'<a title="Editar">'
										+'<button class="botao" onclick="editarFuncionario()" value="'+ funcionario.id + '">'
											+'<span class="oi oi-pencil"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
				
								+ '<div class="col-md-1">'
									+'<a title="Excluir">'
										+'<button class="botao" onclick="excluirFuncionario()" value="'+ funcionario.id + '">'
											+'<span class="oi oi-trash"></span>'
										+'</button>'
									+'</a>'
								+'</div>'
							+ '</div>'
						+ '</td></tr>'
					+ linhaCinza;
			}
			$("#todosFuncionarios").html(linhaHtml);
		}
		carregarLoading("none");
	}).fail(function(){
		carregarLoading("none");
		$.alert("Erro, Nenhum funcionario encontrado!");
	});
});



//-----------------------------------------------------------------------------------------------------------
function verFuncionario() {
	
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in funcionarios) if(funcionarios[i].id == idFuncionario) var idBusca = i;	
	
	linhaHtml = '<table style="width:100%"><tr>'
					+ '<td><h4>Celular</h4></td>'
					+ '<td><h4>Cpf</h4></td>'
					+ '<td><h4>Endereco</h4></td>'
					+ '<td><h4>Referencia</h4></td>'
				+'</tr>'
	
				+ '<tr>'
					+ '<td>' + funcionarios[idBusca].celular + '</td>'
					+ '<td>' + funcionarios[idBusca].cpf + '</td>'
					+ '<td>' + funcionarios[idBusca].endereco + '</td>'
					+ '<td>' + funcionarios[idBusca].referencia + '</td>'
				+ '</tr>'
			+ '</table>';
	
	$.alert({
		type: 'blue',
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
	
	//buscar dados completos do pedido enviado
	for(i in funcionarios) if(funcionarios[i].id == idFuncionario) var idBusca = i;	
		
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
					window.location.href = "/adm/cadastroFuncionario/editar/" + idFuncionario;
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
	
	//buscar dados completos do pedido enviado
	for(i in funcionarios) if(funcionarios[i].id == idFuncionario) var idBusca = i;	
		
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Funcionario: ' + funcionarios[idBusca].nome,
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
									
									//verificar permissao adm
									$.ajax({
										url: "/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM") {
											if(apagarSim === 'sim') {
												
												$.ajax({
													url: "/adm/funcionariosCadastrados/excluirFuncionario/" + idFuncionario,
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
													            btnClass: 'btn-green'
															}
														}
													});
												}).fail(function(){
													$.alert("Erro, funcionario não apagado!");
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
										}else {//se nao for ADM
											$.alert({
												type: 'red',
											    title: 'Permissão de usuário!',
											    content: 'Você não tem permissão para apagar um funcionario<br>Utilize um usuário ADM!',
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
