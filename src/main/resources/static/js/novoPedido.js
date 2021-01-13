//objetos---------------------------------------------------------------------------------------------------------
var cliente = {};

//vetores------------------------------------------------------------------------------------------------------
var pizzas = [], produtos = [], buscaProdutos = [], buscaBordas = [];

//produto------------------------------------------------------------------------------------------------------
var Sabor, Preco, Descricao, Custo, Obs, Qtd, divisor = 1, divisorAnterior = 1;

//borda------------------------------------------------------------------------------------------------------
var Borda, BordaPreco, BordaCusto;

//pedido------------------------------------------------------------------------------------------------------
var tPizzas = 0, tPedido = 0;
var op, string = '', totalUnico; // valor fixo mesmo depois do sistema atualizar o pedido antigo com o novo

//html------------------------------------------------------------------------------------------------------
var linhaHtml = "", imprimirTxt = '';

//botoes------------------------------------------------------------------------------------------------------
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var buttonRemove = '<a class="removerProduto"><button type="button" class="btn btn-danger">Remover</button></a>';
var pedidoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';
var linhaCinzaBusca = '<tr><td colspan="3" class="fundoList" ></td></tr>';

function qtdHtml() {
	let htmlQtd;
	let qtdDivisor;
	
	if(divisor < 1 && divisor != 0){
		htmlQtd = "disabled";
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
	}

	if(divisor == 0 || divisor < 0.1){
		qtdDivisor = divisor = 1;
		htmlQtd = "";
	}
	
	return ('<label>Quantidade:</label><br>'
			+ '<input type="text" placeholder="Quantidade" class="form-control" id="qtd" value="' + qtdDivisor.toFixed(2) + '" ' + htmlQtd + '/>'
			+ '<br>'
			+ '<label>Observação:</label>'
			+ '<input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" />');
}



//url------------------------------------------------------------------------------------------------------
var url_atual = window.location.href;
var celular = parseInt(url_atual.split("/")[4]);//pega o id de novo cadastro
var id_edicao = url_atual.split("/")[5]; //pega o id de edicao do pedido

//buscar borda recheada---------------------------------------------------------------------------
var bordasHtml;
(() => {
	let html;
	
	$.ajax({
		url: '/novoPedido/bordas',
		type: 'GET',
		success: todasBordas => {

			//buscar bordas
			var bordas = '';
			for(borda of todasBordas) bordas += `<option value="${borda.id}">${borda.nomeProduto} R$ ${borda.preco}</option>`;
			
			 html = '<label>Borda Recheada:</label>'
							+ '<select class="form-control" name="borda" id="borda">'
								+ '<option value="0"></option>'
								+ bordas
							+ '</select><br>';
			salvarBordas(html, todasBordas);
		}
	});
})();


function salvarBordas(html, todasBordas){
	bordasHtml = html;
	buscaBordas = todasBordas;
}
	
	
//setInterval(() => console.log(cliente), 1000)

//------------------------------------------------------------------------------------------------------------
if(celular % 2 == 1 || celular % 2 == 0) $("#numeroCliente").val(celular);


//------------------------------------------------------------------------------------------------------------
if(typeof id_edicao == "undefined") {
	$("#Ttotal").html('Total de Produtos: ' + tPizzas.toFixed(2) + '<br><br>Total do Pedido: R$0,00');
}else {
	carregarLoading("block");
	urlNumero = "/novoPedido/editarPedido/" + id_edicao.toString();
	
	$.ajax({
		url: urlNumero,
		type: 'GET'
	}).done(function(e){

		$("#divBuscarCliente").hide();
		$("#divBuscarProdutos").show();
		$("#BotaoEnviarPedido").html('<span class="oi oi-cart"></span> Atualizar pedido');
		$(".divListaGeral").show();
		$("#mostrarDadosCliente").show(); 
		$("#cancelar").html('<span class="oi oi-ban"></span> Cancelar alteração');

		op = "EDITAR";
		cliente = e;
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);
		cliente.taxa = parseFloat(cliente.taxa);
		
		//mostrar entrega
		if(e.envio == 'ENTREGA') {
			$("#mostrarDadosCliente").show('slow'); //esconder tabelas
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeCliente").text(cliente.nome);
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
		}
		
		//mostrar entrega
		if(e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {

			$("#mostrarDadosCliente").hide();
			$("#divEnvio").hide();
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeBalcao").html('<h2>Cliente: ' + cliente.nome + '</h2>');
		}
		
		for(pizza of cliente.pizzas) tPizzas += pizza.qtd;
	
		for(produto of cliente.produtos) tPizzas += produto.qtd;
		
		pizzas = cliente.pizzas;
		produtos = cliente.produtos;
		tPedido = cliente.total;
		
		mostrarProdutos();
		$("#Ttotal").html('Total de Produtos: ' + tPizzas.toFixed(2) + '<br><br>' + 'Total do Pedido: R$' + cliente.total.toFixed(2));
		$(".pula")[2].focus();//focar no campo de buscar pedido
		
		carregarLoading("none");
	}).fail(function(){
		$.alert("Erro, cliente não encontrado!");
	});	
}


