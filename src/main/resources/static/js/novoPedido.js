$(document).ready(() => $("#nomePagina").text("Novo Pedido"));

//objetos---------------------------------------------------------------------------------------------------------
var [cliente, temp, produto, Borda] = [{}, {}, {}, {}];
//vetores------------------------------------------------------------------------------------------------------
var [pizzas, produtos, buscaProdutos, buscaBordas, buscaGarcon] = [[], [], [], [], []];

//divisores de qtd
var [divisor, divisorAnterior] = [1, 1];

//borda------------------------------------------------------------------------------------------------------
var [borda, lastBorda, tamanhoProduto] = ['', 0, 1];

//pedido------------------------------------------------------------------------------------------------------
var [totalTodosProdutos, totalTodosProdutosAnteriores, tPedido, troco] = [0, 0, 0, 0];
var totalUnico; // valor fixo mesmo depois do sistema atualizar o pedido antigo com o novo
var modo = "CRIAR";

//html------------------------------------------------------------------------------------------------------
var [linhaHtml, bordasHtml, garconsHtml, nomeProduto] = ['', '', '', ''];

var pizzaVazio = '<tr><td colspan="7">Nenhuma pizza adicionada!</td></tr>';
var produtoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';

//url------------------------------------------------------------------------------------------------------
var modoPedido = window.location.href.split("/")[5];//pega o modo de pedido
var nomePedido = window.location.href.split("/")[6]; //pega o pedido de edicao do pedido

//-------------------------------------------------------------------------
//controlar qauntidade do produto
function qtdHtml() {
	let [htmlChecked, htmlDisabled] = ['', ''];
	let qtdDivisor = 0;

	if (divisor < 1 && divisor != 0) {
		htmlDisabled = "disabled";

		//para outros
		qtdDivisor = divisor;

		//para meio a meio
		if (divisor == 0.5 && divisorAnterior != 0.75) {
			qtdDivisor = 0.5;
		}
		//para 1/3
		else if (divisor == 0.7 || divisor == 0.4) {
			qtdDivisor = 0.3;
		}
		//para 1/4
		else if (divisor == 0.75 || (divisor == 0.5 && divisorAnterior == 0.75) || divisor == 0.25) {
			qtdDivisor = 0.25;
		}
	} else {
		qtdDivisor = divisor;
		htmlChecked = "checked";
		htmlDisabled = "";
	}

	if (divisor == 0 || divisor < 0.09 || divisor > 1) {
		qtdDivisor = divisor = 1;
		htmlDisabled = "";
	}

	return ('<div class="row">'
		+ '<div class="col-md-6">'
		+ '<label>Quantidade:</label>'
		+ '<div class="input-group mb-3">'
		+ '<div class="input-group-text">'
		+ '<input class="form-check-input liberarqtd" type="radio" aria-label="radio button for following text input" ' + htmlChecked + '>'
		+ '</div>'
		+ '<input type="text" placeholder="Quantidade" class="form-control pula" id="qtd"'
		+ 'value="' + Number(qtdDivisor.toFixed(2)) + '" ' + htmlDisabled + ' aria-label="Text input with radio button"/>'
		+ '</div>'
		+ '</div>'

		+ '<div class="col-md-6">'
		+ '<label>Tamanho:</label>'
		+ '<select class="form-control" id="tamanhoProduto">'
		+ '<option value="1">Medio M</option>'
		+ '<option value="0">Pequeno P</option>'
		+ '<option value="2">Grande G</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'

		+ '<br>'
		+ '<label>Observação:</label>'
		+ '<input type="text" class="form-control pula" name="obs" id="obs" placeholder="Observação" />');
}


//buscar borda recheada---------------------------------------------------------------------------
(() => {
	let html = "";

	$.ajax({
		url: '/u/novoPedido/bordas',
		type: 'GET',
		success: todasBordas => {

			//buscar bordas
			var bordas = '';
			for (borda of todasBordas) bordas += `<option value="${borda.id}">${borda.nome} R$ ${borda.precoM.toFixed(2)}</option>`;

			html = '<label>Borda Recheada:</label>'
				+ '<select class="form-control" name="borda" id="borda">'
				+ '<option value="0"></option>'
				+ bordas
				+ '</select><br>';
			salvarBordas(html, todasBordas);
		}
	});

	$.ajax({
		url: '/u/novoPedido/garcons',
		type: 'GET',
		success: todosGarcons => {

			//buscar bordas
			var garconsHtml = '';
			if (todosGarcons.length != 0) {
				for (garcon of todosGarcons) garconsHtml += `<option value="${garcon.nome}">${garcon.nome}</option>`;

				$("#garcon").append(garconsHtml);
			}
		}
	});
})();


