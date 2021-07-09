$(document).ready(() => $("#nomePagina").text("Novo Pedido"));

// VARIAVEIS
var [Cliente] = [{}];

// LISTAS
var [listBuscaProdutos, listBordasRecheadas] = [[], []];

// INTS
var [totalPedido, intQtdPedido, divisor] = [0, 0, 0]

// Html
var [bordasHtml] = ['']

// String
var [tamanhoProduto] = ['unico'];

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

let todosGarcons = null

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
	
	let opEntrega = '<option value="ENTREGA">Entrega</option>'
	let opBalcao = '<option value="BALCAO">Balcão</option>'
	let opMesa = '<option value="MESA">Mesa</option>'
	let opDrive = '<option value="DRIVE">Drive-Thru</option>'
	
	if (Cliente.envio == "ENTREGA") {
		$("#envioCliente").append(opEntrega + opBalcao + opMesa + opDrive);
		
	} else if (Cliente.envio == "MESA") {
		$("#envioCliente").append(opMesa + opBalcao + opDrive);
		
	} else if (Cliente.envio == "DRIVE") {
		$("#envioCliente").append(opDrive + opBalcao + opMesa);
		
	} else {
		$("#envioCliente").append(opBalcao + opMesa + opDrive);
	} 
	
	// Esconder div de buscar cliente
	$(".divBuscarCliente").hide('slow', () => {
		$(".dadosCliente").show('slow', () => {
			$(".divListaGeral").css('display', "flex", () => {
				// Focar no campo de buscar pedido
				setTimeout(() => $(".pula")[2].focus());
			});
		});
	});
	
	calcularPedido()
	carregarLoading("none");
}


//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	// Pegar campo sem espaços vazios
	let campo_nome_produto = $.trim($("#nome").val());
	let linhaHtml = '';
	
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
	
	// Se objeto nulo
	if(listBuscaProdutos == null)
		linhaHtml = '<tr><td colspan="3"><label>Erro ao buscar produtos</label></td></tr>'
	
	// Se não existirem produtos
	else if (listBuscaProdutos.length == 0) 
		linhaHtml = '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>';
		
	//se o produto estiver indisponivel
	else if (listBuscaProdutos[0].id == -1) 
		linhaHtml = '<tr><td></td>'
				+ '<td>' + produto_encontrado.nome + '</td>'
				+ '<td>' + produto_encontrado.descricao + '</td></tr>';
		
	// Produtos validos
	else if (listBuscaProdutos.length > 0) {
		//ordenar vetor por setor crescente
		const arrayProdutosCrescente = listBuscaProdutos.sort((a, b) => (a.setor > b.setor) ? 1 : ((b.setor > a.setor) ? -1 : 0));
		
		//abrir modal de produtos encontrados
		for (let produto of arrayProdutosCrescente) {
			linhaHtml += '<tr>'
				+ '<td>'
				+ `<button onclick="enviarProduto(${produto.id})"`
				+ 'title="Adicionar" class="botao">'
				+ '<i class="fas fa-plus"></i>'
				+ '</button>'
				+ '</td>'
				+ '<td>' + produto.nome + '</td>'
				+ '<td>R$ ' + produto.precoM.toFixed(2) + '</td>'
				+ '</tr>';
		}
	}
	carregarLoading("none");
	$("#listaProdutosEncontrados").html(linhaHtml);
	
	// Se encontrar apenas 1 produto
	if (listBuscaProdutos.length == 1) {
		enviarProduto(listBuscaProdutos[0].id);
	}
}


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto(idProduto) {
	let produtoSelecionado = listBuscaProdutos.find(_produto => _produto.id == idProduto)
	
	// Produto indisponivel em estoque
	if (produtoSelecionado.disponivel == false) {
		let title = '<h4 align="center">Produto: ' + produtoSelecionado.nome + '</h4>'
		let content = '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>'
		openModal(title, content)
		return 300;
	}

	$.confirm({
		type: 'blue',
		title: "produto: " + produtoSelecionado.nome,
		content: mostrarProduto(produtoSelecionado),
		closeIcon: true,
		onContentReady: () => $(".calcularProduto").change(() => calcularProduto()),
		buttons: {
			confirm: {
				text: 'adicionar',
				btnClass: 'btn btn-success enviarProduto',
				keys: ['enter'],
				action: () => confimarProduto(produtoSelecionado)
			},
			cancel: {
				isHidden: true,
				keys: ['esc'],
			}
		}
	});
}


