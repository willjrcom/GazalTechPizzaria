$(document).ready(() => $("#nomePagina").text("Cadastrar cliente"));
var todosEnderecos = [];
var cliente = {};
var url_atual = window.location.href;

var celular = parseInt(url_atual.split("/")[4]);
url_atual = url_atual.split("/")[5];

if (celular % 2 == 1 || celular % 2 == 0) $("#cel").val(celular);

if (typeof url_atual != "undefined") {

	$.ajax({
		url: "/u/cadastroCliente/editarCliente/" + url_atual,
		type: 'GET',
	}).done(function(e) {

		cliente = e;

		$("#enviar").text("Atualizar");

		//cliente
		$("#id").val(cliente.id);
		$("#nome").val(cliente.nome);
		$("#senha").val(cliente.senha);
		$("#cel").val(cliente.celular);
		$("#cpf").val(cliente.cpf);
		$("#contPedidos").val(cliente.contPedidos);
		$("#dataCadastro").val(cliente.dataCadastro);

		//endereco
		$("#idEnd").val(cliente.endereco.id);
		$("#cep").val(cliente.endereco.cep);
		$("#rua").val(cliente.endereco.rua);
		$("#n").val(cliente.endereco.n);
		$("#bairro").val(cliente.endereco.bairro);
		$("#cidade").val(cliente.endereco.cidade);
		$("#referencia").val(cliente.endereco.referencia);
		$("#taxa").val(cliente.endereco.taxa);

		$("#dados").html('<div class="row">'
			+ '<div class="col-md-6">'
			+ '<input class="form-control" value="Total de pedidos: ' + cliente.contPedidos + '" readonly/>'
			+ '</div>'
			+ '<div class="col-md-6">'
			+ '<input class="form-control" value="Data de cadastro: '
			+ cliente.dataCadastro.split("-")[2] + "/"
			+ cliente.dataCadastro.split("-")[1] + "/"
			+ cliente.dataCadastro.split("-")[0] + '" readonly/>'
			+ '</div></div>');

	}).fail(function() {
		$.alert("Erro, Cliente não encontrado!");
	});
}


$.ajax({
	url: "/u/cadastroCliente/enderecos/",
	type: 'GET',
}).done(function(e) {
	//remover duplicado completo
	const enderecos = e.filter((este, i) => e.indexOf(este) === i);
	let [arrayEnderecos, arrayBairros] = [[], []];
	for (let end of enderecos) {
		Endereco = {};
		[Endereco.bairro, Endereco.taxa] = end.split(',');
		arrayEnderecos.push(Endereco);
	}
	//remover bairros duplicados
	const enderecosFinal = arrayEnderecos.filter(end => end.taxa != 0);
	todosEnderecos = enderecosFinal;

	//criar array bairros
	enderecosFinal.forEach(a => arrayBairros.push(a.bairro));

	//ordenar vetor crescente
	const arrayBairrosOrder = arrayBairros.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));

	$("#bairro").autocomplete({
		source: arrayBairrosOrder
	});
});


$("#bairro").keyup(() => verificarBairro());
$("#cep").blur(() => setTimeout(() => verificarBairro(), 1000));

function verificarBairro() {
	if (todosEnderecos.find(o => o.bairro === $("#bairro").val())) {
		$("#taxa").val(todosEnderecos.find(o => o.bairro === $("#bairro").val()).taxa);
	}
}


//---------------------------------------------------------------
function setCliente() {
	cliente.id = $("#id").val();
	cliente.nome = $("#nome").val();
	cliente.senha = $("#senha").val();
	cliente.celular = Number($("#cel").cleanVal());
	cliente.cpf = $("#cpf").val();
	cliente.contPedidos = $("#contPedidos").val();
	cliente.dataCadastro = $("#dataCadastro").val();

	//endereco
	cliente.endereco = {};
	cliente.endereco.id = $("#idEnd").val();
	cliente.endereco.cep = $("#cep").val();
	cliente.endereco.rua = $("#rua").val();
	cliente.endereco.n = $("#n").val();
	cliente.endereco.bairro = $("#bairro").val();
	cliente.endereco.cidade = $("#cidade").val();
	cliente.endereco.referencia = $("#referencia").val();
	cliente.endereco.taxa = Number($("#taxa").val());
	if (cliente.endereco.taxa == '') cliente.endereco.taxa = 0;
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	cliente = {};

	if ($("#nome").val() != ''
		&& $("#cel").val() != ''
		&& $("#rua").val() != ''
		&& $("#n").val() != ''
		&& $("#bairro").val() != ''
		&& $("#cidade").val() != ''
		&& $("#taxa").val() != ''
		&& $("#validCpf").val() == 1
		&& $("#validCel").val() == 1) {

		setCliente();

		$.confirm({
			type: 'green',
			title: 'Cliente: ' + $("#nome").val(),
			content: 'Cadastrar cliente?',
			buttons: {
				confirm: {
					text: 'Cadastrar',
					btnClass: 'btn-green',
					keys: ['enter'],
					content: "Deseja enviar?",
					action: function() {

						carregarLoading("block");

						$.ajax({
							url: "/u/cadastroCliente/cadastrar",
							type: 'PUT',
							dataType: "json",
							contentType: 'application/json',
							data: JSON.stringify(cliente)

						}).done(function() {

							carregarLoading("none");
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Cliente cadastrado",
								buttons: {
									confirm: {
										text: 'Novo pedido',
										btnClass: 'btn-green',
										keys: ['esc', 'enter'],
										action: function() {
											window.location.href = "/u/novoPedido/atualizar/" + $("#cel").cleanVal();
										}
									},
								}
							});
						}).fail(function() {
							carregarLoading("none");

							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Cliente não cadastrado!"
							});
						});
					}
				},
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-red',
					keys: ['esc'],
				},
			}
		});
	} else {
		$.alert({
			type: 'red',
			title: 'Aviso',
			content: "Preencha os campos corretamente!"
		});
	}
});


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}
