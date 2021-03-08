
var dia = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="5" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="5">Nenhum dia em aberto!</td></tr>';

$(document).ready(() => $("#nomePagina").text("Dias em aberto"));


$.ajax({
	url: "/menu/diaAberto",
	type: 'GET'
}).done(function(e){
	dias = e;
	linhaHtml = "";

	if(dias.length > 1){
		$("#divAlertDias").show('slow');
	}
});	


$("#mostrarDias").click(event =>{
	event.preventDefault();
	linhaHtml = 'Novo Pedido -> Finlizar: Finalize todos os pedidos.'
				+ '<br>Resumo diário -> Fechamento: lance o troco final.<br>'
				+ '<table class="table table-striped table-hover">';
				
	for(dia of dias){
		linhaHtml += '<tr>'
						+ '<td class="text-center col-md-1">' + dia.data.split('-')[2] + '/' + dia.data.split('-')[1] + '/' + dia.data.split('-')[0] + '</td>'
						+ '<td class="text-center col-md-1"><button class="btn btn-primary" onclick="acessarDiaAberto(\'' + dia.data + '\')">Acessar</button></td>'
					+ '</tr>';
	}
	linhaHtml += '</table>';
	
	$.alert({
		type: 'red',
		title: 'Dias em aberto',
		content: linhaHtml,
		closeIcon: true,
		buttons: {
			confirm: {
				isHidden: true,
				keys: ['esc', 'enter']
			}
		}
	});
});


//-----------------------------------------------------
function acessarDiaAberto(data){
	carregarLoading("block");
	//alterar data
	$.ajax({
		url: '/menu/acessarData/' + data,
		type: 'GET'
	}).done(function(){
		window.location.href = "/menu"
	}).fail(function(){
		carregarLoading("none");
		
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Escolha uma data!",
			buttons: {
				confirm: {
					text: 'Tentar novamente',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	});
}


//-------------------------------------------------------------------------
function aviso() {
	
	$.alert({
		type: 'red',
	    title: 'Alerta!',
	    content: "Acesse o dia que não foi finalizado corretamente através do menu e faça o processo de:<br>- fechamento de dia ou<br>- Adicione troco inicial para corrigir seus dados.",
	    buttons: {
	        confirm: {
				text: 'Ok',
	    		keys: ['enter','esc'],
	            btnClass: 'btn-danger'
			},
		}
	});
};


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
