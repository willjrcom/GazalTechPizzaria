
var codigo;
var dados = {}, email, senha, confirmar;
var linhaHtml = '<div class="form-group">'
				+'<label>E-mail:<br></label>'
				+'<p id="avisoUsuario">Usuário já cadastrado, tente outro!</p>'
				+'<input type="email" class="form-control pula" id="email" name="email" placeholder="nome@exemplo.com" />'
			+'</div>'
				
			+'<div class="row">'
				+'<div class="form-group col-md-6">'
					+'<label>Senha:<br></label>'
					+'<p id="avisoSenha">As senhas não conferem!</p>'
					+'<input type="password" class="form-control pula" id="senha" name="senha" placeholder="Senha" />' 
				+'</div>'
	
				+'<div class="form-group col-md-6">'
					+'<label>Confirmar Senha:<br></label>'
					+'<input type="password" class="form-control pula" id="confirmar" name="confirmar" placeholder="Confimar senha" />'  
				+'</div>'
			+'</div>'
			
			+'<div class="form-group">'
				+'<label>Permissão:<br></label>'
				+'<select class="form-control" id="perfil">'
					+'<option value="USUARIO">USUARIO</option>'
					+'<option value="ADM">ADM</option>'
				+'</select>'
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
		if(e == true) {
			$("#liberar").html(linhaHtml);
			$("#divLiberacao").hide();
		}
		//---------------------------------------------------------
		$("#avisoUsuario").hide();
		$("#avisoSenha").hide();
		$('#email').on('blur', function(){// Método para consultar o Usuario

			if($("#email").val() != ''){
				
				var email = $("#email").val();
				var id = $("#id").val();	
				
				$.ajax({
					url:  (id != '') ? "/dev/validar/" + email.toString() + '/' + id : "/dev/validar/" + email.toString() + '/-2',
					type: 'PUT'
				}).done(function(event){

					if(event.length != 0 && event != '' && event.id != -1) {
						$("#avisoUsuario").show().css({
							'color': 'red'
						});
						$("#email").css({
							'border':'1px solid red'
						});
						$("#criar").hide();
					}else {
						$("#avisoUsuario").hide();
						$("#criar").show();
						$("#email").css({
							'border':'1px solid #ccc'
						});
					}
				});
			}			
		});
		
		$('#confirmar').on('blur', function(){//comparar senhas
			if($(this).val() !== $("#senha").val()) {
				$("#avisoSenha").show().css({
					'color': 'red'
				});
				$("#senha").css({
					'border':'1px solid red'
				});
				$("#confirmar").css({
					'border':'1px solid red'
				});
				$("#criar").hide();
			}else if($(this).val() === $("#senha").val()) {
				$("#avisoSenha").hide();
				$("#criar").show();
				$("#senha").css({
					'border':'1px solid #ccc'
				});
				$("#confirmar").css({
					'border':'1px solid #ccc'
				});
			}
		});
		
		
		$("#senha").on('blur', function(){ //comparar senhas
			if($(this).val() !== $("#confirmar").val()) {
				$("#avisoSenha").show().css({
					'color': 'red'
				});
				$("#senha").css({
					'border':'1px solid red'
				});
				$("#confirmar").css({
					'border':'1px solid red'
				});
				$("#criar").hide();
			}else if($(this).val() === $("#confirmar").val()) {
				$("#avisoSenha").hide();
				$("#criar").show();
				$("#senha").css({
					'border':'1px solid #ccc'
				});
				$("#confirmar").css({
					'border':'1px solid #ccc'
				});
			}
		});
		
		
		//-----------------------------------------------------------
		$("#criar").click(function(){

			dados.email = $("#email").val();
			dados.senha = $("#senha").val();
			dados.perfil = $("#perfil").val();
			confirmar = $("#confirmar").val();
			
			if(dados.senha === confirmar && dados.senha != '' && dados.email != '') {
				$.ajax({
					url:'/dev/criar',
					type:'PUT',
					dataType : 'json',
					contentType: "application/json",
					data: JSON.stringify(dados)
				}).done(function(e){
					$.alert({
						type: 'blue',
						title: 'Sucesso',
						content: 'Usuário cadastrado!',
						buttons: {
							confirm:{
								text:'menu',
								btnClass: 'btn-success',
								keys: ['enter', 'esc'],
								action: function(){
									window.location.href = "/menu";
								}
							}
						}
					});
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
