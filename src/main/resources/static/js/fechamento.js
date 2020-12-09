
var dados = {}, pedidos;
var Tpedidos;
var Tvendas = 0, Tfaturamento = 0;
var Tpizza = 0, Tproduto = 0;

//formas de envio
var envioHtml;
var entrega = 0, balcao = 0, mesa = 0, drive = 0;
var tEntrega = 0, tBalcao = 0, tMesa = 0, tDrive = 0;

//formas de pagamento
var pagHtml;
var dinheiro = 0, cartao = 0;

//impressao
var linhaPizzas = '', linhaProdutos = '', linhaBoy = '';
var cont1 = 0, cont2 = 0;

$("#relatorio").attr("disabled", true);

		
//-------------------------------------------------------------------------------
$.ajax({
	//buscar total de vendas
	url: '/adm/fechamento/pedidos',
	type: 'GET'
}).done(function(e){
	pedidos = e;
	
	//para cada pedido
	for(pedido of pedidos) {
			//separar tipos de envio
			if(pedido.envio == "ENTREGA") {
				entrega++;
				tEntrega += pedido.total;
			}else if(pedido.envio == "BALCAO") {
				balcao++;
				tBalcao += pedido.total;
			}else if(pedido.envio == "MESA") {
				mesa++;
				tMesa += pedido.total;
			}else if(pedido.envio == "DRIVE") {
				drive++;
				tDrive += pedido.total;
			}
	}

	$("#relatorio").attr("disabled", false);
	//--------------------------------------------------------------------------------
	$("#relatorio").click(function(){
		$(this).attr("disabled", true);
		var relatorio = $.alert({type: "blue", title: "Carregando", content: "Carregando relatorio..."});
		relatorio.open();
		
		$.ajax({
			url: '/adm/fechamento/relatorio/' + Tfaturamento,
			type: 'GET'
		}).done(function(){
			relatorio.close();
			$("#relatorio").attr("disabled", false);
			relatorio = $.alert({type: "green", title: "Sucesso", content: "Sucesso!"});
			relatorio.open();
			setTimeout(function(){
				relatorio.close();
			}, 3000);
		}).fail(function(){
			relatorio.close();
			$("#relatorio").attr("disabled", false);
			$.alert("Erro, Pedidos não encontrados!");
		});
	});
	
	
	//----------------------------------------------------------------------------
	google.charts.load("current", {packages:['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
	  var data = google.visualization.arrayToDataTable([
	    ["Element", "Density", { role: "style" } ],
	    ["Entrega", entrega, "green"],
	    ["Balcão", balcao, "blue"],
	    ["Mesa", mesa, "Brown"],
	    ["Drive-Thru", drive, "color: yellow"]
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
	  $.ajax({
	  	url: "/adm/fechamento/dados",
	  	type: "GET"
	  }).done(function(e){
	  	  var data = google.visualization.arrayToDataTable([
	  		["Element", "Density", { role: "style" } ],
	  		["Lucro Bruto", e.totalVendas, "green"],
	  		["Lucro Liquido", e.totalLucro, "blue"],
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
	  });
	}
}).fail(function(){
	$.alert("Nenhum valor encontrado!");
});


//-------------------------------------------------------------------------------
$.ajax({
	url: "/motoboy/logMotoboys",
	type: "GET"
}).done(function(e){
	logmotoboys = e;
	if(logmotoboys != '') {
		logmotoboys = JSON.parse(logmotoboys);
		var reduced = [];
		
		logmotoboys.forEach((item) => {
		    var duplicated = reduced.findIndex(redItem => {
		        return item.a == redItem.a;
		    }) > -1;

		    if(!duplicated) {
		        reduced.push(item);
		    }
		});

		linhaBoy = '<h3>Taxas de entrega</h3>'
					+'<div id="divmotoboys">'
					+'<table style="width:100%">'
						+'<thead>'
							+'<tr>'
								+'<th class="text-center col-md-1"><h4>Comanda</h4></th>'
								+'<th class="text-center col-md-1"><h4>Motoboy</h4></th>'
								+'<th class="text-center col-md-1"><h4>Taxa</h4></th>'
								+'<th class="text-center col-md-1"><h4>Pedido</h4></th>'
								+'<th class="text-center col-md-1"><h4>Endereco</h4></th>'
							+'</tr>'
						+'</thead>'
						
						+'<tbody>';
						
		
		for(boy of logmotoboys) {
			linhaBoy += '<tr>'
					+ '<td>' + boy.comanda + '</td>'
					+ '<td>' + boy.motoboy + '</td>'
					+ '<td>R$ ' + parseFloat(boy.taxa).toFixed(2) + '</td>'
					+ '<td>' + boy.nome + '</td>'
					+ '<td>' + boy.endereco + '</td>'
				+ '</tr>';
		}
		
		linhaBoy += '</tbody>'
				+'</table>'
				+'<br>'
			+'</div>';
		
		$("#divmotoboys").css({
			'overflow': 'scroll'
		}).css({
			'height': '30vh'
		});
		$("#logmotoboys").html(linhaBoy);
	}else $("#logmotoboys").html('<label>Nenhuma entrega feita hoje!</label>');
	
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


//-------------------------------------------------------------------
function troco(){
	$.confirm({
		type: 'blue',
		title: 'Troco final do caixa',
		content: '<input type="text" placeholder="Digite o troco final do caixa" class="form-control preco" id="troco"/>',
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
						
						$.ajax({
							url: '/adm/fechamento/finalizar/' + troco,
							type: 'PUT'
						}).done(function(){

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
