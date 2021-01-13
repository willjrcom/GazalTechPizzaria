var produto = {};
var url_atual = window.location.href;

url_atual = url_atual.split("/")[5];

if(typeof url_atual != "undefined") {
	carregarLoading("block");
	
	$.ajax({
		url: "/cadastroProduto/editarProduto/" + url_atual,
		type: 'GET',
	}).done(function(e){
		
		produto = e;
		
		//cliente
		$("#id").val(produto.id);
		$("#codigoBusca").val(produto.codigoBusca);
		$("#nomeProduto").val(produto.nomeProduto);
		$("#preco").val(produto.preco);
		$("#custo").val(produto.custo);
		$("#setor").val(produto.setor);
		$("#descricao").val(produto.descricao);
		if(produto.disponivel == 1) $(".form-check-input").prop('checked', true);
		else $(".form-check-input").prop('checked', false);
		
		carregarLoading("none");
	}).fail(function(){
		carregarLoading("none");
		$.alert("Erro, Produto não encontrado!");
	});
}


//---------------------------------------------------------------
function setProduto() {
	produto.id = $("#id").val();
	produto.codigoBusca = $("#codigoBusca").val();
	produto.nomeProduto = 	$("#nomeProduto").val();
	produto.preco = $("#preco").val();
	produto.custo = $("#custo").val();
	produto.setor = $("#setor").val();
	produto.descricao = $("#descricao").val();
	
	if($(".form-check-input").prop("checked")) produto.disponivel = true;
	else produto.disponivel = false;
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	produto = {};
	if($("#codigoBusca").val() != '' 
	&& $("#nomeProduto").val() != ''
	&& $("#preco").val() != ''
	&& $("#custo").val() != ''
	&& $("#validCod").val() == 1) {
		
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
						carregarLoading("block");
		
						$.ajax({
							url: "/cadastroProduto/cadastrar",
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(produto)
							
						}).done(function(){
							carregarLoading("none");
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
											document.location.href = "/cadastroProduto";
										}
									}
								}
							});
						}).fail(function(){
							carregarLoading("none");
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Erro, Produto não cadastrado!"
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
	}else{
		$.alert({
			type: 'red',
			title: 'Aviso',
			content: "Preencha os campos corretamente!"
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
