
//salvar troco inicial
if(Number($("#trocoInicial").val()) == 0){
	trocoInicial();
}

//-------------------------------------------------------
function trocoRepeat(){
	trocoInicial();
}


//-----------------------------------------------------
function trocoInicial() {
	$.alert({
		type: 'blue',
		title: 'Troco inicial do caixa',
		content: 'Troco:'
				+ '<div class="input-group mb-3">'
					+ '<span class="input-group-text">R$</span>'
					+ '<input class="form-control" id="trocoInicial" placeholder="Digite o valor do troco"/>'
				+ '</div>',
		buttons:{
			confirm:{
				text:'Alterar troco',
				btnClass: 'btn btn-green btnSalvarTrocoClass',
				action: function(){	
					carregarLoading("block");
	
					var troco = this.$content.find('#trocoInicial').val();

					troco = parseFloat(troco.toString().replace(",","."));
					
					if(Number.isFinite(troco) == false) {
						carregarLoading("none");
						
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm:{
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter'],
									action: () => trocoRepeat()
								}
							}
						});
					}else {
						//alterar troco inicial						
						$.ajax({
							url: '/menu/troco/' + troco,
							type: 'GET'
						}).done(function(){
							carregarLoading("none");
							
							$.alert({
								type:'green',
								title: 'Troco alterado',
								content:'Boas vendas!',
								buttons:{
									confirm:{
										text:'Obrigado',
										btnClass: 'btn-success',
										keys: ['esc', 'enter'],
										action: function(){
											window.location.reload(true);
										}
									}
								}
							});
						}).fail(function(){
							carregarLoading("none");
							
							$.alert({
								type: 'red',
								title: 'OPS...',
								content: "Erro, Digite um valor válido!",
								buttons: {
									confirm: {
										text: 'Tentar novamente',
										btnClass: 'btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
						});
					}
				}
			}
		}
	});
}