//------------------------------------------------------------------------------------------------------------------------
$('#buscarCliente').on('click', function(){

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
		
	}else{
		if($("#numeroCliente").val() % 2 == 1 || $("#numeroCliente").val() % 2 == 0){
			carregarLoading("block");
		
			var numero = $("#numeroCliente").val();
	
			$.ajax({
				url: "/novoPedido/numeroCliente/" + numero,
				type: 'GET'
			}).done(function(e){
	
				if(e.length != 0) {
					cliente.nome = e.nome;
					cliente.celular = e.celular;
					cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
					cliente.taxa = parseFloat(e.endereco.taxa);
					
					$("#mostrarDadosCliente").show('slow'); //mostrar dados do cliente
					$("#nomeCliente").text(cliente.nome);
					$("#celCliente").text(cliente.celular);
					$("#enderecoCliente").text(cliente.endereco);
					$("#taxaCliente").text('Taxa: R$ ' + cliente.taxa.toFixed(2));
					$("#divBuscarCliente").hide('slow');
					$("#divBuscarProdutos").show('slow');
	
					$("#divEnvio").html('<label>Envio:</label>'
								+'<select name="opcao" class="form-control" id="envioCliente">'
									+'<option value="ENTREGA">Entrega</option>'
									+'<option value="BALCAO">Balcão</option>'
									+'<option value="MESA">Mesa</option>'
									+'<option value="DRIVE">Drive-Thru</option>'
								+'</select>');
					
					atualizarDados();
					
					$(".pula")[2].focus();//focar no campo de buscar pedido
				}else {
					window.location.href = "/cadastroCliente/" + numero;
				}
				carregarLoading("none");
			});
			
		}else if(typeof $("#numeroCliente").val() == 'string'){
			cliente.nome = $("#numeroCliente").val();
			
			$("#divBuscarCliente").hide('slow');
			$("#mostrarDadosCliente").hide("slow");
			$("#divBuscarProdutos").show('slow');
			$("#nomeBalcao").html('<h2>Cliente: ' + $("#numeroCliente").val() + '</h2>');
			
			if(cliente.nome.indexOf("Mesa") > -1) {//se existir a palavra Mesa
				cliente.envio = "MESA";
			}else if(cliente.nome.indexOf("mesa") > -1){//se existir a palavra mesa
				cliente.envio = "MESA";
			}else if((cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'M' && cliente.nome[1] % 2 == 1)){
				cliente.envio = "MESA";
			}else if((cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 0) || (cliente.nome[0] == 'm' && cliente.nome[1] % 2 == 1)){
				cliente.envio = "MESA";
			}else if(cliente.envio == '' || cliente.envio == null) {//se for nulo o campo
				cliente.envio = $("#envioCliente").val();
			}else{
				$("#divEnvio").html('<label>Envio:</label>'
									+'<select name="opcao" class="form-control" id="envioCliente">'
										+'<option value="BALCAO">Balcão</option>'
										+'<option value="MESA">Mesa</option>'
										+'<option value="DRIVE">Drive-Thru</option>'
									+'</select>');
			}
			atualizarDados();
			$(".pula")[2].focus();//focar no campo de buscar pedido
		}
	}
});


