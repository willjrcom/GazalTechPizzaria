var codigo;
var [dados, usuarios] = [{}, {}];
var email, senha, confirmar;
var [opSenha, confEmail] = [0, 0]; //-1 nao alterar, 0 alterar

//linhas---------------------------------------------------------------------------
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList"></td></tr>';
$(document).ready(() => $("#nomePagina").text("Desenvolvedor"));

//---------------------------------------------------------------------------------
carregarLoading("block");
$.ajax({
	url: '/dev/dev/todosUsuarios',
	type: 'GET'
}).done(function(e) {

	if (e.length == 0) {
		$("#todosUsuarios").html('<tr><td colspan="6">Nenhum usuário encontrado!</td></tr>');
	} else {
		usuarios = e;
		usuarios = usuarios.sort((a, b) => a.codEmpresa - b.codEmpresa);
		let usuarioHtml = '';

		for (usuario of usuarios) {
			usuarioHtml += '<tr>'
				+ '<td class="col-md-1 text-center">' + usuario.codEmpresa + '</td>'
				+ '<td class="col-md-1 text-center">' + usuario.dia + '</td>'
				+ '<td class="col-md-1 text-center">' + usuario.dataLimite + '</td>'
				+ '<td class="col-md-1 text-center">' + (usuario.empresa == null ? '' : usuario.empresa.nomeEstabelecimento) + '</td>'
				+ '<td class="col-md-1 text-center">' + usuario.email + '</td>'
				+ '<td class="col-md-1 text-center">' + usuario.perfil + '</td>';

			if (usuario.ativo == 1) usuarioHtml += '<td class="col-md-1 text-center"><i style="color: green" class="fas fa-check-circle"></i></td>';
			else usuarioHtml += '<td align="center"><i style="color: red" class="fa fa-times-circle"></i></td>';

			usuarioHtml += '<td class="col-md-1 text-center">'
				+ '<div class="row">'
				+ '<div class="col-md-1">'
				+ '<a title="Editar usuario" data-toggle="tooltip" data-html="true">'
				+ '<button onclick="editarUsuario()" value="' + usuario.id + '" class="botao"><i class="fas fa-edit"></i></button>'
				+ '</a>'
				+ '</div>'

				+ '<div class="col-md-1">'
				+ '<a title="Excluir usuario" data-toggle="tooltip" data-html="true">'
				+ '<button onclick="apagarUsuario()" value="' + usuario.id + '" class="botao"><i class="fas fa-trash"></i></button>'
				+ '</a>'
				+ '</div>'
				+ '</div>'
				+ '</td>'
				+ '</tr>'
				+ linhaCinza;

		}
		$("#todosUsuarios").html(usuarioHtml);
		$('[data-toggle="tooltip"]').tooltip();
	}
	carregarLoading("none");
});


$.ajax({
	url: '/dev/dev/todosEmpresas',
	type: 'GET'
}).done(function(e) {
	empresas = e;
	if (empresas.length == 0) {
		$("#todosUsuarios").html('<tr><td colspan="6">Nenhuma empresa encontrada!</td></tr>');
	} else {
		empresas = empresas.sort((a, b) => a.codEmpresa - b.codEmpresa);
		let empresaHtml = '';

		for (empresa of empresas) {
			empresaHtml += '<tr>'

				+ '<td class="col-md-1 text-center">' + empresa.codEmpresa + '</td>';

			if (empresa.conquista.cadEmpresa == true && empresa.conquista.cadFuncionario == true && empresa.conquista.cadPedido == true && empresa.conquista.cadProduto == true)
				empresaHtml += '<td class="col-md-1 text-center"><i style="color: green" class="fas fa-check-circle"></i></td>';
			else {
				empresaHtml += '<td class="col-md-1 text-center"><i style="color: red" class="fa fa-times-circle"></i></td>';
			}
			empresaHtml += '<td class="col-md-1 text-center">' + empresa.nomeEstabelecimento + '</td>'
				+ '<td class="col-md-1 text-center">' + empresa.celular + '</td>'
				+ '<td class="col-md-1 text-center">' + empresa.email + '</td>'
				+ '<td class="col-md-1 text-center">'
				+ '<a title="Adicionar mensalidade" data-toggle="tooltip" data-html="true">'
				+ '<button onclick="addMensalidade()" value="'
				+ empresa.codEmpresa + '" class="botao"><i class="fas fa-external-link-alt"></i></button>'
				+ '</a>'
				+ '</td>'
				+ '</tr>'
				+ linhaCinza;

		}
		$("#todosEmpresas").html(empresaHtml);
		$('[data-toggle="tooltip"]').tooltip();
	}
	carregarLoading("none");
});


