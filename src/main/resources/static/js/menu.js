var linhaHtml= "";

//-----------------------------------------------------
// Função de alteração direta da data do usuario
function acessarDataAjax(data){
	carregarLoading("block");
	//alterar data
	$.ajax({
		url: '/menu/acessarData/' + data,
		type: 'GET'
	}).done(function(){
		window.location.href = "/menu"
	}).fail(function(){
		carregarLoading("none");
		
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Escolha uma data!",
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


// Função de acessar data atraves do modal
const alterarDataAcesso = () => {
	
	//alterar data
	$.confirm({
		type: 'blue',
		title: 'Data de acesso:',
		content: 'Dia:<br><input type="date" name="dia" id="dia" class="form-control"/>',
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Acessar',
				btnClass: 'btn-green',
				keys: ['enter'],
				action: function() {
					carregarLoading("block");

					let data = this.$content.find('#dia').val();
					
					acessarDataAjax(data)
				}
			},
			cancel: {
				isHidden: true,
				keys: ['esc']
			}
		}
	});
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


//------------------------------------------------------------
const abrirModal = (title, content) => {
	$.alert({
		type:'blue',
		title: title,
		content: content,
		columnClass: 'col',
		closeIcon: true,
		buttons: {
			confirm: {
				text:'Voltar',
				btnClass:'btn-primary',
				keys:['esc','enter']
			}
		}
	});
}


const suporte = () => {
	let title = 'Suporte'
	let content = '<i class="fas fa-envelope text-primary"></i>'
			+ ' Caso ocorra algum erro no sistema envie um email para os desenvolvedores: '
			+ '<br><a class="btn btn-light" href="mailto:williamjunior67@gmail.com?subject=Preciso%20de%20ajuda">Enviar email</a>'
			
			+ '<br><br><i class="fab fa-whatsapp text-success"></i>'
			+ ' Envie uma mensagem atraves do nosso whatsapp: '
			+ '<br><a class="btn btn-light" href="https://api.whatsapp.com/send/?phone=5511963849111&text=Preciso+de+ajuda+com+meu+sistema+para+pizzaria&app_absent=0"> Enviar mensagem</a>'
			
			+ '<br><br><i class="fab fa-instagram text-danger"></i>'
			+ ' Acesse nossa página instagram: '
			+ '<br><a class="btn btn-light" href="https://www.instagram.com/gazal.tech">Acessar</a>'
	abrirModal(title, content)
}


const avisoDiasAberto = () => {
	let title = 'Ajuda'
	let content = '<table>'
					+ '<tr>'
						+ '<th>Tela</th>'
						+ '<th>Solução</th>'
					+ '<tr>'
					+ '<tr>'
						+ '<td>Finalizar</td>'
						+ '<td>Finalize todos os pedidos</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>Fechamento</td>'
						+ '<td>lance o troco final</td>'
					+ '<tr>'
				+ '</table>';
	abrirModal(title, content)
}


//----------------------------------------------------------------------
const verificarDiasEmAberto = () => {
	carregarLoading('block')
	
	$.ajax({
		url: "/menu/verificarDiasAbertos",
		type: 'GET'
	}).done(function(e){
		estruturarDiasEmAberto(e)
	});	

}

const estruturarDiasEmAberto = dias => {
	let linhaHtml = '<button onclick="avisoDiasAberto()" class="btn text-primary"><i class="fas fa-question"></i></button>'
				+ '<table class="table table-striped table-hover">';
	
	if (dias.length == 0){
		linhaHtml += '<tr><td class="text-center col-md-1">Nenhum dia em aberto</td></tr>'
	}else{
		for(let dia of dias){
			linhaHtml += '<tr>'
							+ '<td class="text-center col-md-1">' 
								+ dia.split('-')[2] 
								+ '/' + dia.split('-')[1] 
								+ '/' + dia.split('-')[0] 
							+ '</td>'
							+ '<td class="text-center col-md-1"><button class="btn btn-primary" onclick="acessarDataAjax(\'' 
								+ dia + '\')">Acessar</button></td>'
						+ '</tr>';
		}
	}
	linhaHtml += '</table>';
	
	carregarLoading('none')
	abrirModal('Dias em aberto', linhaHtml)
}
