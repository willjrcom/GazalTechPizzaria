$(document).ready(() => $("#nomePagina").text("Novo Pedido"));

//objetos---------------------------------------------------------------------------------------------------------
var [cliente, temp, produto, Borda] = [{}, {}, {}, {}];
//vetores------------------------------------------------------------------------------------------------------
var [pizzas, produtos, buscaProdutos, buscaBordas, buscaGarcon] = [[], [], [], [], []];

//divisores de qtd
var [divisor, divisorAnterior] = [1, 1];

//borda------------------------------------------------------------------------------------------------------
var [borda, lastBorda] = ['', 0];

//pedido------------------------------------------------------------------------------------------------------
var [totalTodosProdutos, totalTodosProdutosAnteriores, tPedido, troco] = [0, 0, 0, 0];
var totalUnico; // valor fixo mesmo depois do sistema atualizar o pedido antigo com o novo
var modo = "CRIAR";

//html------------------------------------------------------------------------------------------------------
var [linhaHtml, bordasHtml, garconsHtml] = ['', '', ''];

//botoes------------------------------------------------------------------------------------------------------
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var pizzaVazio = '<tr><td colspan="7">Nenhuma pizza adicionada!</td></tr>';
var produtoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';
var linhaCinzaBusca = '<tr><td colspan="3" class="fundoList" ></td></tr>';

//url------------------------------------------------------------------------------------------------------
var celular = parseInt(window.location.href.split("/")[4]);//pega o id de novo cadastro
var id_edicao = window.location.href.split("/")[5]; //pega o id de edicao do pedido


//-------------------------------------------------------------------------
//controlar qauntidade do produto
function qtdHtml() {
	let [htmlChecked, htmlDisabled] = ['', ''];
	let qtdDivisor = 0;
	
	if(divisor < 1 && divisor != 0){
		htmlDisabled = "disabled";
		
		//para outros
		qtdDivisor = divisor;
		
		//para meio a meio
		if(divisor == 0.5  && divisorAnterior != 0.75){
			qtdDivisor = 0.5;
		}
		//para 1/3
		else if(divisor == 0.7 || divisor == 0.4){
			qtdDivisor = 0.3;
		}
		//para 1/4
		else if(divisor == 0.75 || (divisor == 0.5 && divisorAnterior == 0.75) || divisor == 0.25){
			qtdDivisor = 0.25;
		}
	}else{
		qtdDivisor = divisor;
		htmlChecked = "checked";
		htmlDisabled = "";
	}

	if(divisor == 0 || divisor < 0.09){
		qtdDivisor = divisor = 1;
		htmlDisabled = "";
	}
	
	return ('<label>Quantidade:</label><br>'
			+ '<div class="input-group mb-3">'
				+ '<div class="input-group-text">'
			    	+ '<input class="form-check-input liberarqtd" type="radio" aria-label="radio button for following text input" ' + htmlChecked + '>'
				+ '</div>'
				+ '<input type="text" placeholder="Quantidade" class="form-control pula" id="qtd"'
				+ 'value="' + Number(qtdDivisor.toFixed(2)) + '" ' + htmlDisabled + ' aria-label="Text input with radio button"/>'
			+ '</div>'
			+ '<br>'
			+ '<label>Observação:</label>'
			+ '<input type="text" class="form-control pula" name="obs" id="obs" placeholder="Observação" />');
}


//buscar borda recheada---------------------------------------------------------------------------
(() => {
	let html = "";
	
	$.ajax({
		url: '/novoPedido/bordas',
		type: 'GET',
		success: todasBordas => {

			//buscar bordas
			var bordas = '';
			for(borda of todasBordas) bordas += `<option value="${borda.id}">${borda.nomeProduto} R$ ${borda.preco.toFixed(2)}</option>`;
		
			 html = '<label>Borda Recheada:</label>'
							+ '<select class="form-control" name="borda" id="borda">'
								+ '<option value="0"></option>'
								+ bordas
							+ '</select><br>';
			salvarBordas(html, todasBordas);
		}
	});
	
	$.ajax({
		url: '/novoPedido/garcons',
		type: 'GET',
		success: todosGarcons => {

			//buscar bordas
			var garconsHtml = '';
			if(todosGarcons.length != 0){
				for(garcon of todosGarcons) garconsHtml += `<option value="${garcon.nome}">${garcon.nome}</option>`;
				
				$("#garcon").append(garconsHtml);
			}
		}
	});
})();