//---------------------------------------------------------
$('#email').on('blur', function() {// Método para consultar o Usuario

	if ($("#email").val() != '') {

		var email = $("#email").val();
		var id = $("#id").val();

		$.ajax({
			url: (id != '') ? "/dev/dev/validar/" + email + '/' + id : "/dev/dev/validar/" + email + '/-2',
			type: 'GET'
		}).done(function(event) {

			if (event.length != 0 && event != '' && event.id != -1) {
				confEmail = 1;
				$("#avisoUsuario").show().css({
					'color': 'red'
				});
				$("#email").css({
					'border': '1px solid red'
				});
				$("#criar").hide();
			} else {
				confEmail = 0;
				$("#avisoUsuario").hide();
				$("#criar").show();
				$("#email").css({
					'border': '1px solid #ccc'
				});
			}
		});
	}
});

$(".pass").keyup(() => {
	if ($("#senha").val() === $("#confirmar").val()) {
		$("#avisoSenha").hide();
		$("#criar").show();
		$("#senha").css({
			'border': '1px solid #ccc'
		});
		$("#confirmar").css({
			'border': '1px solid #ccc'
		});
	} else {
		$("#avisoSenha").show().css({
			'color': 'red'
		});
		$("#senha").css({
			'border': '1px solid red'
		});
		$("#confirmar").css({
			'border': '1px solid red'
		});
		$("#criar").hide();
	}
});


