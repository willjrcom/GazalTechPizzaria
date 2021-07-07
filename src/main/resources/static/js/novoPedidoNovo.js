$(document).ready(() => $("#nomePagina").text("Novo Pedido"));

// VARIAVEIS
var [Cliente] = [{}];

// LISTAS
var [listBuscaProdutos] = [[]];

//
var divisor = 0

// RETORNO DO CADASTRO DE CLIENTE
// Pega o modo de pedido
var modoPedido = window.location.href.split("/")[5];

// Pega o id de edicao do pedido
var nomePedido = window.location.href.split("/")[6]; 

// Retorno do cadastro cliente
if (modoPedido === 'atualizar') {
	$("#numeroCliente").val(nomePedido);
	buscarCliente();
}


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


let html = "";
let todasBordas = null
let todosGarcons = null

$.ajax({
	url: '/u/novoPedido/bordas',
	type: 'GET',
	async: false,
	success: e => todasBordas = e
});

//buscar bordas
var bordas = '';
for (borda of todasBordas) bordas += `<option value="${borda.id}">${borda.nome} R$ ${borda.precoM.toFixed(2)}</option>`;

html = '<label>Borda Recheada:</label>'
	+ '<select class="form-control" name="borda" id="borda">'
	+ '<option value="0"></option>'
	+ bordas
	+ '</select><br>';

bordasHtml = html;
buscaBordas = todasBordas;

$.ajax({
	url: '/u/novoPedido/garcons',
	type: 'GET',
	async: false,
	success: e => todosGarcons = e
});

//buscar bordas
var garconsHtml = '';
if (todosGarcons.length != 0) {
	for (garcon of todosGarcons) garconsHtml += `<option value="${garcon[0]}">${garcon[0]}</option>`;

	$("#garcon").append(garconsHtml);
}


