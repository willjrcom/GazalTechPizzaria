$(document).ready(() => $("#nomePagina").text("Fechamento do dia"));
var [Tvendas, Tfaturamento] = [0, 0];
var totalMotoboys;
var compras = 0;
//formas de envio
var envioHtml;
var [entrega, balcao, mesa, drive] = [0, 0, 0, 0];
var [tEntrega, tBalcao, tMesa, tDrive] = [0, 0, 0, 0];

//formas de pagamento
var pagHtml;
var dinheiro = 0, cartao = 0;

//impressao
var [linhaPizzas, linhaProdutos, linhaBoy] = ['', '', ''];

var linhaCinza = '<tr><td colspan="4" class="fundoList"></td></tr>';

carregarLoading("block");


$("#relatorio").click(function(){

		$("#relatorio").attr("disabled", true);
		
		carregarLoading("block");
		
		$.ajax({
			url: '/imprimir/relatorioFechamento'
		}).done(function(){
			carregarLoading("none");

			$("#relatorio").attr("disabled", false);
			relatorio = $.alert({type: "green", title: "Relatório", content: "Gerado com sucesso!"});
			relatorio.open();
			setTimeout(function(){
				relatorio.close();
			}, 10000);
		}).fail(function(){
			carregarLoading("none");
			$("#relatorio").attr("disabled", false);
			$.alert("Erro, Pedidos não encontrados!");
		});
	});

