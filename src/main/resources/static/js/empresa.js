var empresa = {};

//---------------------------------------------------
$.ajax({
	url: "/empresa/editar",
	type: 'PUT',
}).done(function(e){
	
	console.log(e);
	if(e.length != 0) {

		empresa.nomeEstabelecimento = e.nomeEstabelecimento;
		empresa.nomeEmpresa = e.nomeEmpresa;
		empresa.email = e.email;
		empresa.horaExtra = e.horaExtra;
		empresa.cnpj = e.cnpj;
		empresa.authentication = e.authentication;
		empresa.celular = e.celular;
		empresa.mesa = e.mesa;
		
		empresa.endereco = {};
		empresa.endereco.id = e.endereco.id;
		empresa.endereco.cep = e.endereco.cep;
		empresa.endereco.rua = e.endereco.rua;
		empresa.endereco.n = e.endereco.n;
		empresa.endereco.bairro = e.endereco.bairro;
		empresa.endereco.cidade = e.endereco.cidade;
		empresa.endereco.referencia = e.endereco.referencia;
		empresa.endereco.taxa = e.endereco.taxa;
		
		//empresa
		$("#estabelecimento").val(empresa.nomeEstabelecimento);
		$("#empresa").val(empresa.nomeEmpresa);
		$("#email").val(empresa.email);
		$("#horaExtra").val(empresa.horaExtra);
		$("#cel").val(empresa.celular);
		$("#authentication").val(empresa.authentication);
		$("#cnpj").val(empresa.cnpj);
		$("#mesa").val(empresa.mesa);
		
		//endereco
		$("#cep").val(empresa.endereco.cep);
		$("#rua").val(empresa.endereco.rua);
		$("#n").val(empresa.endereco.n);
		$("#bairro").val(empresa.endereco.bairro);
		$("#cidade").val(empresa.endereco.cidade);
		$("#referencia").val(empresa.endereco.referencia);	
	}
});



//---------------------------------------------------------------
function setEmpresa() {
	empresa.nomeEstabelecimento = $("#estabelecimento").val();
	empresa.nomeEmpresa = $("#empresa").val();
	empresa.email = $("#email").val();
	empresa.horaExtra = $("#horaExtra").val();
	empresa.celular = $("#cel").cleanVal();
	empresa.authentication = $("#authentication").val();
	empresa.cnpj = $("#cnpj").val();
	empresa.mesa = $("#mesa").val();
	
	empresa.endereco = {};
	empresa.endereco.cep = $("#cep").val();
	empresa.endereco.rua = $("#rua").val();
	empresa.endereco.n = $("#n").val();
	empresa.endereco.bairro = $("#bairro").val();
	empresa.endereco.cidade = $("#cidade").val();
	empresa.endereco.referencia = $("#referencia").val();
}

//---------------------------------------------------------------------------------------
$("#atualizar").click(function() {
	
	if($("#estabelecimento").val() != '' 
	&& $("#empresa").val() != ''
	&& $("#email").val() != ''
	&& $("#cnpj").val() != ''
	&& $("#authentication").val() != ''
	&& $("#mesa").val() != ''
	&& $("#cel").val() != ''
	&& $("#horaExtra").val() != ''
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != '') {
		
		setEmpresa();
		
		$.confirm({
			type: 'green',
		    title: 'Empresa: ' + empresa.nomeEmpresa,
			content: "Atualizar empresa?",
		    buttons: {
		        confirm: {
		            text: 'Atualizar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            content: "Deseja atualizar?",
		            action: function(){
						$.ajax({
							url: "/empresa/atualizar",
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(empresa)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Empresa Atualizado",
								buttons: {
							        confirm: {
							            text: 'Menu',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
											window.location.href = "/menu";
										}
									}
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Empresa não atualizado!"
							});
						});
					}
		        },
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
});