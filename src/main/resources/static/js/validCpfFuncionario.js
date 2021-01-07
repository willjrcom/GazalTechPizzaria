
$("#avisoCpf").hide();
$("#avisoCel").hide();

// Método para consultar o CPF
$('#cpf').on('blur', function(){

	if($("#cpf").val() != ''){
		carregarLoading("block");
		
		var cpf = $("#cpf").val();
		var id = $("#id").val();	
		
		$.ajax({
			url:  (id != '') ? "/adm/cadastroFuncionario/buscarCpf/" + cpf.toString() + '/' + id 
							: "/adm/cadastroFuncionario/buscarCpf/" + cpf.toString() + '/-2',
			type: 'GET'
		}).done(function(event){
			if(event.length != 0 && event != '' && event.id != -1) {
				$("#validCpf").val("1");
				$("#avisoCpf").show().css({
					'color': 'red'
				});
				$("#cpf").css({
					'border':'1px solid red'
				});
				$("#enviar").hide();
			}else {
				$("#validCpf").val("1");
				$("#avisoCpf").hide();
				$("#enviar").show();
				$("#cpf").css({
					'border':'1px solid #ccc'
				});
			}
			carregarLoading("none");
		}).fail(() => carregarLoading("none"));
	}			
});


//-----------------------------------------------------------------------------------------
$('#cel').on('blur', function(){
	
	if($.trim($("#cel").val()) != ''){
		carregarLoading("block");
		var cel = $(this).val();	
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? "/adm/cadastroFuncionario/buscarCelular/" + cel.toString() + '/' + id 
							: "/adm/cadastroFuncionario/buscarCelular/" + cel.toString() + '/-2',
			type: 'GET',
				
		}).done(function(e){
			if(e.length != 0 && e.id != -1) {
				$("#validCel").val("0");
				$("#avisoCel").show().css({
					'color': 'red'
				});
				$("#cel").css({
					'border':'1px solid red'
				});
				$("#enviar").hide();
			}else {
				$("#validCel").val("1");
				$("#avisoCel").hide();
				$("#enviar").show();
				$("#cel").css({
					'border':'1px solid #ccc'
				});
			}
			carregarLoading("none");
		}).fail(() => carregarLoading("none"));
	}			
});


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