//---------------------------------------------------------------------------------------------------------
function salvarBordas(html, todasBordas) {
	bordasHtml = html;
	buscaBordas = todasBordas;
}


//setInterval(() => console.log(cliente), 1000)

//------------------------------------------------------------------------------------------------------------
//retorno do cadastro cliente
if (modoPedido === 'atualizar') {
	$("#numeroCliente").val(nomePedido);
	buscarCliente();
}


//------------------------------------------------------------------------------------------------------------
if (modoPedido === 'editar') {
	modo = "EDITAR";
	carregarLoading("block");

	$.ajax({
		url: "/u/novoPedido/editarPedido/" + nomePedido,
		type: 'GET'
	}).done(function(e) {

		if (e.length == 0) {
			carregarLoading("none");
			$.alert({
				type: 'red',
				title: 'OPS...',
				content: 'Este pedido não existe!',
				buttons: {
					confirm: {
						text: 'Recarregar',
						btnClass: 'btn-success',
						keys: ['enter', 'esc'],
						action: () => window.location.href = "/u/novoPedido"
					}
				}
			});
			return 300;
		}
		cliente = e;
		cliente.taxa = parseFloat(cliente.taxa);
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);

		mostrarDivPizzasProdutos();

		//liberar opcao de envio
		mostrarDivsPedido();

		//adicionar cliente
		$("#idCliente").text(cliente.id);
		$("#nomeCliente").text(cliente.nome);
		$("#obs").text(cliente.obs);

		//mostrar entrega
		if (e.envio == 'ENTREGA') {
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
			$("#divCobrarTaxa").show('slow');

			//apagar div de cobrar taxa	
			if (cliente.taxa === 0) {
				$("#cobrarTaxa").val(1);
			}
			$("#cobrarTaxa").attr("disabled", true);
		}

		//mostrar entrega
		if (e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {
			$(".iconesEntrega").hide();
		}

		if (cliente.pago == 1)//pago
			$("#pagoCliente").val('1');
		else//a pagar
			$("#pagoCliente").val('0');

		//opcoes de pagamento
		if (cliente.modoPagamento.split(" ")[0] == "Cartão" && cliente.pago == 0) {
			$("#modoPagamento").val(1);//cartao
			$("#modoPagamentoCartao").val(cliente.modoPagamento.split("-")[1]);
		} else if (cliente.pago == 0) {
			$("#modoPagamento").val(0);//dinheiro
		}

		selecionarPago();
		selecionaModoPagamento();

		$("#divBuscarCliente").hide();
		$(".divListaGeral").show();
		$("#mostrarDadosCliente").show();
		$("#BotaoEnviarPedido").html('<i class="fas fa-check"></i> Atualizar pedido');
		$("#cancelar").html('<i class="fas fa-ban"></i> Cancelar alteração');

		//verificar garcon
		if (e.envio === 'MESA') {
			$("#divGarcon").show('slow');
			$("#garcon").text(cliente.garcon).attr("disabled", true);
		}

		for (pizza of cliente.pizzas) totalTodosProdutos += pizza.qtd;

		for (produto of cliente.produtos) totalTodosProdutos += produto.qtd;

		pizzas = cliente.pizzas;
		produtos = cliente.produtos;
		tPedido = cliente.total;

		$("#alertPedidoAberto").text("Ao confirmar, os pedidos a fazer serão enviados para fazer na cozinha novamente!").show("slow");
		setInterval(() => $("#alertPedidoAberto").hide("slow"), 30000);

		mostrarProdutos();
		mostrarTotal();
		$(".pula")[2].focus();//focar no campo de buscar pedido

		carregarLoading("none");
	}).fail(function() {
		$.alert("Erro, cliente não encontrado!");
	});
}


