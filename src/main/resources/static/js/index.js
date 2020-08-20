$("#enviarLogin").click(function(){
	
	if($("#email").val() == "" && $("#senha").val() == "") {
	$("#esconderLogin").hide('slow');
	
		$.alert({
			type: 'green',
			title: 'Data de acesso',
			content: 'Dia: dd/mm/aaaa<br><input type="data" name="data" id="data" placeholder="Digite a data de acesso" />',
			buttons: {
		        confirm: {
		            text: 'Acessar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						window.location.href = "/menu";
					}
				}
			}
		});
	}else {
		$.alert({
			type: 'red',
			title: 'Senha incorreta',
			content: 'Tente novamente!',
		})
	}
});