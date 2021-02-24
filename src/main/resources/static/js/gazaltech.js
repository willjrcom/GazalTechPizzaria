var url = window.location.href;
$(document).ready(() => $("#nomePagina").text("Gazaltech"));

if(url.split("/")[4] === "enviado"){
	$("#btnEnviar").attr('disabled', false);
	$.alert({
			type: 'green',
			title: 'OPS...',
			content: 'Email enviado com sucesso!',
			buttons:{
				confirm:{
					text: 'Continuar',
					btnClass: 'btn btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
}

$("#opcao").change(function() {
	if($(this).val()[0] === "duvida"){
		$("#areas").hide("slow");
		$("#campo").hide("slow", function(){
			$("#texto").text("Dúvidas:");
			$("#campo").show("slow");
			$("#campo").attr("placeholder", "Digite sua duvida");
		});
	}else if($(this).val()[0] === "reportar"){
		$("#areas").show("slow");
		$("#campo").hide("slow", function(){
			$("#texto").text("Reportar erro:");
			$("#campo").show("slow");
			$("#campo").attr("placeholder", "Digite seu problema");
		});
	}else if($(this).val()[0] === "recomendar"){
		$("#areas").hide("slow");
		$("#campo").hide("slow", function(){
			$("#texto").text("Recomendar alteração:");
			$("#campo").show("slow");
			$("#campo").attr("placeholder", "Digite sua recomendação");
		});
	}else if($(this).val()[0] === "avaliar"){
		$("#areas").hide("slow");
		$("#campo").hide("slow", function(){
			$("#texto").text("Avaliar:");
			$("#campo").show("slow");
			$("#campo").attr("placeholder", "Digite sua avaliação");
		});
	}
});


function enviarEmail(){
	if($("#opcao").val() == null)
		return $.alert({
			type: 'red',
			title: 'OPS...',
			content: 'Escolha uma opção!',
			buttons:{
				confirm:{
					text: 'voltar',
					btnClass: 'btn btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	
	if($("#campo").text() == "")
		return $.alert({
			type: 'red',
			title: 'OPS...',
			content: 'Texto em branco!',
			buttons:{
				confirm:{
					text: 'voltar',
					btnClass: 'btn btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	
	const email = {
    	email : $("#email").val(),
    	assunto : $("#opcao").val() + " - GazalTech Pizzaria",
    	texto : "Cliente: " + $("#nome").val()
				+ "<br>Assunto: " + $("#opcao").val()
				+ "<br>Mensagem: " + $("#conteudo").val()
	}

	$.ajax({
		url: "/email/enviar",
		type: "POST",
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(email),
		onClose: () => {
			$("#btnEnviar").attr('disabled', true);
		}
	}).done(function(){
		window.location.href="/gazaltech/enviado";
	}).fail(function(){
		$.alert({
			type: 'red',
			title: 'OPS...',
			content: 'Email não enviado',
			buttons:{
				confirm:{
					text: 'voltar',
					btnClass: 'btn btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
		$("#btnEnviar").attr('disabled', false);
	});
}