$(document).ready(() => $("#nomePagina").text("Top 10"));

var mesas = [], top5 = [];


//mesas------------------------------------------------------
function mostrarMesas() {
	if ($("#topMesas").is(":visible") == false) {
		carregarLoading("block");

		$.ajax({
			url: "/adm/top10/mesas",
			type: "GET"
		}).done(function(e) {
			mesas = e;

			//remover caracteres
			for (mesa of mesas) {
				try {
					mesa.mesa = mesa.mesa.replace(/[^\d]+/g, '');
				} catch (e) { }//remover letras
			}

			//ordenar vetor decrescente
			top5Mesas = mesas.sort((a, b) => (a.contador < b.contador) ? 1 : ((b.contador < a.contador) ? -1 : 0));

			//reduzir a 10 mesas
			if (top5Mesas.length > 10) {
				top5Mesas = top5Mesas.slice(0, 10);
			}

			mesasHtml = '';
			if (top5Mesas.length == 0) {
				mesasHtml = '<tr><td colspan="3" align="center"><label>Nenhuma mesa encontrada!</label></td><tr>';
				carregarLoading("none");
			} else {
				for ([i, mesa] of top5Mesas.entries()) {
					mesasHtml += '<tr>'
						+ `<td align="center">Top ${i + 1}</td>`
						+ `<td align="center"><b>Mesa ${mesa.mesa}</b></td>`
						+ `<td align="center">${mesa.contador} vezes</td>`
						+ '</tr>';
				}
			}

			carregarLoading("none");
			$("#topMesas").show("slow");
			$("#btnMesas").text("Ocultar Top 10 Mesas");
			$("#mesasTop").html(mesasHtml);
		});
	} else {
		$("#topMesas").hide("slow");
		$("#btnMesas").text("Mostrar Top 10 Mesas");
	}
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}
