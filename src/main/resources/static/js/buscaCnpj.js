// Método para consultar o CEP
$('#buscarCnpj').on('click', function(){

    $(this).attr("disabled", true);
    
	if($.trim($("#cnpj").cleanVal()) != ""){
		carregarLoading("block");
		
		$.ajax({
			url: "https://www.receitaws.com.br/v1/cnpj/" + $("#cnpj").cleanVal(),
			type: "GET",
			dataType : 'jsonp',
			contentType: "application/json",
			
		}).done(function(e){
			//empresa
			$("#empresa").val(e.nome);
			$("#estabelecimento").val(e.fantasia);
			$("#cel").val(e.telefone);
			
			//endereco
			$("#cep").val(e.cep.replace("-","").replace(".",""));
			$("#rua").val(e.logradouro);
			$("#n").val(e.numero);
			$("#bairro").val(e.bairro);
			$("#cidade").val(e.municipio);
			$("#email").val(e.email);
			
			carregarLoading("none");
		}).fail(function(){
			carregarLoading("none");
		});
	}			
	setTimeout(() => { 
		$(this).attr("disabled", false);
	}, 10000);
    
});


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
