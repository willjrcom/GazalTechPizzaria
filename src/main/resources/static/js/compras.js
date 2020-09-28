
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
		
		//buscar data
		$.ajax({
			url: '/menu/mostrarDia',
			type: 'PUT'
		}).done(function(e){
			
			//buscar id da data
			$.ajax({
				url: '/menu/verificarData/' + e.dia,
				type: 'PUT'
			}).done(function(e){
				
				if(JSON.parse(e.compras) != null) {
					compras = JSON.parse(e.compras);
				}
				
				compras.unshift(compra);
				console.table(compras);
				
				var id = JSON.parse(e.id);
				console.log(id);
				e.compras = JSON.stringify(compras);

				console.log(e);
				
				$.ajax({
					url: '/fechamento/finalizar/' + id,
					type: 'PUT',
					dataType : 'json',
					contentType: "application/json",
					data: JSON.stringify(e),
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

	//buscar data
	$.ajax({
		url: '/menu/mostrarDia',
		type: 'PUT'
	}).done(function(e){

		//buscar id da data
		$.ajax({
			url: '/menu/verificarData/' + e.dia,
			type: 'PUT'
		}).done(function(e){
			
			Tcompras = '';
			var produtos = JSON.parse(e.compras);

			//se existir algum produto
			if(produtos != null) {
				for(produto of produtos) {
					Tcompras += '<tr>'
								+ '<td>' + produto.produto + '</td>'
								+ '<td>R$ ' + parseFloat(produto.preco).toFixed(2) + '</td>'
							+ '</tr>';
				}
			}else {
				Tcompras = '<tr><td colspan="2">Nenhuma compra feita nessa data</td></tr>';
			}
			
			$("#compras").html(Tcompras);
		});
	});
});