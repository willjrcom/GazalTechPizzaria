 	// Método para consultar o CEP
	$('#cep').on('blur', function(){

		if($.trim($("#cep").val()) != ""){
			//$.getScript("http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+$("#cep").val(), function(){
			
			$.ajax({
				url: "https://viacep.com.br/ws/" + +$("#cep").val() + "/json/"
				
			}).done(function(e){
				console.log(e);
				$("#rua").val(e.logradouro);
				$("#bairro").val(e.bairro);
				$("#cidade").val(e.localidade);
				
			}).fail(function(){
				$.alert("falhou!");
			});
			
			/*
			$.getScript("https://viacep.com.br/ws/" + +$("#cep").val() + "/json/", function(){
			  	if(resultadoCEP["resultado"]){
					$("#rua").val(unescape(resultadoCEP["tipo_logradouro"])+" "+unescape(resultadoCEP["logradouro"]));
					$("#bairro").val(unescape(resultadoCEP["bairro"]));
					$("#cidade").val(unescape(resultadoCEP["cidade"]));
					$("#uf").val(unescape(resultadoCEP["uf"]));
				}
			});			
			*/	
		}			
	});
	