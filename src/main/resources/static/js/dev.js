
var codigo;
var dados = {}, usuarios = {};
var email, senha, confirmar;
var opSenha = 0; //-1 nao alterar, 0 alterar

//---------------------------------------------------------------------------------
$.ajax({
	url: '/dev/dev/todos',
	type: 'GET'
}).done(function(e){
	usuarios = e;
	var usuarioHtml = '';
	
	for(usuario of usuarios) {
		usuarioHtml += '<tr>'
						+'<td align="center">' + usuario.codEmpresa + '</td>'
						+'<td align="center">' + usuario.email + '</td>'
						+'<td align="center">' + usuario.perfil + '</td>';
		
		if(usuario.ativo == 1) usuarioHtml += '<td align="center">Sim</td>';
		else usuarioHtml += '<td align="center">Não</td>';
		
		usuarioHtml += '<td align="center"><div class="row">'
						+'<div class="col-md-1"><button onclick="editarUsuario()" value="' + usuario.id + '" class="botao"><span class="oi oi-pencil"></span></button></div>'
						+'<div class="col-md-1"><button onclick="apagarUsuario()" value="' + usuario.id + '" class="botao"><span class="oi oi-trash"></span></button></div>'
					+'</div></td>'
				+'</tr>';
						
	}
	
	$("#todosUsuarios").html(usuarioHtml);
		
});


//---------------------------------------------------------
$('#email').on('blur', function(){// Método para consultar o Usuario

	if($("#email").val() != ''){
		
		var email = $("#email").val();
		var id = $("#id").val();	
		
		$.ajax({
			url:  (id != '') ? "/dev/dev/validar/" + email + '/' + id : "/dev/dev/validar/" + email + '/-2',
			type: 'GET'
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


//---------------------------------------------------------------------------
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


//-----------------------------------------------------------------
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

	dados.id = $("#id").val();
	dados.email = $("#email").val();
	dados.perfil = $("#perfil").val();
	dados.ativo = $("#ativo").val();
	dados.codEmpresa = $("#codEmpresa").val();
	var textoEnviado;
	
	if(opSenha == 0) {
		dados.senha = $("#senha").val();
		confirmar = $("#confirmar").val();
		textoEnviado = 'Usuário cadastrado!';
	}else {
		dados.senha = "-1";
		confirmar = "-1";
		textoEnviado = 'Usuário atualizado!';
	}

if(dados.senha === confirmar && dados.senha != '' && dados.email != '') {
	$.ajax({
		url:'/dev/dev/criar',
		type:'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(dados)
	}).done(function(){
		$.alert({
			type: 'blue',
			title: 'Sucesso',
			content: textoEnviado,
			buttons: {
				confirm:{
					text:'Dev',
					btnClass: 'btn-success',
					keys: ['enter', 'esc'],
					action: function(){
						window.location.href = "/dev/dev";
					}
				}
			}
		});
	}).fail(function(){
		$.alert("Falhou");
	})
}else {
	$.alert({
		type:'red',
		title:'Ops...',
		content:'Digite os dados corretamente!',
		buttons:{
			confirm:{
				text:'Voltar',
				btnClass:'btn-danger',
				keys:['esc','enter']
				}
			}
		});
	}
});


//-----------------------------------------------------------------------------------------------------
function editarUsuario() {
	var botaoReceber = $(event.currentTarget);
	var idUsuario = botaoReceber.attr('value');
	
	$.confirm({
		type: 'red',
		title: 'Alerta',
		content: 'Deseja alterar esse usuario?',
		buttons:{
			confirm:{
				text: 'Sim',
				btnClass: 'btn-danger',
				keys: ['enter'],
				action: function(){
					for(usuario of usuarios) {
						if(usuario.id == idUsuario) {
							
							//variaveis
							$("#id").val(usuario.id);
							$("#email").val(usuario.email);
							$("#senha").val("");
							$("#perfil").val(usuario.perfil);
							$("#codEmpresa").val(usuario.codEmpresa);
							if(usuario.ativo == 1) $("#ativo").val("true");
							else $("#ativo").val("false");
							
							//avisos
							$("#avisoSenha").hide();
							$("#avisoUsuario").hide();
							$("#email").css({
								'border':'1px solid #ccc'
							});
							$("#senha").css({
								'border':'1px solid #ccc'
							});
							$("#confirmar").css({
								'border':'1px solid #ccc'
							});
							$("#criar").show();
							
							$("#criar").text("Atualizar usuário");
							opSenha = -1;
							//edit senha
							$("#senhas").hide();
							$("#alterar").show();
							break;
						}
					}
				}
			},
			cancel:{
				text: 'Não',
				btnClass: 'btn-success',
				keys: ['esc'],
			}
		}
	})
}


//---------------------------------------------------------------------------------
function alterarSenha() {
	$("#senhas").show('slow');
	$("#alterar").hide('slow');
	opSenha = 0;
}


//-----------------------------------------------------------------------------------------------------
function apagarUsuario() {
	var botaoReceber = $(event.currentTarget);
	var idUsuario = botaoReceber.attr('value');
	
	var inputApagar = '<input type="text" placeholder="Digite SIM para apagar!" class="form-control" id="apagar" required />'
			
	$.confirm({
		type: 'red',
	    title: 'Alerta',
	    content: 'Deseja APAGAR o usuário?',
	    buttons: {
	        confirm: {
	            text: 'Apagar',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
		
					$.confirm({
						type: 'red',
					    title: 'APAGAR usuário!',
					    content: 'Tem certeza?' + inputApagar,
					    buttons: {
					        confirm: {
					            text: 'Apagar usuário',
					            btnClass: 'btn-red',
					            keys: ['enter'],
					            action: function(){
									var apagarSim = this.$content.find('#apagar').val();
									
									if(apagarSim === 'sim') {
										$.ajax({
											url: "/adm/dev/excluirUsuario/" + idUsuario,
											type: 'GET'
										}).done(function(e){
											if(e == "200") {
												$.alert({
													type: 'red',
												    title: 'Usuário apagado!',
												    content: 'Espero que dê tudo certo!',
												    buttons: {
												        confirm: {
															text: 'Voltar',
												    		keys: ['enter'],
												            btnClass: 'btn-green',
												            action: function(){
																window.location.href = "/adm/dev";
															}
														}
													}
												});
											}
										}).fail(function(){
											$.alert("Erro, Usuário não apagado!");
										});
									}else {
										$.alert({
											type: 'red',
										    title: 'Texto incorreto!',
										    content: 'Pense bem antes de apagar um usuário!',
										    buttons: {
										        confirm: {
													text: 'Voltar',
										    		keys: ['enter'],
										            btnClass: 'btn-red',
												}
											}
										});
									}
								}
							},
					        cancel: {
								text: 'Voltar',
					            btnClass: 'btn-green',
					            keys: ['esc'],
							}
						}
					});
				}
			},
		    cancel: {
				text: 'Voltar',
		        btnClass: 'btn-green',
		        keys: ['esc'],
			}
		}
	});
}