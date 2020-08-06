$("#enviarLogin").click(function(){
	$("#esconderLogin").hide('slow');
	
	window.setTimeout(function(){
	this.location.href = "/novoPedido";
	},500);
});