//------------------------------------------------------------------------------------
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
		
		if(e.id != null) {
			op = "ATUALIZAR";
			tPedido = e.total;
			cliente.id = e.id;
			cliente.comanda = e.comanda;
			cliente.horaPedido = e.horaPedido;
		}
	});
}
		
		
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
			if(e.length == 0) {//se nao encontrar nenhum produto
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
			}else if(e[0].id == -1) {//se o produto estiver indisponivel
				$.confirm({
					type: 'red',
					title: '<h4 align="center">Produto: ' + e[0].nomeProduto + '</h4>',
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
			}else if(e.length == 1) {//se existir apenas um resultado vai direto ao produto
				enviarProduto(e[0].id);
			}else{//senao vai para lista de produtos
		
				$("#listaProdutos").show('slow');
				$("#todosProdutos").html(" ");
				
				
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
												+ ($("#cadastroCliente").attr("class", "fa-plus") == "" ? "<b>+</b>" : '<i class="fas fa-plus"></i>')
											+ '</button>'
										+ '</div>'
									+ '</td>'
									+ '<td align="left">' + produto.nomeProduto + '</td>'
									+ '<td align="center">R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
								+ '</tr>' + linhaCinzaBusca;
					}
						
				}else {
					linhaHtml += '<tr><td colspan="3"><label>Nenhum produto encontrado!</label></td></tr>';
				}
				linhaHtml += '</tbody>'
							+ '<table>';
				
				$.confirm({
					type: 'blue',
					title: '<h4 align="center">Lista de Produtos</h4>',
					content: linhaHtml,
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
			}
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto(idUnico) {
	
	//setar valores de borda
	BordaPreco = 0, BordaCusto = 0, Borda = '';
	
	//caso o retorno seja apenas 1 item
	if(idUnico == null) {
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
	}else var idProduto = idUnico;	
	
	var produto;

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
			            btnClass: 'btn-green',
			            keys: ['enter','esc'],
					}
				}
			});
			
		return;
	}
	
	Sabor = produto.nomeProduto;
	Preco = produto.preco;
	Custo = parseFloat(produto.custo);
	Setor = produto.setor;
	Descricao = produto.descricao;

	//pizza
	if(Setor == 'PIZZA') {
		
		$.confirm({
			type: 'blue',
			title: Setor + ': ' + Sabor,
			content: bordasHtml + qtdHtml(),
		    closeIcon: true,
			buttons: {
				confirm: {
					text: 'adicionar',
					btnClass: 'btn-success',
					keys: ['enter'],
					action: function(){
						
						Qtd = parseFloat($("#qtd").val().toString().replace(",","."));
						if(isNaN(Qtd) || Qtd == 0){
							Qtd = 1;
						}
						Obs = $("#obs").val();
						
						//multiplica o preco da pizza
						Preco *= Qtd;
						
						//adiciona o valor da borda
						bordaId = parseFloat($("#borda").val());
						
						//se for escolhido uma borda
						if(bordaId != 0) {
							var borda;
							
							//buscar produto na lista
							for(let busca of buscaBordas){
								if(busca.id == bordaId) borda = busca;
							}
								
							//setar valores da borda escolhida
							Borda = borda.nomeProduto;
							BordaPreco = parseFloat(borda.preco);
							BordaCusto = parseFloat(borda.custo);
							Preco += parseFloat(BordaPreco * Qtd);
							Custo += parseFloat(BordaCusto * Qtd);
							
							tPizzas += Qtd;
							tPedido += Preco;
							
							pizzas.unshift({
								'sabor' : Sabor,
								'qtd': (Qtd < 1 ? Number(Qtd.toFixed(2)) : Number(Qtd)),
								'borda': Borda,
								'obs': Obs,
								'preco': Preco,
								'custo': parseFloat(Custo),
								'setor': Setor,
								'descricao': Descricao,
							});
							
							//controlar qtd do produto
							divisorAnterior = divisor.toFixed(2);
							divisor -= Qtd;
							
							mostrarProdutos();
							$(".divListaGeral").show('slow');
							
						//sem borda
						}else {
							tPizzas += Qtd;
							tPedido += parseFloat(Preco);
							
							pizzas.unshift({
								'sabor' : Sabor,
								'qtd': (Qtd < 1 ? Number(Qtd.toFixed(2)) : Number(Qtd)),
								'borda': Borda,
								'obs': Obs,
								'preco': Preco,
								'custo': parseFloat(Custo),
								'setor': Setor,
								'descricao': Descricao,
							});

							//controlar qtd do produto
							divisorAnterior = divisor.toFixed(2);
							divisor -= Qtd;
							
							if(divisor <= 0) divisor = 1;
							
							mostrarProdutos();
							$(".divListaGeral").show('slow');
						}

					}
				},
				cancel: {
					isHidden: true,
					keys: ['esc'],
				}
			}
		});
	//outros produtos do cardapio
	}else {
		$.confirm({
			type: 'blue',
			title: Setor + ': ' + Sabor,
			content: qtdHtml(),
		    closeIcon: true,
			buttons: {
				confirm: {
					text: 'adicionar',
					btnClass: 'btn-success',
					keys: ['enter'],
					action: function(){
						
						Qtd = parseFloat($("#qtd").val().toString().replace(",","."));
						if(isNaN(Qtd) || Qtd == 0){
							Qtd = 1;
						}
						Obs = $("#obs").val();
						
						Preco *= Qtd;
						tPizzas += Qtd;
						tPedido += Preco;

						produtos.unshift({
							'sabor' : Sabor,
							'qtd': (Qtd < 1 ? Number(Qtd.toFixed(2)) : Number(Qtd)),
							'obs': Obs,
							'preco': Preco,
							'custo': parseFloat(Custo),
							'setor': Setor,
							'descricao': Descricao,
						});

						//controlar qtd do produto
						divisorAnterior = divisor.toFixed(2);
						divisor -= Qtd;
					
						if(divisor <= 0) divisor = 1;
						
						mostrarProdutos();
						$(".divListaGeral").show('slow');
					}
				},
				cancel: {
					isHidden: true,
					keys: ['esc'],
				}
			}
		});
	}
};


