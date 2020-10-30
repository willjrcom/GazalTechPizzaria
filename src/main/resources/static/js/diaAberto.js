
var dia = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="5" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="5">Nenhum dia em aberto!</td></tr>';

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosFuncionarios").html(linhaCinza);

$.ajax({
	url: "/adm/diaAberto/todosDias",
	type: 'PUT'
})
.done(function(e){
	dia = e;
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
						+ '</tr>'
					+ linhaCinza;
		}
		
		$("#todosFuncionarios").html(linhaHtml);
	}
});	


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