//------------------------------------------------------------
function calendario() {
	$.alert({
		type:'blue',
		title: 'Calendário',
		content:'<input type="date"/>',
		buttons:{
			confirm:{
				text:'Obrigado!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//------------------------------------------------------------
function calculadora() {
	$.alert({
		type:'blue',
		title: 'Calculadora',
		content:'Em desenvolvimento',
		buttons:{
			confirm:{
				text:'aguarde!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//---------------------------------------------------------------
$(document).ready(function(){
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'GET'
	}).done(function(e){
		if(e.length != 0) $("title").text($("title").text() + " - " + e.nomeEstabelecimento);
	});
	
	$.ajax({
		url: '/menu/autenticado',
		type: 'GET'
	}).done(function(e){
		$("#usuario").html("&nbsp; <span class=\"oi oi-person\"></span> " + e + "&nbsp;");
	});
});