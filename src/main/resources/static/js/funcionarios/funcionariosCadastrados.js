
$(document).ready(() => $("#nomePagina").text("Funcionários cadastrados"));
var funcionarios = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="4">Nenhum funcionário encontrado!</td></tr>';
var linhaCinza = '<tr id="linhaCinza"><td colspan="4" class="fundoList"></td></tr>';


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
			funcionarios = e;
			linhaHtml = '';
			
			for(funcionario of funcionarios) {
				funcionario.referencia = funcionario.endereco.referencia;
				funcionario.endereco = funcionario.endereco.rua + ', ' + funcionario.endereco.n + ' - ' + funcionario.endereco.bairro;
				
				linhaHtml += '<tr>'
							+ '<td>' + funcionario.nome + '</td>'
							+ '<td>' + funcionario.celular + '</td>'
							+ '<td>' + funcionario.cargo + '</td>'

							+ '<td><div class="row">'
								+'<div class="col-md-1">'
									+'<a title="Ver">'
										+'<button class="botao" onclick="verFuncionario()" value="'+ funcionario.id + '">'
											+'<i class="fas fa-search"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
						
								+ '<div class="col-md-1">'
									+'<a title="Editar">'
										+'<button class="botao" onclick="editarFuncionario()" value="'+ funcionario.id + '">'
											+'<i class="fas fa-edit"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
				
								+ '<div class="col-md-1">'
									+'<a title="Excluir">'
										+'<button class="botao" onclick="excluirFuncionario()" value="'+ funcionario.id + '">'
											+'<i class="fas fa-trash"></i>'
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
	
	linhaHtml = '<div class="row">'
					+ '<div class="col-md-3">'
						+ '<label>Celular</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].celular
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-3">'
						+ '<label>Cpf</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].cpf
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-3">'
						+ '<label>Cargo</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].cargo
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-3">'
						+ '<label>Sexo</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].sexo
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-4">'
						+ '<label>Email</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].email
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-4">'
						+ '<label>Situação</label>'
						+ '<input class="form-control" value="' 
							+ (funcionarios[idBusca].situacao == 1 ? "Ativo" : "Inativo")
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-4">'
						+ '<label>Data de nascimento</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].nascimento.split('-')[2] + '/'
							+ funcionarios[idBusca].nascimento.split('-')[1] + '/'
							+ funcionarios[idBusca].nascimento.split('-')[0]
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div>'
					+ '<label>Endereco</label>'
					+ '<input class="form-control" value="' 
						+ funcionarios[idBusca].endereco
					+ '" readonly/>'
				+ '</div>'
			
				+ '<div>'
					+ '<label>Referência</label>'
					+ '<input class="form-control" value="' 
						+ funcionarios[idBusca].referencia
					+ '" readonly/>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-4">'
						+ '<label>Dia de pagamento</label>'
						+ '<input class="form-control" value=" R$ ' 
							+ funcionarios[idBusca].diaPagamento.toFixed(2)
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-4">'
						+ '<label>Salário</label>'
						+ '<input class="form-control" value=" R$ ' 
							+ funcionarios[idBusca].salario.toFixed(2)
						+ '" readonly/>'
					+ '</div>'
					
					+ '<div class="col-md-4">'
						+ '<label>Data de admissão</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].admissao.split('-')[2] + '/'
							+ funcionarios[idBusca].admissao.split('-')[1] + '/'
							+ funcionarios[idBusca].admissao.split('-')[0]
						+ '" readonly/>'
					+ '</div>'
				+ '</div>';
	
	if(funcionarios[idBusca].obs != null){
		linhaHtml += '<div>'
						+ '<label style="color: red">Observação da demissão</label>'
						+ '<input class="form-control" value="' 
							+ funcionarios[idBusca].obs
						+ '" readonly/>'
					+ '</div>';
	}
				
	$.alert({
		type: 'blue',
	    title: 'Funcionário: ' + funcionarios[idBusca].nome,
	    content: linhaHtml,
	    columnClass: 'col-md-12',
	    containerFluid: true,
	    buttons: {
			situacao: {
				text: (funcionarios[idBusca].situacao == 1 ? "Demitir" : "Contratar"),
				btnClass: 'btn btn-warning',
				action: () => {
					$.confirm({
						type: 'orange',
						title: 'confirmar: '+ (funcionarios[idBusca].situacao == 1 ? "demissão" : "contratação"),
						content: 'Deseja continuar?',
						buttons: {
							yes: {
								text: 'Confirmar',
					    		keys: ['enter'],
					            btnClass: 'btn-success',
								action: () => {
									if(funcionarios[idBusca].situacao == 1){
										$.confirm({
											type: 'orange',
											title: 'Observação',
											content: '<label>Digite o motivo da demissão</label><input id="obs" class="form-control" />',
											buttons: {
												confirm:{
													text: 'confirmar',
													btnClass: 'btn btn-success',
													keys: ['enter'],
													action: function() {
														var obs = this.$content.find('#obs').val();
														fetch("/adm/funcionariosCadastrados/situacao/" + funcionarios[idBusca].id + "/" + obs.replace("/", " - "))
															.then(window.location.href="/adm/funcionariosCadastrados");
													}
												},
												cancel: {
													text: 'Voltar',
													btnClass: 'btn btn-danger',
													keys: ['esc']
												}
											}
										});
									}else{
										fetch("/adm/funcionariosCadastrados/situacao/" + funcionarios[idBusca].id + "/contratar")
											.then(window.location.href="/adm/funcionariosCadastrados");
									}
								}
							},
					        no: {
								text: 'Voltar',
					    		keys: ['esc'],
					            btnClass: 'btn-danger',
							}
						}
					})
				}
			},
	        confirm: {
				text: 'Voltar',
	    		keys: ['esc', 'enter'],
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
