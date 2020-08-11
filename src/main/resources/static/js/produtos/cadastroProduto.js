var produto = {};
var url_atual = window.location.href;

url_atual = url_atual.split("/")[5];

if(typeof url_atual == "undefined") {
	console.log("nao existe");
	$("#atualizar").hide();
}else {
	$("#enviar").hide();
	console.log(url_atual);
	urlEnviar = "/cadastroProduto/editarProduto/" + url_atual;
	
	$.ajax({
		url: urlEnviar,
		type: 'PUT',
	}).done(function(e){
		console.log(e);
		
		produto.id = e.id;
		produto.codigoBusca = e.codigoBusca;
		produto.nomeProduto = e.nomeProduto;
		produto.preco = e.preco;
		produto.estoque = e.estoque;
		produto.setor = e.setor;
		produto.descricao = e.descricao;
		
		//cliente
		$("#id").val(produto.id);
		$("#codigoBusca").val(produto.codigoBusca);
		$("#nomeProduto").val(produto.nomeProduto);
		$("#preco").val(produto.preco);
		$("#estoque").val(produto.estoque);
		$("#setor").val(produto.setor);
		$("#descricao").val(produto.descricao);
		
	}).fail(function(){
		$.alert("Produto não encontrado!");
	});
}


//---------------------------------------------------------------
function setProduto() {
	produto.codigoBusca = $("#codigoBusca").val();
	produto.nomeProduto = 	$("#nomeProduto").val();
	produto.preco = $("#preco").val();
	produto.estoque = $("#estoque").val();
	produto.setor = $("#setor").val();
	produto.descricao = $("#descricao").val();
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	produto = {};
	
	if($("#codigoBusca").val() != '' 
	&& $("#nomeProduto").val() != ''
	&& $("#preco").val() != '') {
		
		setProduto();
		
		console.log(produto);
		
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Produto: ' + produto.nomeProduto,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            content: "Deseja enviar?",
		            action: function(){
						$.ajax({
							url: "/cadastroProduto/cadastrar",
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(produto)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Produto cadastrado",
								buttons: {
							        confirm: {
							            text: 'Novo pedido',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
											window.location.href = "/novoPedido";
										}
									},
									cancel: {
										text: 'Continuar cadastros',
							            btnClass: 'btn-blue',
							            keys: ['esc'],
							            action: function(){
											document.location.reload(true);
										}
									}
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Produto não cadastrado!"
							});
						});
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


//---------------------------------------------------------------------------------------
$("#atualizar").click(function() {
	
	if($("#codigoBusca").val() != '' 
	&& $("#nomeProduto").val() != ''
	&& $("#preco").val() != '') {
		
		setProduto();
		
		console.log(produto);
		
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Produto: ' + produto.nomeProduto,
			content: "Atualizar?",
		    buttons: {
		        confirm: {
		            text: 'Atualizar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            content: "Deseja enviar?",
		            action: function(){
						$.ajax({
							url: "/cadastroProduto/atualizarCadastro/" + url_atual,
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(produto)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Produto Atualizado",
								buttons: {
							        confirm: {
							            text: 'Novo pedido',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
											window.location.href = "/novoPedido";
										}
									},
									cancel: {
										text: 'voltar a busca',
							            btnClass: 'btn-blue',
							            keys: ['esc'],
							            action: function(){
											window.location.href = "/produtosCadastrados";
										}
									}
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Produto não atualizado!"
							});
						});
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