//-------------------------------------------------------------------------------
$.ajax({
  	url: "/adm/fechamento/dados",
  	type: "GET"
}).done(function(e){
	console.log(e)
	//motoboy-------------------------------------------------------------------
	if(e.logMotoboy.length != 0)
		carregarMotoboy(e.logMotoboy);
	else
		$("#logmotoboys").html('<label>Nenhuma entrega feita hoje!</label>');
		
	setTimeout(() => $("#mostrarTaxasCompleto").show('slow'), 1000);
	$("#logmotoboys").show();
	

	//compras---------------------------------------------------------------------
	calcularCompra(e.compra);
	
	//sangrias---------------------------------------------------------------------
	calcularSangria(e.sangria);
		
	
	//graficos---------------------------------------------------------------------
	google.charts.load("current", {packages:['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
	  var data = google.visualization.arrayToDataTable([
	    ["Element", "Density", { role: "style" } ],
	    ["Entrega", Number(e.entrega), "green"],
	    ["Balcão", Number(e.balcao), "blue"],
	    ["Mesa", Number(e.mesa), "Brown"],
	    ["Drive-Thru", Number(e.drive), "color: yellow"]
	  ]);

	  var view = new google.visualization.DataView(data);
	  view.setColumns([0, 1,
	                   { calc: "stringify",
	                     sourceColumn: 1,
	                     type: "string",
	                     role: "annotation" },
	                   2]);

	  var options = {
	    bar: {groupWidth: "80%"},
	    legend: { position: "none" },
	  };
	  var chart = new google.visualization.ColumnChart(document.getElementById("totalPedidos"));
	  chart.draw(view, options);
	  
	  //-------------------------------------------------------------------------------
  	  var data = google.visualization.arrayToDataTable([
  		["Element", "Density", { role: "style" } ],
  		["Lucro Bruto", Number(e.totalVendas), "green"],
  		["Lucro Liquido", Number(e.totalLucro), "blue"],
  		  ]);
  		
  	  	  var view = new google.visualization.DataView(data);
  		  view.setColumns([0, 1,
  		                   { calc: "stringify",
  		                 sourceColumn: 1,
  		                 type: "string",
  		                 role: "annotation" },
  		                   2]);
  		
  		  var options = {
  		    bar: {groupWidth: "60%"},
  		    legend: { position: "none" },
  		  };
  		  var chart = new google.visualization.ColumnChart(document.getElementById("totalVendas"));
  		  chart.draw(view, options);
	}
	carregarLoading("none");
}).fail(function(){
	carregarLoading("none");
	$.alert("Nenhum valor encontrado!");
});


//-------------------------------------------------------------------------------------
function carregarMotoboy(logmotoboys){
	//resumo
	const todosNomes = logmotoboys.map(logmotoboys => logmotoboys.motoboy);
	var objsMotoboys = [];
	const nomes = Array.from(new Set(todosNomes))
	for(let nome of nomes){
		objsMotoboys.push({
			nome,
			taxa: 0
		});
	}

	for(let boy of objsMotoboys){
		for(let entrega of logmotoboys){
			if(entrega.motoboy === boy.nome){
				boy.taxa += Number(entrega.taxa);
			}
		}
	}
	
	totalMotoboys = objsMotoboys.reduce((a, b) => a.taxa + b.taxa);
	
	linhaBoy = '<div class="divMotoboys">'
				+ '<table>'
					+ '<thead>'
						+'<tr>'
							+'<th class="text-center col-md-1"><h4>Motoboy</h4></th>'
							+'<th class="text-center col-md-1"><h4>Taxa total</h4></th>'
						+'</tr>'
					+'</thead>'
				+ '</table>'
				
				+ '<div class="table-min-scroll">'
					+ '<table>'
						+ '<tbody>';
	
	for(boy of objsMotoboys) {
		linhaBoy += '<tr>'
				+ '<td class="text-center col-md-1">' + boy.nome.substring(0, 20) + '</td>'
				+ '<td class="text-center col-md-1">' + parseFloat(boy.taxa).toFixed(2) + '</td>'
			+ '</tr>' + linhaCinza;
	}
	
	linhaBoy += '</tbody>'
			+'</table></div></div>';
			
	$("#logResumo").html(linhaBoy);
			
			
	//completo-------------------------------------------------------------------------
	linhaBoy = '<div class="divMotoboys">'
				+ '<table>'
					+ '<thead>'
						+'<tr>'
							+'<th class="text-center col-md-1"><h4>Comanda</h4></th>'
							+'<th class="text-center col-md-1"><h4>Pedido</h4></th>'
							+'<th class="text-center col-md-1"><h4>Motoboy</h4></th>'
							+'<th class="text-center col-md-1"><h4>Taxa</h4></th>'
						+'</tr>'
					+'</thead>'
				+ '</table>'
				
				+ '<div class="table-min-scroll">'
					+ '<table>'
						+ '<tbody>';
					
	for(boy of logmotoboys) {
		linhaBoy += '<tr>'
				+ '<td class="text-center col-md-1">' + boy.comanda + '</td>'
				+ '<td class="text-center col-md-1">' + boy.nome + '</td>'
				+ '<td class="text-center col-md-1">' + boy.motoboy + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + parseFloat(boy.taxa).toFixed(2) + '</td>'
			+ '</tr>' + linhaCinza;
	}
	
	linhaBoy += '</tbody>'
			+'</table></div></div>';
	
	$(".divmotoboys").css({
		'height': '30vh'
	});
}


function calcularCompra(compra){
	if(compra.length != 0) {
		var produtos = e.compras;
		for(produto of produtos) {
			compras += parseFloat(produto.valor);
		}
					
		$("#compras").html('<tr>'
							+ '<th class="text-center"><h5><i class="fas fa-dollar-sign"></i> Total compras da empresa</h5></th>'
						+ '</tr>'
						+ '<tr>'
							+ '<td class="text-center col-md-1">R$ ' + compras.toFixed(2) + '</td>'
						+ '</tr>'
					);
	}else{
		$("#compras").text("Nenhuma compra feita hoje!");
	}
}


function calcularSangria(sangrias){
	if(typeof sangrias != "undefined") {
		let totalSangria = 0, sangriaHtml = '';
		
		sangriaHtml = '<tr>'
						+ '<th class="text-center" colspan="2"><h5><i class="fas fa-dollar-sign"></i> Sangrias do dia</h5></th>'
					+ '</tr>';
					
		for(let sangria of sangrias) {
			totalSangria += parseFloat(sangria.valor);
			
			sangriaHtml += '<tr>'
						+ '<td class="text-center col-md-1">' + sangria.nome + '</td>'
						+ '<td class="text-center col-md-1">R$ ' + sangria.valor.toFixed(2) + '</td>'
					+ '</tr>';
		}
			
		sangriaHtml += '<tr><td>&nbsp;</td></tr>' 
					+ '<tr>'
						+ '<th class="text-center col-md-1" colspan="2">Total retirado do caixa</th>'
					+ '</tr>'
					
					+ '<tr>'
						+ '<td class="text-center col-md-1" colspan="2">R$ ' + totalSangria.toFixed(2) + '</td>'
					+ '</tr>';
		
					
		$("#todasSangrias").html(sangriaHtml);
	}else{
		$("#todasSangrias").text("Nenhuma sangria feita hoje!");
	}
}

//--------------------------------------------------------------------------------------
$("#mostrarTaxasCompleto").click(() => {
	$.alert({
		type: 'blue',
		title: 'Taxas de entrega completo',
		content: linhaBoy,
	    closeIcon: true,
	    columnClass: 'col-md-12',
		buttons:{
			confirm:{
				isHidden: true,
				keys: ['esc', 'enter']
			}
		}
	});
});


//---------------------------------------------------------------------------------------
$("#finalizar_caixa").click(function(){
	$.confirm({
		type: 'blue',
		title: 'Finalizar caixa',
		content: 'Faça isso apenas uma vez ao fim do dia',
		buttons:{
			confirm:{
				text:'Sim',
				btnClass: 'btn-success',
				keys:['enter'],
				action: function(){
					troco();
				}
			},
			cancel:{
				text:'Não',
				btnClass: 'btn-danger',
				keys:['esc'],
			}
		}
	});
});


$("#sangria").click(function(){
	$.confirm({
		type: 'blue',
		title: 'Sangria',
		columnClass: 'col-md-8',
		content: '<div class="row">'
					+ '<div class="col-md-6">'
						+ '<label>Nome:</label>'
						+ '<input class="form-control pula" id="nomeSangria" placeholder="Digite o nome"/>'
					+ '</div>'
					
					+ '<div class="col-md-6">'
						+ '<label>Valor:</label>'
						+ '<input class="form-control pula" id="valorSangria" placeholder="Digite o valor"/>'
					+ '</div>'
				+ '</div>',
		buttons:{
			confirm:{
				text: 'Salvar',
				btnClass: 'btn-success',
				keys:['enter'],
				action: function(){
					var nomeSangria = this.$content.find('#nomeSangria').val();
					var valorSangria = this.$content.find('#valorSangria').val();
					
					valorSangria = parseFloat(valorSangria.toString().replace(",","."));
					console.log(nomeSangria, valorSangria)
					if(Number.isFinite(valorSangria) == false || nomeSangria == '') {
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm:{
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					}else {
						carregarLoading("block");
						$.ajax({
							url: '/adm/fechamento/sangria/' + nomeSangria + '/' + valorSangria,
							type: 'POST'
						}).done(function(){
							carregarLoading("none");
							$.alert({
								type:'green',
								title: 'Sucesso!',
								content: 'Sangria adicionada com sucesso!',
								buttons:{
									confirm:{
										text:'Continuar',
										btnClass: 'btn-success',
										keys:['enter', 'esc'],
										action: () => window.location.href = '/adm/fechamento'
									}
								}
							});
						});
					}
				}
			},
			cancel:{
				text: 'Voltar',
				btnClass: 'btn-danger',
				keys:['esc'],
			}
		}
	});
});


//-------------------------------------------------------------------
function troco(){
	$.confirm({
		type: 'blue',
		title: 'Troco final do caixa',
		content: 'Troco:'
				+ '<div class="input-group mb-3">'
					+ '<span class="input-group-text">R$</span>'
					+ '<input class="form-control" id="troco" placeholder="Digite o valor do troco"/>'
				+ '</div>',
		buttons:{
			confirm:{
				text:'Salvar',
				btnClass: 'btn-success',
				keys:['enter'],
				action: function(){
		
					var troco = this.$content.find('#troco').val();
					
					troco = parseFloat(troco.toString().replace(",","."));

					if(Number.isFinite(troco) == false) {
						$.alert({
							type: 'red',
							title: 'OPS...',
							content: "Digite um valor válido",
							buttons: {
								confirm:{
									text: 'Voltar',
									btnClass: 'btn-danger',
									keys: ['esc', 'enter']
								}
							}
						});
					}else {
						carregarLoading("block");
						$.ajax({
							url: '/adm/fechamento/finalizar/' + troco,
							type: 'POST'
						}).done(function(){
							carregarLoading("none");
							$.alert({
								type:'green',
								title: 'Sucesso!',
								content: 'Caixa finalizado com sucesso!',
								buttons:{
									confirm:{
										text:'Continuar',
										btnClass: 'btn-success',
										keys:['enter', 'esc'],
									}
								}
							});
						});
					}
				}
			},
			cancel:{
				text:'Voltar',
				btnClass: 'btn-danger',
				keys:['esc'],
			}
		}
	});
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}

