$(document).ready(() => $("#nomePagina").text("Forum"));
$("select").selectmenu().addClass("overflow");
var perguntas, userId = 0;

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

//user
$.ajax({
	url: '/f/forum/userId',
	type: 'GET'
}).done(e => {
	userId = e;
});


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
		+ '<label id="pergCurtir' + pergunta.id + '">' + pergunta.curtida.length + '</label><button onclick="curtirPergunta(' + pergunta.id + ',' + pergunta.curtida.length + ')" class="botao"><i class="far fa-thumbs-up"></i></button><br>'
		+ '<label id="pergDescurtir' + pergunta.id + '">' + pergunta.descurtida.length + '</label><button onclick="descurtirPergunta(' + pergunta.id + ',' + pergunta.descurtida.length + ')" class="botao"><i class="far fa-thumbs-down"></i></button>'
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
	return '<div class="border border-secondary rounded p-2">'
		+ '<div class="row">'
		+ '<div class="col-md-8">'
		+ '<label><b>' + FirstUpper(pergunta.duvida) + '</b></label><br>'
		+ '<label><b>Setor:</b> ' + pergunta.setor + '</label><br>'
		+ '<label><b>Comentários:</b> ' + pergunta.comentario.length + '</label>'
		+ '</div>'

		+ '<div class="col-md-2">'
		+ '<label>' + pergunta.curtida.length + ' <i class="far fa-thumbs-up"></i></label><br>'
		+ '<label>' + pergunta.descurtida.length + ' <i class="far fa-thumbs-down"></i></label>'
		+ '</div>'
		+ '<div class="col-md-2"><button class="btn btn-success" value="' + pergunta.id + '" onclick="verPergunta(0)">Acessar pergunta</button></div>'
		+ '</div>'
		+ '</div>';
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
		+ '<label id="comentCurtir' + comentario.id + '">' + comentario.curtida.length + '</label><button onclick="curtirComent(' + comentario.id + ',' + comentario.curtida.length + ')" class="botao"><i class="far fa-thumbs-up"></i></button><br>'
		+ '<label id="comentDescurtir' + comentario.id + '">' + comentario.descurtida.length + '</label><button onclick="descurtirComent(' + comentario.id + ',' + comentario.curtida.length + ')" class="botao"><i class="far fa-thumbs-down"></i></button>'
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
	$.confirm({
		type: 'red',
		title: 'Apagar pergunta',
		content: 'Deseja excluir a pergunta?',
		closeIcon: true,
		buttons: {
			confirm: {
				text: 'Sim',
				btnClass: 'btn btn-danger',
				keys: ['enter'],
				action: () => {
					$.ajax({
						url: '/f/forum/excluir/' + id
					}).done(() => window.location.href = "/f/forum")
						.fail(() => carregarLoading("none"));
				}
			}
		}
	});
}


const curtirPergunta = (id, total) => {
	let pergunta;
	for (let search of perguntas) if (search.id == id) {
		pergunta = search;
		break;
	}

	if (pergunta.curtida.indexOf(String(userId)) == -1) {
		$("#pergCurtir" + id).text(total + 1);
		pergunta.curtida.push(String(userId));

		$.ajax({
			url: '/f/forum/curtir/1/' + userId + '/' + id
		});
	} else {
		$("#pergCurtir" + id).text(total - 1);
		pergunta.curtida = pergunta.curtida.filter(e => e !== userId);

		$.ajax({
			url: '/f/forum/rmCurtir/1/' + userId + '/' + id
		});
	}
}


const descurtirPergunta = (id, total) => {
	let pergunta;
	for (let search of perguntas) if (search.id == id) {
		pergunta = search;
		break;
	}

	if (pergunta.descurtida.indexOf(String(userId)) == -1) {
		$("#pergDescurtir" + id).text(total + 1);
		pergunta.descurtida.push(String(userId));

		$.ajax({
			url: '/f/forum/curtir/2/' + userId + '/' + id
		});
	} else {
		$("#pergDescurtir" + id).text(total - 1);
		pergunta.descurtida = pergunta.descurtida.filter(e => e !== userId);

		$.ajax({
			url: '/f/forum/rmCurtir/2/' + userId + '/' + id
		});
	}
}


const curtirComent = (id, total) => {
	let pergunta, comentario;
	for (let searchPergunta of perguntas) {
		for (let searchComent of searchPergunta.comentario) {
			if (searchComent.id == id) {
				pergunta = searchPergunta;
				comentario = searchComent;
				break;
			}
		}
	}

	//adicionar curtida
	if (comentario.curtida.indexOf(String(userId)) == -1) {
		$("#comentCurtir" + id).text(total + 1);
		comentario.curtida.push(String(userId));
		pergunta.comentario = comentario;

		$.ajax({
			url: '/f/forum/curtir/3/' + userId + '/' + id
		});
		//remover curtida
	} else {
		$("#comentCurtir" + id).text(total - 1);
		comentario.curtida = comentario.curtida.filter(e => e !== userId);
		pergunta.comentario = comentario;

		$.ajax({
			url: '/f/forum/rmCurtir/3/' + userId + '/' + id
		});
	}
}


const descurtirComent = (id, total) => {
	let pergunta, comentario;
	console.log(perguntas)
	for (let searchPergunta of perguntas) {
		for (let searchComent of searchPergunta.comentario) {
			if (searchComent.id == id) {
				pergunta = searchPergunta;
				comentario = searchComent;
				break;
			}
		}
	}

	//adicionar descurtida
	if (comentario.descurtida.indexOf(String(userId)) == -1) {
		$("#comentDescurtir" + id).text(total + 1);
		comentario.descurtida.push(String(userId));
		pergunta.comentario = comentario;

		$.ajax({
			url: '/f/forum/curtir/4/' + userId + '/' + id
		});
		//remover curtida
	} else {
		$("#comentDescurtir" + id).text(total - 1);
		comentario.descurtida = comentario.descurtida.filter(e => e !== userId);
		pergunta.comentario = comentario;

		$.ajax({
			url: '/f/forum/rmCurtir/4/' + userId + '/' + id
		});
	}
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
