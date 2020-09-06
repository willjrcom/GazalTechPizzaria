
var codigo;
var dados = {}, email, senha, confirmar;
var linhaHtml = '<div class="form-group">'
				+'<label>E-mail:<br/></label>'
				+'<input type="email" class="form-control pula" id="email" name="email" placeholder="nome@exemplo.com" />'
			+'</div>'
				
			+'<div class="row">'
				+'<div class="form-group col-md-6">'
					+'<label>Senha:<br/></label>'
					+'<input type="password" class="form-control pula" id="senha" name="senha" placeholder="Senha" />' 
				+'</div>'
	
				+'<div class="form-group col-md-6">'
					+'<label>Confirmar Senha:<br/></label>'
					+'<input type="password" class="form-control pula" id="confirmar" name="confirmar" placeholder="Confimar senha" />'  
				+'</div>'
			+'</div>'
			
			+'<br>'
			+'<button type="button" id="criar" class="form-contact-button" name="enviar">Criar Usuário</button>';


//----------------------------------------------------
$("#buscar").click(function(){
	codigo = $("#codigo").val();

	$.ajax({
		url:'/dev/liberar/' + codigo,
		type: 'PUT'
	}).done(function(e){
		$("#liberar").html(linhaHtml);

		//---------------------------------------------------------
		$("#criar").click(function(){

			dados.email = $("#email").val();
			dados.senha = $("#senha").val();
			confirmar = $("#confirmar").val();
			
			if(dados.senha === confirmar && dados.senha != '' && dados.email != '') {
				$.ajax({
					url:'/dev/criar',
					type:'PUT',
					dataType : 'json',
					contentType: "application/json",
					data: JSON.stringify(dados)
				}).done(function(e){
					$.alert("foi");
				}).fail(function(){
					$.alert("Falhou");
				})
			}
		})
	}).fail(function(){
		$.alert({
			type:'red',
			title:'Falha',
			content:'A busca falhou!',
			buttons:{
				confirm:{
					text:'Voltar',
					btnClass:'btn-danger',
					keys:['esc','enter']
				}
			}
		});
	});
});


