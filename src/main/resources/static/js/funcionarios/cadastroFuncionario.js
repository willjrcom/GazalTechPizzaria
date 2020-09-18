var funcionario = {};
var url_atual = window.location.href;

url_atual = url_atual.split("/")[5];

if(typeof url_atual == "undefined") {
	$("#atualizar").hide();
}else {
	$("#enviar").hide();
	$("#divCpf").hide();
	urlEnviar = "/cadastroFuncionario/editarFuncionario/" + url_atual;
	
	$.ajax({
		url: urlEnviar,
		type: 'PUT',
	}).done(function(e){
		
		//receber valores do servidor
		funcionario.id = e.id;
		funcionario.nome = e.nome;
		funcionario.email = e.email;
		funcionario.nascimento = e.nascimento;
		funcionario.cpf = e.cpf;
		funcionario.celular = e.celular;
		funcionario.cargo = e.cargo;
		funcionario.sexo = e.sexo;
		
		//endereco
		funcionario.endereco = {};
		id_endereco = e.endereco.id;
		funcionario.endereco.id = e.endereco.id;
		funcionario.endereco.cep = e.endereco.cep;
		funcionario.endereco.rua = e.endereco.rua;
		funcionario.endereco.n = e.endereco.n;
		funcionario.endereco.bairro = e.endereco.bairro;
		funcionario.endereco.cidade = e.endereco.cidade;
		funcionario.endereco.referencia = e.endereco.referencia;
		funcionario.endereco.taxa = e.endereco.taxa;
		
		//pagamento
		funcionario.admissao = e.admissao;
		funcionario.diaPagamento = e.diaPagamento;
		funcionario.salario = e.salario;
		
		//madar os valores para o front
		$("#id").val(funcionario.id);
		$("#nome").val(funcionario.nome);
		$("#email").val(funcionario.email);
		$("#nascimento").val(funcionario.nascimento);
		$("#cpf").val(funcionario.cpf);
		$("#cel").val(funcionario.celular);
		$("#cargo").val(funcionario.cargo);
		$("#sexo").val(funcionario.sexo);
		
		//endereco
		$("#cep").val(funcionario.endereco.cep);
		$("#rua").val(funcionario.endereco.rua);
		$("#n").val(funcionario.endereco.n);
		$("#bairro").val(funcionario.endereco.bairro);
		$("#cidade").val(funcionario.endereco.cidade);
		$("#referencia").val(funcionario.endereco.referencia);
		$("#taxa").val(funcionario.endereco.taxa);
		
		//pagamento
		$("#admissao").val(funcionario.admissao);
		$("#diaPagamento").val(funcionario.diaPagamento);
		$("#salario").val(funcionario.salario);
		
	}).fail(function(){
		$.alert("Funcionario não encontrado!");
	});
}


//---------------------------------------------------------------
function setFuncionario() {
	//funcionario
	funcionario.nome = $("#nome").val();
	funcionario.email = $("#email").val();
	funcionario.nascimento = $("#nascimento").val();
	funcionario.celular = $("#cel").val();
	funcionario.cpf = $("#cpf").val();
	funcionario.cargo = $("#cargo").val();
	funcionario.sexo = $("#sexo").val();
	
	//endereco
	funcionario.endereco = {};
	funcionario.endereco.cep = $("#cep").val();
	funcionario.endereco.rua = $("#rua").val();
	funcionario.endereco.n = $("#n").val();
	funcionario.endereco.bairro = $("#bairro").val();
	funcionario.endereco.cidade = $("#cidade").val();
	funcionario.endereco.referencia = $("#referencia").val();
	funcionario.endereco.taxa = $("#taxa").val();
	
	//pagamento
	funcionario.admissao = $("#admissao").val();
	funcionario.diaPagamento = $("#diaPagamento").val();
	funcionario.salario = $("#salario").val();
}


//---------------------------------------------------------------
$("#enviar").click(function() {
	funcionario = {};
	
	if($("#nome").val() != '' 
	&& $("#email").val() != ''
	&& $("#cel").val() != ''
	
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != ''
	
	&& $("#admissao").val() != ''
	&& $("#diaPagamento").val() != ''
	&& $("#salario").val() != '') {
		
		setFuncionario();
		
		$.confirm({
			type: 'green',
		    typeAnimated: true,
		    title: 'Funcionário: ' + $("#nome").val(),
            content: "Cadastrar funcionário?",
		    buttons: {
		        confirm: {
		            text: 'Cadastrar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						$.ajax({
							url: "/cadastroFuncionario/cadastrar",
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(funcionario)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Funcionário cadastrado",
								buttons: {
									confirmar: {
										text: 'Recarregar',
							            btnClass: 'btn-blue',
							            keys: ['esc', 'enter'],
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
								content: "Funcionário não cadastrado!"
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
	&& $("#email").val() != ''
	&& $("#cel").val() != ''
	&& $("#cargo").val() != ''
	&& $("#sexo").val() != ''
	
	
	&& $("#cep").val() != ''
	&& $("#rua").val() != ''
	&& $("#n").val() != ''
	&& $("#bairro").val() != ''
	&& $("#cidade").val() != ''
	
	&& $("#admissao").val() != ''
	&& $("#diaPagamento").val() != ''
	&& $("#salario").val() != '') {
		
		setFuncionario();
		funcionario.endereco.id = id_endereco;
		
		$.confirm({
			type: 'green',
		    title: 'Funcionário: ' + funcionario.nome,
			content: "Atualizar cadastro?",
		    buttons: {
		        confirm: {
		            text: 'Atualizar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						$.ajax({
							url: "/cadastroFuncionario/atualizarCadastro/" + url_atual,
							type: 'PUT',
							dataType: "json",
							contentType:'application/json',
							data: JSON.stringify(funcionario)
							
						}).done(function(e){
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: "Funcionário Atualizado",
								buttons: {
									cancel: {
										text: 'voltar a busca',
							            btnClass: 'btn-blue',
							            keys: ['esc', 'enter'],
							            action: function(){
											window.location.href = "/funcionariosCadastrados";
										}
									}
								}
							});
							
							
						}).fail(function(e){
							$.alert({
								type: 'red',
								title: 'Aviso',
								content: "Funcionário não atualizado!"
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