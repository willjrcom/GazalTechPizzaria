$("#avisoCpf").hide();
$("#avisoCel").hide();

// Método para consultar o CEP
$('#cpf').on('blur', function(){
	console.table($("#foto").val());
	
	if($("#cpf").val() != ''){
		
		var cpf = $(this).val();
		urlEnviar = "/cadastroFuncionario/buscarCpf/" + cpf;
		
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

	if($.trim($("#cel").val()) != ''){
		if($("#id").val() == '') {
			var cel = $(this).val();
			
			//buscar cpf
			urlEnviar = "/cadastroFuncionario/buscarCelular/" + cel;
			
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

