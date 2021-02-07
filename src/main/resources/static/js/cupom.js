
var cupom = {};
var Tcupons = '';
var todosCupons = [];
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';

carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Cupom"));

//-------------------------------------------------------------------
function aviso() {
	$.alert({
		type:'blue',
		title:'Cupom',
		content:'Crie seus cupons de desconto para oferecer aos clientes.',
		buttons:{
			confirm:{
				text:'Voltar',
				btnClass:'btn-success',
				keys:['enter','esc']
			}
		}
	});
}


//----------------------------------------------------------------
function salvar() {
	if($("#cupom").val() != '' && $("#desconto").val() != '' && $("#validade").val() != '' && $("#descricao").val() != '') {
		
		carregarLoading("block");
		cupom.id = $("#id").val();
		cupom.nome = $("#nome").val();
		cupom.tipo = $("#tipo").val();
		cupom.desconto = $("#desconto").val();
		cupom.validade = $("#validade").val();
		cupom.descricao = $("#descricao").val();
		
		$.ajax({
			url: '/adm/cupom/criar',
			type: 'PUT',
			dataType : 'json',
			contentType: "application/json",
			data: JSON.stringify(cupom)
		}).done(function(){
			
			carregarLoading("none");
			$.alert({
				type: 'green',
				title: 'Sucesso',
				content: "Salvo com sucesso!",
				buttons: {
					confirm: {
						text: 'continuar',
						btnClass: 'btn-success',
						keys: ['esc', 'enter'],
						action: function(){
							document.location.href ="/adm/cupom";
						}
					}
				}
			});
		});
	}else {
		$.alert({
			type: 'red',
			title: 'Atenção',
			content: "Campo Vazio, preencha corretamente",
			buttons: {
				confirm: {
					text: 'ok',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}
}

function salvarCupons(cupons){
	todosCupons = cupons;
}


//---------------------------------------------------------------------------
function mostrarCupons(){
	//buscar id da data
	$.ajax({
		url: '/adm/cupom/todosCupons',
		type: 'GET'
	}).done(function(cupons){
		salvarCupons(cupons);
		Tcupons = '';
		
		//se existir algum produto
		if(cupons.length != 0) {
			for(let cupom of cupons) {
				Tcupons += '<tr>'
							+ '<td>' + cupom.nome + '</td>'
							+ '<td>' + cupom.descricao + '</td>'
							+ '<td>' + ((cupom.tipo === "R$") ? cupom.tipo + " " + cupom.desconto : cupom.desconto + " " + cupom.tipo) + '</td>'
							+ '<td>' + cupom.validade + '</td>'
							+ '<td>'
								+ '<button class="btn btn-warning" value="' + cupom.id + '" onclick="editarCupom()"><i class="fas fa-edit"></i></button>'
								+ '&nbsp;'
								+ '<button class="btn btn-danger" value="' + cupom.id + '" onclick="excluirCupom()"><i class="fas fa-trash"></i></button>'
						+ '</tr>' + linhaCinza;
			}
		}else {
			Tcupons = '<tr><td colspan="4">Nenhum cupom cadastrado</td></tr>';
		}

		$("#todosCupons").html(Tcupons);
		carregarLoading("none");
	});
}
mostrarCupons();



//-----------------------------------------------------------------------------------------------------------
function excluirCupom() {
	var botaoReceber = $(event.currentTarget);
	var idCupom = botaoReceber.attr('value');

	$.confirm({
		type: 'red',
	    title: 'Excluir cupom?',
	    content: 'Deseja excluir o cupom?',
	    buttons: {
	        confirm: {
	            text: 'excluir',
	            btnClass: 'btn-red',
	            keys: ['enter'],
	            action: function(){
					$.ajax({
						url: "/adm/cupom/excluir/" + idCupom,
						type: 'PUT'
					}).done(function(){		
						$.alert({
							type: 'red',
						    title: 'Cupom apagado!',
						    content: 'Espero que dê tudo certo!',
						    buttons: {
						        confirm: {
									text: 'Voltar',
						    		keys: ['enter'],
						            btnClass: 'btn-green',
						            action: function(){
										window.location.href = "/adm/cupom";
									}
								}
							}
						});
					}).fail(function(){
						$.alert("Erro, Cupom não apagado!");
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


//-----------------------------------------------------------------------------------------------------
function editarCupom() {
	var botaoReceber = $(event.currentTarget);
	var idCupom = botaoReceber.attr('value');

	$.confirm({
		type: 'red',
		title: 'Editar',
		content: 'Deseja alterar esse cupom?',
		buttons:{
			confirm:{
				text: 'Sim',
				btnClass: 'btn-danger',
				keys: ['enter'],
				action: function(){
					for(cupom of todosCupons) {
						if(cupom.id == idCupom) {
							
							//variaveis
							$("#id").val(cupom.id);
							$("#nome").val(cupom.nome);
							$("#tipo").val(cupom.tipo);
							$("#desconto").val(cupom.desconto);
							$("#validade").val(cupom.validade);
							$("#descricao").val(cupom.descricao);
							
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
	});
}


//----------------------------------------------
function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
