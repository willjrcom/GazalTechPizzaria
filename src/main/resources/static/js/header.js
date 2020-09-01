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