//---------------------------------------------------------------------------------------------------------
function salvarBordas(html, todasBordas){
	bordasHtml = html;
	buscaBordas = todasBordas;
}
	
	
//setInterval(() => console.log(cliente), 1000)

//------------------------------------------------------------------------------------------------------------
//retorno do cadastro cliente
if(celular % 2 == 1 || celular % 2 == 0) {
	$("#numeroCliente").val(celular);
	buscarCliente();
}


//------------------------------------------------------------------------------------------------------------
if(typeof id_edicao != "undefined") {
	modo = "EDITAR";
	carregarLoading("block");
	
	$.ajax({
		url: "/novoPedido/editarPedido/" + id_edicao,
		type: 'GET'
	}).done(function(e){
		
		if(e.length == 0){
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
						action: () => window.location.href = "/novoPedido"
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
		if(e.envio == 'ENTREGA') {
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
			$("#divCobrarTaxa").show('slow');
			
			//apagar div de cobrar taxa	
			if(cliente.taxa === 0){
				$("#cobrarTaxa").val(1);
			}
			$("#cobrarTaxa").attr("disabled", true);
		}
			
		//mostrar entrega
		if(e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {
			$(".iconesEntrega").hide();
		}

		//verificar garcon
		if(e.envio === 'MESA'){
			$("#garcon").val(e.garcon);
			$("#divGarcon").show('slow');
			$("#divPagamentoGeral").hide('slow');
		}
			
		//opcoes de pagamento
		if(cliente.modoPagamento.split(" ")[0] == "Cartão"){
			$("#modoPagamento").val(1);
			$("#modoPagamentoCartao").val(cliente.modoPagamento.split("-")[1]);
		}else{
			$("#modoPagamento").val(0);
		}

		selecionaModoPagamento();
		
		$("#divBuscarCliente").hide();
		$("#divBuscarProdutos").show();
		$(".divListaGeral").show();
		$("#mostrarDadosCliente").show(); 
		$("#BotaoEnviarPedido").html('<i class="fas fa-check"></i> Atualizar pedido');
		$("#cancelar").html('<i class="fas fa-ban"></i> Cancelar alteração');
		
		
		for(pizza of cliente.pizzas) totalTodosProdutos += pizza.qtd;
	
		for(produto of cliente.produtos) totalTodosProdutos += produto.qtd;
		
		pizzas = cliente.pizzas;
		produtos = cliente.produtos;
		tPedido = cliente.total;
		
		mostrarProdutos();
		mostrarTotal();
		$(".pula")[2].focus();//focar no campo de buscar pedido
		
		carregarLoading("none");	
	}).fail(function(){
		$.alert("Erro, cliente não encontrado!");
	});	
}


//------------------------------------------------------------------------------------------------------------------------
function buscarCliente(){

	//se for nulo
	if($("#numeroCliente").val() == ''){
		//voltar campo para digitar numero
		var campo = $(".pula");
		indice = $(".pula").index(this);
		campo[indice - 1].focus();
		
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'O campo está vazio, digite um telefone ou um nome!',
			buttons:{
				confirm:{
					text: 'Ok',
					btnClass: "btn-success",
					keys: ['esc', 'enter']
				}
			}
		});
		return 300;
	}
	//se for numero
	if(isNumber($("#numeroCliente").val())){
		carregarLoading("block");

		$.ajax({
			url: "/novoPedido/numeroCliente/" + $("#numeroCliente").val(),
			type: 'GET'
		}).done(function(e){
			//verificar se existe
			if(e.length != 0) {
				console.log(e)
				cliente.nome = e.nome;
				cliente.celular = e.celular;
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
				cliente.referencia = e.endereco.referencia;
				cliente.taxa = e.endereco.taxa;
				cliente.envio = "ENTREGA";
				
				$("#nomeCliente").text(cliente.nome);
				$("#celCliente").text(cliente.celular);
				$("#enderecoCliente").text(cliente.endereco);
				$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));

				atualizarDados();
				mostrarDivsPedido();
			}else {
				window.location.href = "/cadastroCliente/" + $("#numeroCliente").val();
			}
			carregarLoading("none");
		});
		
	}else if(typeof $("#numeroCliente").val() == 'string'){
		cliente.nome = $("#numeroCliente").val();
		$("#nomeCliente").text(cliente.nome);
		$(".iconesEntrega").hide();
		
		//se for mesa
		if(cliente.nome.indexOf("Mesa") > -1) {//se existir a palavra Mesa
			cliente.envio = "MESA";
		}else if(cliente.nome.indexOf("mesa") > -1){//se existir a palavra mesa
			cliente.envio = "MESA";
		}else if((cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 1)){
			cliente.envio = "MESA";
		}else if((cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 1)){
			cliente.envio = "MESA";
		}else if(cliente.nome.indexOf("drive") > -1){//se existir a palavra mesa
			cliente.envio = "DRIVE";
		}else if(cliente.nome.indexOf("Drive") > -1){//se existir a palavra mesa
			cliente.envio = "DRIVE";
		}else{
			cliente.envio = "BALCAO";
		}
		
		atualizarDados();
		mostrarDivsPedido();
	}
};


