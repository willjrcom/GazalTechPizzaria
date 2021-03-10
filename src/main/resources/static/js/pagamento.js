$("#filtro").selectmenu().addClass("overflow");
var funcionarios = [];
var linhaHtml = "";
var pedidoVazio = '<tr><td colspan="6">Nenhum Funcionário encontrado!</td></tr>';
var horaExtra = 10;
$(document).ready(() => $("#nomePagina").text("Pagamento de funcionários"));

//------------------------------------------------------------
carregarLoading("block");
$.ajax({
	url: '/adm/pagamento/empresa',
	type: 'GET'
}).done(function(e) {
	if (e.length != 0) horaExtra = e.horaExtra;

	//Ao carregar a tela
	//-------------------------------------------------------------------------------------------------------------------

	$.ajax({
		url: "/adm/pagamento/todosFuncionarios",
		type: 'GET'
	}).done(function(e) {
		funcionarios = e;

		mostrar(funcionarios, 1);
	});
});


//--------------------------------------------------------------------------
function filtrar() {
	mostrar(funcionarios, $("#filtro").val());
}


function mostrar(funcionarios, filtro) {
	linhaHtml = "";

	for (funcionario of funcionarios) {
		if (filtro == funcionario.situacao || filtro == 2) {
			linhaHtml += '<tr>'
				+ '<td class="text-center col-md-1">' + funcionario.nome + '</td>'
				+ '<td class="text-center col-md-1">' + funcionario.celular + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + funcionario.salario.toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">' + funcionario.diaPagamento + '</td>'
				+ '<td class="text-center col-md-1">' + funcionario.cargo + '</td>'
				+ '<td class="text-center col-md-1">'
				+ '<div class="row">'
				+ '<div class="col-md-1">'
				+ '<a title="Adicionar diaria" data-toggle="tooltip" data-html="true">'
				+ '<button type="button" onclick="addDiaria()" class="botao"'
				+ 'value="' + funcionario.id + '"><i class="fas fa-plus"></i></button>'
				+ '</a>'
				+ '</div>'

				+ '<div class="col-md-1">'
				+ '<a title="Adicionar horas" data-toggle="tooltip" data-html="true">'
				+ '<button type="button" onclick="addHoras()" class="botao"'
				+ 'value="' + funcionario.id + '"><i class="far fa-clock"></i></button>'
				+ '</a>'
				+ '</div>'

				+ '<div class="col-md-1">'
				+ '<a title="Adicionar gastos" data-toggle="tooltip" data-html="true">'
				+ '<button type="button" onclick="addGastos()" class="botao"'
				+ 'value="' + funcionario.id + '"><i class="fas fa-credit-card"></i></button>'
				+ '</a>'
				+ '</div>'

				+ '<div class="col-md-1">'
				+ '<a title="Pagar salario" data-toggle="tooltip" data-html="true">'
				+ '<button type="button" onclick="acessarData(1)" class="botao"'
				+ 'value="' + funcionario.id + '"><i class="far fa-check-square"></i></button>'
				+ '</a>'
				+ '</div>'

				+ '<div class="col-md-1">'
				+ '<a title="Imprimir relatorio" data-toggle="tooltip" data-html="true">'
				+ '<button type="button" onclick="acessarData(2)" class="botao"'
				+ 'value="' + funcionario.id + '"><i class="fas fa-print"></i></button>'
				+ '</a>'
				+ '</div>'
				+ '</div>'
				+ '</td>'
				+ '</tr>';
		}
	}
	if (linhaHtml !== '') {
		$("#todosFuncionarios").html(linhaHtml);
		$('[data-toggle="tooltip"]').tooltip();
	}
	else
		$("#todosFuncionarios").html(pedidoVazio);

	carregarLoading("none");
}


