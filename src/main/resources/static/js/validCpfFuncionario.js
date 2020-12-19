
$("#avisoCpf").hide();
$("#avisoCel").hide();

// Método para consultar o CPF
$('#cpf').on('blur', function(){

	if($("#cpf").val() != ''){
		
		var cpf = $("#cpf").val();
		var id = $("#id").val();	
		
		$.ajax({
			url:  (id != '') ? "/adm/cadastroFuncionario/buscarCpf/" + cpf.toString() + '/' + id 
							: "/adm/cadastroFuncionario/buscarCpf/" + cpf.toString() + '/-2',
			type: 'GET'
		}).done(function(event){
			if(event.length != 0 && event != '' && event.id != -1) {
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
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? "/adm/cadastroFuncionario/buscarCelular/" + cel.toString() + '/' + id 
							: "/adm/cadastroFuncionario/buscarCelular/" + cel.toString() + '/-2',
			type: 'GET',
				
		}).done(function(e){
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

