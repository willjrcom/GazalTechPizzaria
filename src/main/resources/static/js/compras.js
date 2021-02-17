
var compra = {};
var compras = [];
var Tcompras = '';
var linhaCinza = '<tr><td colspan="2" class="fundoList" ></td></tr>';

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Compras do dia"));


//-------------------------------------------------------------------
function aviso() {
	$.alert({
		type:'blue',
		title:'Compras',
		content:'Para acessar e ver as compras feitas, é necessário escolher o dia que a compra foi feita através do menu.',
		buttons:{
			confirm:{
				text:'Voltar',
				btnClass:'btn-success',
				keys:['enter','esc']
			}
		}
	});
}


//----------------------------------------------------------------
function salvar() {
	if($("#produto").val() != '' && $("#preco").val() != '') {
		$("#salvar").attr("disabled", true);
		carregarLoading("block");
		compra.produto = $("#produto").val();
		compra.preco = $("#preco").val();
		
			
		//buscar id da data
		$.ajax({
			url: '/adm/compras/dados',
			type: 'GET'
		}).done(function(e){
			
			if(e != "") compras = JSON.parse(e);
			compras.unshift(compra);
			e = JSON.stringify(compras);
			
			mostrarProdutos(e);
			
			$.ajax({
				url: '/adm/compras/comprar',
				type: 'PUT',
				dataType : 'json',
				contentType: "application/json",
				data: e,
			}).done(function(){
				carregarLoading("none");
				$("#produto").val("");
				$("#preco").val("");
				$("#salvar").attr("disabled", false);
				$.alert({
					type: 'green',
					title: 'Sucesso',
					content: "Salvo com sucesso!",
					buttons: {
						confirm: {
							text: 'continuar',
							btnClass: 'btn-success',
							keys: ['esc', 'enter'],
							action: () => $(".pula")[0].focus()
						}
					}
				});
			});
		});
	}else {
		$.alert({
			type: 'red',
			title: 'Atenção',
			content: "Campo Vazio, preencha corretamente",
			buttons: {
				confirm: {
					text: 'ok',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}
}


//---------------------------------------------------------------------------
function dados(){

	//buscar id da data
	$.ajax({
		url: '/adm/compras/dados',
		type: 'GET'
	}).done(function(e){
		mostrarProdutos(e);
	});
}
dados();


//----------------------------------------------------
function mostrarProdutos(e){
	Tcompras = '';
		var total = 0;

		//se existir algum produto
		if(e != "") {
			var produtos = JSON.parse(e);
			for(produto of produtos) {
				Tcompras += '<tr>'
							+ '<td class="text-center col-md-1">' + produto.produto + '</td>'
							+ '<td class="text-center col-md-1">R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
						+ '</tr>' + linhaCinza;
				total += parseFloat(produto.preco);
			}
		}

		if(Tcompras !== "") $("#compras").html(Tcompras);
		$("#total").html('<p class="text-center">R$ ' + total.toFixed(2) + '</p>');
		carregarLoading("none");
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
