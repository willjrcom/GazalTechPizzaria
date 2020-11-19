var empresa = {};

//---------------------------------------------------
$.ajax({
	url: "/adm/empresa/editar",
	type: 'GET',
}).done(function(e){
	
	if(e.length != 0) {

		empresa = e;
		
		//empresa
		$("#estabelecimento").val(empresa.nomeEstabelecimento);
		$("#empresa").val(empresa.nomeEmpresa);
		$("#email").val(empresa.email);
		$("#horaExtra").val(empresa.horaExtra);
		$("#cel").val(empresa.celular);
		$("#cnpj").val(empresa.cnpj);
		$("#mesa").val(empresa.mesa);
		
		//impressao
		if(empresa.impressoraOnline == 1) $("#impressoraOnline").prop("checked", true);
		else $("#impressoraOnline").prop("checked", false);
		
		if(empresa.impressoraOnline == 1) $("#impressoraOnline").prop("checked", true);
		else $("#impressoraOnline").prop("checked", false);
		
		$("#texto1").val(empresa.texto1);
		$("#texto2").val(empresa.texto2);
		$("#promocao").val(empresa.promocao);
		
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
	empresa.cnpj = $("#cnpj").val();
	empresa.mesa = $("#mesa").val();
	empresa.funcionamento = $("#dia1").val() + $("#dia2").val()
	
	//impressao
	empresa.texto1 = $("#texto1").val();
	empresa.texto2 = $("#texto2").val();
	empresa.promocao = $("#promocao").val();
	
	if($("#imprimir:checked").val() == 'on') empresa.imprimir = true;
	else empresa.imprimir = false;
	
	if($("#impressoraOnline:checked").val() == 'on') empresa.impressoraOnline = true;
	else empresa.impressoraOnline = false;
	
	//endereco
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
							url: "/adm/empresa/atualizar",
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