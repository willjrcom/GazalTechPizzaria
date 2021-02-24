var confirmacao = 1;
var dados = {};


if(window.location.href.split("/")[3] === "novaSenha" 
	&& window.location.href.split("/")[4] === "auth"
	&& isNumber(window.location.href.split("/")[5])){
	$("#senhas").show("slow");	
}


function isNumber(str) {
    return !isNaN(parseFloat(str))
}


$(".pass").keyup(() => {
	if($("#senha").val() === $("#confirmar").val()){
		$("#avisoSenha").hide();
		$("#criar").show();
		$("#senha").css({
			'border':'1px solid #ccc'
		});
		$("#confirmar").css({
			'border':'1px solid #ccc'
		});
		confirmacao = 1;
	}else{
		$("#avisoSenha").show().css({
		'color': 'red'
		});
		$("#senha").css({
			'border':'1px solid red'
		});
		$("#confirmar").css({
			'border':'1px solid red'
		});
		confirmacao = 0;
	}
});

//-----------------------------------------------------------
$("#criar").click(function(){
	dados = {};
	dados.email = $("#email").text();
	dados.senha = $("#senha").val();

	if(confirmacao == 1 && dados.senha.length >= 4) {
		
		$.confirm({
			type: 'green',
			title: 'Alterar senha',
			content: 'Deseja continuar?',
			buttons:{
				confirm:{
					text: 'Sim',
					btnClass: 'btn-success',
					keys: ['enter'],
					action: function(){
						carregarLoading("block");
						
						$.ajax({
							url:'/novaSenha/criar',
							type: 'POST',
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(dados)
						}).done(function(){
							carregarLoading("none");
							$.alert({
								type: 'blue',
								title: 'Sucesso',
								content: "Senha alterada!",
								buttons: {
									confirm:{
										text: 'Login',
										btnClass: 'btn-success',
										keys: ['enter', 'esc'],
										action: function(){
											window.location.href = "/logout";
										}
									}
								}
							});
						}).fail(function(){
							$.alert("Falhou");
						});
					}
				},
				cancel:{
					text: 'Não',
					btnClass: 'btn-danger',
					keys: ['esc']
				}
			}
		});
	}else {
		$.alert({
			type: 'red',
			title: 'Ops...',
			content: 'Digite os dados corretamente!<br>Mínimo de 4 caracteres',
			buttons:{
				confirm:{
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc','enter']
				}
			}
		});
	}
});


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}