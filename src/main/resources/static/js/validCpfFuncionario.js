$(document).ready(function () {
	$('.pula').on('keypress', function(e){
        var tecla = (e.keyCode?e.keyCode:e.which);
 
        if(tecla == 13){
			$("#cpf").v
				$.ajax({
					url: urlEnviar,
					type: 'PUT',
					
				})
		}
});