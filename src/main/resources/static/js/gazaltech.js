var url = window.location.href;
if(url.split("/")[4] === "enviado"){
	alert("Email enviado com sucesso!");
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
		return alert("Escolha uma opção!");
	
	if($("#campo").text() == "")
		return alert("Texto em branco!");
	
	const email = {
    	email : $("#email").val(),
    	assunto : $("#opcao").val() + " - GazalTech",
    	texto : "Cliente: " + $("#nome").val()
				+ "<br>Assunto: " + $("#opcao").val()
				+ "<br>Mensagem: " + $("#conteudo").val()
	}

	$.ajax({
		url: "/email/enviar",
		type: "POST",
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(email)
	}).done(function(){
		window.location.href="/gazaltech/enviado";
	}).fail(function(){
		alert("Email não enviado!");
	});
}