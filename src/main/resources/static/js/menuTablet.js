function avalie() {
	
	var linhaHtml = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">'
		+'<div class="estrelas">'
		  +'<input type="radio" id="cm_star-empty" name="fb" value="" checked/>'
		  +'<label for="cm_star-1"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-1" name="fb" value="1"/>'
		  +'<label for="cm_star-2"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-2" name="fb" value="2"/>'
		  +'<label for="cm_star-3"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-3" name="fb" value="3"/>'
		  +'<label for="cm_star-4"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-4" name="fb" value="4"/>'
		  +'<label for="cm_star-5"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-5" name="fb" value="5"/>'
		+'</div>';
	
	
	var texto = 'Garçon: ' + linhaHtml
			+ '<br>Comida: ' + linhaHtml
			+ '<br>Tempo de espera: ' + linhaHtml
			+ '<br>Está satisfeito? ' + linhaHtml;
	
	$.confirm({
		type: 'blue',
		title: 'Avalie nosso estabelecimento',
		content: texto,
		buttons: {
			confirm: {
				text: 'avaliar',
				btnClass: 'btn-success'
			},
			cancel: {
				text: 'Voltar',
				btnClass: 'btn-danger'
			}
		}
	});
}