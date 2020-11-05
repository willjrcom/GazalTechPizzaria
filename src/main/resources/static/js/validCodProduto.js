$("#avisoCod").hide();

// Método para consultar o CEP
$('#codigoBusca').on('blur', function(){

	if($.trim($("#codigoBusca").val()) != ""){

		var cod = $(this).val();
		var id = $("#id").val();
		
		$.ajax({
			url:  (id != '') ? "/cadastroProduto/buscarCodigo/" + cod + '/' + id : "/cadastroProduto/buscarCodigo/" + cod + '/-2',
			type: 'PUT',
		}).done(function(e){
			if(e.length != 0 && e != '' && e.id != -1) {
				$("#avisoCod").show().css({
					'color': 'red'
				});
				$("#codigoBusca").css({
					'border':'1px solid red'
				});
			}else {
				$("#avisoCod").hide();
				$("#enviar").show();
				$("#codigoBusca").css({
					'border':'1px solid #ccc'
				});
			}
		});
	}			
});
