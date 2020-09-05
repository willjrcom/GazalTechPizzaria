
var dados = {};
var Tpedidos;
var Tvendas = 0, Tfaturamento = 0;
var Tpizza = 0, Tproduto = 0;

//formas de envio
var envioHtml;
var entrega = 0, balcao = 0, mesa = 0, ifood = 0, drive = 0;
var tEntrega = 0, tBalcao = 0, tMesa = 0, tIfood = 0, tDrive = 0;
//formas de pagamento
var pagHtml;
var dinheiro = 0, cartao = 0;


//-------------------------------------------------------------------------------
$.ajax({
	//buscar total de pedidos
	url: '/fechamento/Tpedidos',
	type: 'PUT'
}).done(function(e){
	Tpedidos = e;
}).fail(function(){
	$.alert("Nenhum pedido encontrado!");
});


//-------------------------------------------------------------------------------
$.ajax({
	//buscar total de vendas
	url: '/fechamento/Tvendas',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	
	//para cada pedido
	console.log('total pedidos: ' + e.length);
	
	for(var i = 0; i < e.length; i++) {
			e[i].produtos = JSON.parse(e[i].produtos);
			e[i].pizzas = JSON.parse(e[i].pizzas);
			
			
			Tvendas += parseFloat(e[i].total);
			console.log('Tvendas: ' + Tvendas);
			//para cada produto
			for(var j = 0; j < e[i].produtos.length; j++) {
				Tfaturamento += parseFloat(e[i].produtos[j].custo);
				Tproduto += parseFloat(e[i].produtos[j].qtd);
			}
			//para cada pizza
			for(var j = 0; j < e[i].pizzas.length; j++) {
				Tfaturamento += parseFloat(e[i].pizzas[j].custo);
				Tpizza += parseFloat(e[i].pizzas[j].qtd);
			}
			
			
			//separar tipos de envio
			if(e[i].envio == "ENTREGA") {
				entrega ++;
				tEntrega += e[i].total;
			}else if(e[i].envio == "BALCAO") {
				balcao ++;
				tBalcao += e[i].total;
			}else if(e[i].envio == "MESA") {
				mesa ++;
				tMesa += e[i].total;
			}else if(e[i].envio == "IFOOD") {
				ifood ++;
				tIfood += e[i].total;
			}else if(e[i].envio == "DRIVE") {
				drive ++;
				tDrive += e[i].total;
			}
			
			
			//separar tipos de pagamento
			
	}
	
	
	//criar html de acordo com os tipos existentes
	if(Tpedidos != 0) {
		if(Tpedidos == 1) {
			envioHtml = '<tr><td>' + Tpedidos + ' Pedido total sendo:</td></tr>';
		}else {
			envioHtml = '<tr><td><label>' + Tpedidos + ' Pedidos totais sendo:</label></td></tr>';
		}
	}else {
		envioHtml = '<tr><td><label>' + 0 + ' Pedidos finalizados</label></td></tr>';
	}
	if(entrega != 0) {
		if(entrega == 1) {
			envioHtml += '<tr><td>' + entrega + ' entrega - R$: ' + tEntrega.toFixed(2) + '</td></tr>';
		}else {
			envioHtml += '<tr><td>' + entrega + ' entregas - R$: ' + tEntrega.toFixed(2) + '</td></tr>';
		}
	}
	if(balcao != 0) {
		if(balcao == 1) {
			envioHtml += '<tr><td>' + balcao + ' balcão - R$: ' + tBalcao.toFixed(2) + '</td></tr>';
		}else {
			envioHtml += '<tr><td>' + balcao + ' balcões - R$: ' + tBalcao.toFixed(2) + '</td></tr>';
		}
	}
	if(mesa != 0) {
		if(mesa == 1) {
			envioHtml += '<tr><td>' + mesa + ' mesa - R$: ' + tMesa.toFixed(2) + '</td></tr>';
		}else {
			envioHtml += '<tr><td>' + mesa + ' mesas - R$: ' + tMesa.toFixed(2) + '</td></tr>';
		}
	}
	if(ifood != 0) {
		if(ifood == 1) {
			envioHtml += '<tr><td>' + ifood + ' ifood - R$: ' + tIfood.toFixed(2) + '</td></tr>';
		}else {
			envioHtml += '<tr><td>' + ifood + ' ifoods - R$: ' + tIfood.toFixed(2) + '</td></tr>';
		}
	}
	if(drive != 0) {
		if(drive == 1) {
			envioHtml += '<tr><td>' + drive + ' drive - R$: ' + drive.toFixed(2) + '</td></tr>';
		}else {
			envioHtml += '<tr><td>' + drive + ' drives - R$: ' + drive.toFixed(2) + '</td></tr>';
		}
	}

	$("#fEnvio").html(envioHtml);
	$("#Tvendas").text('R$ ' + Tvendas.toFixed(2));
	$("#Tfaturamento").text('R$ ' + (Tvendas - parseFloat(Tfaturamento).toFixed(2)).toFixed(2) );
}).fail(function(){
	$.alert("Nenhum valor encontrado!");
});


