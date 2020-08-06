 	// Método para consultar o CEP
	$('#cep').on('blur', function(){
 
		if($.trim($("#cep").val()) != ""){
			$.getScript("http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+$("#cep").val(), function(){
			  	if(resultadoCEP["resultado"]){
					$("#rua").val(unescape(resultadoCEP["tipo_logradouro"])+" "+unescape(resultadoCEP["logradouro"]));
					$("#bairro").val(unescape(resultadoCEP["bairro"]));
					$("#cidade").val(unescape(resultadoCEP["cidade"]));
					$("#uf").val(unescape(resultadoCEP["uf"]));
				}
			});				
		}			
	});