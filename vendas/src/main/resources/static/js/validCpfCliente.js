$("#avisoCpf").hide();
$("#avisoCel").hide();

// Método para consultar o CEP
$('#cpf').on('blur', function(){

	if($.trim($("#cpf").val()) != ""){
		
		var cpf = $(this).val();
		urlEnviar = "/cadastroCliente/buscarCpf/" + cpf;
		
		$.ajax({
			url:  urlEnviar,
			type: 'PUT',
				
		}).done(function(e){
			if(e.length != 0 && e != '') {
				$("#avisoCpf").show().css({
					'color': 'red'
				});
				$("#cpf").val('');
			}else {
				$("#avisoCpf").hide();
				$("#enviar").show();
			}
		});
	}			
});


//-----------------------------------------------------------------------------------------
$('#cel').on('blur', function(){

	if($.trim($("#cel").val()) != ""){
		if($("#id").val() == '') {
			var cel = $(this).cleanVal();
			
			//buscar cpf
			urlEnviar = "/cadastroCliente/buscarCelular/" + cel;
			
			$.ajax({
				url:  urlEnviar,
				type: 'PUT',
					
			}).done(function(e){
				if(e.length != 0) {
					$("#avisoCel").show().css({
						'color': 'red'
					});
					$("#enviar").hide();
				}else {
					$("#avisoCel").hide();
					$("#enviar").show();
				}
			});
		}
	}			
});
