	
	// Método para pular campos teclando ENTER
    $('.pula').on('keypress', function(e){
        var tecla = (e.keyCode?e.keyCode:e.which);
 
        if(tecla == 13){
            campo = $('.pula');
            indice = campo.index(this);
            
            if(campo[indice+1] != null){
            	if(indice == 3) {
            		proximo = campo[indice - 1];
            	}else {
                    proximo = campo[indice + 1];
            	}
                proximo.focus();
                //console.log("indice: " + indice);
            }
        }
    });