//------------------------------------------------------------------------------------------------------------------------
function buscarCliente() {
	//se for nulo
	if ($("#numeroCliente").val() == '') {
		//voltar campo para digitar numero
		let campo = $(".pula");
		let indice = $(".pula").index(this);
		campo[indice - 1].focus();

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
	//se for numero
	if (isNumber($("#numeroCliente").val())) {
		carregarLoading("block");

		$.ajax({
			url: "/u/novoPedido/numeroCliente/" + $("#numeroCliente").val(),
			type: 'GET'
		}).done(function(e) {
			//verificar se existe
			if (e.length != 0) {

				cliente.nome = e.nome;
				cliente.celular = e.celular;
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n + ' - ' + e.endereco.bairro;
				cliente.referencia = e.endereco.referencia;
				cliente.taxa = e.endereco.taxa;
				cliente.envio = "ENTREGA";

				$("#nomeCliente").text(cliente.nome);
				$("#celCliente").text(cliente.celular);
				$("#enderecoCliente").text(cliente.endereco);
				$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));

				atualizarDados();
				mostrarDivsPedido();
			} else {
				window.location.href = "/f/cadastroCliente/" + $("#numeroCliente").val();
			}
			carregarLoading("none");
		});

	} else if (typeof $("#numeroCliente").val() == 'string') {
		cliente.nome = $("#numeroCliente").val();
		$("#nomeCliente").text(cliente.nome);
		$(".iconesEntrega").hide();

		//se for mesa
		if (cliente.nome.indexOf("Mesa") > -1) {//se existir a palavra Mesa
			cliente.envio = "MESA";
		} else if (cliente.nome.indexOf("mesa") > -1) {//se existir a palavra mesa
			cliente.envio = "MESA";
		} else if ((cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 1)) {
			cliente.envio = "MESA";
		} else if ((cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 1)) {
			cliente.envio = "MESA";
		} else if (cliente.nome.indexOf("drive") > -1) {//se existir a palavra mesa
			cliente.envio = "DRIVE";
		} else if (cliente.nome.indexOf("Drive") > -1) {//se existir a palavra mesa
			cliente.envio = "DRIVE";
		} else {
			cliente.envio = "BALCAO";
		}

		atualizarDados();
		mostrarDivsPedido();
	}
};


