$(document).ready(() => $("#nomePagina").text("Produtos cadastrados"));

var produtos = [];
var linhaHtml;
var pedidoVazio = '<tr><td colspan="5">Nenhum produto encontrado!</td></tr>';
var linhaCinza = '<tr><td colspan="5" class="fundoList"></td></tr>';


$("#buscar").click(function(){
	carregarLoading("block");
	
	var nome = $("#nomeBusca").val();
	
	$.ajax({
		url: '/produtosCadastrados/buscar/' + nome,
		type: 'GET'
	}).done(function(e){
		
		produtos = e;
		linhaHtml = '';
		if(produtos.length == 0) {
			$("#todosProdutos").html(pedidoVazio);
		} else {
			for(produto of produtos) {
				linhaHtml += '<tr>'
							+'<td>' + produto.codigoBusca + '</td>'
							+'<td>' + produto.nomeProduto + '</td>'
							+'<td>R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
							+'<td>R$ ' + parseFloat(produto.custo).toFixed(2) + '</td>'
				
							+ '<td><div class="row">'
								+ '<div class="col-md-1">'
									+'<a title="Ver">'
										+'<button class="botao" onclick="verProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-search"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
			
								+ '<div class="col-md-1">'
									+'<a title="Editar">'
										+'<button class="botao" onclick="editarProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-edit"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
				
								+ '<div class="col-md-1">'
									+'<a title="Excluir">'
										+'<button class="botao" onclick="excluirProduto()" value="'+ produto.id + '">'
											+'<i class="fas fa-trash"></i>'
										+'</button>'
									+'</a>'
								+'</div>'
							+ '</div>'
						+ '</td></tr>'
					+ linhaCinza;
			}
			$("#todosProdutos").html(linhaHtml);
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
		
	linhaHtml = '<table><tr>'
					+ '<td><h4>Codigo</h4></td>'
					+ '<td><h4>Nome</h4></td>'
					+ '<td><h4>Preço</h4></td>'
					+ '<td><h4>Setor</h4></td>'
					+ '<td><h4>Descrição</h4></td>'
				+ '</tr>'
	
				+ '<tr>'
					+ '<td>' + produtos[idBusca].codigoBusca + '</td>'
					+ '<td>' + produtos[idBusca].nomeProduto + '</td>'
					+ '<td>' + produtos[idBusca].preco + '</td>'
					+ '<td>' + produtos[idBusca].setor + '</td>'
					+ '<td>' + produtos[idBusca].descricao + '</td>'
				+ '</tr>'
			+ '</table>';
	
	$.alert({
		type: 'blue',
	    title: 'Produto:' + produtos[idBusca].nomeProduto,
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
	    title: 'Produto: ' + produtos[idBusca].nomeProduto,
	    content: 'Tenha certeza do que você está fazendo!<br>',
	    buttons: {
	        confirm: {
	            text: 'Editar produto',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					window.location.href = "/cadastroProduto/editar/" + idProduto.toString();
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
	    title: 'Produto: ' + produtos[idBusca].nomeProduto,
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
										url: "/verpedido/autenticado"
									}).done(function(e){
										if(e[0].authority === "ADM" || e[0].authority === "DEV") {
											if(apagarSim === 'sim' || apagarSim === 'SIM') {
												
												$.ajax({
													url: "/produtosCadastrados/excluirProduto/" + idProduto.toString(),
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
																	window.location.href = "/produtosCadastrados";
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
