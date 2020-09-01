var dados = {};

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
					
					dados.data = this.$content.find('#dia').val();
					console.log('dia: ' + dados.data);
					$.ajax({
						url: '/menu/verificarData/' + dados.data,
						type: 'PUT'
					}).done(function(e){
						console.log(e.length);
						
						if(e.length != 0) {
							$.ajax({
								url: '/menu/acessarData/' + dados.data,
								type: 'PUT'
							}).done(function(e){
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Data: ' + dados.data + ' acessado',
									buttons:{
										confirm:{
											text:'Continuar',
											btnClass: 'btn-green'
										}
									}
								});
							}).fail(function(){
								$.alert({
									type: 'red',
									title: 'Tente novamente!',
									content: 'Não foi possivel acessar uma data',
									buttons:{
										confirm:{
											text:'Voltar',
											btnClass: 'btn-danger'
										}
									}
								});
							});
						}else {
							$.ajax({
								url: '/menu/criarData/' + dados.data,
								type: 'PUT'
							}).done(function(e){
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Data: ' + dados.data + ' criado',
									buttons:{
										confirm:{
											text:'Continuar',
											btnClass: 'btn-green'
										}
									}
								});
							}).fail(function(){
								$.alert({
									type: 'red',
									title: 'Tente novamente!',
									content: 'Não foi possivel criar uma data',
									buttons:{
										confirm:{
											text:'Voltar',
											btnClass: 'btn-danger'
										}
									}
								});
							});
						}
					}).fail(function(){
						$.alert("Falha no acesso!");
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