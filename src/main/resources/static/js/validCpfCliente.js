$("#avisoCpf").hide();
$("#avisoCel").hide();

var url_atual = window.location.href;
url_atual = url_atual.split("/")[4];

// Método para consultar o CEP
$('#cpf').on('blur', function(){

	if($.trim($("#cpf").val()) != ""){
		
		var cpf = $(this).val();
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? '/cadastroCliente/buscarCpf/' + cpf + '/' + id : '/cadastroCliente/buscarCpf/' + cpf + '/-2',
			type: 'GET',
				
		}).done(function(e){
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

	if($.trim($("#cel").val()) != ""){
		var cel = $(this).cleanVal();
		var id = $("#id").val();
		$.ajax({
			url:  (id != '') ? '/cadastroCliente/buscarCelular/' + cel + '/' + id.toString() : '/cadastroCliente/buscarCelular/' + cel + '/0',
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
