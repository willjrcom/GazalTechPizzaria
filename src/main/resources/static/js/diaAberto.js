
var dia = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="5" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="5">Nenhum Funcinário encontrado!</td></tr>';

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosFuncionarios").html(linhaCinza);

$.ajax({
	url: "/diaAberto/todosDias",
	type: 'PUT'
})
.done(function(e){
	console.log(e);

	for(var i = 0; i< e.length; i++){
		dia.unshift({
			'id' : e[i].id,
			'data' : e[i].data,
			'trocoInicio' : e[i].trocoInicio,
			'trocoFinal': e[i].trocoFinal
		});
	}
	$("#todosFuncionarios").html("");
	linhaHtml = "";
	
	if(dia.length == 0){
		$("#todosFuncionarios").html(pedidoVazio);
	}else{
		for(var i = 0; i<dia.length; i++){
			linhaHtml += '<tr>'
							+ '<td>' + dia[i].id + '</td>'
							+ '<td>' + dia[i].data.split('-')[2] + '/' + dia[i].data.split('-')[1] + '/' + dia[i].data.split('-')[0] + '</td>'
							+ '<td>R$ ' + dia[i].trocoInicio.toFixed(2) + '</td>'
							+ '<td>' + dia[i].trocoFinal.toFixed(2) + '</td>'
							+ '<td>'
								+'<a>'
								+ '<button type="button" title="Adicionar Horas" onclick="addHoras()" class="botao"'
								+ 'value="'+ dia[i].id + '"><span class="oi oi-pencil"></span></button>'
								+'</a>'
							+'</td>'
						+ '</tr>'
							+ linhaCinza;
		}
		
		$("#todosFuncionarios").html(linhaHtml);
	}
});	


//-------------------------------------------------------------------------
function addHoras() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<dia.length; i++){//buscar dados completos do pedido enviado
		if(dia[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	
	$.alert({
		type: 'green',
	    typeAnimated: true,
	    title: 'Funcionário: ' + dia[idBusca].data.split('-')[2] + '/' + dia[idBusca].data.split('-')[1] + '/' + dia[idBusca].data.split('-')[0],
	    content: "Acesse o dia que não foi finalizado corretamente através do menu e faça o processo de fechamento de dia ou troco inicial para corrigir seus dados!",
	    buttons: {
	        confirm: {
				text: 'Ok',
	    		keys: ['enter','esc'],
	            btnClass: 'btn-green'
			},
		}
	});
};