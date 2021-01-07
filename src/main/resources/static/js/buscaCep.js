// Método para consultar o CEP
$('#cep').on('blur', function(){

	if($.trim($("#cep").val()) != ""){
		carregarLoading("block");
		
		$.ajax({
			url: "https://viacep.com.br/ws/" + +$("#cep").val() + "/json/"
			
		}).done(function(e){
			$("#rua").val(e.logradouro);
			$("#bairro").val(e.bairro);
			$("#cidade").val(e.localidade);
			carregarLoading("none");
		}).fail(function(){
			carregarLoading("none");
		});
	}			
});
	
	
function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}