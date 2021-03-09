$(document).ready(() => $("#nomePagina").text("Estatísticas"));
var [todosDados, objeto, objeto1, dados, dados1] = [[], [], [], [], []];
var [dataInicio, dataFinal, dataAtual] = [0, 0];
var [taxaCrescimentoInicio, taxaCrescimentoFinal, totalDados] = [0, 0, 0]

function filtrar() {
	carregarLoading("block");
	dataInicio = $("#dataInicio").val();
	dataFinal = $("#dataFinal").val()
	dataAtual = new Date();

	if (!dataInicio) {
		dataInicio = dataAtual.getFullYear() + '-'
			+ (dataAtual.getMonth() < 10 ? '0' + dataAtual.getMonth() : dataAtual.getMonth()) + '-'
			+ (dataAtual.getDate() < 10 ? '0' + dataAtual.getDate() : dataAtual.getDate());
	}
	if (!dataFinal) {
		dataFinal = dataAtual.getFullYear() + '-'
			+ (dataAtual.getMonth() + 1 < 10 ? '0' + (dataAtual.getMonth() + 1) : (dataAtual.getMonth() + 1)) + '-'
			+ (dataAtual.getDate() < 10 ? '0' + dataAtual.getDate() : dataAtual.getDate());
	}


	$.ajax({
		url: '/adm/estatistica/filtrar/' + dataInicio + '/' + dataFinal,
		type: 'GET'
	}).done(function(e) {
		todosDados = objeto = objeto1 = e;
		google.charts.load('current', { 'packages': ['corechart', 'line'] });
		google.charts.setOnLoadCallback(drawBackgroundColor);

	});
}
filtrar();


function drawBackgroundColor() {
	gerarTotalVendas();
	gerarEntregas();
	gerarDadosMensal();
	carregarLoading("none");
}


//--------------------------------------------------------------------------------------------
function gerarTotalVendas() {
	var data = null;
	data = new google.visualization.DataTable();
	data.addColumn('string', 'X');
	data.addColumn('number', 'Bruto');
	data.addColumn('number', 'Líquido');
	
	objeto.sort(function(a, b) {
		return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2])
			? 1
			: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	});

	for (obj of objeto) {
		if (obj.totalVendas != 0) {
			dados.push([
				(obj.data.split('-')[2] + '/' + obj.data.split('-')[1]),
				obj.totalVendas,
				obj.totalLucro
			]);
		}
	}

	data.addRows(dados);
	var options = {
		hAxis: {
			title: 'Dia'
		},
		vAxis: {
			title: 'Total de Vendas R$'
		},
		backgroundColor: 'white',
		curveType: 'function',
		legend: { position: 'bottom' },
		role: 'tooltip'
	};

	var chart = new google.visualization.LineChart(document.getElementById('totalVendas'));
	chart.draw(data, options);
}


//--------------------------------------------------------------------------------------------
function gerarEntregas() {
	let data1 = null;
	let [todosBalcao, todosEntrega, todosMesa, todosDrive] = [0, 0, 0, 0];
	/*
	  objeto1.sort(function (a, b) {
			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
					? 1 
					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	  });*/

	for (obj1 of objeto1) {
		if (obj1.totalVendas != 0) {
			todosBalcao += obj1.balcao;
			todosEntrega += obj1.entrega
			todosMesa += obj1.mesa;
			todosDrive += obj1.drive;
		}
	}

	data1 = google.visualization.arrayToDataTable([
		['tipo', 'total'],
		['Balcão', todosBalcao],
		['Entrega', todosEntrega],
		['Mesa', todosMesa],
		['Drive-thru', todosDrive]
	]);
	var options = {
		backgroundColor: 'white',
		is3D: true
	};

	var chart = new google.visualization.PieChart(document.getElementById('entregaBalcao'));
	chart.draw(data1, options);
}


//--------------------------------------------------------------------------------------------
function gerarDadosMensal() {
	let linhaHtml = '';
	let [totalVendas, totalLucro, taxa_entrega, totalPizza, totalPedidos, totalCompras, compraDiaria] = [0, 0, 0, 0, 0, 0, 0];

	for ([i, dado] of todosDados.entries()) {
		//se for menor que a metade
		if (i < todosDados.length / 2 && dado.totalVendas != 0) {
			taxaCrescimentoInicio += Number(dado.totalVendas);
			totalDados++;
		}
		//se for maior que a metade
		if (i >= todosDados.length / 2 && dado.totalVendas != 0) {
			taxaCrescimentoFinal += Number(dado.totalVendas);
			totalDados++;
		}

		compraDiaria = 0;
		for (let comp of dado.compra) compraDiaria += comp.valor;
		totalCompras += compraDiaria;
		totalVendas += dado.totalVendas;
		totalLucro += dado.totalLucro;
		taxa_entrega += dado.taxa_entrega;
		totalPizza += dado.totalPizza;
		totalPedidos += dado.totalPedidos;

		linhaHtml += '<tr>'
			+ '<td class="text-center col-md-1">' + dado.data + '</td>'
			+ '<td class="text-center col-md-1">R$ ' + Number(dado.taxa_entrega).toFixed(2) + '</td>'
			+ '<td class="text-center col-md-1">R$ ' + Number(compraDiaria).toFixed(2) + '</td>'
			+ '<td class="text-center col-md-1">' + dado.totalPizza + '</td>'
			+ '<td class="text-center col-md-1">' + dado.totalPedidos + '</td>'
			+ '<td class="text-center col-md-1">R$ ' + Number(dado.totalVendas).toFixed(2) + '</td>'
			+ '<td class="text-center col-md-1">R$ ' + Number(dado.totalLucro).toFixed(2) + '</td>'
			+ '</tr>';

	}
	$("#gerarDadosMensal").html(linhaHtml);

	let somaHtml = '<tr>'
		+ '<td class="text-center col-md-1">Total:</td>'
		+ '<td class="text-center col-md-1">R$ ' + Number(taxa_entrega).toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + Number(totalCompras).toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">' + totalPizza + '</td>'
		+ '<td class="text-center col-md-1">' + totalPedidos + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + Number(totalVendas).toFixed(2) + '</td>'
		+ '<td class="text-center col-md-1">R$ ' + Number(totalLucro).toFixed(2) + '</td>'
		+ '</tr>';
	$("#geralDadosSoma").html(somaHtml);

	//se a empresa crescer
	if ((taxaCrescimentoFinal - taxaCrescimentoInicio) > 0)
		$("#taxaCrescimento").html('<label class="text-success"><b>'
			+ '<i class="fas fa-arrow-up"></i> '
			+ Math.pow(taxaCrescimentoFinal - taxaCrescimentoInicio, 1 / totalDados).toFixed(2)
			+ ' %</b></label>');
	else
		$("#taxaCrescimento").html('<label class="text-danger"><b>'
			+ '<i class="fas fa-arrow-down"></i> '
			+ Math.pow((taxaCrescimentoFinal - taxaCrescimentoInicio) * (-1), 1 / totalDados).toFixed(2)
			+ ' %</b></label>');
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
	return !isNaN(parseFloat(str))
}