//-----------------------------------------------------------------------------------
$("#delete_all").click(function(){
	$.confirm({
		title: 'APAGAR TUDO?',
		content: 'Tem certeza?',
		buttons: {
	        confirm: {
				text: 'APAGAR',
	    		keys: ['enter'],
	            btnClass: 'btn-red',
	            action: function(){
					$.ajax({
						url: '/fechamento/apagartudo',
						type: 'PUT'
					}).done(function(){
						$.alert("Todos pedidos foram apagados!");
					}).fail(function(){
						$.alert("Falhou!");
					})
				}
			},
	        cancel: {
				text: 'Voltar',
	    		keys: ['esc'],
	            btnClass: 'btn-green'
			}
		}
	});
});


//--------------------------------------------------------------------------------
$("#download_all").click(function(){
	$.ajax({
		url: '/fechamento/baixartudo',
		type: 'PUT',
	}).done(function(data){
          data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = 'data:' + data ;
          a.download = "data.json";
          a.click();
	}).fail(function(){
		$.alert("Pedidos não encontrados!");
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

function troco(){
	$.confirm({
		type: 'blue',
		title: 'Troco do caixa',
		content: '<input type="text" placeholder="Digite o troco final do caixa" class="form-control" id="troco" value="0"/>',
		buttons:{
			confirm:{
				text:'Salvar',
				btnClass: 'btn-success',
				keys:['enter'],
				action: function(){
		
					var troco = this.$content.find('#troco').val();
		
					if(troco % 2 != 0 && troco % 2 != 1) {
						$.alert({
							type:'red',
							title:'Tente novamente!',
							content: 'Digite um valor válido.',
							buttons:{
								confirm:{
									text:'Voltar',
									btnClass: 'btn-danger',
									keys:['enter','esc'],
								}
							}
						});
						troco();
					}
					
					//buscar data do sistema
					$.ajax({
						url: '/fechamento/data',
						type: 'PUT'
					}).done(function(e){
						dados.data = e.dia;
							
						//buscar id da data do sistema
						$.ajax({
							url: '/fechamento/buscarIdData/' + dados.data,
							type: 'PUT'
						}).done(function(e){

							console.log(e);
							dados.id = e.id;
							dados.balcao = balcao + mesa + drive;
							dados.entregas = entrega + ifood;
							dados.totalLucro = Tvendas - parseFloat(Tfaturamento);
							dados.totalPedidos = Tpedidos;
							dados.totalVendas = Tvendas;
							dados.totalPizza = Tpizza;
							dados.totalProduto = Tproduto;
							dados.trocoFinal = troco;
							dados.trocoInicio = e.trocoInicio;
							console.log(dados);
							
							$.ajax({
								url: '/fechamento/finalizar/' + dados.id,
								type: 'PUT',
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(dados)
							}).done(function(e){
								console.log(e);
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
								
							}).fail(function(){
								$.alert("Erro");
							});
						
						});
					}).fail(function(){
						$.alert("Entre em contato conosco!");
					});
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


//----------------------------------------------------------------------------
google.charts.load("current", {packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Element", "Density", { role: "style" } ],
    ["Entrega", entrega, "green"],
    ["Balcão", balcao, "blue"],
    ["Mesa", mesa, "Brown"],
    ["Ifood", ifood, "color: red"],
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
  
  
  
  //------------------------------------------------------------------------------------------------
  var data = google.visualization.arrayToDataTable([
	["Element", "Density", { role: "style" } ],
	["Lucro Bruto", Tvendas, "green"],
	["Lucro Liquido", Tfaturamento, "blue"],
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


//----------------------------------------------------------------------------------------