//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	let divAnt = divisor;
	divisor = divisorAnterior;
	
	if(divisor != 1)
		divisorAnterior += divAnt;
	
	produtos.shift();

	if(produtos.length == 0) $("#listaProduto").html(pedidoVazio);
	
	if(pizzas.length == 0 && produtos.length == 0) $(".divListaGeral").hide('slow');
	
	else mostrarProdutos();

	$("#Ttotal").html('Total de Produtos: ' + tPizzas.toFixed(2) + '<br><br>Total do Pedido: R$ ' + tPedido);	
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function(){
	
	tPizzas -= pizzas[0].qtd;
	tPedido -= pizzas[0].preco;
	
	let divAnt = divisor;
	divisor = divisorAnterior;
	
	if(divisor != 1)
		divisorAnterior += divAnt;
	
	pizzas.shift();
	
	if(pizzas.length == 0) $("#listaPizza").html(pedidoVazio);
	
	if(pizzas.length == 0 && produtos.length == 0) $(".divListaGeral").hide('slow');	
	
	else mostrarProdutos();

	$("#Ttotal").html('Total de Produtos: ' + tPizzas.toFixed(2) + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$("#BotaoEnviarPedido").click(function() {
		
	if(cliente.envio !== "MESA" || cliente.envio == "") cliente.envio = $("#envioCliente").val();
	
	if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Apenas valores inteiros!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});	
	}else{
		
		linhaHtml = "";
		
		if(cliente.envio == 'ENTREGA') {
			linhaHtml += '<b>Qtd Produtos:</b> ' + tPizzas.toFixed(2)
						+ '<br><b>Total sem Taxa:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><b>Taxa de Entrega:</b> R$ ' + cliente.taxa.toFixed(2)
						+ '<br><b>Total do Pedido:</b> R$ ' + (parseFloat(tPedido) + cliente.taxa).toFixed(2)
						+ '<br><div class="row"><div class="col-md-6">'
						+ '<b>Receber:</b>'
						+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' 
						+ (parseFloat(tPedido) + cliente.taxa).toFixed(2) + '"/></div>';
		}else {
			linhaHtml += '<b>Qtd Produtos:</b> ' + tPizzas.toFixed(2) 
						+ '<br><b>Total do Pedido:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><div class="row"><div class="col-md-6">'
						+ '<b>Receber:</b>'
						+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' 
						+ tPedido.toFixed(2) + '"/></div>';
		}
		
		linhaHtml += '<div class="col-md-6">'
					+'<label><b>O pedido foi pago:</b></label>'
					+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
						+'<option value="Não">Não</option>'
						+'<option value="Sim">Sim</option>'
					+ '</select></div>'
					
					+ '<label><b>Observação do Pedido:</b></label>'
					+ '<textarea type="area" id="obs" name="obs" class="form-control" placeholder="Observação do pedido" />'
					+ '<div>&nbsp;</div><b class="fRight">Deseja enviar o pedido?</b>';

		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nome,
		    content: linhaHtml,
		    closeIcon: true,
		    columnClass: 'col-md-12',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						carregarLoading("block");
						
						var troco = this.$content.find('#troco').val();
						var obs = this.$content.find('#obs').val();
						
						if(obs != '') cliente.obs = obs;
						
						cliente.pagamento = this.$content.find("#pagamentoCliente").val();

						troco = parseFloat(troco.toString().replace(",","."));
						
						if(Number.isFinite(troco) == false) {
							
							carregarLoading("none");
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
						}else {
							var temp = {};
							
							temp.data = cliente.data;
							temp.pizzas = cliente.pizzas = JSON.stringify(pizzas);
							temp.nome = cliente.nome;
							temp.envio = cliente.envio;
							temp.status = "COZINHA";
							
							cliente.produtos = JSON.stringify(produtos);
							cliente.total = tPedido;
							cliente.horaPedido = hora + ':' + minuto + ':' + segundo;
							cliente.troco = troco;
							
							if(cliente.envio == null) cliente.envio = "ENTREGA";
							if(cliente.envio !== "ENTREGA") cliente.taxa = cliente.endereco = null;//apagar variaveis para evitar erros
							
							//buscar pedido no sistema
							$.ajax({
								url: "/novoPedido/atualizar",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(cliente)
							}).done(function(e){
	
								if(e.id != null && op == "ATUALIZAR") {//atualizar
									cliente.horaPedido = e.horaPedido;
									
									if((troco % 2 != 0 && troco % 2 != 1) || (troco < (cliente.total + cliente.taxa))) {
										if(e.taxa == '' || e.taxa == null) //se for balcao
											cliente.troco = cliente.total;
										else cliente.troco = cliente.total + cliente.taxa;//se for entrega
									}
									
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
							
								//editar ou criar
								}else if((troco % 2 != 0 && troco % 2 != 1) || (troco < (cliente.total + cliente.taxa))) {
									if(cliente.taxa == '' || cliente.taxa == null) //se for balcao
										cliente.troco = cliente.total;
									else cliente.troco = cliente.total + cliente.taxa; //se for entrega
								}
									
								if(op == "EDITAR"){//editar
									//excluir temporarios para nao duplicar
									$.ajax({
										url: "/novoPedido/excluirPedidosTemp/" + cliente.comanda,
										type: 'PUT'
									});
								}

								//salvar pedido
								$.ajax({
									url: "/novoPedido/salvarPedido",
									type: "PUT",
									dataType : 'json',
									contentType: "application/json",
									data: JSON.stringify(cliente)
									
								}).done(function(e){
	
									cliente.comanda = temp.comanda = e.comanda; //recebe numero do servidor
									
									//salvar pedido no temp
									$.ajax({
										url: '/novoPedido/salvarTemp',
										type: 'POST',
										dataType : 'json',
										contentType: "application/json",
										data: JSON.stringify(temp)
									});
									
									imprimir();
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
							}).fail(function(){
								carregarLoading("none");
							});
						}
					}
		        },
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
});


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {//todos

	$("#listaProduto").html("");
	$("#listaPizza").html("");

	if(produtos.length == 0) $("#listaProduto").html(pedidoVazio);
	if(pizzas.length == 0) $("#listaPizza").html(pedidoVazio);
	
	for(pizza of pizzas){
		linhaHtml = '<tr>'
					 +	'<td>' + pizza.qtd + " x " + pizza.sabor + '</td>'
					 +	'<td>' + pizza.obs + '</td>'
					 +	'<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +	'<td>' + pizza.borda + '</td>'
				 + '</tr>'
				 + linhaCinza;
		$("#listaPizza").append(linhaHtml);
	}
	for(produto of produtos){
		linhaHtml = '<tr>'
				 +	'<td>' + produto.qtd + " x " + produto.sabor + '</td>'
				 +	'<td>' + produto.obs + '</td>'
				 +	'<td>R$ ' + produto.preco.toFixed(2) + '</td>'
			 + '</tr>'
			 + linhaCinza;
		$("#listaProduto").append(linhaHtml);
	}
	
	$("#Ttotal").html('Total de Produtos: ' + tPizzas.toFixed(2) + '<br><hr>Total do Pedido: R$ ' + tPedido.toFixed(2));
}


