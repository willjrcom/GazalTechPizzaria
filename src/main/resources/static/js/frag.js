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


//------------------------------------------------------------
function calendario() {
	$.alert({
		type:'blue',
		title: 'Calendário',
		content:'<input type="date"/>',
		buttons:{
			confirm:{
				text:'Obrigado!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//------------------------------------------------------------
function calculadora() {
	$.alert({
		type:'blue',
		title: 'Calendário',
		content:'1+1=2',
		buttons:{
			confirm:{
				text:'Obrigado!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}