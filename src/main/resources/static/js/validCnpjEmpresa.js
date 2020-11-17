$("#avisoCnpj").hide();
$("#avisoCel").hide();

// Método para consultar o CEP
$('#cnpj').on('blur', function(){

	if($("#cnpj").val() != ''){
		
		var cpf = $(this).val();
		urlEnviar = "/cadastroEmpresa/buscarCnpj/" + cpf;
		
		$.ajax({
			url:  urlEnviar,
			type: 'GET',
				
		}).done(function(e){
			if(e.length != 0 && e != '') {
				$("#avisoCnpj").show().css({
					'color': 'red'
				});
				$("#cnpj").val('');
			}else {
				$("#avisoCnpj").hide();
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
			urlEnviar = "/cadastroEmpresa/buscarCelular/" + cel;
			
			$.ajax({
				url:  urlEnviar,
				type: 'GET',
					
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

/*
var token = "36C6B9E3-5910-4A62-B04B-1B52B5652927";
var cpf = $("#cpf").val();
var nascimento = "26012000";
var plugin = "CPF";
$.ajax({
	method: 'GET',
	url: "https://www.sintegraws.com.br/api/v1/execute-api.php?token=" + token 
	+ "&cpf=" + cpf 
	+ "&data-nascimento=" + nascimento 
	+ "&plugin=" + plugin,
	
}).done(function(e){
	
}).fail(function(){
	$.alert("Cpf não encontrado!");
});
*/
