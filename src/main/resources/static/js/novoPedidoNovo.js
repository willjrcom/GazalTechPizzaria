$(document).ready(() => $("#nomePagina").text("Novo Pedido"));

// VARIAVEIS
var [Cliente] = [{}];


// RETORNO DO CADASTRO DE CLIENTE
// Pega o modo de pedido
var modoPedido = window.location.href.split("/")[5];

// Pega o pedido de edicao do pedido
var nomePedido = window.location.href.split("/")[6]; 

// Retorno do cadastro cliente
if (modoPedido === 'atualizar') {
	$("#numeroCliente").val(nomePedido);
	buscarCliente();
}

//--------------------------------------------------------------------------
function buscarCliente() {
	campo_busca_cliente = $("#numeroCliente").val()
	// Se for nulo
	if (campo_busca_cliente === '') {
		// Voltar campo para digitar numero
		$(".pula")[$(".pula").index(this) - 1].focus();

		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'O campo está vazio, digite um telefone ou um nome!',
			buttons: {
				confirm: {
					text: 'Ok',
					btnClass: "btn-success",
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}
	// Se for numero
	if (isNumber($("#numeroCliente").val())) {
		carregarLoading("block");

		$.ajax({
			url: "/u/novoPedido/numeroCliente/" + $("#numeroCliente").val(),
			type: 'GET'
		}).done(function(retorno_cliente) {
			// Verificar se existe
			if (retorno_cliente.length != 0) {
				// Set obj
				Cliente.nome = retorno_cliente.nome;
				Cliente.celular = retorno_cliente.celular;
				Cliente.endereco = `${retorno_cliente.endereco.rua} - ${retorno_cliente.endereco.n} - ${retorno_cliente.endereco.bairro}`;
				Cliente.referencia = retorno_cliente.endereco.referencia;
				Cliente.taxa = retorno_cliente.endereco.taxa;
				Cliente.envio = "ENTREGA";
				
				// Set html
				$("#nomeCliente").text(Cliente.nome);
				$("#celCliente").text(Cliente.celular);
				$("#enderecoCliente").text(Cliente.endereco);
				$("#taxaCliente").text('Taxa: R$ ' + Cliente.taxa.toFixed(2));

				mostrarDivsPedido();
			} else {
				window.location.href = "/u/cadastroCliente/" + $("#numeroCliente").val();
			}
			carregarLoading("none");
		});

	} else if (typeof $("#numeroCliente").val() == 'string') {
		Cliente.nome = $("#numeroCliente").val();
		$("#nomeCliente").text(Cliente.nome);
		$(".iconesEntrega").hide();

		//se for mesa
		if (Cliente.nome.indexOf("Mesa") > -1) {//se existir a palavra Mesa
			Cliente.envio = "MESA";
		} else if (Cliente.nome.indexOf("mesa") > -1) {//se existir a palavra mesa
			Cliente.envio = "MESA";
		} else if ((Cliente.nome[0] == 'M' && Cliente.nome[1] % 2 == 0) || (Cliente.nome[0] == 'M' && Cliente.nome[1] % 2 == 1)) {
			Cliente.envio = "MESA";
		} else if ((Cliente.nome[0] == 'm' && Cliente.nome[1] % 2 == 0) || (Cliente.nome[0] == 'm' && Cliente.nome[1] % 2 == 1)) {
			Cliente.envio = "MESA";
		} else if (Cliente.nome.indexOf("drive") > -1) {//se existir a palavra mesa
			Cliente.envio = "DRIVE";
		} else if (Cliente.nome.indexOf("Drive") > -1) {//se existir a palavra mesa
			Cliente.envio = "DRIVE";
		} else {
			Cliente.envio = "BALCAO";
		}

		mostrarDivsPedido();
	} else{
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'Retorno não mapeado!',
			buttons: {
				confirm: {
					text: 'Ok',
					btnClass: "btn-danger",
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}
};


//------------------------------------------------------------------------------------
function mostrarDivsPedido() {
	buscarProdutosAutoComplete();
	if (Cliente.envio == "ENTREGA") {
		$("#envioCliente").append('<option value="ENTREGA">Entrega</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
		$("#divCobrarTaxa").show('slow');
		$("#divPagamentoGeral").show('slow');
	} else if (Cliente.envio == "MESA") {
		$("#envioCliente").append('<option value="MESA">Mesa</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
		$("#divGarcon").show('slow');
		$("#divPagamentoGeral").hide('slow');
	} else if (Cliente.envio == "BALCAO") {
		$("#envioCliente").append('<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
	} else if (Cliente.envio == "DRIVE") {
		$("#envioCliente").append('<option value="DRIVE">Drive-Thru</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
		);
	}
	
	// Esconder div de buscar cliente
	$("#divBuscarCliente").hide('slow', () => {
		$("#mostrarDadosCliente").show('slow', () => {
			$("#divBuscarProdutos").show('slow', () => {
				// Focar no campo de buscar pedido
				$(".pula")[2].focus();
			});
		});
	});
}


// Funções ---------------------------------
function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
	return !isNaN(parseFloat(str))
}


function buscarProdutosAutoComplete() {
	$.widget("custom.catcomplete", $.ui.autocomplete, {
		_create: function() {
			this._super();
			this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
		},
		_renderMenu: function(ul, items) {
			var that = this,
				currentCategory = "";
			$.each(items, function(index, item) {
				var li;
				if (item.category != currentCategory) {
					ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
					currentCategory = item.category;
				}
				li = that._renderItemData(ul, item);
				if (item.category) {
					li.attr("aria-label", item.category + " : " + item.label);
				}
			});
		}
	});

	$.ajax({
		url: '/u/novoPedido/autoComplete',
		type: 'GET'
	}).done(e => {
		let _produto = {};
		let arrayProdutosAutoComplete = [];
		for (let produto of e) {
			_produto = {};
			[_produto.label, _produto.category] = produto.split(',');
			arrayProdutosAutoComplete.push(_produto);
		}
		//ordenar vetor crescente
		const arrayProdutosAutoCompleteOrder = arrayProdutosAutoComplete.sort((a, b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0));
		
		$("#nome").catcomplete({
			source: arrayProdutosAutoCompleteOrder
		});
	});
}


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	campo_nome_produto = $.trim($("#nome").val());
	if (campo_nome_produto != "") {
		carregarLoading("block");

		$.ajax({
			url: "/u/novoPedido/nomeProduto/" + campo_nome_produto,
			type: 'GET'
		}).done(function(e) {
			buscaProdutos = e;
			$("#nome").val('');

			carregarLoading("none");
			if (buscaProdutos.length == 0) {//se nao encontrar nenhum produto
				$.confirm({
					type: 'red',
					title: 'OPS...',
					content: '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>',
					closeIcon: true,
					buttons: {
						confirm: {
							isHidden: true,
							text: 'Voltar',
							btnClass: 'btn-green',
							keys: ['enter', 'esc'],
						}
					}
				});
				return 300;
			}

			if (buscaProdutos[0].id == -1) {//se o produto estiver indisponivel
				$.confirm({
					type: 'red',
					title: '<h4 align="center">Produto: ' + buscaProdutos[0].nome + '</h4>',
					content: '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>',
					closeIcon: true,
					buttons: {
						confirm: {
							isHidden: true,
							text: 'Voltar',
							btnClass: 'btn-green',
							keys: ['enter', 'esc'],
						}
					}
				});
				return 300;
			}

			if (buscaProdutos.length == 1) {//se existir apenas um resultado vai direto ao produto
				enviarProduto(buscaProdutos[0].id);
				return 300;
			}

			$.confirm({
				type: 'blue',
				title: '<h4 align="center">Lista de Produtos</h4>',
				content: mostrarListaBuscaProdutos(buscaProdutos),
				closeIcon: true,
				buttons: {
					confirm: {
						isHidden: true,
						text: 'Voltar',
						btnClass: 'btn-green',
						keys: ['enter', 'esc'],
					}
				}
			});
		});
	}
}