//----------------------------------------------------------------------------
function imprimir() {
    
    //buscar dados da empresa
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'GET'
	}).done(function(e){
		if(e.length != 0 && e.imprimir == 1) {
			
			impressaoPedido = {};
			impressaoPedido.nomeEstabelecimento = e.nomeEstabelecimento;//nome do estabelecimento
			impressaoPedido.envio = cliente.envio; //forma de envio
			impressaoPedido.texto1 = e.texto1;//texto1 gerado pela empresa
			impressaoPedido.cnpj = e.cnpj;
			impressaoPedido.enderecoEmpresa = e.endereco.rua + " " + e.endereco.n + "\n" + e.endereco.bairro;
					
					//numero da comanda e nome
			impressaoPedido.comanda = cliente.comanda;
			impressaoPedido.nome = cliente.nome;
		
			//mostrar endereco do cliente
			if(cliente.envio == 'ENTREGA') {
				impressaoPedido.celular = cliente.celular
				impressaoPedido.endereco =  cliente.endereco;
			}
			impressaoPedido.pizzas = cliente.pizzas;
			impressaoPedido.produtos = cliente.produtos;
	
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				impressaoPedido.total = cliente.total;
				impressaoPedido.taxa = cliente.taxa;
				
				//total sem taxa
			}else impressaoPedido.total = cliente.total;
	
			//total a levar de troco
			impressaoPedido.troco = cliente.troco;

			if(cliente.obs != "") impressaoPedido.obs = cliente.obs;
						
			//texto2 e promocao
			impressaoPedido.texto2 = e.texto2;
			impressaoPedido.promocao = e.promocao;
						
			//salvar hora
			impressaoPedido.hora = cliente.horaPedido;
			impressaoPedido.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];
			
			$.ajax({
				url: "/imprimir/imprimirPedido",
				type: 'POST',
				dataType : 'json',
				contentType: "application/json",
				data: JSON.stringify(impressaoPedido)
			});
		}
	});
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
	
	
//salvar troco inicial
if(Number($("#trocoInicial").val()) == 0)
	trocoInicial();
	

