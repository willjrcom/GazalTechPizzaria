// Método para consultar o CEP
$('#cep').on('blur', function(){

	if($.trim($("#cep").val()) != ""){
		$.ajax({
			url: "https://viacep.com.br/ws/" + +$("#cep").val() + "/json/"
			
		}).done(function(e){
			console.log(e);
			$("#rua").val(e.logradouro);
			$("#bairro").val(e.bairro);
			$("#cidade").val(e.localidade);
			
		}).fail(function(){
			$.alert("Cep não encontrado!");
		});
	}			
});
	