//-------------------------------------------------------------------------
function acessarData(op) {

	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in funcionarios) if (funcionarios[i].id == idFuncionario) var idBusca = i;

	mesAtual = new Date();

	$.alert({
		type: 'blue',
		title: 'Acessar data',
		content: '<label>Mês:</label><input type="number" id="mes" min="1" value="'
			+ (mesAtual.getMonth() + 1) + '" max="12" class="form-control" />'
			+ '<label>Ano:</label><input type="number" id="ano" min="2015" value="'
			+ mesAtual.getFullYear() + '" max="2050" class="form-control" />',
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Acessar',
				btnClass: 'btn-primary',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");

					let mes = this.$content.find('#mes').val();
					mes = (mes.length == 1) ? '0' + mes : mes;

					let ano = this.$content.find('#ano').val();
					ano = (ano.length == 1) ? '0' + ano : ano;

					let dataBusca = ano + '-' + mes;

					//buscar o mes de gastos do funcionario
					$.ajax({
						url: '/adm/pagamento/buscar/' + funcionarios[idBusca].id + '/' + dataBusca,
						type: 'GET'
					}).done(function(e) {
						if (op == 1) pagarSalario(e, funcionarios[idBusca], dataBusca);
						if (op == 2) imprimirResumo(e, funcionarios[idBusca]);
					});
				}
			},
			cancel: {
				isHidden: true,
				keys: ['esc'],
			}
		}
	});
};


//--------------------------------------------------------------------------
function addDiaria() {
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in funcionarios) if (funcionarios[i].id == idFuncionario) var idBusca = i;

	funcionario = funcionarios[idBusca];

	linhaHtml = '<label>Total da diária:</label><br>'

		+ '<div class="input-group mb-3">'
		+ '<span class="input-group-text">R$</span>'
		+ '<input class="form-control" id="diaria" name="diaria" placeholder="Digite o total a ser adicionado"/>'
		+ '</div>';

	$.alert({
		type: 'blue',
		title: 'Funcionário: ' + funcionario.nome,
		content: linhaHtml,
		buttons: {
			confirm: {
				text: 'Adicionar Diária',
				keys: ['enter'],
				btnClass: 'btn-green',
				action: function() {

					carregarLoading("block");
					let diaria = this.$content.find('#diaria').val();

					if (diaria == 0) {
						carregarLoading("none");
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm: {
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					} else {
						let salario = {};
						salario.diarias = diaria;

						$.ajax({
							url: '/adm/pagamento/salvar/' + idFuncionario + '/0',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(salario)
						}).done(function(e) {
							carregarLoading("none");
							if (e.diarias == 1) {
								$.alert({
									type: 'green',
									title: "Sucesso",
									content: "1 Diária registrada!",
									buttons: {
										confirm: {
											text: "Continuar",
											btnClass: 'btn-success',
											keys: ['enter', 'esc']
										}
									}
								});
							} else if (e.diarias == 2) {
								$.alert({
									type: 'warning',
									title: "Sucesso",
									content: "2 Diárias registradas!",
									buttons: {
										confirm: {
											text: "Continuar",
											btnClass: 'btn-success',
											keys: ['enter', 'esc']
										}
									}
								});
							} else if (e.diarias >= 3) {
								$.alert({
									type: 'red',
									title: "OPS...",
									content: "Você já adicionou 2 diárias hoje, limite alcançado!",
									buttons: {
										confirm: {
											text: "Continuar",
											btnClass: 'btn-success',
											keys: ['enter', 'esc']
										}
									}
								});

								return 300;
							}
							//imprimir pagamento
							$.ajax({
								url: "/imprimir/imprimirLogFuncionario/" + idFuncionario,
								type: 'POST',
								dataType: 'json',
								contentType: "application/json",
								data: JSON.stringify(salario)
							});
						});
					}
				}
			},
			cancel: {
				text: 'Voltar',
				keys: ['esc'],
				btnClass: 'btn-danger'
			}
		}
	});
}

