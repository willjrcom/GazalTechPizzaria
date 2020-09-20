$("#avisoCod").hide();

// Método para consultar o CEP
$('#codigoBusca').on('blur', function(){

	if($.trim($("#codigoBusca").val()) != ""){
		
		var cpf = $(this).val();
		urlEnviar = "/cadastroProduto/buscarCodigo/" + cpf;
		
		$.ajax({
			url:  urlEnviar,
			type: 'PUT',
				
		}).done(function(e){
			if(e.length != 0 && e != '') {
				$("#avisoCod").show().css({
					'color': 'red'
				});
				$("#codigoBusca").val('');
			}else {
				$("#avisoCod").hide();
				$("#enviar").show();
			}
		});
	}			
});
