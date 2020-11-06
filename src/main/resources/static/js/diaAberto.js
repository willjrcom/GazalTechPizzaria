
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
	dias = e;
	$("#todosFuncionarios").html("");
	linhaHtml = "";
	
	if(dias.length == 0){
		$("#todosFuncionarios").html(pedidoVazio);
	}else{
		for(dia of dias){
			linhaHtml += '<tr>'
							+ '<td>' + dia.id + '</td>'
							+ '<td>' + dia.data.split('-')[2] + '/' + dia.data.split('-')[1] + '/' + dia.data.split('-')[0] + '</td>'
							+ '<td>R$ ' + dia.trocoInicio.toFixed(2) + '</td>'
							+ '<td>' + dia.trocoFinal.toFixed(2) + '</td>'
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