//-------------------------------------------------------------------------
function addHoras() {
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in funcionarios) if (funcionarios[i].id == idFuncionario) var idBusca = i;

	funcionario = funcionarios[idBusca];

	linhaHtml = '<b>Hora Extra:</b> R$' + horaExtra.toFixed(2)
		+ '<hr><label>Total a adicionar: <button class="botao p-0 btn-link" onclick="aviso1()"><i class="fas fa-question"></i></button></label><br>'
		+ '<input type="number" class="form-control" id="horas" name="horas" placeholder="Digite o total de horas a adicionar"/>';

	carregarLoading("none");

	$.alert({
		type: 'blue',
		title: 'Funcionário: ' + funcionario.nome,
		content: linhaHtml,
		buttons: {
			confirm: {
				text: 'Adicionar Horas',
				keys: ['enter'],
				btnClass: 'btn-green',
				action: function() {

					carregarLoading("block");
					var horas = this.$content.find('#horas').val();

					if (horas == 0) {
						carregarLoading("none");
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm: {
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					} else {
						let salario = {};
						salario.horas = horas * horaExtra;

						$.ajax({
							url: '/adm/pagamento/salvar/' + idFuncionario + '/0',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(salario)
						}).done(function() {

							//imprimir pagamento
							$.ajax({
								url: "/imprimir/imprimirLogFuncionario/" + idFuncionario,
								type: 'POST',
								dataType: 'json',
								contentType: "application/json",
								data: JSON.stringify(salario)
							});

							carregarLoading("none");
							$.alert({
								type: 'green',
								title: "Sucesso",
								content: "Hora extra registrada!",
								buttons: {
									confirm: {
										text: "Continuar",
										btnClass: 'btn-success',
										keys: ['enter', 'esc']
									}
								}
							});
						}).fail(function() {
							carregarLoading("none");
							$.alert({
								type: 'red',
								title: 'OPS..',
								content: 'Digite um valor valido',
								buttons: {
									confirm: {
										text: 'Voltar',
										btnClass: 'btn-success',
										keys: ['esc', 'enter']
									}
								}
							});
						});
					}
				}
			},
			cancel: {
				text: 'Voltar',
				keys: ['esc'],
				btnClass: 'btn-danger'
			}
		}
	});
}


//-------------------------------------------------------------------------
function addGastos() {
	var botaoReceber = $(event.currentTarget);
	var idFuncionario = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in funcionarios) if (funcionarios[i].id == idFuncionario) var idBusca = i;

	funcionario = funcionarios[idBusca];

	linhaHtml = '<label>Total de gastos: '
		+ '<button class="btn-link p-0 botao" onclick="aviso2()">'
		+ '<i class="fas fa-question"></i></button></label><br>'

		+ '<div class="input-group mb-3">'
		+ '<span class="input-group-text">R$</span>'
		+ '<input class="form-control" id="gastos" name="gasto" placeholder="Digite o total a ser gasto"/>'
		+ '</div>';

	carregarLoading("none");
	$.alert({
		type: 'blue',
		title: 'Funcionário: ' + funcionario.nome,
		content: linhaHtml,
		buttons: {
			confirm: {
				text: 'Adicionar Gastos',
				keys: ['enter'],
				btnClass: 'btn-green',
				action: function() {
					carregarLoading("block");

					let gastos = Number(this.$content.find('#gastos').val().replace(",", "."));

					if (Number.isFinite(gastos) == false || gastos == 0) {
						carregarLoading("none");

						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm: {
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					} else {
						let salario = {};
						salario.gastos = gastos;

						$.ajax({
							url: '/adm/pagamento/salvar/' + idFuncionario + '/0',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(salario)
						}).done(function() {

							//imprimir pagamento
							$.ajax({
								url: "/imprimir/imprimirLogFuncionario/" + idFuncionario,
								type: 'POST',
								dataType: 'json',
								contentType: "application/json",
								data: JSON.stringify(salario)
							});

							carregarLoading("none");

							$.alert({
								type: 'green',
								title: "Sucesso",
								content: "Gasto registrado!",
								buttons: {
									confirm: {
										text: "Continuar",
										btnClass: 'btn-success',
										keys: ['enter', 'esc']
									}
								}
							});
						}).fail(function() {
							carregarLoading("none");
							$.alert({
								type: 'red',
								title: 'OPS..',
								content: 'Digite um valor valido',
								buttons: {
									confirm: {
										text: 'Voltar',
										btnClass: 'btn-success',
										keys: ['esc', 'enter']
									}
								}
							});
						});
					}
				}
			},
			cancel: {
				text: 'Voltar',
				keys: ['esc'],
				btnClass: 'btn-danger'
			}
		}
	});
};



