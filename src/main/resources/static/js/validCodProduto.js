$("#avisoCod").hide();

// Método para consultar o CEP
$('#codigoBusca').on('blur', function(){

	if($.trim($("#codigoBusca").val()) != ""){
		carregarLoading("block");
		
		var cod = $(this).val();
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? "/cadastroProduto/buscarCodigo/" + cod + '/' + id : "/cadastroProduto/buscarCodigo/" + cod + '/-2',
			type: 'GET',
		}).done(function(e){
			if(e.length != 0 && e != '' && e.id != -1) {
				$("#validCod").val("0");
				$("#avisoCod").show().css({
					'color': 'red'
				});
				$("#enviar").hide();
				$("#codigoBusca").css({
					'border':'1px solid red'
				});
			}else {
				$("#validCod").val("1");
				$("#avisoCod").hide();
				$("#enviar").show();
				$("#codigoBusca").css({
					'border':'1px solid #ccc'
				});
			}
			carregarLoading("none");
		});
	}			
});


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
