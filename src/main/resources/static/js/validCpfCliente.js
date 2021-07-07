$("#avisoCpf").hide();
$("#avisoCel").hide();

var url_atual = window.location.href;
url_atual = url_atual.split("/")[4];

// Método para consultar o CEP
$('#cpf').on('blur', function(){

	if($.trim($("#cpf").val()) != ""){
		carregarLoading("block");
		
		var cpf = $(this).val();
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? '/f/cadastroCliente/buscarCpf/' + cpf + '/' + id
							: '/f/cadastroCliente/buscarCpf/' + cpf + '/-2',
			type: 'GET',
				
		}).done(function(e){
			if(e.length != 0 && e.id != -1) {
				$("#validCpf").val("0");
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

	if($.trim($("#cel").val()) != ""){
		carregarLoading("block");
		
		var cel = $(this).cleanVal();
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? '/f/cadastroCliente/buscarCelular/' + cel + '/' + id
							: '/f/cadastroCliente/buscarCelular/' + cel + '/-2',
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
