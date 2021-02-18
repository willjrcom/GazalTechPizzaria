
if(window.location.href.split("/")[3] == "login-erro" || window.location.href.split("/")[3] == "expired") {
	$("#erro").show('slow');
}

$("button").click(() => {
	$(".loading").css({
		"display": "block"
	});
});
			
			
$("#novaSenha").click(event => {
	event.preventDefault();
	
	$.confirm({
		type: 'blue',
		title: 'Enviar email de recuperação',
		content: 'Digite seu email:<br>'
				+ '<input class="form-control" id="novoEmail" />',
		buttons: {
			confirm:{
				text: 'Enviar email',
				btnClass: 'btn btn-success',
				keys: ['esc', 'enter'],
				action: function(){	
					var novoEmail = this.$content.find('#novoEmail').val();
					
					$.ajax({
						url: '/email/novaSenha/' + novoEmail.replace("/", ""),
						type: 'GET'
					}).done(() => alert("Funcionou")
					).fail(() => alert("Erro"));
				}
			}
		}
	})	
});