//------------------------------------------------------------------------------------
function mostrarDivsPedido(){
	if(cliente.envio == "ENTREGA"){
		$("#envioCliente").append('<option value="ENTREGA">Entrega</option>'
									+'<option value="BALCAO">Balcão</option>'
									+'<option value="MESA">Mesa</option>'
									+'<option value="DRIVE">Drive-Thru</option>'
								);
		$("#divCobrarTaxa").show('slow');
	}else if(cliente.envio == "MESA"){
		$("#envioCliente").append('<option value="MESA">Mesa</option>'
									+'<option value="BALCAO">Balcão</option>'
									+'<option value="DRIVE">Drive-Thru</option>'
								);
		$("#divGarcon").show('slow');
		$("#divPagamentoGeral").hide('slow');
	}else if(cliente.envio == "BALCAO"){
		$("#envioCliente").append('<option value="BALCAO">Balcão</option>'
									+'<option value="MESA">Mesa</option>'
									+'<option value="DRIVE">Drive-Thru</option>'
								);
	}else if(cliente.envio == "DRIVE"){
		$("#envioCliente").append('<option value="DRIVE">Drive-Thru</option>'
									+'<option value="BALCAO">Balcão</option>'
									+'<option value="MESA">Mesa</option>'
								);
	}
	$("#divBuscarCliente").hide('slow', () => {
		$("#mostrarDadosCliente").show('slow', () => {
			$("#divBuscarProdutos").show('slow', () => {
				$(".pula")[2].focus();//focar no campo de buscar pedido
			});
		});
	});
}


//verificar se o pedido ja existe
function atualizarDados() {
	//buscar pedido no sistema
	$.ajax({
		url: "/novoPedido/atualizar",
		type: "PUT",
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(cliente)
	}).done(function(e){
		cliente.data = e.data;
		console.log(e)
		if(e.id != null) {
			modo = "ATUALIZAR";
			tPedido = e.total;
			cliente.id = e.id;
			cliente.comanda = e.comanda;
			cliente.horaPedido = e.horaPedido;
			totalTodosProdutosAnteriores = 0;
			
			if(JSON.parse(e.pizzas).length != 0) for(let pizza of JSON.parse(e.pizzas)) totalTodosProdutosAnteriores += pizza.qtd;
			
			if(JSON.parse(e.produtos).length != 0) for(let produto of JSON.parse(e.produtos)) totalTodosProdutosAnteriores += produto.qtd;
			
			$("#totalTodosProdutosAnteriores").html('<b>Total de produtos anteriores:</b> ' + totalTodosProdutosAnteriores).show('slow');
			mostrarTotal();
			
			$("#alertPedidoAberto").show("slow");
			setInterval(() => $("#alertPedidoAberto").hide("slow"), 30000);
		}
	});
}


