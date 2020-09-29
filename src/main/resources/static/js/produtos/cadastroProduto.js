var produto = {};
var url_atual = window.location.href;

url_atual = url_atual.split("/")[5];

if(typeof url_atual == "undefined") {
	$("#atualizar").hide();
}else {
	$("#enviar").hide();
	
	$.ajax({
		url: "/cadastroProduto/editarProduto/" + url_atual,
		type: 'PUT',
	}).done(function(e){
		
		produto.id = e.id;
		produto.codigoBusca = e.codigoBusca;
		produto.nomeProduto = e.nomeProduto;
		produto.preco = e.preco;
		produto.custo = e.custo;
		produto.setor = e.setor;
		produto.descricao = e.descricao;
		produto.disponivel = e.disponivel;
		
		//cliente
		$("#id").val(produto.id);
		$("#codigoBusca").val(produto.codigoBusca);
		$("#nomeProduto").val(produto.nomeProduto);
		$("#preco").val(produto.preco);
		$("#custo").val(produto.custo);
		$("#setor").val(produto.setor);
		$("#descricao").val(produto.descricao);

		
	}).fail(function(){
		$.alert("Erro, Produto não encontrado!");
	});
}


//---------------------------------------------------------------
function setProduto() {
	produto.codigoBusca = $("#codigoBusca").val();
	produto.nomeProduto = 	$("#nomeProduto").val();
	produto.preco = $("#preco").val();
	produto.custo = $("#custo").val();
	produto.setor = $("#setor").val();
	produto.descricao = $("#descricao").val();
	
	if($("#disponivel:checked").val() == 'on') {
		produto.disponivel = true;
	}else {
		produto.disponivel = false;
	}
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	produto = {};
	
	if($("#codigoBusca").val() != '' 
	&& $("#nomeProduto").val() != ''
	&& $("#preco").val() != ''
	&& $("#custo").val() != '') {
		
		setProduto();
		
		$.confirm({
			type: 'green',
		    title: 'Produto: ' + produto.nomeProduto,
		    content: 'Cadastrar produto?',
		    buttons: {
		        confirm: {
		            text: 'Cadastrar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
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
										text: 'Continuar cadastros',
							            btnClass: 'btn-blue',
							            keys: ['esc','enter'],
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
	&& $("#preco").val() != ''
	&& $("#custo").val() != '') {
		
		setProduto();
		
		$.confirm({
			type: 'green',
		    title: 'Produto: ' + produto.nomeProduto,
			content: "Atualizar cadastro?",
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
										text: 'voltar a busca',
							            btnClass: 'btn-blue',
							            keys: ['esc', 'enter'],
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


//----------------------------------------------------------------------------
function aviso() {
	$.alert({
		type: 'blue',
		title: 'Aviso!',
		content: 'O código de busca é utilizado para facilitar a busca do produto da tela de novo pedido.',
		buttons:{
			confirm:{
				text: 'Obrigado!',
				btnClass: 'btn-primary',
				keys: ['esc', 'enter']
			}
		}
	});
}


//----------------------------------------------------------------------------
function aviso1() {
	$.alert({
		type: 'blue',
		title: 'Aviso!',
		content: 'Apenas o setor (Pizza) aparece na tela de cozinha!',
		buttons:{
			confirm:{
				text: 'Obrigado!',
				btnClass: 'btn-primary',
				keys: ['esc', 'enter']
			}
		}
	});
}


//-----------------------------------------------------------------------------
function aviso2() {
	$.alert({
		type: 'blue',
		title: 'Aviso!',
		content: '- Este campo foi criado para esconder o produto do cardapio.'
			+ '<br><br>- Assim quando não estiver disponivel para venda, o cliente não pode ve-lo no tablet.'
			+ '<br><br>- Nem o funcionário na tela de novo pedido.',
		buttons:{
			confirm:{
				text: 'Obrigado!',
				btnClass: 'btn-primary',
				keys: ['esc', 'enter']
			}
		}
	});
}


//-----------------------------------------------------------------------------
function aviso3() {
	$.alert({
		type: 'blue',
		title: 'Aviso!',
		content: 'A descrição do produto pode ser vista na tela de cozinha ao clicar na [?].'
			+'<br><br>Assim o pizzaiolo terá agilidade para ver qual os ingredientes da pizza.',
		buttons:{
			confirm:{
				text: 'Obrigado!',
				btnClass: 'btn-primary',
				keys: ['esc', 'enter']
			}
		}
	});
}