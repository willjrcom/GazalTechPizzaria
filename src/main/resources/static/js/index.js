$("#enviarLogin").click(function(){
	$("#esconderLogin").hide('slow');
	
	window.setTimeout(function(){
	this.location.href = "/menu";
	},500);
});