//------------------------------------------------------------------------------------
function mostrarDivsPedido() {
	buscarProdutosAutoComplete();
	if (cliente.envio == "ENTREGA") {
		$("#envioCliente").append('<option value="ENTREGA">Entrega</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
		$("#divCobrarTaxa").show('slow');
		$("#divPagamentoGeral").show('slow');
	} else if (cliente.envio == "MESA") {
		$("#envioCliente").append('<option value="MESA">Mesa</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
		$("#divGarcon").show('slow');
		$("#divPagamentoGeral").hide('slow');
	} else if (cliente.envio == "BALCAO") {
		$("#envioCliente").append('<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
			+ '<option value="DRIVE">Drive-Thru</option>'
		);
	} else if (cliente.envio == "DRIVE") {
		$("#envioCliente").append('<option value="DRIVE">Drive-Thru</option>'
			+ '<option value="BALCAO">Balcão</option>'
			+ '<option value="MESA">Mesa</option>'
		);
	}
	$("#divBuscarCliente").hide('slow', () => {
		$("#mostrarDadosCliente").show('slow', () => {
			if (modo != "EDITAR") {
				$("#divBuscarProdutos").show('slow', () => {
					$(".pula")[2].focus();//focar no campo de buscar pedido
				});
			}
		});
	});
}


//verificar se o pedido ja existe
function atualizarDados() {
	//buscar pedido no sistema
	$.ajax({
		url: "/u/novoPedido/atualizarPedido/" + cliente.nome,
		type: 'PUT',
	}).done(function(e) {
		cliente.data = e.data;

		if (e.id != null) {
			modo = "ATUALIZAR";
			tPedido = e.total;
			cliente.id = e.id;
			cliente.comanda = e.comanda;
			cliente.horaPedido = e.horaPedido;
			cliente.envio = e.envio;

			if (e.cupom != '' && e.cupom != null) {
				cliente.cupom = e.cupom;
				$("#divCupom").show('slow');
				$("#cupom").val(cliente.cupom);
			}

			totalTodosProdutosAnteriores = 0;

			if (JSON.parse(e.pizzas).length != 0) for (let pizza of JSON.parse(e.pizzas)) totalTodosProdutosAnteriores += pizza.qtd;

			if (JSON.parse(e.produtos).length != 0) for (let produto of JSON.parse(e.produtos)) totalTodosProdutosAnteriores += produto.qtd;

			$("#totalTodosProdutosAnteriores").html('<b>Total de produtos anteriores:</b> ' + totalTodosProdutosAnteriores).show('slow');
			mostrarTotal();
			if (modoPedido != 'atualizar') {
				$("#alertPedidoAberto").show("slow");
				setInterval(() => $("#alertPedidoAberto").hide("slow"), 30000);
			}
		}
	});
}


//fechar alert pedidos
$("#alertPedidoAberto").click(() => $("#alertPedidoAberto").hide("slow"))


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {

	if ($.trim($("#nome").val()) != "") {
		carregarLoading("block");

		$.ajax({
			url: "/u/novoPedido/nomeProduto/" + $("#nome").val(),
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


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto(idUnico) {

	[borda, nomeProduto] = ['', ''];
	[produto, Borda] = [{}, {}];
	Borda.nome = '';

	//caso o retorno seja apenas 1 item
	if (idUnico == null) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');

	} else var idProduto = idUnico;

	if (buscaProdutos.length != 1)//buscar produto na lista
		for (let busca of buscaProdutos) {
			if (busca.id == idProduto) produto = busca;
		} else {
		produto = buscaProdutos[0];
	}

	if (produto.disponivel == false) {
		$.confirm({
			type: 'red',
			title: '<h4 align="center">Produto: ' + produto.nome + '</h4>',
			content: '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>',
			closeIcon: true,
			buttons: {
				confirm: {
					isHidden: true,
					text: 'Voltar',
					btnClass: 'btn btn-green',
					keys: ['enter', 'esc'],
				}
			}
		});
		return 300;
	}

	$.confirm({
		type: 'blue',
		title: produto.setor + ': ' + produto.nome,
		content: '<label><b>Total:</b> R$ <span id="precoComQtd">' + Number(produto.preco).toFixed(2) + '</span></label><br>'
			+ (produto.setor == 'PIZZA' ? bordasHtml : '') + qtdHtml(),
		closeIcon: true,
		onContentReady: () => {
			if (produto.setor == 'PIZZA') {
				//liberar qtd para alteracao
				$(".liberarqtd").change(() => {
					$(".liberarqtd").prop("checked") == 'on'
						? $("#qtd").prop("disabled", true)
						: $("#qtd").prop("disabled", false);
				});

				if (divisor != 1) {
					//$("#borda").prop("disabled", true)
					$("#borda").val(lastBorda);
				} else {
					//$("#borda").prop("disabled", false);
				}

				$("#tamanhoProduto").val(tamanhoProduto);
				$("#tamanhoProduto").change(() => confirmarTamanho());

				$("#borda").change(() => {
					confirmarTamanho();
				});
			}

			//verificar o campo pula dentro do jquery confirm
			if (!$("#qtd").attr('disabled'))
				$("#qtd").focus().select();
			else
				$("#obs").focus();

			$("#qtd").keyup(() => {
				confirmarTamanho();
			});
			confirmarTamanho();
		},
		buttons: {
			confirm: {
				text: 'adicionar',
				btnClass: 'btn btn-success enviarProduto',
				keys: ['enter'],
				action: function() {

					//adiciona o id da borda
					lastBorda = bordaId = $("#borda").val();
					
					//pegar tamanho do produto
					tamanhoProduto = $("#tamanhoProduto").val();

					//adiciona quantidade do produto
					qtd = Number(Number($("#qtd").val().toString().replace(",", ".")).toFixed(2));
					if (isNaN(qtd) || qtd == 0) qtd = 1;

					//setar ultima borda adicionada
					if (qtd == 1) lastBorda = 0;

					//adiciona observacao do produto
					obs = $("#obs").val();

					//verifica o tamanho do produto
					if (tamanhoProduto == 0) {
						if (produto.custoP == 0) return precoNulo('Pequeno P');
						nomeProduto = produto.nome + ' - P';
						produto.preco = produto.precoP;
						produto.custo = produto.custoP;
					} else if (tamanhoProduto == 1) {
						if (produto.custoM == 0) return precoNulo('Medio M');
						nomeProduto = produto.nome + ' - M';
						produto.preco = produto.precoM;
						produto.custo = produto.custoM;
					} else if (tamanhoProduto == 2) {
						if (produto.custoG == 0) return precoNulo('Grande G');
						nomeProduto = produto.nome + ' - G';
						produto.preco = produto.precoG;
						produto.custo = produto.custoG;
					}
					//multiplica o preco e custo do produto
					produto.preco *= qtd;
					produto.custo *= qtd;

					if (produto.setor == 'PIZZA') {
						//se for escolhido uma borda
						if (bordaId != 0) {
							//buscar produto na lista
							for (let busca of buscaBordas) if (busca.id == bordaId) Borda = busca;

							//setar valores da borda escolhida
							borda = Borda.nome;

							//multiplica o preco e custo da borda
							produto.preco += (Borda.precoM * qtd);
							produto.custo += (Borda.custoM * qtd);
						}
						pizzas.unshift({
							qtd,
							obs,
							'sabor': nomeProduto,
							'borda': Borda.nome,
							'preco': produto.preco,
							'custo': produto.custo,
							'setor': produto.setor,
							'descricao': produto.descricao,
						});
					} else {
						produtos.unshift({
							qtd,
							obs,
							'sabor': nomeProduto,
							'preco': produto.preco,
							'custo': produto.custo,
							'setor': produto.setor,
							'descricao': produto.descricao,
						});
					}
					//adicionar total de produtos em geral
					totalTodosProdutos += qtd;

					//adicionar total do pedido
					tPedido += produto.preco;

					//controlar qtd do produto
					divisorAnterior = divisor;
					divisor -= qtd;

					//setar divisor
					if (divisor <= 0) divisor = 1;

					mostrarProdutos();
				}
			},
			cancel: {
				isHidden: true,
				keys: ['esc'],
			}
		}
	});
};


//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function() {
	try {
		totalTodosProdutos -= produtos[0].qtd;
		tPedido -= produtos[0].preco;

		let divAnt = divisor;
		divisor = divisorAnterior;

		if (divisor != 1) divisorAnterior += divAnt;

		produtos.shift();
		mostrarProdutos();
	} catch (exception) { }
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function() {
	try {
		totalTodosProdutos -= pizzas[0].qtd;
		tPedido -= pizzas[0].preco;

		let divAnt = divisor;
		divisor = divisorAnterior;

		if (divisor != 1) divisorAnterior += divAnt;

		pizzas.shift();
		mostrarProdutos();
	} catch (exception) { }
});


//------------------------------------------------------------------------------------------------------------------------
$("#BotaoEnviarPedido").click(function() {

	//receber modo de envio e verificar opcao de envio
	cliente.envio = $("#envioCliente").val();

	if (cliente.envio === 'MESA') {
		if ($("#garcon").val() == '--') {
			$.alert({
				type: 'red',
				title: 'OPS...',
				content: "Escolha um garçon",
				buttons: {
					confirm: {
						text: 'Voltar',
						btnClass: 'btn-danger',
						keys: ['esc', 'enter']
					}
				}
			});
			return 300;
		}
		cliente.garcon = $("#garcon").val();
	}

	//verificar se for dinheiro
	if ($("#modoPagamento").val() == 0) {
		//receber troco
		troco = Number($('#troco').val().replace(",", "."));

		//verificar troco
		if (Number.isFinite(troco) == false) {
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
			return 300;
		}
		cliente.modoPagamento = "Dinheiro -R$ " + mostrarTotalComTaxa().toFixed(2);
	}

	//verificar se for cartao e escolheu uma opcao
	if (selecionarCartao() == 0 && $("#modoPagamento").val() == 1) {
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: "Escolha uma bandeira de cartão!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}
	/*
	//se o total de produtos for inteiro
	if(totalTodosProdutos % 2 != 0 && totalTodosProdutos % 2 != 1){
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: "Apenas valores inteiros!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});	
		return 300;
	}*/

	//modal jquery confirmar
	$.confirm({
		type: 'green',
		title: 'Pedido: ' + cliente.nome,
		content: mostrarPedido(),
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Enviar',
				btnClass: 'btn-green',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");

					if (cliente.envio === 'ENTREGA' && $("#cobrarTaxa").val() == 1) cliente.taxa = 0;

					if (cliente.envio != "ENTREGA") {
						cliente.taxa = cliente.endereco = cliente.celular = null; //apagar variaveis para evitar erros
					}

					if ($('#obsPedido').val() != '') cliente.obs = $('#obsPedido').val();

					//criar dados
					cliente.pizzas = JSON.stringify(pizzas);
					cliente.produtos = JSON.stringify(produtos);
					cliente.total = tPedido;
					cliente.troco = troco;

					//buscar pedido no sistema
					$.ajax({
						url: "/u/novoPedido/atualizarPedido/" + cliente.nome,
						type: 'PUT',
					}).done(function(e) {
						estruturarPedido(e, troco);
					}).fail(function() {
						carregarLoading("none");
					});
				}
			},
			cancel: {
				isHidden: true,
				keys: ['esc']
			}
		}
	});
});


//--------------------------------------------------------------------------------------------------------------------
function estruturarPedido(e, troco) {
	//se atualizar
	if (e.id != null && modo == "ATUALIZAR") {
		cliente.data = e.data;
		cliente.horaPedido = e.horaPedido;

		//converter pedido atual para objeto
		cliente.pizzas = JSON.parse(cliente.pizzas);
		cliente.produtos = JSON.parse(cliente.produtos);

		//converter pedido antigo para objeto
		e.pizzas = JSON.parse(e.pizzas);
		e.produtos = JSON.parse(e.produtos);

		//concatenar pizzas
		for (pizza of e.pizzas) cliente.pizzas.unshift(pizza);

		//concatenar produtos
		for (produto of e.produtos) cliente.produtos.unshift(produto);

		//converter pedido atual em JSON
		cliente.pizzas = JSON.stringify(cliente.pizzas);
		cliente.produtos = JSON.stringify(cliente.produtos);
	}

	//editar
	if (modo == "EDITAR") {
		//excluir temporarios para nao duplicar
		$.ajax({
			url: "/u/novoPedido/excluirPedidosTemp/" + cliente.comanda,
			type: 'POST'
		});
	}

	if ((isNumber(troco) == false) || (troco < mostrarTotalComTaxa())) {
		cliente.troco = mostrarTotalComTaxa();
	}
	salvarPedido();
}


//-------------------------------------------------------------------------------------------------------------------
function criarTemp(produtoSetor, comanda) {
	temp = {};
	temp.comanda = comanda;
	temp.nome = cliente.nome;
	temp.envio = cliente.envio;
	temp.pizzas = JSON.stringify(produtoSetor);

	//salvar pedido no temp
	$.ajax({
		url: '/u/novoPedido/salvarTemp',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(temp)
	});
}


//--------------------------------------------------------------------------------------------------------------------
function salvarPedido() {
	//salvar pedido
	$.ajax({
		url: "/u/novoPedido/salvarPedido",
		type: "PUT",
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(cliente)
	}).done(function(e) {
		cliente.comanda = e.comanda; //recebe numero do servidor

		if (pizzas.length != 0) {
			criarTemp(pizzas, e.comanda);
		}
		
		//ordenar vetor crescente
		const arrayProdutos = produtos.sort((a, b) => (a.setor > b.setor) ? 1 : ((b.setor > a.setor) ? -1 : 0));
		
		let [arrayProdutosBebidas, arrayProdutosLanche, arrayProdutosEsfiha, 
			arrayProdutosPastel, arrayProdutosPorcao, arrayProdutosOutros] = [[], [], [], [], [], []];
			
		//buscar produtos em diferentes setores
		for(onlyProduto of arrayProdutos){
			if(onlyProduto.setor == 'BEBIDA') arrayProdutosBebidas.push(onlyProduto);
			if(onlyProduto.setor == 'LANCHE') arrayProdutosLanche.push(onlyProduto);
			if(onlyProduto.setor == 'ESFIHA') arrayProdutosEsfiha.push(onlyProduto);
			if(onlyProduto.setor == 'PASTEL') arrayProdutosPastel.push(onlyProduto);
			if(onlyProduto.setor == 'PORCAO') arrayProdutosPorcao.push(onlyProduto);
			if(onlyProduto.setor == 'OUTROS') arrayProdutosOutros.push(onlyProduto);
		}
		
		//salvar setores temp
		if(arrayProdutosBebidas.length != 0) criarTemp(arrayProdutosBebidas, e.comanda);
		if(arrayProdutosLanche.length != 0) criarTemp(arrayProdutosLanche, e.comanda);
		if(arrayProdutosEsfiha.length != 0) criarTemp(arrayProdutosEsfiha, e.comanda);
		if(arrayProdutosPastel.length != 0) criarTemp(arrayProdutosPastel, e.comanda);
		if(arrayProdutosPorcao.length != 0) criarTemp(arrayProdutosPorcao, e.comanda);
		if(arrayProdutosOutros.length != 0) criarTemp(arrayProdutosOutros, e.comanda);
		
		carregarLoading("none");

		$.alert({
			type: 'green',
			title: 'Sucesso!',
			content: 'Pedido enviado!',
			buttons: {
				confirm: {
					text: 'Obrigado!',
					btnClass: 'btn-green',
					keys: ['enter', 'esc'],
					action: function() {
						window.location.href = "/u/novoPedido";
					}
				}
			}
		});
	}).fail(function() {
		$.alert("Erro, Pedido não enviado!");
		carregarLoading("none");
	});
}



//mostrar pedido no jquery confirm final
function mostrarPedido() {
	return linhaHtml = '<div class="row">'
		+ '<div class="col-md-6"><b>Qtd Produtos:</b><br>' + totalTodosProdutos + '</div>'
		+ '<div class="col-md-6"><b>Total do Pedido:</b><br>R$ ' + mostrarTotalComTaxa().toFixed(2) + '</div>'
		+ '<div>&nbsp;</div>'
		+ '<b class="fRight">Deseja enviar o pedido?</b>';
}


//-------------------------------------------------------
function recarregar() {
	window.location.href = "/u/novoPedido";
}


//Método para pular campos teclando ENTER
$('.pula').on('keypress', function(e) {
	var tecla = (e.keyCode ? e.keyCode : e.which);

	if (tecla == 13) {
		campo = $('.pula');
		indice = campo.index(this);

		if (campo[indice + 1] != null) {
			if (indice == 3) proximo = campo[indice - 1];
			else proximo = campo[indice + 1];
			proximo.focus();
		}
	}
});


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
	return !isNaN(parseFloat(str))
}


function mostrarTotal() {
	$("#TotalProdutos").html('<b>Total de Produtos:</b> ' + totalTodosProdutos);

	if ($("#cobrarTaxa").val() == 1
		|| $("#envioCliente").val() === 'MESA'
		|| $("#envioCliente").val() === 'BALCAO'
		|| $("#envioCliente").val() === 'DRIVE') {

		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + tPedido.toFixed(2));
		$("#troco").val(tPedido);
	} else if (isNumber(cliente.taxa) == true) {
		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + (tPedido + cliente.taxa).toFixed(2));
		$("#troco").val((tPedido + cliente.taxa));
	}

	else {
		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + tPedido.toFixed(2));
		$("#troco").val(tPedido);
	}
}