//-------------------------------------------------------
function trocoRepeat(){
	trocoInicial();
}


//-----------------------------------------------------
function trocoInicial() {
	$.alert({
		icon: 'oi oi-dollar',
		type: 'blue',
		title: 'Troco inicial do caixa',
		content: 'Troco:'
				+ '<div class="input-group mb-3">'
					+ '<span class="input-group-text">R$</span>'
					+ '<input class="form-control" id="trocoInicial" placeholder="Digite o valor do troco"/>',
		buttons:{
			confirm:{
				text:'Alterar troco',
				btnClass: 'btn-green',
				action: function(){	
					carregarLoading("block");
	
					var troco = this.$content.find('#trocoInicial').val();

					troco = parseFloat(troco.toString().replace(",","."));
					
					if(Number.isFinite(troco) == false) {
						carregarLoading("none");
						
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm:{
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter'],
									action: () => trocoRepeat()
								}
							}
						});
					}else {
						//alterar troco inicial						
						$.ajax({
							url: '/menu/troco/' + troco,
							type: 'GET'
						}).done(function(){
							carregarLoading("none");
							
							$.alert({
								type:'green',
								title: 'Troco alterado',
								content:'Boas vendas!',
								buttons:{
									confirm:{
										text:'Obrigado',
										btnClass: 'btn-success',
										keys: ['esc', 'enter'],
										action: function(){
											window.location.href= "/menu";
										}
									}
								}
							});
						}).fail(function(){
							carregarLoading("none");
							
							$.alert({
								type: 'red',
								title: 'Alerta',
								content: "Digite um valor válido!",
								buttons: {
									confirm: {
										text: 'Tentar novamente',
										btnClass: 'btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
						});
					}
				}
			}
		}
	});
}