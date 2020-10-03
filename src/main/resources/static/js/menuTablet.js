var Qtd, Tempo, Estrela;
var mesas = 0, Nmesa = 0;


//---------------------------------------------------------------
function avalie() {
	Qtd = 5, Tempo = 'Excelente', Estrela = 5;
	
	var estrelas = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">'
		+'<div class="estrelas">'
		  +'<input type="radio" id="cm_star-empty" name="fb" value="" checked/>'
		  +'<label for="cm_star-1" onclick="estrelas(1)"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-1" name="fb" value="1"/>'
		  +'<label for="cm_star-2" onclick="estrelas(2)"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-2" name="fb" value="2"/>'
		  +'<label for="cm_star-3" onclick="estrelas(3)"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-3" name="fb" value="3"/>'
		  +'<label for="cm_star-4" onclick="estrelas(4)"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-4" name="fb" value="4"/>'
		  +'<label for="cm_star-5" onclick="estrelas(5)"><i class="fa"></i></label>'
		  +'<input type="radio" id="cm_star-5" name="fb" value="5"/>'
		+'</div>';
	
	var notaGarcon = '<label>Nota do Garçon: <span id="inputGarcon">5</span></label><br>'
			+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
				+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
				    + '<button type="button" onclick="qtdGarcon(1)" class="btn btn-link"><span class="badge badge-danger">1</span></button>'
				    + '<button type="button" onclick="qtdGarcon(2)" class="btn btn-link"><span class="badge badge-warning">2</span></button>'
				    + '<button type="button" onclick="qtdGarcon(3)" class="btn btn-link"><span class="badge badge-light">3</span></button>'
				    + '<button type="button" onclick="qtdGarcon(4)" class="btn btn-link"><span class="badge badge-primary">4</span></button>'
				    + '<button type="button" onclick="qtdGarcon(5)" class="btn btn-link"><span class="badge badge-success">5</span></button>'
			  + '</div>'
			+ '</div>';
			
	
	var notatempo = '<label>Tempo de espera: <span id="inputTempo">Excelente</span></label><br>'
			+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
				+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
				    + '<button type="button" onclick="qtdTempo(1)" class="btn btn-link"><span class="badge badge-danger">Péssimo</span></button>'
				    + '<button type="button" onclick="qtdTempo(2)" class="btn btn-link"><span class="badge badge-warning">Lento</span></button>'
				    + '<button type="button" onclick="qtdTempo(3)" class="btn btn-link"><span class="badge badge-light">Regular</span></button>'
				    + '<button type="button" onclick="qtdTempo(4)" class="btn btn-link"><span class="badge badge-primary">Rapido</span></button>'
				    + '<button type="button" onclick="qtdTempo(5)" class="btn btn-link"><span class="badge badge-success">Excelente</span></button>'
			  + '</div>'
			+ '</div>';
	
	var obs = '<label>Observação:</label>'
			+ '<input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" />';
	
	var texto = notaGarcon + '<hr>' 
			+ notatempo + '<hr>' 
			+ '<br>Está satisfeito? ' + estrelas + '<hr>'
			+ obs;
	
	$.confirm({
		type: 'blue',
		title: 'Avalie nosso estabelecimento',
		content: texto,
	    columnClass: 'col-md-12',
		buttons: {
			confirm: {
				text: 'avaliar',
				btnClass: 'btn-success',
				action: function(){
					console.log(Tempo);
					console.log(Qtd);
					console.log(Estrela);
				}
			},
			cancel: {
				text: 'Voltar',
				btnClass: 'btn-danger'
			}
		}
	});
}


//---------------------------------------------------------------
function qtdGarcon(qtd) {
	$("#inputGarcon").text(qtd);
	Qtd = qtd;
}


//---------------------------------------------------------------
function qtdTempo(tempo) {
	if(tempo == 1) {
		Tempo = "Péssimo";
	}else if(tempo == 2) {
		Tempo = "Lento";
	}else if(tempo == 3) {
		Tempo = "Regular";
	}else if(tempo == 4) {
		Tempo = "Rápido";
	}else if(tempo == 5) {
		Tempo = "Excelente";
	}
	
	$("#inputTempo").text(Tempo);
}


//--------------------------------------------------------------
function estrelas(estrela) {
	Estrela = estrela;
}


//--------------------------------------------------------------
$("#mesa").click(function(){
	
	$.ajax({
		url: '/empresa/editar',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			mesas = e.mesa;
			
			var filtro = '<label>Mesas disponíveis:</label><br>'
						+'<select name="filtro" id="filtro" class="form-control">';
			
			if($("#Nmesa").text() != '') {
				Nmesa = $("#Nmesa").text();
				filtro += '<option value="' + Nmesa + '">' + Nmesa +'</option>';
				
				for(var i = 1; i <= mesas; i++) {
					if(i != Nmesa) {
						filtro += '<option value="' + i + '">' + i +'</option>';	
					}
				}
			}else {
				for(var i = 1; i <= mesas; i++) {
					filtro += '<option value="' + i + '">' + i +'</option>';
				}
			}
			
			
			filtro += '</select>';
			
			$.confirm({
				type: 'blue',
				title: 'Mesas',
				content: filtro,
				buttons: {
					confirm: {
						text: 'Escolher',
						btnClass: 'btn-success',
						action: function(){
							Nmesa = this.$content.find('#filtro').val();
							$("#Nmesa").text(Nmesa);
						}
					},
					cancel: {
						text: 'Voltar',
						btnClass: 'btn-danger'
					}
				}
			});
		}
	});
});


//-----------------------------------------------------------------------
function cardapio() {
	if($("#Nmesa").text() == '') {
		$.alert({
			type: 'red',
			title: 'OPS..',
			content: 'Escolha uma mesa para fazer o pedido',
			buttons: {
				confirm: {
					text: 'Ok',
					btnClass: 'btn-success'
				}
			}
		});
	}else {
		window.location.href = "/novoPedidoTablet/mesa/" + $("#Nmesa").text();
	}
}
/*
 multiselect
 
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.css" />
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>

var notaComida = '<select class="selectpicker" multiple data-live-search="true">'
+'<option>Mustard</option>'
+'<option>Ketchup</option>'
+'<option>Relish</option>'
+'</select>';

$('select').selectpicker();
*/