function mostrarTotalComTaxa() {
	if ($("#cobrarTaxa").val() == 1
		|| $("#envioCliente").val() === 'MESA'
		|| $("#envioCliente").val() === 'BALCAO'
		|| $("#envioCliente").val() === 'DRIVE')
		return tPedido;
	else if (isNumber(cliente.taxa) == true)
		return (tPedido + cliente.taxa);
	else
		return tPedido;
}


$("#pagoCliente").change(() => {
	selecionarPago();
});

function selecionarPago() {
	if ($("#pagoCliente").val() == 0 && $("#envioCliente").val() != 'ENTREGA') {
		cliente.pago = false;
		$("#divPagamentoGeral").hide('slow');
	} else {
		cliente.pago = true;
		$("#divPagamentoGeral").show('slow');
	}
}

$("#modoPagamento").change(() => {
	selecionaModoPagamento();
});


function selecionaModoPagamento() {
	//dinheiro
	if ($("#modoPagamento").val() == 0) {
		$("#divModoPagamentoCartao").hide('show', () => {
			$("#divModoPagamentoDinheiro").show('show');
		});
	}

	//cartao
	if ($("#modoPagamento").val() == 1) {
		$("#divModoPagamentoDinheiro").hide('show', () => {
			$("#divModoPagamentoCartao").show('show');
		});
	}
}


