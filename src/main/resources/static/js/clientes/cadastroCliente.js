var cliente = {};
var endereco = [];

$("#enviar").click(function() {
	cliente = {};
	endereco = [];
	
	if($("#nome").val() != '' 
	&& $("#cel").val() != ''
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != '') {
		
		cliente.nome = $("#nome").val();
		cliente.celular = $("#cel").val();
		cliente.cpf = $("#cpf").val();
		
		cliente.endereco = {};
		cliente.endereco.cep = $("#cep").val();
		cliente.endereco.rua = $("#rua").val();
		cliente.endereco.n = $("#n").val();
		cliente.endereco.bairro = $("#bairro").val();
		cliente.endereco.cidade = $("#cidade").val();
		cliente.endereco.referencia = $("#referencia").val();
		cliente.endereco.taxa = $("#taxa").val();
		
		console.log(cliente);
		
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Cliente: ' + $("#nome").val().split(' ')[0],
		    buttons: {
		        confirm: {
		            text: 'Enviar',
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
							            keys: ['enter'],
							            action: function(){
											window.location.href = "/novoPedido";
										}
									},
									cancel: {
										text: 'Continuar cadastros',
							            btnClass: 'btn-blue',
							            keys: ['esc'],
							            action: function(){
											document.location.reload(true);
										}
									}
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