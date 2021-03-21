$(document).ready(() => $("#nomePagina").text("Forum"));
$("select").selectmenu().addClass("overflow");
var perguntas;

function buscarPerguntas() {
	carregarLoading("block");
	$.ajax({
		url: '/f/forum/todasPerguntas',
		type: 'GET'
	}).done(e => {
		carregarLoading("none");
		perguntas = e;
		filtrarPerguntas();
	});

}

buscarPerguntas();
setInterval(function() {
	buscarPerguntas();
}, 60000);//recarregar a cada 1 min


const filtrarPerguntas = () => {
	let duvidasHtml = '';
	for (let pergunta of perguntas) {
		if (pergunta.setor == $("#setor").val() || $("#setor").val() == 'TODOS')
			duvidasHtml += estruturarPergunta(pergunta);
	}
	$("#forum").html(duvidasHtml);
}


//criar por codigo
const criarPergunta = codigo => {
	if ($("#texto" + codigo).val() != '') {
		carregarLoading("block");
		
		let duvida = {};
		duvida.codigo = codigo;
		duvida.duvida = $("#texto" + codigo).val();
		duvida.setor = $("#setor" + codigo).val();

		$.ajax({
			url: '/f/forum/criar',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(duvida)
		}).done(() => window.location.href = "/f/forum")
		.fail(() => carregarLoading("none"));
	}
}


//ver por id
const verPergunta = boolOpcao => {
	let botao = $(event.currentTarget);
	let idPergunta = botao.attr('value');
	let pergunta = {};

	for (let search of perguntas) if (search.id == idPergunta) pergunta = search;
	pergunta.boolOpcao = boolOpcao;

	$.alert({
		type: 'blue',
		closeIcon: true,
		columnClass: 'col-md-12',
		title: FirstUpper(pergunta.duvida),
		content: mostrarPergunta(pergunta)
			+ mostrarComentarios(pergunta)
			+ comentar(pergunta),
		buttons: {
			confirm: {
				isHidden: true,
				keys: ['esc']
			}
		}
	});
}


const mostrarPergunta = pergunta => {
	let linhaHtml = '<div class="border border-secondary rounded p-2">'
		+ '<div class="row">'
		+ '<div class="col-md-4">'
		+ '<label><b>Setor:</b> ' + pergunta.setor + '</label><br>'
		+ '<label><b>Comentários:</b> ' + pergunta.comentario.length + '</label>'
		+ '</div>'
		+ '<div class="col-md-4">'
		+ '<label><b>Criado em:</b> ' + pergunta.data + '</label><br>'
		+ '<label><b>Válido até:</b> ' + mostrarData(pergunta.validade) + '</label>'
		+ '</div>'

		+ '<div class="col-md-2">'
		+ '<label>' + pergunta.curtida + ' <a href=""><i class="far fa-thumbs-up"></i></a></label><br>'
		+ '<label>' + pergunta.descurtida + ' <a href=""><i class="far fa-thumbs-down"></i></a></label>'
		+ '</div>'
		+ (pergunta.boolOpcao == 1 ? '<div class="col-md-2"><button class="btn btn-danger" onclick="apagarPergunta(' + pergunta.id + ')">Apagar pergunta</button></div>' : '')
		+ '</div>'
		+ '</div>';

	return linhaHtml;
}


const mostrarComentarios = pergunta => {
	let linhaHtml = '<hr><br><label><b>Comentários:</b></label>'
		+ '<div id="todosComentarios">';

	if (pergunta.comentario != 0)
		for (let comentario of pergunta.comentario)
			linhaHtml += estruturaComentario(comentario);

	linhaHtml += '</div>';
	return linhaHtml;
}


const estruturarPergunta = pergunta => {
	let linhaHtml = '<div class="border border-secondary rounded p-2">'
		+ '<div class="row">'
		+ '<div class="col-md-8">'
		+ '<label><b>' + FirstUpper(pergunta.duvida) + '</b></label><br>'
		+ '<label><b>Setor:</b> ' + pergunta.setor + '</label><br>'
		+ '<label><b>Comentários:</b> ' + pergunta.comentario.length + '</label>'
		+ '</div>'

		+ '<div class="col-md-2">'
		+ '<label>' + pergunta.curtida + ' <i class="far fa-thumbs-up"></i></label><br>'
		+ '<label>' + pergunta.descurtida + ' <i class="far fa-thumbs-down"></i></label>'
		+ '</div>'
		+ '<div class="col-md-2"><button class="btn btn-success" value="' + pergunta.id + '" onclick="verPergunta(0)">Acessar pergunta</button></div>'
		+ '</div>'
		+ '</div>';

	return linhaHtml;
}


const estruturaComentario = comentario => {
	return '<br><div class="border border-secondary rounded p-2">'
		+ '<div class="row">'
		+ '<div class="col-md-8"><label>' + comentario.descricao + '</label></div>'
		+ '<div class="col-md-3">'
		+ '<label>' + comentario.responsavel + '</label><br>'
		+ '<label>' + comentario.data + '</label>'
		+ '</div>'
		+ '<div class="col-md-1">'
		+ '<label>' + comentario.curtidas + ' <a href=""><i class="far fa-thumbs-up"></i></a></label><br>'
		+ '<label>' + comentario.descurtidas + ' <a href=""><i class="far fa-thumbs-down"></i></a></label>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
}


const comentar = pergunta => {
	return '<hr><br><label><b>Comentar:</b></label>'
		+ '<input class="form-control border-secondary" id="comentario" placeholder="Digite seu comentario"/>'
		+ '<br><button class="btn btn-success"id="btnComentar" onclick="salvarComentario(' + pergunta.id + ')">Comentar</button>';
}


const salvarComentario = id => {
	if ($("#comentario").val() != '') {
		carregarLoading("block");
		$("#btnComentar").attr("disabled", true);

		$.ajax({
			url: '/f/forum/comentar/' + id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: $("#comentario").val()
		}).done(comentario => {
			$("#btnComentar").attr("disabled", false);
			carregarLoading("none");
			//apagar texto do ultimo comentario
			$("#comentario").val("");
			//adicionar aos demais
			$("#todosComentarios").append(estruturaComentario(comentario));
		});
	}
}


const apagarPergunta = id => {
	carregarLoading("block");
	$.ajax({
		url: '/f/forum/excluir/' + id
	}).done(() => window.location.href = "/f/forum")
	.fail(() => carregarLoading("none"));
}


function FirstUpper(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


function mostrarData(data) {
	return data.split("-")[2] + '/' + data.split("-")[1] + '/' + data.split("-")[0]
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}