$("#modoPagamentoCartao").change(() => {
	selecionarCartao();
});


function selecionarCartao() {
	if ($("#modoPagamentoCartao").val() === '--') {
		return 0;
	} else {
		$("#modoPagamentoCartao").val();
		cliente.modoPagamento = "Cartão -" + $("#modoPagamentoCartao").val();
		return 1;
	}
}


$("#envioCliente").change(function() {
	mostrarTotal();
	if ($("#envioCliente").val() === 'MESA') {
		$("#divCobrarTaxa").hide('slow', () => {
			$("#divGarcon").show('slow');
		});

	} else if ($("#envioCliente").val() == 'ENTREGA') {
		$("#divGarcon").hide('slow', () => {
			$("#divCobrarTaxa").show('slow');
		});
	} else {
		$("#divGarcon").hide('slow', () => {
			$("#divCobrarTaxa").hide('slow');
		});
	}
	selecionarPago();
});


$("#cobrarTaxa").change(() => {
	mostrarTotal();
});


$(document).keypress(function(e) {
	if (e.which == 13) {
		if ($("#obs").is(":focus"))
			$(".enviarProduto").focus();

		if ($("#qtd").is(":focus"))
			$("#obs").focus();
	}
});


function mostrarDivPizzasProdutos() {
	if (cliente.pizzas != 0)
		$("#divPizzas").show('slow');
	if (cliente.produtos != 0)
		$("#divProdutos").show('slow');
}


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {//todos
	mostrarTotal();

	if (pizzas.length == 0 && produtos.length == 0) {
		$(".divListaGeral").hide('slow');
		return 300;
	} else {
		$(".divListaGeral").show('slow');
	}

	if (produtos.length != 0) {
		linhaHtml = "";

		for (produto of produtos) {
			linhaHtml += '<tr>'
				+ '<td>' + produto.qtd + " x " + produto.sabor + '</td>'
				+ '<td>' + produto.obs + '</td>'
				+ '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
				+ '</tr>';
		}
		$("#listaProduto").html(linhaHtml);
		$("#divProdutos").show('slow');
	} else {
		$("#listaProduto").html(produtoVazio);
		$("#divProdutos").hide('slow');
	}

	if (pizzas.length != 0) {
		linhaHtml = "";

		for (pizza of pizzas) {
			linhaHtml += '<tr>'
				+ '<td>' + pizza.qtd + " x " + pizza.sabor + '</td>'
				+ '<td>' + pizza.obs + '</td>'
				+ '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
				+ '<td>' + pizza.borda + '</td>'
				+ '</tr>';
		}
		$("#listaPizza").html(linhaHtml);
		$("#divPizzas").show('slow');
	} else {
		$("#listaPizza").html(pizzaVazio);
		$("#divPizzas").hide('slow');
	}
}


