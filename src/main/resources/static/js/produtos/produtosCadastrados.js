$(document).ready(() => $("#nomePagina").text("Produtos cadastrados"));

var produtos = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="4">Nenhum produto encontrado!</td></tr>';


$("#buscar").click(function(){
	carregarLoading("block");
	
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/u/produtosCadastrados/buscar/' + nome,
		type: 'GET'
	}).done(function(e){
		
		produtos = e;
		linhaHtml = '';
		if(produtos.length == 0) {
			$("#todosProdutos").html(pedidoVazio);
		} else {
			for(produto of produtos) {
				linhaHtml += '<tr>'
							+ '<td class="text-center col-md-1">' + produto.codigoBusca + '</td>'
							+ '<td class="text-center col-md-1">' + produto.nome + '</td>'
							+ '<td class="text-center col-md-1">' + produto.setor + '</td>'
				
							+ '<td class="text-center col-md-1"><div class="row">'
								+ '<div class="col-md-1">'
									+'<a title="Ver produto" data-toggle="tooltip" data-html="true">'
										+'<button class="botao" onclick="verProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-search"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
			
								+ '<div class="col-md-1">'
									+'<a title="Editar produto" data-toggle="tooltip" data-html="true">'
										+'<button class="botao" onclick="editarProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-edit"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
				
								+ '<div class="col-md-1">'
									+'<a title="Excluir produto" data-toggle="tooltip" data-html="true">'
										+'<button class="botao" onclick="excluirProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-trash"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
							+ '</div>'
						+ '</td></tr>';
			}
			$("#todosProdutos").html(linhaHtml);
			$('[data-toggle="tooltip"]').tooltip();
		}
		carregarLoading("none");
	}).fail(function(){
		carregarLoading("none");
		$.alert("Erro, Produtos não encontrados!");
	});
});


//-----------------------------------------------------------------------------------------------------------
function verProduto() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in produtos) if(produtos[i].id == idProduto) var idBusca = i;		

	linhaHtml = '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Codigo de busca</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].codigoBusca
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-6">'
						+ '<label>Nome do produto</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].nome
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Preço pequeno</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].precoP
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-6">'
						+ '<label>Custo pequeno</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].custoP
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Preço médio</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].precoM
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-6">'
						+ '<label>Custo médio</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].custoM
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Preço grande</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].precoG
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-6">'
						+ '<label>Custo grande</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].custoG
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Setor</label>'
						+ '<input class="form-control" value="' 
							+ produtos[idBusca].setor
						+ '" readonly/>'
					+ '</div>'
				
					+ '<div class="col-md-6">'
						+ '<label>Disponivel para venda?</label>'
						+ '<input class="form-control" value="' 
							+ (produtos[idBusca].disponivel == 1 ? "Sim" : "Não")
						+ '" readonly/>'
					+ '</div>'
				+ '</div>'
				
				+ '<div>'
					+ '<label>Descrição</label>'
					+ '<input class="form-control" value="' 
						+ produtos[idBusca].descricao
					+ '" readonly/>'
				+ '</div>';
	
	$.alert({
		type: 'blue',
	    title: 'Produto: ' + produtos[idBusca].nome,
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
function editarProduto() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in produtos) if(produtos[i].id == idProduto) var idBusca = i;		
	
	$.confirm({
		type: 'red',
	    title: 'Produto: ' + produtos[idBusca].nome,
	    content: 'Tenha certeza do que você está fazendo!<br>',
	    buttons: {
	        confirm: {
	            text: 'Editar produto',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					window.location.href = "/u/cadastroProduto/editar/" + idProduto.toString();
				}
			},
	        cancel:{
				text: 'Voltar',
	            btnClass: 'btn-green',
	            keys: ['esc'],
			}
		}
	});
}


//-----------------------------------------------------------------------------------------------------------
function excluirProduto() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in produtos) if(produtos[i].id == idProduto) var idBusca = i;		
		
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Produto: ' + produtos[idBusca].nome,
	    content: 'Deseja apagar o produto?',
	    buttons: {
	        confirm: {
	            text: 'Apagar produto',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'APAGAR PRODUTO!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar produto',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									$.ajax({
										url: "/u/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM" || e[0].authority === "DEV") {
											if(apagarSim === 'sim' || apagarSim === 'SIM') {
												
												$.ajax({
													url: "/u/produtosCadastrados/excluirProduto/" + idProduto,
													type: 'PUT'
													
												}).done(function(){		
													$.alert({
														type: 'green',
													    title: 'Produto apagado!',
													    content: 'Espero que dê tudo certo!',
													    buttons: {
													        confirm: {
																text: 'Voltar',
													    		keys: ['enter'],
													            btnClass: 'btn-green',
													            action: function(){
																	window.location.href = "/u/produtosCadastrados";
																}
															}
														}
													});
												}).fail(function(){
													$.alert("Erro, Produto não apagado!");
												});
											}else {
												$.alert({
													type: 'red',
												    title: 'Texto incorreto!',
												    content: 'Pense bem antes de apagar um produto!',
												    buttons: {
												        confirm: {
															text: 'Voltar',
												    		keys: ['enter'],
												            btnClass: 'btn-red',
														}
													}
												});
											}
										}else {//se nao for ADM
											$.alert({
												type: 'red',
											    title: 'Permissão de usuário!',
											    content: 'Você não tem permissão para apagar um funcionario<br>Utilize um usuário ADM!',
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
