$(document).ready(() => $("#nomePagina").text("Clientes cadastrados"));

var [clientes, arrayClientes] = [[], []];
var Cliente = {};
var [linhaHtml, linhaClientesHtml] = ['', ''];
var pedidoVazio = '<tr><td colspan="4">Nenhum cliente encontrado!</td></tr>';

$("#buscar").click(function() {
	carregarLoading("block");

	var nome = $("#nomeBusca").val();

	$.ajax({
		url: '/f/clientesCadastrados/buscar/' + nome + '/' + (isNaN(Number(nome)) ? "0" : Number(nome)),
		type: 'GET'
	}).done(function(e) {

		clientes = e;
		if (e.length == 0) {
			$("#todosClientes").html(pedidoVazio);
		} else {

			linhaHtml = "";
			for (cliente of clientes) {
				cliente.referencia = cliente.endereco.referencia;
				cliente.taxa = cliente.endereco.taxa;
				cliente.endereco = cliente.endereco.rua + ' - ' + cliente.endereco.n + ' - ' + cliente.endereco.bairro

				linhaHtml += '<tr>'
					+ '<td>' + cliente.nome + '</td>'
					+ '<td>' + cliente.celular + '</td>'
					+ '<td>' + cliente.endereco + '</td>'

					+ '<td><div class="row">'
					+ '<div class="col-md-1">'
					+ '<a title="Ver cliente" data-toggle="tooltip" data-html="true">'
					+ '<button class="botao" onclick="verCliente()" value="' + cliente.id + '">'
					+ '<i class="fas fa-search"></i>'
					+ '</button>'
					+ '</a>'
					+ '</div>'

					+ '<div class="col-md-1">'
					+ '<a title="Editar cliente" data-toggle="tooltip" data-html="true">'
					+ '<button class="botao" onclick="editarCliente()" value="' + cliente.id + '">'
					+ '<i class="fas fa-edit"></i>'
					+ '</button>'
					+ '</a>'
					+ '</div>'

					+ '<div class="col-md-1">'
					+ '<a title="Excluir cliente" data-toggle="tooltip" data-html="true">'
					+ '<button class="botao" onclick="excluirCliente()" value="' + cliente.id + '">'
					+ '<i class="fas fa-trash"></i>'
					+ '</button>'
					+ '</a>'
					+ '</div>'
					+ '</div>'
					+ '</td></tr>';
			}
			$("#todosClientes").html(linhaHtml);
			$('[data-toggle="tooltip"]').tooltip();
		}
		carregarLoading("none");
	}).fail(function() {
		carregarLoading("none");
		$.alert("Erro, Nenhum cliente encontrado!");
	});
});


