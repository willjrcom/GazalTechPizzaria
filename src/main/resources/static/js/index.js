var dia = {};

$("#enviarLogin").click(function(){
	
	if($("#email").val() == "" && $("#senha").val() == "") {
	$("#esconderLogin").hide('slow');
	
		$.alert({
			type: 'green',
			title: 'Data de acesso',
			content: 'Dia: dd/mm/aaaa<br><input type="date" name="data" id="data" placeholder="Digite a data de acesso" required/>',
			buttons: {
		        confirm: {
		            text: 'Acessar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						dia.data = this.$content.find('#data').val();
						
						$.ajax({
							url: '/index/data',
							data: dia
						}).done(function(){	
							window.location.href = "/menu";
						}).fail(function(){
							$.alert("Falha no acesso!");
						});
					}
				}
			}
		});
	}else {
		$.alert({
			type: 'red',
			title: 'Senha incorreta',
			content: 'Tente novamente!',
		});
	}
});