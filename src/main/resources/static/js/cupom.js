
var cupom = {};
var cupons = [];
var Tcupons = '';

carregarLoading("block");

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
	if($("#cupom").val() != '' && $("#desconto").val() != '' && $("#validade").val() != '') {
		
		carregarLoading("block");
		cupom.nome = $("#nome").val();
		cupom.tipo = $("#tipo").val();
		cupom.desconto = $("#desconto").val();
		cupom.validade = $("#validade").val();
		
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
							document.location.reload(true);
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


//---------------------------------------------------------------------------
function mostrarCupons(){
	//buscar id da data
	$.ajax({
		url: '/adm/cupom/todosCupons',
		type: 'GET'
	}).done(function(cupons){
		console.log(cupons)
		Tcupons = '';

		//se existir algum produto
		if(cupons.length != 0) {
			for(let cupom of cupons) {
				Tcupons += '<tr>'
							+ '<td>' + cupom.nome + '</td>'
							+ '<td>' + ((cupom.tipo === "R$") ? cupom.tipo + " " + cupom.desconto : cupom.desconto + " " + cupom.tipo) + '</td>'
							+ '<td>' + cupom.validade.split("T")[1] + " " + cupom.validade.split("T")[0] + '</td>'
							+ '<td>'
								+ '<button class="btn btn-warning" value="' + cupom.id + '"><span class="oi oi-pencil"></span></button>'
								+ '&nbsp;'
								+ '<button class="btn btn-danger" value="' + cupom.id + '"><span class="oi oi-trash"></span></button>'
						+ '</tr>';
			}
		}else {
			Tcupons = '<tr><td colspan="4">Nenhum cupom cadastrado</td></tr>';
		}

		$("#todosCupons").html(Tcupons);
		carregarLoading("none");
	});
}
mostrarCupons();


//----------------------------------------------
function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