//-------------------------------------------------------------------------
function pagarSalario(e, funcionario, dataBusca) {
	let [diarias, horas, gastos, pago] = [0, 0, 0, 0];

	for (j = 0; j < e.length; j++) {
		diarias += e[j].diarias;
		gastos += e[j].gastos;
		horas += e[j].horas;
		pago += e[j].pago;
	}

	var totalExtra = horas;

	linhaHtml = '<table class="table table-striped table-hover">'
		+ '<thead><tr>'
		+ '<th class="col-md-1"><h5>Salário</h5></th>'
		+ '<th class="col-md-1"><h5>Diárias</h5></th>'
		+ '<th class="col-md-1"><h5>Extras</h5></th>'
		+ '<th class="col-md-1"><h5>Gastos</h5></th>'
		+ '<th class="col-md-1"><h5>Pago</h5></th>'
		+ '<th class="col-md-1"><h5>Total</h5></th>'
		+ '</tr></thead>'

		+ '<tr>'
		+ '<td class="text-center col-md-1">R$ ' + funcionario.salario.toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + diarias.toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + totalExtra.toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + gastos.toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + pago.toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + (funcionario.salario + diarias + totalExtra - gastos - pago).toFixed(2) + '</td>'
		+ '</tr>'
		+ '</table>'

		+ '<hr><label>Total a pagar: '
		+ '<button class="btn-link p-0 botao" onclick="aviso()">'
		+ '<i class="fas fa-question"></i></button></label><br>'

		+ '<div class="input-group mb-3">'
		+ '<span class="input-group-text">R$</span>'
		+ '<input class="form-control" id="pagamento" name="pagamento" placeholder="Digite o total a ser pago"/>'
		+ '</div>';

	carregarLoading("none");
	$.alert({
		type: 'blue',
		title: 'Funcionário: ' + funcionario.nome,
		content: linhaHtml,
		columnClass: 'col-md-12',
		buttons: {
			confirm: {
				text: 'Pagar funcionário',
				keys: ['enter'],
				btnClass: 'btn-green',
				action: function() {
					carregarLoading("block");
					var pagamento = Number(this.$content.find('#pagamento').val().replace(",", "."));

					if (Number.isFinite(pagamento) == false || pagamento == 0) {
						carregarLoading("none");
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm: {
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					} else {
						let salario = {};
						salario.pago = pagamento;

						$.ajax({
							url: '/adm/pagamento/salvar/' + funcionario.id + '/' + dataBusca,
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(salario)
						}).done(function() {

							//imprimir pagamento
							$.ajax({
								url: "/imprimir/imprimirLogFuncionario/" + funcionario.id,
								type: 'POST',
								dataType: 'json',
								contentType: "application/json",
								data: JSON.stringify(salario)
							});

							carregarLoading("none");

							$.alert({
								type: 'green',
								title: "Sucesso",
								content: "Pagamento registrado!",
								buttons: {
									confirm: {
										text: "Continuar",
										btnClass: 'btn-success',
										keys: ['enter', 'esc']
									}
								}
							});
						}).fail(function() {
							carregarLoading("none");

							$.alert({
								type: 'red',
								title: 'OPS..',
								content: 'Digite um valor valido',
								buttons: {
									confirm: {
										text: 'Voltar',
										btnClass: 'btn-success',
										keys: ['esc', 'enter']
									}
								}
							});
						});
					}
				}
			},
			cancel: {
				text: 'Voltar',
				keys: ['esc'],
				btnClass: 'btn-danger'
			}
		}
	});
};


function imprimirResumo(e, funcionario) {
	linhaHtml = '<table class="table table-striped table-hover">'
		+ '<thead><tr>'
		+ '<th class="text-center col-md-1">Data registro</th>'
		+ '<th class="text-center col-md-1">Ação</th>'
		+ '<th class="text-center col-md-1">Total</th>'
		+ '</tr></thead>';
	if (e != 0) {
		for (log of e) {
			linhaHtml += '<tr>'
				+ '<td class="text-center col-md-1">' + log.logData + '</td>';

			if (log.gastos != 0) linhaHtml += '<td class="text-center col-md-1">gasto</td>'
				+ '<td class="text-center col-md-1">R$ ' + log.gastos.toFixed(2) + '</td>';
			if (log.horas != 0) linhaHtml += '<td class="text-center col-md-1">hora extra</td>'
				+ '<td class="text-center col-md-1">R$ ' + log.horas.toFixed(2) + '</td>';
			if (log.pago != 0) linhaHtml += '<td class="text-center col-md-1">pago</td>'
				+ '<td class="text-center col-md-1">R$ ' + log.pago.toFixed(2) + '</td>';
			if (log.diarias != 0) linhaHtml += '<td class="text-center col-md-1">diária</td>'
				+ '<td class="text-center col-md-1">R$ ' + log.diarias.toFixed(2) + '</td>';
			linhaHtml += '</tr>';
		}
	} else {
		linhaHtml += '<tr><td colspan="3">Nenhum registro adicionado</td></tr>';
	}

	linhaHtml += '</table>';

	carregarLoading("none");
	$.alert({
		type: 'blue',
		title: 'Funcionário: ' + funcionario.nome,
		content: linhaHtml,
		columnClass: 'col-md-8',
		buttons: {
			confirm: {
				text: '<i class="fas fa-print"></i> Imprimir',
				keys: ['enter'],
				btnClass: 'btn-green',
				action: function() {

					//imprimir pagamento
					$.ajax({
						url: "/imprimir/imprimirGeralFuncionario/" + funcionario.id,
						type: 'POST',
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(e)
					});
				}
			},
			cancel: {
				text: 'Voltar',
				keys: ['esc'],
				btnClass: 'btn-danger'
			}
		}
	});
};


//-------------------------------------------------------------------
function aviso() {
	$.alert({
		type: 'blue',
		title: 'Pagamento',
		content: 'Este campo é utilizado para descontar o valor que foi pago ao funcionário.'
			+ '<br><b>Pode ser usado para:</b>'
			+ '<br>&nbsp- Pagamentos diarios.'
			+ '<br>&nbsp- Pagamentos semanais.'
			+ '<br>&nbsp- Pagamentos mensais.',
		buttons: {
			confirm: {
				text: 'Voltar',
				btnClass: 'btn-success',
				keys: ['enter', 'esc']
			}
		}
	});
}

//-------------------------------------------------------------------
function aviso1() {
	$.alert({
		type: 'blue',
		title: 'Pagamento',
		content: 'Este campo é utilizado para adicionar as horas extras ao funcionário'
			+ '<br>Será multiplicada automaticamente e feito o calculo do valor total.',
		buttons: {
			confirm: {
				text: 'Voltar',
				btnClass: 'btn-success',
				keys: ['enter', 'esc']
			}
		}
	});
}

//-------------------------------------------------------------------
function aviso2() {
	$.alert({
		type: 'blue',
		title: 'Pagamento',
		content: 'Este campo é utilizado para selecionar o quanto foi gasto pelo funcionário no dia a dia e descontar do valor final',
		buttons: {
			confirm: {
				text: 'Voltar',
				btnClass: 'btn-success',
				keys: ['enter', 'esc']
			}
		}
	});
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}
