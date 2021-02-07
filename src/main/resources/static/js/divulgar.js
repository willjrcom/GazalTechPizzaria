carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Divulgar"));

var divulgar = {};

$.ajax({
	url: "/dev/divulgar",
	type: 'GET'
}).done(function(e){
	divulgar = e;
	
	//empresa 1
	$("#texto1").text(divulgar.texto1);
	$("#link1").text(divulgar.link1);
	$("#empresa1").text(divulgar.empresa1);
	$("#datai1").text(divulgar.datai1);
	$("#dataf1").text(divulgar.dataf1);
	$("#valor1").text(divulgar.valor1);
	
	//empresa 2
	$("#texto2").text(divulgar.texto2);
	$("#link2").text(divulgar.link2);
	$("#empresa2").text(divulgar.empresa2);
	$("#datai2").text(divulgar.datai2);
	$("#dataf2").text(divulgar.dataf2);
	$("#valor2").text(divulgar.valor2);
	
	//empresa 3
	$("#texto3").text(divulgar.texto3);
	$("#link3").text(divulgar.link3);
	$("#empresa3").text(divulgar.empresa3);
	$("#datai3").text(divulgar.datai3);
	$("#dataf3").text(divulgar.dataf3);
	$("#valor3").text(divulgar.valor3);
	
	//empresa 4
	$("#texto4").text(divulgar.texto4);
	$("#link4").text(divulgar.link4);
	$("#empresa4").text(divulgar.empresa4);
	$("#datai4").text(divulgar.datai4);
	$("#dataf4").text(divulgar.dataf4);
	$("#valor4").text(divulgar.valor4);
	
	//empresa 5
	$("#texto5").text(divulgar.texto5);
	$("#link5").text(divulgar.link5);
	$("#empresa5").text(divulgar.empresa5);
	$("#datai5").text(divulgar.datai5);
	$("#dataf5").text(divulgar.dataf5);
	$("#valor5").text(divulgar.valor5);
	
	carregarLoading("none");
});	


//-----------------------------------------------------------------
function salvar(){
	//id
	divulgar.id = 1;
	//empresa 1
	divulgar.texto1 = $("#texto1").text();
	divulgar.link1 = $("#link1").text();
	divulgar.empresa1 = $("#empresa1").text();
	divulgar.datai1 = $("#datai1").text();
	divulgar.dataf1 = $("#dataf1").text();
	divulgar.valor1 = $("#valor1").text();
	
	//empresa 2
	divulgar.texto2 = $("#texto2").text();
	divulgar.link2 = $("#link2").text();
	divulgar.empresa2 = $("#empresa2").text();
	divulgar.datai2 = $("#datai2").text();
	divulgar.dataf2 = $("#dataf2").text();
	divulgar.valor2 = $("#valor2").text();
	
	//empresa 3
	divulgar.texto3 = $("#texto3").text();
	divulgar.link3 = $("#link3").text();
	divulgar.empresa3 = $("#empresa3").text();
	divulgar.datai3 = $("#datai3").text();
	divulgar.dataf3 = $("#dataf3").text();
	divulgar.valor3 = $("#valor3").text();
	
	//empresa 4
	divulgar.texto4 = $("#texto4").text();
	divulgar.link4 = $("#link4").text();
	divulgar.empresa4 = $("#empresa4").text();
	divulgar.datai4 = $("#datai4").text();
	divulgar.dataf4 = $("#dataf4").text();
	divulgar.valor4 = $("#valor4").text();
	
	//empresa 5
	divulgar.texto5 = $("#texto5").text();
	divulgar.link5 = $("#link5").text();
	divulgar.empresa5 = $("#empresa5").text();
	divulgar.datai5 = $("#datai5").text();
	divulgar.dataf5 = $("#dataf5").text();
	divulgar.valor5 = $("#valor5").text();
	
	$.ajax({
		url: '/dev/divulgar/criar',
		type: 'PUT',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(divulgar)
	}).done(() => {
		$.alert({
			type: 'success',
			title: 'Sucesso',
			content: 'Dados salvos!',
			buttons: {
				confirm: {
					text: 'Continuar',
					btnClass: 'btn btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
	});
}