//-----------------------------------------------------------
$("#criarUsuario").click(function() {

	dados.id = $("#id").val();
	dados.email = $("#email").val();
	dados.perfil = $("#perfil").val();
	dados.ativo = $("#ativo").val();
	dados.codEmpresa = $("#codEmpresa").val();
	dados.dataLimite = $("#dataLimite").val();

	var textoEnviado;

	if (opSenha == 0) {
		dados.senha = $("#senha").val();
		confirmar = $("#confirmar").val();
		textoEnviado = 'Usuário cadastrado!';
	} else {
		dados.senha = "-1";
		confirmar = "-1";
		textoEnviado = 'Usuário atualizado!';
	}

	if (dados.senha === confirmar && dados.senha != '' && dados.email != '' && confEmail == 0) {

		$.confirm({
			type: 'green',
			title: 'Salvar',
			content: 'Continuar?',
			buttons: {
				confirm: {
					text: 'Sim',
					btnClass: 'btn-success',
					keys: ['enter'],
					action: function() {
						carregarLoading("block");

						$.ajax({
							url: '/dev/dev/criarUsuario',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(dados)
						}).done(function() {
							carregarLoading("none");
							$.alert({
								type: 'blue',
								title: 'Sucesso',
								content: textoEnviado,
								buttons: {
									confirm: {
										text: 'Dev',
										btnClass: 'btn-success',
										keys: ['enter', 'esc'],
										action: function() {
											window.location.href = "/dev/dev";
										}
									}
								}
							});
						}).fail(function() {
							$.alert("Falhou");
						});
					}
				},
				cancel: {
					text: 'Não',
					btnClass: 'btn-danger',
					keys: ['esc']
				}
			}
		});
	} else {
		$.alert({
			type: 'red',
			title: 'Ops...',
			content: 'Digite os dados corretamente!',
			buttons: {
				confirm: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}
});


function addMensalidade() {
	var botaoReceber = $(event.currentTarget);
	var codEmpresa = botaoReceber.attr('value');
	$.confirm({
		type: 'green',
		columnClass: 'col-md-6',
		title: 'Salvar mensalidade',
		content: '<div class="row">'
			+ '<div class="col-md-6">'
			+ '<label>Log</label>'
			+ '<input id="log" class="form-control" placeholder="Digite o valor" />'
			+ '</div>'

			+ '<div class="col-md-6">'
			+ '<label>valor</label>'
			+ '<div class="input-group mb-3">'
			+ '<span class="input-group-text">R$</span>'
			+ '<input class="form-control" id="valor" placeholder="Digite o valor"/>'
			+ '</div>'
			+ '</div>'
			+ '</div>',
		buttons: {
			confirm: {
				text: 'Sim',
				btnClass: 'btn-success',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");
					let mensalidade = {};
					mensalidade.log = $("#log").val();
					mensalidade.valor = Number($("#valor").val());
					$.ajax({
						url: '/dev/dev/addMensalidade/' + codEmpresa,
						type: 'POST',
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(mensalidade)
					}).done(function() {
						carregarLoading("none");
						$.alert({
							type: 'blue',
							title: 'Sucesso',
							content: 'Mensalidade salva',
							buttons: {
								confirm: {
									text: 'Dev',
									btnClass: 'btn-success',
									keys: ['enter', 'esc']
								}
							}
						});
					}).fail(function() {
						carregarLoading("none");
						$.alert("Falhou");
					});
				}
			},
			cancel: {
				text: 'Não',
				btnClass: 'btn-danger',
				keys: ['esc']
			}
		}
	});
}


//-----------------------------------------------------------------------------------------------------
function editarUsuario() {
	var botaoReceber = $(event.currentTarget);
	var idUsuario = botaoReceber.attr('value');

	$.confirm({
		type: 'red',
		title: 'Alerta',
		content: 'Deseja alterar esse usuario?',
		buttons: {
			confirm: {
				text: 'Sim',
				btnClass: 'btn-danger',
				keys: ['enter'],
				action: function() {
					for (usuario of usuarios) {
						if (usuario.id == idUsuario) {

							//variaveis
							$("#id").val(usuario.id);
							$("#email").val(usuario.email);
							$("#senha").val("");
							$("#perfil").val(usuario.perfil);
							$("#codEmpresa").val(usuario.codEmpresa);
							$("#dataLimite").val(usuario.dataLimite);
							if (usuario.ativo == 1) $("#ativo").val("true");
							else $("#ativo").val("false");

							dados.dia = usuario.dia;
							confEmail = 0;

							//avisos
							$("#avisoSenha").hide();
							$("#avisoUsuario").hide();
							$("#email").css({
								'border': '1px solid #ccc'
							});
							$("#senha").css({
								'border': '1px solid #ccc'
							});
							$("#confirmar").css({
								'border': '1px solid #ccc'
							});
							$("#criar").show();

							$("#criar").text("Atualizar usuário");
							opSenha = -1;
							//edit senha
							$("#senhas").hide();
							$("#alterar").show();
							break;
						}
					}
				}
			},
			cancel: {
				text: 'Não',
				btnClass: 'btn-success',
				keys: ['esc'],
			}
		}
	});
}


//---------------------------------------------------------------------------------
function alterarSenha() {
	$("#senhas").show('slow');
	$("#alterar").hide('slow');
	opSenha = 0;
}


//-----------------------------------------------------------------------------------------------------
function apagarUsuario() {
	var botaoReceber = $(event.currentTarget);
	var idUsuario = botaoReceber.attr('value');

	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'

	$.confirm({
		type: 'red',
		title: 'Alerta',
		content: 'Deseja APAGAR o usuário?',
		buttons: {
			confirm: {
				text: 'Apagar',
				btnClass: 'btn-red',
				keys: ['enter'],
				action: function() {

					$.confirm({
						type: 'red',
						title: 'APAGAR usuário!',
						content: 'Tem certeza?' + inputApagar,
						buttons: {
							confirm: {
								text: 'Apagar usuário',
								btnClass: 'btn-red',
								keys: ['enter'],
								action: function() {
									var apagarSim = this.$content.find('#apagar').val();

									if (apagarSim === 'sim') {
										$.ajax({
											url: "/adm/dev/excluirUsuario/" + idUsuario,
											type: 'GET'
										}).done(function(e) {
											if (e == "200") {
												$.alert({
													type: 'red',
													title: 'Usuário apagado!',
													content: 'Espero que dê tudo certo!',
													buttons: {
														confirm: {
															text: 'Voltar',
															keys: ['enter'],
															btnClass: 'btn-green',
															action: function() {
																window.location.href = "/adm/dev";
															}
														}
													}
												});
											}
										}).fail(function() {
											$.alert("Erro, Usuário não apagado!");
										});
									} else {
										$.alert({
											type: 'red',
											title: 'Texto incorreto!',
											content: 'Pense bem antes de apagar um usuário!',
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


function controlAcess() {
	carregarLoading("block");
	fetch('/dev/dev/controlAcess/' + $("#codAcess").val() + '/' + $("#typeAcess").val())
		.then(() => {
			carregarLoading("none");
			$.alert({
				type: 'green',
				title: 'sucesso',
				content: 'Usuários alterados!',
				buttons: {
					confirm: {
						text: 'Continuar',
						btnClass: 'btn btn-success',
						keys: ['esc', 'enter']
					}
				}
			});
		});
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}