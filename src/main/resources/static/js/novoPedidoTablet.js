var produtos = [];
var linhaHtml = '';


//----------------------------------------------------------------
function mostrarOpcao(opcao) {
	
	$.ajax({
		url: '/novoPedidoTablet/escolher/' + opcao,
		type: 'PUT'
	}).done(function(e){
		produtos = e;
		console.log(e);
		linhaHtml = '<h4>'+ opcao +'</h4><hr>';
		
		for(produto of produtos) {
			linhaHtml += '<div class="blog-card">'
						+ '<div class="meta"><div class="photo" style="background-image: url(/img/mexicana.jpg)"></div></div>'
				  		+ '<div class="description">'
						+ '<h1>' + produto.nomeProduto +'</h1>';
						
						if(produto.descricao != '') {
							linhaHtml += '<p>' + produto.descricao + '</p>';
						}
						linhaHtml += '<p>R$ ' + parseFloat(produto.preco).toFixed(2) + '</p>'
									+ '<p class="read-more">'
								+ '<button class="btn" value="' + produto.id + '" onclick="adicionar()">+</button>'
							+ '</p>'
						+ '</div>'
					+ '</div>';
		}
		
		$("#cardapio").html(linhaHtml);
	}).fail(function(){
		$.alert({
			type: 'red',
			title: 'Sem sinal!',
			content: 'Conecte a internet ou chame o atendente.',
			buttons: {
				confirm: {
					text: 'Voltar',
					btnClass: 'btn-red',
				}
			}
		});
	});
}

mostrarOpcao('TODOS');

//-----------------------------------------------------------------
function adicionar() {

	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	var produto = {};
	
	$.ajax({
		url: '/novoPedidoTablet/bordas',
		type: 'PUT'
	}).done(function(e){
		console.log(e);
	});
	
	
	//quantidade
	var qtdHtml = '<label>Quantidade: <span id="qtd">1</span></label><br>'
				+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
					+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
					    + '<button type="button" onclick="qtdProduto(0.5)" class="btn btn-link">0.5</button>'
					    + '<button type="button" onclick="qtdProduto(1)" class="btn btn-link">1</button>'
					    + '<button type="button" onclick="qtdProduto(2)" class="btn btn-link">2</button>'
					    + '<button type="button" onclick="qtdProduto(3)" class="btn btn-link">3</button>'
					    + '<button type="button" onclick="qtdProduto(4)" class="btn btn-link">4</button>'
					    + '<button type="button" onclick="qtdProduto(5)" class="btn btn-link">5</button>'
				  + '</div>'
				+ '</div>';
	
	$.ajax({
		url: '/novoPedidoTablet/produto/' + idProduto,
		type: 'PUT'
	}).done(function(e){
		produto = e;
		console.log(produto);
		
		$.confirm({
			type: 'blue',
			title: produto.nomeProduto,
			content: qtdHtml,
			buttons: { 
				confirm: {
					text: 'Confirmar',
					btnClass: 'btn-success',
					keys: ['enter']
				},
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc']
				}
			}
		});
		
	});	
}


//---------------------------------------------------------------
function qtdProduto(qtd) {
	$("#qtd").text(qtd);
}