function mostrarListaBuscaProdutos(produtosEncontrados) {
	//lista de produtos
	linhaHtml = '<table class="h-100 table table-striped table-hover">'
		+ '<thead>'
		+ '<tr>'
		+ '<th class="col-md-1"></th>'
		+ '<th class="col-md-1"><h5>Produto</h5></th>'
		+ '<th class="col-md-1"><h5>Preço</h5></th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>';

		//ordenar vetor por setor crescente
		const arrayProdutosCrescente = produtosEncontrados.sort((a, b) => (a.setor > b.setor) ? 1 : ((b.setor > a.setor) ? -1 : 0));
		
		
	if (arrayProdutosCrescente.length != 0) {
		//abrir modal de produtos encontrados
		for (let produto of arrayProdutosCrescente) {
			linhaHtml += '<tr>'
				+ '<td align="center">'
				+ '<div>'
				+ '<button onclick="enviarProduto()"'
				+ 'title="Adicionar" onclick="enviarProduto()" class="botao" value="' + produto.id + '">'
				+ '<i class="fas fa-plus"></i>'
				+ '</button>'
				+ '</div>'
				+ '</td>'
				+ '<td align="left">' + produto.nome + '</td>'
				+ '<td align="center">R$ ' + produto.precoM.toFixed(2) + '</td>'
				+ '</tr>';
		}
	} else {
		linhaHtml += '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>';
	}
	linhaHtml += '</tbody>'
		+ '</table>';
		
	return linhaHtml;
}

