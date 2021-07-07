
var compra = {};
var compras = [];
var Tcompras = '';

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
		compra.nome = $("#produto").val();
		compra.valor = $("#preco").val();
		
		$.ajax({
			url: '/adm/compras/comprar',
			type: 'POST',
			dataType : 'json',
			contentType: "application/json",
			data: JSON.stringify(compra)
		}).done(function(){
			dados();
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
						action: () => {
							$(".pula")[0].focus();
						}
					}
				}
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
	let total = 0;
	produtos = e;
	//se existir algum produto
	if(produtos.length != 0) {
		for(let produto of produtos) {
			Tcompras += '<tr>'
						+ '<td>' + produto.nome + '</td>'
						+ '<td>R$ ' + produto.valor.toFixed(2) + '</td>'
					+ '</tr>';
			total += produto.valor;
		}
	}

	if(Tcompras !== "") $("#compras").html(Tcompras);
	$("#total").html('<p class="text-center">R$ ' + total.toFixed(2) + '</p>');
	carregarLoading("none");
}


function imprimir(){
	carregarLoading("block");
	$.ajax({
		url: '/imprimir/compras'
	}).done(() => carregarLoading("none"));
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