//fechar alert pedidos
$("#alertPedidoAberto").click(() => $("#alertPedidoAberto").hide("slow"))
		
		
//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	
	if($.trim($("#nomeProduto").val()) != ""){
		carregarLoading("block");

		$.ajax({
			url: "/novoPedido/nomeProduto/" + $("#nomeProduto").val(),
			type: 'GET'
		}).done(function(e){
			buscaProdutos = e;
			$("#nomeProduto").val('');
				
			carregarLoading("none");
			if(buscaProdutos.length == 0) {//se nao encontrar nenhum produto
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
				            keys: ['enter','esc'],
						}
					}
				});
				return 300;
			}
			
			if(buscaProdutos[0].id == -1) {//se o produto estiver indisponivel
				$.confirm({
					type: 'red',
					title: '<h4 align="center">Produto: ' + buscaProdutos[0].nomeProduto + '</h4>',
					content: '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>',
				    closeIcon: true,
					buttons: {
				        confirm: {
							isHidden: true,
				            text: 'Voltar',
				            btnClass: 'btn-green',
				            keys: ['enter','esc'],
						}
					}
				});
				return 300;
			}
			
			if(buscaProdutos.length == 1) {//se existir apenas um resultado vai direto ao produto
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
			            keys: ['enter','esc'],
					}
				}
			});
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto(idUnico) {
	
	borda = '';
	[produto, Borda] = [{}, {}];
	Borda.nomeProduto = '';
	
	//caso o retorno seja apenas 1 item
	if(idUnico == null) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
	}else var idProduto = idUnico;	

	if(buscaProdutos.length != 1)//buscar produto na lista
		for(let busca of buscaProdutos){
			if(busca.id == idProduto) produto = busca;
	}else{
		produto = buscaProdutos[0];
	}
	
	if(produto.disponivel == false){
		$.confirm({
				type: 'red',
				title: '<h4 align="center">Produto: ' + produto.nomeProduto + '</h4>',
				content: '<tr><td colspan="3"><label>Não disponível em estoque!</label></td></tr>',
			    closeIcon: true,
				buttons: {
			        confirm: {
						isHidden: true,
			            text: 'Voltar',
			            btnClass: 'btn btn-green',
			            keys: ['enter','esc'],
					}
				}
			});
		return 300;
	}
		
	$.confirm({
		type: 'blue',
		title: produto.setor + ': ' + produto.nomeProduto,
		content: (produto.setor == 'PIZZA' ? bordasHtml : '') + qtdHtml(),
	    closeIcon: true,
		onContentReady: () => {
			if(produto.setor == 'PIZZA'){
				//liberar qtd para alteracao
				$(".liberarqtd").change(() => {
					$(".liberarqtd").prop("checked") == 'on' 
					? $("#qtd").prop("disabled", true)
					: $("#qtd").prop("disabled", false);
				});

				if(divisor != 1){
					//$("#borda").prop("disabled", true)
					$("#borda").val(lastBorda);
				}else{
					//$("#borda").prop("disabled", false);
				}
			}
			
			//verificar o campo pula dentro do jquery confirm
			if(!$("#qtd").attr('disabled'))
				$("#qtd").focus().select();
			else
				$("#obs").focus();
		},
		buttons: {
			confirm: {
				text: 'adicionar',
				btnClass: 'btn btn-success enviarProduto',
				keys: ['enter'],
				action: function(){
					
					//adiciona o id da borda
					lastBorda = bordaId = $("#borda").val();
					
					//adiciona quantidade do produto
					qtd = Number($("#qtd").val().toString().replace(",","."));
					if(isNaN(qtd) || qtd == 0) qtd = 1;
					
					//setar ultima borda adicionada
					if(qtd == 1) lastBorda = 0;
					
					//adiciona observacao do produto
					obs = $("#obs").val();
					
					//multiplica o preco e custo da pizza
					produto.preco *= qtd;
					produto.custo *= qtd;
					
					if(produto.setor == 'PIZZA'){
						//se for escolhido uma borda
						if(bordaId != 0) {
							//buscar produto na lista
							for(let busca of buscaBordas) if(busca.id == bordaId) Borda = busca;
							
							//setar valores da borda escolhida
							borda = Borda.nomeProduto;
							
							//multiplica o preco e custo da borda
							produto.preco += (Borda.preco * qtd);
							produto.custo += (Borda.custo * qtd);
						}							
						pizzas.unshift({
							qtd,
							obs,
							'sabor' : produto.nomeProduto,
							'borda': Borda.nomeProduto,
							'preco': produto.preco,
							'custo': produto.custo,
							'setor': produto.setor,
							'descricao': produto.descricao,
						});
					}else{
						produtos.unshift({
							qtd,
							obs,
							'sabor' : produto.nomeProduto,
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
					if(divisor <= 0) divisor = 1;
					
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
$(".removerProduto").click(function(){
	try{
		totalTodosProdutos -= produtos[0].qtd;
		tPedido -= produtos[0].preco;
		
		let divAnt = divisor;
		divisor = divisorAnterior;
		
		if(divisor != 1) divisorAnterior += divAnt;
		
		produtos.shift();
		mostrarProdutos();
	}catch(exception){}
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function(){
	try{
		totalTodosProdutos -= pizzas[0].qtd;
		tPedido -= pizzas[0].preco;
		
		let divAnt = divisor;
		divisor = divisorAnterior;
		
		if(divisor != 1) divisorAnterior += divAnt;
		
		pizzas.shift();
		mostrarProdutos();
	}catch(exception){}	
});


//------------------------------------------------------------------------------------------------------------------------
$("#BotaoEnviarPedido").click(function() {

	//receber modo de envio e verificar opcao de envio
	cliente.envio = $("#envioCliente").val();
	
	if(cliente.envio === 'MESA'){
		if($("#garcon").val() == '--'){
			$.alert({
				type: 'red',
				title: 'OPS...',
				content: "Escolha um garçon",
				buttons: {
					confirm:{
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
	if($("#modoPagamento").val() == 0){
		//receber troco
		troco = Number($('#troco').val().replace(",", "."));
		
		//verificar troco
		if(Number.isFinite(troco) == false) {
			$.alert({
				type: 'red',
				title: 'OPS...',
				content: "Digite um valor válido",
				buttons: {
					confirm:{
						text: 'Voltar',
						btnClass: 'btn-danger',
						keys: ['esc', 'enter']
					}
				}
			});
			return 300;
		}
		
		//verificar se for dinheiro
		if(cliente.envio === 'ENTREGA'){
			cliente.modoPagamento = "Dinheiro -R$ " + Number(cliente.total + cliente.taxa).toFixed(2); 
		}else if(cliente.envio != 'MESA'){
			cliente.modoPagamento = "Dinheiro -R$ " + Number(cliente.total).toFixed(2); 
		}
	}
	
	//verificar se for cartao
	if(selecionarCartao() == 0 && $("#modoPagamento").val() == 1){
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
	}
	
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
	            action: function(){
					carregarLoading("block");
					
					if(cliente.envio === 'ENTREGA' && $("#cobrarTaxa").val() == 1) cliente.taxa = 0;

					if(cliente.envio != "ENTREGA"){
						cliente.taxa = cliente.endereco = cliente.celular = null; //apagar variaveis para evitar erros
					}
					
					if($('#obsPedido').val() != '') cliente.obs = $('#obsPedido').val();
					
					cliente.pago = (this.$content.find("#pagoCliente").val() == 0 ? false : true);
					cliente.pizzas = JSON.stringify(pizzas);
					cliente.produtos = JSON.stringify(produtos);
					cliente.total = tPedido;
					cliente.horaPedido = hora + ':' + minuto + ':' + segundo;
					cliente.troco = troco;
					/*
					//buscar pedido no sistema
					$.ajax({
						url: "/novoPedido/atualizar",
						type: "PUT",
						dataType : 'json',
						contentType: "application/json",
						data: JSON.stringify(cliente)
					}).done(function(e){
						estruturarPedido(e, troco);
					}).fail(function(){
						carregarLoading("none");
					});*/
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
function estruturarPedido(e, troco){
	//atualizar
	if(e.id != null && modo == "ATUALIZAR") {
		cliente.horaPedido = e.horaPedido;
		
		//converter pedido atual para objeto
		cliente.pizzas = JSON.parse(cliente.pizzas);
		cliente.produtos = JSON.parse(cliente.produtos);
		
		//converter pedido antigo para objeto
		e.pizzas = JSON.parse(e.pizzas);
		e.produtos = JSON.parse(e.produtos);

		//concatenar pizzas
		for(pizza of e.pizzas) cliente.pizzas.unshift(pizza);

		//concatenar produtos
		for(produto of e.produtos) cliente.produtos.unshift(produto);
		
		//converter pedido atual em JSON
		cliente.pizzas = JSON.stringify(cliente.pizzas);
		cliente.produtos = JSON.stringify(cliente.produtos);
	}
	
	//editar
	if(modo == "EDITAR"){
		//excluir temporarios para nao duplicar
		$.ajax({
			url: "/novoPedido/excluirPedidosTemp/" + cliente.comanda,
			type: 'POST'
		});
	}
	
	if((isNumber(troco) == false) || (troco < mostrarTotalComTaxa())) {
		cliente.troco = mostrarTotalComTaxa();
	}
	salvarPedido();
}


//-------------------------------------------------------------------------------------------------------------------
function criarTemp(setor, comanda){
	temp = {};
	temp.comanda = comanda;
	temp.data = cliente.data;
	temp.nome = cliente.nome;
	temp.envio = cliente.envio;
	temp.status = "COZINHA";
	temp.setor = setor;

	if(setor == 1){
		temp.pizzas = JSON.stringify(pizzas);
	}
	if(setor == 2){
		temp.pizzas = JSON.stringify(produtos);
	}
	
	//salvar pedido no temp
	$.ajax({
		url: '/novoPedido/salvarTemp',
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(temp)
	});
}


//--------------------------------------------------------------------------------------------------------------------
function salvarPedido(){
	//salvar pedido
	$.ajax({
		url: "/novoPedido/salvarPedido",
		type: "PUT",
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(cliente)
	}).done(function(e){
		cliente.comanda = e.comanda; //recebe numero do servidor
		
		if(pizzas.length != 0){
			criarTemp(1, e.comanda);
		}
		if(produtos.length != 0){
			criarTemp(2, e.comanda);
		}
		
		carregarLoading("none");
		
		$.alert({
			type: 'green',
			title: 'Sucesso!',
			content: 'Pedido enviado!',
			buttons: {
		        confirm: {
		            text: 'Obrigado!',
		            btnClass: 'btn-green',
		            keys: ['enter','esc'],
		            action: function(){
						window.location.href = "/novoPedido";
					}
				}
			}
		});
	}).fail(function(){
		$.alert("Erro, Pedido não enviado!");
		carregarLoading("none");
	});
}



//mostrar pedido no jquery confirm final
function mostrarPedido(){
	return linhaHtml = '<b>Qtd Produtos:</b> ' + totalTodosProdutos 
				+ '<br><b>Total do Pedido:</b> R$ ' + mostrarTotalComTaxa().toFixed(2)
				+ '<br>'
				+ '<div>'//col-md-6
					+'<label><b>O pedido foi pago:</b></label>'
					+'<select name="pagamento" class="form-control" id="pagoCliente">'
						+'<option value="0">Não</option>'
						+'<option value="1">Sim</option>'
					+ '</select>'
				+ '</div>'
			
			+ '<div>&nbsp;</div>'
			+ '<b class="fRight">Deseja enviar o pedido?</b>';	
}


//-------------------------------------------------------
function recarregar() {
	window.location.href= "/novoPedido";
}


//Método para pular campos teclando ENTER
$('.pula').on('keypress', function(e){
	var tecla = (e.keyCode?e.keyCode:e.which);

    if(tecla == 13){
    	campo = $('.pula');
    	indice = campo.index(this);
     
    	if(campo[indice+1] != null){
    		if(indice == 3) proximo = campo[indice - 1];
    		else proximo = campo[indice + 1];
    		proximo.focus();
    	}
    }
});


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}

//salvar hora atual
var data = new Date();
hora = data.getHours();
hora = (hora.length == 0) ? '00' : hora;
hora = (hora <= 9) ? '0'+hora : hora;
minuto = data.getMinutes();
minuto = (minuto.length == 0) ? '00' : minuto;
minuto = (minuto <= 9) ? '0'+minuto : minuto;
segundo = data.getSeconds();
segundo = (segundo.length == 0) ? '00' : segundo;
segundo = (segundo <= 9) ? '0'+segundo : segundo;
dia  = data.getDate().toString();
dia = (dia.length == 1) ? '0'+dia : dia;
mes  = (data.getMonth()+1).toString();
mes = (mes.length == 1) ? '0'+mes : mes;
ano = data.getFullYear();


function isNumber(str) {
    return !isNaN(parseFloat(str))
}


function mostrarTotal(){
	$("#TotalProdutos").html('<b>Total de Produtos:</b> ' + totalTodosProdutos);
	
	if($("#cobrarTaxa").val() == 1
	|| $("#envioCliente").val() === 'MESA'
	|| $("#envioCliente").val() === 'BALCAO'
	|| $("#envioCliente").val() === 'DRIVE'){
			
		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + tPedido.toFixed(2));
		$("#troco").val(tPedido);
	}else if(isNumber(cliente.taxa) == true){
		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + (tPedido + cliente.taxa).toFixed(2));
		$("#troco").val((tPedido + cliente.taxa));
	}
		
	else{
		$("#TotalPedido").html('<b>Total do Pedido:</b><br>R$ ' + tPedido.toFixed(2));
		$("#troco").val(tPedido);
	}
}


function mostrarTotalComTaxa(){
	if($("#cobrarTaxa").val() == 1
	|| $("#envioCliente").val() === 'MESA'
	|| $("#envioCliente").val() === 'BALCAO'
	|| $("#envioCliente").val() === 'DRIVE')
		return tPedido;
	else if(isNumber(cliente.taxa) == true)
		return (tPedido + cliente.taxa);
	else
		return tPedido;
}


$("#modoPagamento").change(() => {
	selecionaModoPagamento();
});


function selecionaModoPagamento(){
	//dinheiro
	if($("#modoPagamento").val() == 0){
		$("#divModoPagamentoCartao").hide('show', () => {
			$("#divModoPagamentoDinheiro").show('show');
		});	
	}
	
	//cartao
	if($("#modoPagamento").val() == 1){
		$("#divModoPagamentoDinheiro").hide('show', () => {
			$("#divModoPagamentoCartao").show('show');
		});
	}
}


$("#modoPagamentoCartao").change(() => {
	selecionarCartao();
});


function selecionarCartao(){
	if($("#modoPagamentoCartao").val() === '--'){
		return 0;
	}else{
		$("#modoPagamentoCartao").val();
		cliente.modoPagamento = "Cartão -" + $("#modoPagamentoCartao").val();
		return 1;
	}
}


$("#envioCliente").change(function(){
	mostrarTotal();
	if($("#envioCliente").val() === 'MESA'){
		$("#divCobrarTaxa").hide('slow', () => {
			$("#divGarcon").show('slow', () => {
				$("#divPagamentoGeral").hide('slow');
			});
		});
		
	}else if($("#envioCliente").val() == 'ENTREGA'){
		$("#divGarcon").hide('slow', () => {
			$("#divCobrarTaxa").show('slow', () => {
				$("#divPagamentoGeral").show('slow');
			});
		});
	}else{
		$("#divGarcon").hide('slow',() =>{
			$("#divCobrarTaxa").hide('slow', () => {
				$("#divPagamentoGeral").show('slow');
			});
		});
	}
});


$("#cobrarTaxa").change(() => {
	mostrarTotal();
});


$(document).keypress(function(e) {
	if(e.which == 13){
		if($("#obs").is(":focus"))
			$(".enviarProduto").focus();
			
		if($("#qtd").is(":focus"))
			$("#obs").focus();
	}
});


function mostrarDivPizzasProdutos(){
	if(cliente.pizzas != 0)
		$("#divPizzas").show('slow');
	if(cliente.produtos != 0)
		$("#divProdutos").show('slow');
}


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {//todos
	mostrarTotal();
	
	if(pizzas.length == 0 && produtos.length == 0){
		$(".divListaGeral").hide('slow');
		return 300;
	}else{
		$(".divListaGeral").show('slow');
	}

	if(produtos.length != 0){
		linhaHtml = "";
		
		for(produto of produtos){
			linhaHtml += '<tr>'
					 +	'<td class="text-center col-md-1">' + produto.qtd + " x " + produto.sabor + '</td>'
					 +	'<td class="text-center col-md-1">' + produto.obs + '</td>'
					 +	'<td class="text-center col-md-1">R$ ' + produto.preco.toFixed(2) + '</td>'
				 + '</tr>'
				 + linhaCinza;
		}
		$("#listaProduto").html(linhaHtml);
		$("#divProdutos").show('slow');
	}else{
		$("#listaProduto").html(produtoVazio);
		$("#divProdutos").hide('slow');
	}
	
	if(pizzas.length != 0){
		linhaHtml = "";
		
		for(pizza of pizzas){
			linhaHtml += '<tr>'
					 +	'<td class="text-center col-md-1">' + pizza.qtd + " x " + pizza.sabor + '</td>'
					 +	'<td class="text-center col-md-1">' + pizza.obs + '</td>'
					 +	'<td class="text-center col-md-1">R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +	'<td class="text-center col-md-1">' + pizza.borda + '</td>'
				 + '</tr>'
				 + linhaCinza;
		}
		$("#listaPizza").html(linhaHtml);
		$("#divPizzas").show('slow');
	}else{
		$("#listaPizza").html(pizzaVazio);
		$("#divPizzas").hide('slow');
	}
}


function mostrarListaBuscaProdutos(buscaProdutos){
	//lista de produtos
	linhaHtml = '<table class="h-100">'
				+ '<thead>'
					+ '<tr>'
						+ '<th class="col-md-1"></th>'
						+ '<th class="col-md-1"><h5>Produto</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>'
				+ '</thead>'
				+ '<tbody>';
	

	if(buscaProdutos.length != 0) {
		//abrir modal de produtos encontrados
		for(produto of buscaProdutos){
			linhaHtml += '<tr>'
						+ '<td align="center">'
							+ '<div>'
								+ '<button onclick="enviarProduto()"'
									+ 'title="Adicionar" onclick="enviarProduto()" class="botao" value="' + produto.id + '">'
									+ '<i class="fas fa-plus"></i>'
								+ '</button>'
							+ '</div>'
						+ '</td>'
						+ '<td align="left">' + produto.nomeProduto + '</td>'
						+ '<td align="center">R$ ' + produto.preco.toFixed(2) + '</td>'
					+ '</tr>' + linhaCinzaBusca;
		}
			
	}else {
		linhaHtml += '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>';
	}
	linhaHtml += '</tbody>'
				+ '<table>';
}