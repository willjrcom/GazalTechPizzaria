carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Divulgar"));

var divulgar = {};

$.ajax({
	url: "/dev/divulgar/mostrar",
	type: 'GET'
}).done(function(e){
	divulgar = e;
	if(divulgar != null){
		$("#id").val(divulgar.id);

		if(divulgar.mostrarNovidades == 1)
			$("#mostrarNovidades").prop('checked', true);
		else
			$("#mostrarNovidades").prop('checked', false);
		
		//empresa 1
		$("#texto1").val(divulgar.texto1);
		$("#link1").val(divulgar.link1);
		$("#empresa1").val(divulgar.empresa1);
		$("#datai1").val(divulgar.datai1);
		$("#dataf1").val(divulgar.dataf1);
		$("#valor1").val(divulgar.valor1);
		
		//empresa 2
		$("#texto2").val(divulgar.texto2);
		$("#link2").val(divulgar.link2);
		$("#empresa2").val(divulgar.empresa2);
		$("#datai2").val(divulgar.datai2);
		$("#dataf2").val(divulgar.dataf2);
		$("#valor2").val(divulgar.valor2);
		
		//empresa 3
		$("#texto3").val(divulgar.texto3);
		$("#link3").val(divulgar.link3);
		$("#empresa3").val(divulgar.empresa3);
		$("#datai3").val(divulgar.datai3);
		$("#dataf3").val(divulgar.dataf3);
		$("#valor3").val(divulgar.valor3);
		
		//empresa 4
		$("#texto4").val(divulgar.texto4);
		$("#link4").val(divulgar.link4);
		$("#empresa4").val(divulgar.empresa4);
		$("#datai4").val(divulgar.datai4);
		$("#dataf4").val(divulgar.dataf4);
		$("#valor4").val(divulgar.valor4);
		
		//empresa 5
		$("#texto5").val(divulgar.texto5);
		$("#link5").val(divulgar.link5);
		$("#empresa5").val(divulgar.empresa5);
		$("#datai5").val(divulgar.datai5);
		$("#dataf5").val(divulgar.dataf5);
		$("#valor5").val(divulgar.valor5);
	}
	carregarLoading("none");
});	


//-----------------------------------------------------------------
function salvar(){
	divulgar = {};
	
	if($("#id").val() != null) divulgar.id = $("#id").val();
	divulgar.mostrarNovidades = ($("#mostrarNovidades").prop('checked') ? true : false);

	//empresa 1
	divulgar.texto1 = $("#texto1").val();
	divulgar.link1 = $("#link1").val();
	divulgar.empresa1 = $("#empresa1").val();
	divulgar.datai1 = $("#datai1").val();
	divulgar.dataf1 = $("#dataf1").val();
	divulgar.valor1 = $("#valor1").val();
	
	//empresa 2
	divulgar.texto2 = $("#texto2").val();
	divulgar.link2 = $("#link2").val();
	divulgar.empresa2 = $("#empresa2").val();
	divulgar.datai2 = $("#datai2").val();
	divulgar.dataf2 = $("#dataf2").val();
	divulgar.valor2 = $("#valor2").val();
	
	//empresa 3
	divulgar.texto3 = $("#texto3").val();
	divulgar.link3 = $("#link3").val();
	divulgar.empresa3 = $("#empresa3").val();
	divulgar.datai3 = $("#datai3").val();
	divulgar.dataf3 = $("#dataf3").val();
	divulgar.valor3 = $("#valor3").val();
	
	//empresa 4
	divulgar.texto4 = $("#texto4").val();
	divulgar.link4 = $("#link4").val();
	divulgar.empresa4 = $("#empresa4").val();
	divulgar.datai4 = $("#datai4").val();
	divulgar.dataf4 = $("#dataf4").val();
	divulgar.valor4 = $("#valor4").val();
	
	//empresa 5
	divulgar.texto5 = $("#texto5").val();
	divulgar.link5 = $("#link5").val();
	divulgar.empresa5 = $("#empresa5").val();
	divulgar.datai5 = $("#datai5").val();
	divulgar.dataf5 = $("#dataf5").val();
	divulgar.valor5 = $("#valor5").val();
	
	$.ajax({
		url: '/dev/divulgar/criar',
		type: 'PUT',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(divulgar)
	}).done(() => {
		$.alert({
			type: 'green',
			title: 'Sucesso',
			content: 'Dados salvos!',
			buttons: {
				confirm: {
					text: 'Continuar',
					btnClass: 'btn btn-success',
					keys: ['esc', 'enter'],
					action: () => window.location.href= "/dev/divulgar"
				}
			}
		});
	});
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}