function mostrarPrecoProduto(precoProduto) {
	let precoCompleto = 0;
	let qtd = (Number(Number($("#qtd").val().toString().replace(",", ".")).toFixed(2))).toFixed(2);

	precoCompleto = qtd * precoProduto;

	if ($("#borda").val() != 0) {
		for (let busca of buscaBordas)
			if (busca.id == $("#borda").val()) {
				precoCompleto += (busca.precoM * qtd);
			}
	}

	$("#precoComQtd").text(isNumber(precoCompleto) ? precoCompleto.toFixed(2) : Number(precoProduto).toFixed(2));
}


function precoNulo(tamanho) {
	$.alert({
		type: 'red',
		title: 'Preço não cadastrado!',
		content: 'Acesse os cadastros e adicione um valor válido ao tamanho: ' + tamanho,
		closeIcon: true,
		buttons: {
			confirm: {
				isHidden: true,
				keys: ['esc', 'enter']
			}
		}
	})
}


function confirmarTamanho() {
	tamanhoProduto = $("#tamanhoProduto").val();

	if (tamanhoProduto == 0) {
		mostrarPrecoProduto(produto.precoP);
	} else if (tamanhoProduto == 1) {
		mostrarPrecoProduto(produto.precoM);
	} else if (tamanhoProduto == 2) {
		mostrarPrecoProduto(produto.precoG);
	}
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
		let Produto = {};
		let arrayProdutosAutoComplete = [];
		for (let produto of e) {
			Produto = {};
			[Produto.label, Produto.category] = produto.split(',');
			arrayProdutosAutoComplete.push(Produto);
		}
		//ordenar vetor crescente
		const arrayProdutosAutoCompleteOrder = arrayProdutosAutoComplete.sort((a, b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0));
		
		$("#nome").catcomplete({
			source: arrayProdutosAutoCompleteOrder
		});
	});
}
