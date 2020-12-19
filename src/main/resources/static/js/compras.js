
var compra = {};
var compras = [];
var Tcompras = '';

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
			
			$.ajax({
				url: '/adm/compras/comprar',
				type: 'PUT',
				dataType : 'json',
				contentType: "application/json",
				data: e,
			}).done(function(){
				
				$.alert({
					type: 'green',
					title: 'Sucesso',
					content: "Salvo com sucesso!",
					buttons: {
						confirm: {
							text: 'continuar',
							btnClass: 'btn-success',
							keys: ['esc', 'enter'],
							action: function(){
								document.location.reload(true);
							}
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
$(document).ready(function(){

	//buscar id da data
	$.ajax({
		url: '/adm/compras/dados',
		type: 'GET'
	}).done(function(e){

		Tcompras = '';
		var total = 0;

		//se existir algum produto
		if(e != "") {
			var produtos = JSON.parse(e);
			for(produto of produtos) {
				Tcompras += '<tr>'
							+ '<td>' + produto.produto + '</td>'
							+ '<td>R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
						+ '</tr>';
				total += parseFloat(produto.preco);
			}
		}else {
			Tcompras = '<tr><td colspan="2">Nenhuma compra feita nessa data</td></tr>';
		}

		$("#compras").html(Tcompras);
		$("#total").html('<p class="text-center">R$ ' + total.toFixed(2) + '</p>');
	});
});