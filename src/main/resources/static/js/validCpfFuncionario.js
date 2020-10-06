$("#avisoCpf").hide();
$("#avisoCel").hide();

// Método para consultar o CEP
$('#cpf').on('blur', function(){
	
	if($("#cpf").val() != ''){
		
		var cpf = $(this).val();
		
		$.ajax({
			url:  "/cadastroFuncionario/buscarCpf/" + cpf + '/' + $("#id").val(),
			type: 'PUT',
				
		}).done(function(e){
			console.log(e);
			if(e.length != 0 && e != '' && e.id != -1) {
				$("#avisoCpf").show().css({
					'color': 'red'
				});
				$("#cpf").css({
					'border':'1px solid red'
				});
				$("#enviar").hide();
			}else {
				$("#avisoCpf").hide();
				$("#enviar").show();
				$("#cpf").css({
					'border':'1px solid #ccc'
				});
			}
		});
	}			
});


//-----------------------------------------------------------------------------------------
$('#cel').on('blur', function(){

	if($.trim($("#cel").val()) != ''){
		var cel = $(this).val();
		
		//buscar cpf
		urlEnviar = "/cadastroFuncionario/buscarCelular/" + cel + '/' + $("#id").val();
		
		$.ajax({
			url:  urlEnviar,
			type: 'PUT',
				
		}).done(function(e){
			console.log(e);
			if(e.length != 0 && e.id != -1) {
				$("#avisoCel").show().css({
					'color': 'red'
				});
				$("#cel").css({
					'border':'1px solid red'
				});
				$("#enviar").hide();
			}else {
				$("#avisoCel").hide();
				$("#enviar").show();
				$("#cel").css({
					'border':'1px solid #ccc'
				});
			}
		});
	}			
});