//-----------------------------------------------------------------------------------------------------------
function verCliente() {

	var botaoReceber = $(event.currentTarget);
	var idCliente = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in clientes) if (clientes[i].id == idCliente) var idBusca = i;

	linhaHtml = '<div class="row">'
		+ '<div class="col-md-6">'
		+ '<label>Celular</label>'
		+ '<input class="form-control" value="'
		+ clientes[idBusca].celular
		+ '" readonly/>'
		+ '</div>'

		+ '<div class="col-md-6">'
		+ '<label>Cpf</label>'
		+ '<input class="form-control" value="'
			+ clientes[idBusca].cpf
		+ '" readonly/>'
		+ '</div>'
		+ '</div>'

		+ '<div>'
		+ '<label>Endereco</label>'
		+ '<input class="form-control" value="'
		+ clientes[idBusca].endereco
		+ '" readonly/>'
		+ '</div>'

		+ '<div>'
		+ '<label>Referência</label>'
		+ '<input class="form-control" value="'
		+ clientes[idBusca].referencia
		+ '" readonly/>'
		+ '</div>'

		+ '<div class="row">'
		+ '<div class="col-md-4">'
		+ '<label>Taxa de entrega</label>'
		+ '<input class="form-control" value=" R$ '
		+ clientes[idBusca].taxa.toFixed(2)
		+ '" readonly/>'
		+ '</div>'

		+ '<div class="col-md-4">'
		+ '<label>Data de cadastro</label>'
		+ '<input class="form-control" value="'
		+ clientes[idBusca].dataCadastro.split('-')[2] + '/'
		+ clientes[idBusca].dataCadastro.split('-')[1] + '/'
		+ clientes[idBusca].dataCadastro.split('-')[0]
		+ '" readonly/>'
		+ '</div>'

		+ '<div class="col-md-4">'
		+ '<label>Total de pedidos</label>'
		+ '<input class="form-control" value="'
		+ clientes[idBusca].contPedidos
		+ '" readonly/>'
		+ '</div>'
		+ '</div>';

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
	for (i in clientes) if (clientes[i].id == idCliente) var idBusca = i;

	$.confirm({
		type: 'red',
		title: 'Cliente: ' + clientes[idBusca].nome,
		content: 'Tenha certeza do que você está fazendo!<br>',
		buttons: {
			confirm: {
				text: 'Editar Cliente',
				btnClass: 'btn-red',
				keys: ['enter'],
				action: function() {
					window.location.href = "/f/cadastroCliente/editar/" + idCliente;
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


//-----------------------------------------------------------------------------------------------------------
function excluirCliente() {
	var botaoReceber = $(event.currentTarget);
	var idCliente = botaoReceber.attr('value');

	//buscar dados completos do pedido enviado
	for (i in clientes) if (clientes[i].id == idCliente) var idBusca = i;

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
				action: function() {

					$.confirm({
						type: 'red',
						title: 'APAGAR CLIENTE!',
						content: 'Tem certeza?' + inputApagar,
						buttons: {
							confirm: {
								text: 'Apagar cliente',
								btnClass: 'btn-red',
								keys: ['enter'],
								action: function() {
									var apagarSim = this.$content.find('#apagar').val();

									//verificar permissao adm
									$.ajax({
										url: "/u/verpedido/autenticado"
									}).done(function(e) {
										if (e[0].authority === "ADM" || e[0].authority === "DEV") {
											if (apagarSim === 'sim' || apagarSim === 'SIM') {

												$.ajax({
													url: "/f/clientesCadastrados/excluirCliente/" + idCliente,
													type: 'PUT'

												}).done(function() {
													$.alert({
														type: 'green',
														title: 'Cliente apagado!',
														content: 'Espero que dê tudo certo!',
														buttons: {
															confirm: {
																text: 'Voltar',
																keys: ['enter'],
																btnClass: 'btn-green',
																action: function()  {
																	indow.location.href = "/f/clientesCadastrados";
																}
															}
														}
													});
												}).fail(function() {
													$.alert("Erro, Cliente nâo apagado!");
												});
											} else {
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
										} else {//se nao for ADM
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


//cadastros------------------------------------------------------
function mostrarClientes() {
	carregarLoading('block');

	$.ajax({
		url: '/f/clientesCadastrados/clientes',
		type: "GET"
	}).done(todosClientes => {

		linhaHtml = '<table class="table table-striped table-hover table-sm">'
			+ '<caption><i class="fas fa-trophy"></i> Top 10 Clientes</caption>'
			+ '<thead>'
			+ '<tr>'
			+ '<th class="col-md-1">Ranking</th>'
			+ '<th class="col-md-1">Cliente</th>'
			+ '<th class="col-md-1">Pedidos</th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>';

		if (todosClientes.length != 0) {
			arrayClientes = [];
			for (cliente of todosClientes) {
				Cliente = {};
				[Cliente.nome, Cliente.total] = cliente.split(',');
				arrayClientes.push(Cliente);
			}

			linhaClientesHtml = "";
			for (let [i, cliente] of arrayClientes.entries()) {
				linhaHtml += '<tr>'
					+ '<td class="sombra" align="center">Top ' + (i + 1) + '</td>'
					+ '<td class="sombra" align="center"><b>' + cliente.nome.substring(0, 20) + '</b></td>'
					+ '<td class="sombra" align="center">' + cliente.total + '</td>'
					+ '</tr>';
			}
		} else {
			linhaHtml += '<tr><td colspan="3" class="sombra" align="center"><label>Nenhum cliente encontrado!</label></td><tr>';
		}

		linhaHtml += '</tbody>'
			+ '</table>';

		carregarLoading("none");
		$.alert({
			type: 'blue',
			title: 'Top 10',
			content: linhaHtml,
			closeIcon: true,
			buttons: {
				confirm: {
					isHidden: true,
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
