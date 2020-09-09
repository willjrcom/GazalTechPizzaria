
var produtos = [];
var linhaHtml= "";

linhaInput = '<div class="row">'
			+'<div class="col-md-4">'
				+'<input class="form-control" placeholder="Digite o nome do produto"/>'
			+'</div>'
			
			+'<div class="col-md-4">'
				+'<input class="form-control preco" placeholder="Digite o preco do produto"/>'
			+'</div>'
			
			+'<div class="col-md-4" align="left">'
				+'<button class="form-control btn btn-link" onclick="adicionar()"><span class="oi oi-plus"></span></button>'
			+'</div>'
		+'</div><hr>';
//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------

$("#compras").html(linhaInput);
$("#salvar").html('<button class="btn btn-success fRight">Salvar compras</button>');
//-------------------------------------------------------------------
function aviso() {
	$.alert({
		type:'blue',
		title:'Compras',
		content:'Para acessar e ver as compras feitas, é necessário adicionar o dia que a compra foi feita através do menu.',
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
function adicionar() {
	$("#compras").html($("#compras").html() + linhaInput);
}