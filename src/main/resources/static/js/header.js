//abrir menu
$("#menuButton").click(function(){

	var submenu = document.getElementById("menuPrincipal");
	
	if(submenu.style.display == 'block'){
		$("#menuPrincipal").hide('slow');
		$("#menuButton").removeClass("posicaoMenu");
		/*$(".dropdown").hide();
		$(".dropdown-content").hide();*/
	}else{
		$("#menuPrincipal").show('slow');
		$("#menuButton").addClass("posicaoMenu");
		/*$(".dropdown").show();
		$(".dropdown-content").show();*/
	}
});


//-----------------------------------------------------
$("#data").click(function(){
	//alterar data
	$.confirm({
		type: 'blue',
		title: 'Data de acesso:',
		content: 'Dia: dd/mm/aaaa<br><input type="date" name="dia" id="dia" placeholder="Digite a data de acesso" required/>',
		buttons: {
	        confirm: {
	            text: 'Acessar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					
					dia = this.$content.find('#dia').val();
					
					$.ajax({
						url: '/menu/verificar',
						data: dia
					}).done(function(){	
						$.alert("");
					}).fail(function(){
						$.alert("Falha no acesso!");
						console.log(dia);
					});
				}
			},
	        cancel:{
				text: 'Voltar',
				btnClass: 'btn-danger',
				keys: ['esc']
			}
		}
	});
});



//-----------------------------------------------------
$("#troco").click(function(){
	$.alert("troco");
	console.log("foi");
});