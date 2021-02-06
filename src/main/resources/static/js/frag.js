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
function ajuda() {
	$.alert({
		type:'blue',
		title: 'Suporte',
		content:'Caso ocorra algum erro no sistema envie um email para os desenvolvedores: '
			+ '<br><a href="mailto:williamjunior67@gmail.com?subject=Preciso%20de%20ajuda">Enviar email</a>'
			+ '<br><br>Ou envie uma mensagem atraves do nosso whatsapp: '
			+ '<br><a href="https://api.whatsapp.com/send/?phone=5511963849111&text=Preciso+de+ajuda+com+meu+sistema+para+pizzaria&app_absent=0"> Enviar mensagem</a>'
			+ '<br><br><i class="fab fa-instagram"></i> Acesse nossa página instagram: '
			+ '<br><a href="https://www.instagram.com/gazal.tech">Acessar</a>',
		buttons:{
			confirm:{
				text:'Voltar!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//---------------------------------------------------------------
$(document).ready(function(){

	$.ajax({
		url: "/menu/autenticado"
	}).done(function(e){
		$("#usuario").html('<i class="fas fa-user-circle"></i> ' + e);
	});
	
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'GET'
	}).done(function(e){
		if(e.length != 0) $("title").text($("title").text() + " - " + e.nomeEstabelecimento);
	});
	
});