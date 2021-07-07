$(document).ready(() => $("#nomePagina").text("Estatísticas"));
var [todosDados, objeto, objeto1, dados, dados1] = [[], [], [], [], []];
var [dataInicio, dataFinal, dataAtual] = [0, 0];
var [taxaCrescimentoInicio, taxaCrescimentoFinal, totalDados, mediaDesvioPadrao] = [0, 0, 0, 0];
var [totalVendas, totalLucro, taxa_entrega, totalPizza, totalPedidos, totalCompras, compraDiaria] = [0, 0, 0, 0, 0, 0, 0];
let [todosBalcao, todosEntrega, todosMesa, todosDrive] = [0, 0, 0, 0];

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
async function gerarTotalVendas() {
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
async function gerarEntregas() {
	let data1 = null;
	[todosBalcao, todosEntrega, todosMesa, todosDrive] = [0, 0, 0, 0];
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
async function gerarDadosMensal() {
	let linhaHtml = '', cont = 0, arrayDesvioPadrao = [], somaXY = 0;
	[totalVendas, totalLucro, taxa_entrega, totalPizza, totalPedidos, totalCompras, compraDiaria] = [0, 0, 0, 0, 0, 0, 0];
	[taxaCrescimentoInicio, taxaCrescimentoFinal, mediaDesvioPadrao, totalDados] = [0, 0, 0, 0];

	for ([i, dado] of todosDados.entries()) {
		if (dado.totalVendas != 0) {
			//verificar total de dados nao nulos
			cont++;

			//soma regressao linear
			somaXY += (dado.totalVendas * cont);

			if (todosDados.length > 1) {
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
			}

			compraDiaria = 0;
			for (let comp of dado.compra) compraDiaria += comp.valor;
			totalCompras += compraDiaria;
			totalVendas += dado.totalVendas;
			totalLucro += dado.totalLucro;
			taxa_entrega += dado.taxa_entrega;
			totalPizza += dado.totalPizza;
			totalPedidos += dado.totalPedidos;

			//desvio padrao
			arrayDesvioPadrao.push(dado.totalVendas);

			let dataAtual = dado.data.split('-')[2] + '/'
				+ dado.data.split('-')[1] + '/'
				+ dado.data.split('-')[0];

			linhaHtml += '<tr>'
				+ '<td>' + dataAtual + '</td>'
				+ '<td>R$ ' + Number(dado.taxa_entrega).toFixed(2) + '</td>'
				+ '<td>R$ ' + Number(compraDiaria).toFixed(2) + '</td>'
				+ '<td>' + dado.totalPizza + '</td>'
				+ '<td>' + dado.totalPedidos + '</td>'
				+ '<td>R$ ' + Number(dado.totalVendas).toFixed(2) + '</td>'
				+ '<td>R$ ' + Number(dado.totalLucro).toFixed(2) + '</td>'
				+ '<td>R$ ' + Number(dado.totalVendas - dado.totalLucro).toFixed(2) + '</td>'
				+ '</tr>';
		}
	}
	if (todosDados.length != 0)
		$("#gerarDadosMensal").html(linhaHtml);
	else
		$("#gerarDadosMensal").html('<tr><td colspan="8">Nenhum dado encontrado!</td></tr>');


	let somaHtml = '<tr>'
		+ '<td>Total:</td>'
		+ '<td>R$ ' + Number(taxa_entrega).toFixed(2) + '</td>'
		+ '<td>R$ ' + Number(totalCompras).toFixed(2) + '</td>'
		+ '<td>' + totalPizza + '</td>'
		+ '<td>' + totalPedidos + '</td>'
		+ '<td>R$ ' + Number(totalVendas).toFixed(2) + '</td>'
		+ '<td>R$ ' + Number(totalLucro).toFixed(2) + '</td>'
		+ '<td>R$ ' + Number(totalVendas - totalLucro).toFixed(2) + '</td>'
		+ '</tr>';
	$("#geralDadosSoma").html(somaHtml);

	//se a empresa crescer
	if ((taxaCrescimentoFinal - taxaCrescimentoInicio) > 0)
		$("#taxaCrescimento").html('<label class="text-success"><b>'
			+ '<i class="fas fa-arrow-up"></i> '
			+ Math.pow(taxaCrescimentoFinal - taxaCrescimentoInicio, 1 / totalDados).toFixed(2)
			+ ' %</b></label>');
	else if ((taxaCrescimentoFinal - taxaCrescimentoInicio) < 0)
		$("#taxaCrescimento").html('<label class="text-danger"><b>'
			+ '<i class="fas fa-arrow-down"></i> '
			+ Math.pow((taxaCrescimentoFinal - taxaCrescimentoInicio) * (-1), 1 / totalDados).toFixed(2)
			+ ' %</b></label>');
	else if ((taxaCrescimentoFinal - taxaCrescimentoInicio) == 0)
		$("#taxaCrescimento").html('<label class="text-warning"><b>'
			+ '<i class="fas fa-arrow-down"></i> 0.00 %</b></label>');

	//desvio padrao
	mediaDesvioPadrao = totalVendas / cont;

	const totalDesvioPadrao = () => {
		let totalDesvio = 0;
		for (valor of arrayDesvioPadrao) {
			totalDesvio += Math.pow(valor - mediaDesvioPadrao, 2)
		}
		totalDesvio /= arrayDesvioPadrao.length;
		return Math.sqrt(totalDesvio);
	}

	if (isNumber(totalDesvioPadrao()))
		$("#desvioPadrao").html('<b>R$ ' + totalDesvioPadrao().toFixed(2) + '</b>');
	else
		$("#desvioPadrao").html('<b>R$ 0.00</b>');

	//media de vendas
	if (isNumber(mediaDesvioPadrao))
		$("#media").html('<b>R$ ' + mediaDesvioPadrao.toFixed(2) + '</b>');
	else
		$("#media").html('<b>R$ 0.00</b>');

	//regressao linear
	const somaX = () => {
		let totalSomaX = 0
		for (i = 1; i <= cont; i++) {
			totalSomaX += i;
		}
		return totalSomaX;
	};
	const somaY = totalVendas;

	const somaYY = () => {
		let totalYY = 0;
		for (valor of arrayDesvioPadrao) {
			totalYY += Math.pow(valor, 2);
		}
		return totalYY;
	}
	const somaXX = () => {
		let totalSomaXX = 0
		for (i = 1; i <= cont; i++) {
			totalSomaXX += Math.pow(i, 2);
		}
		return totalSomaXX;
	}

	const alfaRegressao = ((Number(cont * somaXY) - Number(somaX() * somaY))
		/ (Math.sqrt(Number(cont * somaXX()) - Number(Math.pow(somaX(), 2)))
			* Math.sqrt(Number(cont * somaYY()) - Number(Math.pow(somaY, 2)))
		));

	const betaRegressao = (Number(somaY / cont) - Number(alfaRegressao * Number(somaX() / cont)));

	//Y = alfaRegressao * X - betaRegressao + erro
	if (cont != 0)
		graficoRegressao(alfaRegressao, betaRegressao, cont);
	else
		graficoRegressao(0, 0, 0);
		
	correlacao(Math.pow(alfaRegressao, 2));
}


function graficoRegressao(alfaRegressao, betaRegressao, cont) {
	let [dadosGrafico, arrayValores, dadosGraficoReduzido] = [[], [], []];
	if (cont != 0) {
		for (let x = 1; x <= cont; x++) {
			let y = (Number(alfaRegressao * x) + Number(betaRegressao) / 100);
			dadosGrafico.push([x.toString(), Number(Number(y).toFixed(2))]);
			arrayValores.push(y);
		}

		//reduzir tamanho do grafico
		const min = Math.min(...arrayValores);

		//reduzir dados do grafico ao min
		dadosGrafico.forEach(val => val[1] -= min.toFixed(2));

		dadosGraficoReduzido = [['Dia', 'Taxa'], ...dadosGrafico];
	} else {
		dadosGraficoReduzido = [['Dia', 'Taxa'], [0, 0], [1, 0]];
	}

	var data = new google.visualization.arrayToDataTable(dadosGraficoReduzido);

	var options = {
		hAxis: { title: 'Dia', titleTextStyle: { color: '#333' } },
		vAxis: { title: 'Crescimento', minValue: 0 },
		curveType: 'function',
		legend: { position: 'bottom' }
	};

	var chart = new google.visualization.LineChart(document.getElementById('tendencia'));
	chart.draw(data, options);
}


function correlacao(r){
	console.log(r)
	if(!isNumber(r) || r == 0){
		$("#correlacao").html('<span class="text-danger"><b>0 - Péssimo</b></span>');
	}else if(r > 0 && r <= 0.35){
		$("#correlacao").html('<span class="text-warning"><b>' + Number(r).toFixed(2) + ' - Ruim</b></span>');
	}else if(r > 0.35 && r <= 0.65){
		$("#correlacao").html('<span class="text-secondary"><b>' + Number(r).toFixed(2) + ' - Bom</b></span>');
	}else if(r > 0.65 && r <= 0.95){
		$("#correlacao").html('<span class="text-primary"><b>' + Number(r).toFixed(2) + ' - Muito bom</b></span>');
	}else if(r > 0.95){
		$("#correlacao").html('<span class="text-success"><b>' + Number(r).toFixed(2) + ' - Perfeito</b></span>');
	}
}


function carregarLoading(texto) {
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
	return !isNaN(parseFloat(str))
}

