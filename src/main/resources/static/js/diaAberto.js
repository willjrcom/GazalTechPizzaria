
var dia = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="5" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="5">Nenhum dia em aberto!</td></tr>';

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Dias em aberto"));


$.ajax({
	url: "/adm/diaAberto/todosDias",
	type: 'GET'
}).done(function(e){
	dias = e;
	$("#todosFuncionarios").html("");
	linhaHtml = "";
	
	if(dias.length == 0){
		$("#todosFuncionarios").html(pedidoVazio);
	}else{
		for(dia of dias){
			linhaHtml += '<tr>'
							+ '<td class="text-center col-md-1">' + dia.data.split('-')[2] + '/' + dia.data.split('-')[1] + '/' + dia.data.split('-')[0] + '</td>'
							+ '<td class="text-center col-md-1">R$ ' + dia.trocoFinal.toFixed(2) + '</td>'
							+ '<td class="text-center col-md-1"><button class="btn btn-primary" onlick="escolherData()">Acessar</button></td>'
						+ '</tr>'
					+ linhaCinza;
		}
		
		$("#todosFuncionarios").html(linhaHtml);
	}
	carregarLoading("none");
});	


//-----------------------------------------------------
function escolherData(){
	carregarLoading("block");
	console.log("rodou")
	//alterar data
	$.ajax({
		url: '/menu/verificarData/' + data,
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
