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
						+ '<h1>' + produto.nomeProduto +'</h1>'
							+ '<p>' + produto.descricao + '</p>'
							+ '<p>R$ ' + parseFloat(produto.preco).toFixed(2) + '</p>'
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
	$.alert("Adicionou");
}
