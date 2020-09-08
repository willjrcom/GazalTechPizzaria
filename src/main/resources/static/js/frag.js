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


//---------------------------------------------------------------