function confirmarProduto(produto) {
	let [nomeProduto, lastBorda] = ['', ''];
	let produtoConfirmado = {};
	
	//adiciona observacao do produto
	obs = $("#obs").val();
	
	// Setar o nome, preço e custo do produto novo
	produtoConfirmado = setTamanhoEscolhidoProduto(produto, produtoConfirmado);
	
	// Quantidade do produto
	let qtdProduto = Number(Number($("#qtd").val().toString().replace(",", ".")).toFixed(2));
	if (isNaN(qtdProduto) || qtdProduto == 0) qtdProduto = 1;
	
	//multiplica o preco e custo do produto
	produtoConfirmado.preco *= qtdProduto;
	produtoConfirmado.custo *= qtdProduto;

	produtos.unshift(produtoConfirmado);
	
	//adicionar total de produtos em geral
	intQtdPedido += qtd;

	//adicionar total do pedido
	totalPedido += produto.preco;


	mostrarProdutos();
}


function setTamanhoEscolhidoProduto(produto, produtoNovo){
	//pegar tamanho do produto escolhido
	tamanhoProduto = $("#tamanhoProduto").val();
	
	// Set nome produto
	produtoNovo.nome = produto.nome;
	
	if (produto.setor == 'PIZZA') {
		//adiciona o id da borda
		let bordaId = $("#borda").val();
	
		//se for escolhido uma borda
		if (bordaId != 0) {
			let bordaEscolhida = listBordasRecheadas.find(borda => borda.id == bordaId);y

			//multiplica o preco e custo da borda
			produtoNovo.preco += (bordaEscolhida.precoM * qtdProduto);
			produtoNovo.custo += (bordaEscolhida.custoM * qtdProduto);
		}
	}
	
	//verifica o tamanho do produto
	if (tamanhoProduto == "pequeno") {
		if (produto.custoP == 0) {
			let title = 'Preço Pequeno não cadastrado!';
			let content = 'Acesse os cadastros e adicione um valor válido!';
			openModal(title, content)
			return 300
		}
	
		produtoNovo.nome += ' - P';
		produtoNovo.preco = produto.precoP;
		produtoNovo.custo = produto.custoP;
		
	} else if (tamanhoProduto == "medio") {
		if (produto.custoM == 0) {
			let title = 'Preço Medio não cadastrado!';
			let content = 'Acesse os cadastros e adicione um valor válido!';
			openModal(title, content)
			return 300
		}
		produtoNovo.nome += ' - M';
		produtoNovo.preco = produto.precoM;
		produtoNovo.custo = produto.custoM;
		
	} else if (tamanhoProduto == "grande") {
		if (produto.custoG == 0) {
			let title = 'Preço Grande não cadastrado!';
			let content = 'Acesse os cadastros e adicione um valor válido!';
			openModal(title, content)
			return 300
		}
		
		produtoNovo.nome += ' - G';
		produtoNovo.preco = produto.precoG;
		produtoNovo.custo = produto.custoG;
	}
	
	// Produto com nome e preço alterados
	return produtoNovo;
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


function openModal(title, content) {
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


function btnMaisOpcoes() {
	let display = $(".divMaisOpcoes").css("display")
	
	if(display == "none"){
		$("#btnMaisOpcoes").fadeOut('fast', function() {
			$(this).html('Menos opções <i class="fas fa-sort-up"></i>').fadeIn('fast')
			$(".divMaisOpcoes").show('slow')
		})
	
	} else {
		$("#btnMaisOpcoes").fadeOut('fast', function() {
			$(this).html('Mais opções <i class="fas fa-sort-down"></i>').fadeIn('fast')
			$(".divMaisOpcoes").hide('slow')
		})
	}
}


$(".calcularPedido").change(() => calcularPedido())


function calcularPedido() {
	//---------------------------------------------------------
	// Validar campo de pagamento: SIM/NÂO
	let pagoCliente = $("#pagoCliente").val() 
	
	if (pagoCliente == "nao") {
		Cliente.pago = false;
			
	} else {
		Cliente.pago = true;
	}
	//---------------------------------------------------------
	// Seleciona modo pagamento: DINHEIRO/CARTÂO
	let selectModoPagamento = $("#selectModoPagamento").val()
	
	if (selectModoPagamento == "dinheiro") {
		$("#divModoPagamentoCartao").hide('show', () => {
			$("#divModoPagamentoDinheiro").show('show');
		});
		
		//receber troco
		let troco = Number($('#modoPagamentoDinheiro').val().replace(",", "."));

		//verificar troco
		if (!Number.isFinite(troco)) {
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
		Cliente.modoPagamento = "Dinheiro -R$ " + mostrarTotal();
	}

	if (selectModoPagamento == "cartao") {
		$("#divModoPagamentoDinheiro").hide('show', () => {
			$("#divModoPagamentoCartao").show('show');
		});
	
		Cliente.modoPagamento = "Cartão -" + $("#modoPagamentoCartao").val();
	}
	
	//---------------------------------------------------------
	// Modo de envio
	let envioCliente = $("#envioCliente").val()
	
	// Mostrar Garçon
	if (envioCliente === 'MESA') {
		$("#divCobrarTaxa").hide('slow', () => {
			$("#divGarcon").show('slow');
		});
	// Mostrar taxa
	} else if (envioCliente == 'ENTREGA') {
		$("#divGarcon").hide('slow', () => {
			$("#divCobrarTaxa").show('slow');
		});
	// Esconder tudo
	} else {
		$("#divGarcon").hide('slow', () => {
			$("#divCobrarTaxa").hide('slow');
		});
	}
	
	//---------------------------------------------------------
	// Mostrar total do pedido
	// Para entregas e taxa existente
	if ($("#cobrarTaxa").val() == "sim" && envioCliente === 'ENTREGA' && isNumber(Cliente.taxa)) {
		$("#TotalPedido").text((totalPedido + Cliente.taxa).toFixed(2));
		// $("#modoPagamentoDinheiro").val(totalPedido + Cliente.taxa);
	}
	else {
		$("#TotalPedido").text(totalPedido.toFixed(2));
		// $("#modoPagamentoDinheiro").val(totalPedido);
	}
	// Mostrar quantidade de produtos
	$("#TotalProdutos").text(intQtdPedido);
}


function mostrarTotal() {
	let envioCliente = $("#envioCliente").val()
	
	// Se entrega
	if ($("#cobrarTaxa").val() == "sim" && envioCliente === 'ENTREGA' && isNumber(Cliente.taxa))
		return (totalPedido + Cliente.taxa).toFixed(2)
	else
		return totalPedido.toFixed(2)
}

function calcularProduto(produto) {
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
}


function mostrarProduto(_produto) {
	console.log(_produto)
	let precoProduto = Number(_produto.precoM).toFixed(2);
	let qtdDivisor = 1;
	let htmlDisabled = '';
	let htmlChecked = '';
	
	let _total = `<b>Total: </b>R$ <span id="calcularPrecoProduto">${precoProduto}</span>`;
	let _bordas = (produto.setor == 'PIZZA' ? buscarBordas() : '');
	
	// Campo quantidade
	let _qtd = '<label><b>Quantidade:</b></label>'
		+ '<div class="input-group mb-3">'
			+ '<div class="input-group-text">'
				+ `<input class="form-check-input calcularProduto" type="radio" aria-label="radio button for following text input" ${htmlChecked}>`
			+ '</div>'
			+ '<input class="form-control calcularProduto pula" id="qtd"'
			+ `value="${qtdDivisor}" ${htmlDisabled} aria-label="Text input with radio button"/>`
		+ '</div>';
	
	
	let tamanhoPizza = '<option value="medio">Medio M</option>'
			+ '<option value="pequeno">Pequeno P</option>'
			+ '<option value="grande">Grande G</option>';
			
	let tamanhoUnico = '<option value="unico">Padrão</option>';
	
	// Campo tamanho
	let _tamanho = '<label><b>Tamanho:</b></label>'
		+ '<select class="form-control" id="tamanhoProduto">'
			(produto.setor == 'PIZZA' ? tamanhoPizza : tamanhoUnico)
		+ '</select>';
	
	// Observação do produto
	let _observacao = '<label><b>Observação:</b></label>'
		+ '<textarea class="form-control pula" id="obsProduto" placeholder="Digite a observação"></textarea>';
	
	// Descrição do produto
	let _descricao = '<label><b>Descrição:</b></label>'
		+ `<p class="lead">${produto.descricao}</p>`;
		
	return _total 
		+ '<br>'
		+ _bordas
		+ '<br>'
		+ '<div class="row">'
			+ '<div class="col-md-6">' + _qtd + '</div>'
			+ '<div class="col-md-6">' + _tamanho + '</div>'
		+ '</div>'
		+ '<br>'
		+ _observacao
		+ '<br>'
		+ (produto.descricao == '' ? '' : _descricao); 
}


function buscarBordas() {
	// Primeira execução
	if(listBordasRecheadas.length == 0){
		carregarLoading("block");
		
		$.ajax({
			url: '/u/novoPedido/bordas',
			type: 'GET',
			async: false,
			success: e => listBordasRecheadas = e
		});
		// Se não existirem bordas no sistema
		if(listBordasRecheadas.length == 0)
			listBordasRecheadas = ["vazio"]
			
		let _bordas = '';
		for (borda of listBordasRecheadas) _bordas += `<option value="${borda.id}">${borda.nome} R$ ${Number(borda.precoM).toFixed(2)}</option>`;
		
		bordasHtml = '<label><b>Borda Recheada:</b></label>'
			+ '<select class="form-control" id="bordaRecheada">'
				+ '<option value="0">------</option>'
				+ _bordas
			+ '</select>';

		carregarLoading("none");
	}
	
	return bordasHtml;
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
}