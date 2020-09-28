var cliente = {};
var url_atual = window.location.href;

var celular = url_atual.split("/")[4];
celular = parseInt(celular);
url_atual = url_atual.split("/")[5];

if(celular % 2 == 1 || celular % 2 == 0) {
	$("#cel").val(celular);
}
if(typeof url_atual == "undefined") {
	$("#atualizar").hide();
}else {
	$("#divCpf").hide();
	$("#enviar").hide();
	urlEnviar = "/cadastroCliente/editarCliente/" + url_atual;
	
	$.ajax({
		url: urlEnviar,
		type: 'PUT',
	}).done(function(e){
		
		cliente.id = e.id;
		cliente.nome = e.nome;
		cliente.cpf = e.cpf;
		cliente.celular = e.celular;
		
		cliente.endereco = {};
		cliente.endereco.id = e.endereco.id;
		id_endereco = e.endereco.id;
		cliente.endereco.cep = e.endereco.cep;
		cliente.endereco.rua = e.endereco.rua;
		cliente.endereco.n = e.endereco.n;
		cliente.endereco.bairro = e.endereco.bairro;
		cliente.endereco.cidade = e.endereco.cidade;
		cliente.endereco.referencia = e.endereco.referencia;
		cliente.endereco.taxa = e.endereco.taxa;
		
		
		//cliente
		$("#id").val(cliente.id);
		$("#nome").val(cliente.nome);
		$("#cel").val(cliente.celular);
		$("#cpf").val(cliente.cpf);
		
		//endereco
		$("#cep").val(cliente.endereco.cep);
		$("#rua").val(cliente.endereco.rua);
		$("#n").val(cliente.endereco.n);
		$("#bairro").val(cliente.endereco.bairro);
		$("#cidade").val(cliente.endereco.cidade);
		$("#referencia").val(cliente.endereco.referencia);
		$("#taxa").val(cliente.endereco.taxa);
		
	}).fail(function(){
		$.alert("Cliente não encontrado!");
	});
}


//---------------------------------------------------------------
function setCliente() {
	cliente.nome = $("#nome").val();
	cliente.celular = $("#cel").cleanVal();
	cliente.cpf = $("#cpf").val();
	
	cliente.endereco = {};
	cliente.endereco.cep = $("#cep").val();
	cliente.endereco.rua = $("#rua").val();
	cliente.endereco.n = $("#n").val();
	cliente.endereco.bairro = $("#bairro").val();
	cliente.endereco.cidade = $("#cidade").val();
	cliente.endereco.referencia = $("#referencia").val();
	cliente.endereco.taxa = $("#taxa").val();
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	cliente = {};
	
	if($("#nome").val() != '' 
	&& $("#cel").val() != ''
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != '') {
		
		setCliente();
		
		$.confirm({
			type: 'green',
		    title: 'Cliente: ' + $("#nome").val().split(' ')[0],
		    content: 'Cadastrar cliente?',
		    buttons: {
		        confirm: {
		            text: 'Cadastrar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            content: "Deseja enviar?",
		            action: function(){
						$.ajax({
							url: "/cadastroCliente/cadastrar",
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Cliente cadastrado",
								buttons: {
							        confirm: {
							            text: 'Novo pedido',
							            btnClass: 'btn-green',
							            keys: ['esc','enter'],
							            action: function(){
											window.location.href = "/novoPedido/" + $("#cel").cleanVal();
										}
									},
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Cliente não cadastrado!"
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


//---------------------------------------------------------------------------------------
$("#atualizar").click(function() {
	
	if($("#nome").val() != '' 
	&& $("#cel").val() != ''
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != '') {
		
		setCliente();
		cliente.endereco.id = id_endereco;
		
		$.confirm({
			type: 'green',
		    title: 'Cliente: ' + cliente.nome,
			content: "Atualizar cliente?",
		    buttons: {
		        confirm: {
		            text: 'Atualizar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            content: "Deseja enviar?",
		            action: function(){
						$.ajax({
							url: "/cadastroCliente/atualizarCadastro/" + url_atual,
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Cliente Atualizado",
								buttons: {
							        confirm: {
							            text: 'Novo pedido',
							            btnClass: 'btn-green',
							            keys: ['enter'],
							            action: function(){
											window.location.href = "/novoPedido/" + $("#cel").cleanVal();
										}
									},
									cancel: {
										text: 'voltar a busca',
							            btnClass: 'btn-blue',
							            keys: ['esc'],
							            action: function(){
											window.location.href = "/clientesCadastrados";
										}
									}
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Cliente não atualizado!"
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