//--------------------------------------------------------------------------
function buscarCliente() {
	let campo_busca_cliente = $("#numeroCliente").val()
	
	// Se for nulo
	if (campo_busca_cliente.length == 0) {
		campo = $('.pula');
		indice = campo.index(this);

		if (campo[indice + 1] != null) {
			if (indice == 3) proximo = campo[indice - 1];
			else proximo = campo[indice + 1];
			proximo.focus();
		}
		
		// Abrir modal
		let title = 'OPS...'
		let content = 'O campo está vazio<br>Digite um telefone cadastrado ou um nome!'
		openModal(title, content)
		return 300;
	}
	
	// Se for numero
	if (isNumber(campo_busca_cliente)) {
		carregarLoading("block");
		
		let retorno_cliente = null
		
		$.ajax({
			url: "/u/novoPedido/numeroCliente/" + campo_busca_cliente,
			type: 'GET',
			async: false,
			success: e => retorno_cliente = e
		});
		
		// Verificar se existe o cliente
		if (retorno_cliente.length == 0) {
			window.location.href = "/f/cadastroCliente/" + $("#numeroCliente").val();
			return 300
		}
		Cliente = retorno_cliente
		Cliente.envio = "ENTREGA";
		Cliente.taxa = retorno_cliente.endereco.taxa;
		Cliente.referencia = retorno_cliente.endereco.referencia;
		Cliente.endereco = `${retorno_cliente.endereco.rua} - ${retorno_cliente.endereco.n} - ${retorno_cliente.endereco.bairro}`;
		
		// Set html
		$("#nomeCliente").text(Cliente.nome);
		$("#celCliente").text(Cliente.celular);
		$("#enderecoCliente").text(Cliente.endereco);
		$("#taxaCliente").text('Taxa: R$ ' + Cliente.taxa.toFixed(2));


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

	} else{
		carregarLoading("none");
		// Abrir modal
		let title = 'OPS...'
		let content = 'Retorno não mapeado!'
		openModal(title, content)
		return 300;
	}
	
	mostrarDivsPedido();
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
	
	carregarLoading("none");
}


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	// Pegar campo sem espaços vazios
	let campo_nome_produto = $.trim($("#nome").val());
	
	// Campo vazio
	if (campo_nome_produto.length == 0) {
		// Abrir modal
		let title = 'OPS...'
		let content = 'Campo vazio, digite o nome ou codigo de busca do produto'
		openModal(title, content)
		return 300	
	}
	
	carregarLoading("block");

	$.ajax({
		url: "/u/novoPedido/nomeProduto/" + campo_nome_produto,
		type: 'GET',
		async: false,
		success: e => listBuscaProdutos = e
	});
	
	$("#nome").val('');
	carregarLoading("none");
	
	// Se objeto nulo
	if(listBuscaProdutos == null){
		// Abrir modal
		let title = 'OPS...'
		let content = '<tr><td colspan="3"><label>Erro ao buscar produtos</label></td></tr>'
		openModal(title, content)
		return 300
	}
	
	//se nao encontrar nenhum produto
	if (listBuscaProdutos.length == 0) {
		// Abrir modal
		let title = 'OPS...'
		let content = '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>'
		openModal(title, content)
		return 300;
	}
	
	// Lista com varios produtos
	if(listBuscaProdutos.length > 1){
		// Abrir modal
		let title = '<h4 align="center">Lista de Produtos</h4>'
		let content = mostrarListaBuscaProdutos(listBuscaProdutos)
		openModal(title, content)
		return 200
	}
	
	//se existir apenas um resultado vai direto ao produto
	if (listBuscaProdutos.length != 1) {
		// Abrir modal
		let title = 'OPS...'
		let content = 'Erro no sistema!'
		openModal(title, content)
		return 300
	}
		
	// Setar lista como obj
	let produto_encontrado = listBuscaProdutos[0]
	
	//se o produto estiver indisponivel
	if (produto_encontrado.id == -1) {
		// Abrir modal
		let title = '<h4 align="center">Produto: ' + produto_encontrado.nome + '</h4>'
		let content = '<tr><td colspan="3"><label>' + produto_encontrado.descricao + '</label></td></tr>'
		openModal(title, content)
		return 300;
	}
	
	// Sucesso ao encontrar apenas 1 produto
	enviarProduto(produto_encontrado.id);
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

	if (listBuscaProdutos.length != 1)//buscar produto na lista
		for (let busca of listBuscaProdutos) {
			if (busca.id == idProduto) produto = busca;
		} else {
		produto = listBuscaProdutos[0];
	}

	if (produto.disponivel == false) {
		let title = '<h4 align="center">Produto: ' + produto.nome + '</h4>'
		let content = '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>'
		openModal(title, content)
		return 300;
	}
	
	let content = '<label><b>Total:</b> R$ <span id="precoComQtd">' 
		+ Number(produto.preco).toFixed(2) + '</span></label><br>'
		+ (produto.setor == 'PIZZA' ? bordasHtml : '') + qtdHtml()
		
	$.confirm({
		type: 'blue',
		title: `${produto.setor}: ${produto.nome}`,
		content: content,
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
}


function mostrarListaBuscaProdutos(produtosEncontrados) {
	//lista de produtos
	let linhaHtml = '<table class="h-100 table table-striped table-hover">'
		+ '<thead>'
		+ '<tr>'
		+ '<th class="col-md-1"></th>'
		+ '<th class="col-md-1"><h5>Produto</h5></th>'
		+ '<th class="col-md-1"><h5>Preço</h5></th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>';
	
	// Se não existirem produtos
	if (arrayProdutosCrescente.length == 0) 
		return linhaHtml + '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr></tbody></table>';
		
	//ordenar vetor por setor crescente
	const arrayProdutosCrescente = produtosEncontrados.sort((a, b) => (a.setor > b.setor) ? 1 : ((b.setor > a.setor) ? -1 : 0));
	
	//abrir modal de produtos encontrados
	for (let produto of arrayProdutosCrescente) {
		linhaHtml += '<tr>'
			+ '<td align="center">'
			+ '<div>'
			+ '<button onclick="enviarProduto()"'
			+ `title="Adicionar" onclick="enviarProduto(${produto.id})" class="botao">`
			+ '<i class="fas fa-plus"></i>'
			+ '</button>'
			+ '</div>'
			+ '</td>'
			+ '<td align="left">' + produto.nome + '</td>'
			+ '<td align="center">R$ ' + produto.precoM.toFixed(2) + '</td>'
			+ '</tr>';
	}
	
	linhaHtml += '</tbody></table>';
		
	return linhaHtml;
}


// Funções ---------------------------------
function recarregar() {
	window.location.href = "/u/novoPedido";
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
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


function isNumber(str) {
	return !isNaN(parseFloat(str))
}


function mostrarTotal() {
	$("#TotalProdutos").text(totalTodosProdutos);
	modo_envio = $("#envioCliente").val()
	if ($("#cobrarTaxa").val() == 1
		|| modo_envio === 'MESA'
		|| modo_envio === 'BALCAO'
		|| modo_envio === 'DRIVE') {

		$("#TotalPedido").text(tPedido.toFixed(2));
		$("#troco").val(tPedido);
		
	} else if (isNumber(cliente.taxa) == true) {
		$("#TotalPedido").text((tPedido + cliente.taxa).toFixed(2));
		$("#troco").val(tPedido + cliente.taxa);
	}

	else {
		$("#TotalPedido").text(tPedido.toFixed(2));
		$("#troco").val(tPedido);
	}
}

$(".calcular").change(() => console.log("mudou"))

function mostrarTotalComTaxa() {
	modo_envio = $("#envioCliente").val()
	if ($("#cobrarTaxa").val() == 1
		|| modo_envio === 'MESA'
		|| modo_envio === 'BALCAO'
		|| modo_envio === 'DRIVE')
		return tPedido;
	else if (isNumber(cliente.taxa) == true)
		return (tPedido + cliente.taxa);
	else
		return tPedido;
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
	
	let retornoAutoComplete = null
	
	$.ajax({
		url: '/u/novoPedido/autoComplete',
		type: 'GET',
		async: false,
		success: e => retornoAutoComplete = e
	});
	
	let _produto = {};
	let arrayProdutosAutoComplete = [];
	for (let produto of retornoAutoComplete) {
		_produto = {};
		[_produto.label, _produto.category] = produto.split(',');
		arrayProdutosAutoComplete.push(_produto);
	}
	//ordenar vetor crescente
	const arrayProdutosAutoCompleteOrder = arrayProdutosAutoComplete.sort((a, b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0));
	
	$("#nome").catcomplete({
		source: arrayProdutosAutoCompleteOrder
	});
}


const openModal = (title, content) => {
	$.confirm({
		type: 'blue',
		title: title,
		content: content,
		columnClass: 'col',
		closeIcon: true,
		buttons: {
			confirm: {
				isHidden: true,
				keys: ['enter', 'esc'],
			}
		}
	});
}


const btnMaisOpcoes = () => {
	let display = $("#divMaisOpcoes").css("display")
	
	if(display == "none"){
		$("#btnMaisOpcoes").fadeOut('fast', function() {
			$(this).html('Menos opções <i class="fas fa-sort-up"></i>').fadeIn('fast')
			$("#divMaisOpcoes").show('slow')
		})
	
	} else {
		$("#btnMaisOpcoes").fadeOut('fast', function() {
			$(this).html('Mais opções <i class="fas fa-sort-down"></i>').fadeIn('fast')
			$("#divMaisOpcoes").hide('slow')
		})
	}
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
