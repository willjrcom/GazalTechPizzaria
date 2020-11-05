
var dados = {};
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
var linhaPizzas = '', linhaProdutos = '';
var cont1 = 0, cont2 = 0;

//-------------------------------------------------------------------------------
$.ajax({
	//buscar total de pedidos
	url: '/adm/fechamento/Tpedidos',
	type: 'PUT'
}).done(function(e){
	Tpedidos = e;
}).fail(function(){
	$.alert("Erro, Nenhum pedido encontrado!");
});


//-------------------------------------------------------------------------------
$.ajax({
	//buscar total de vendas
	url: '/adm/fechamento/Tvendas',
	type: 'PUT'
}).done(function(e){
	
	//para cada pedido
	for(var i = 0; i < e.length; i++) {
			e[i].produtos = JSON.parse(e[i].produtos);
			e[i].pizzas = JSON.parse(e[i].pizzas);
						
			Tvendas += parseFloat(e[i].total);

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
			}else if(e[i].envio == "DRIVE") {
				drive ++;
				tDrive += e[i].total;
			}
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


//--------------------------------------------------------------------------------
$("#download_all").click(function(){
	//salvar hora atual
	var data = new Date();
	hora = data.getHours();
	hora = (hora.length == 0) ? '00' : hora;
	hora = (hora <= 9) ? '0'+hora : hora;
	minuto = data.getMinutes();
	minuto = (minuto.length == 0) ? '00' : minuto;
	minuto = (minuto <= 9) ? '0'+minuto : minuto;
	segundo = data.getSeconds();
	segundo = (segundo.length == 0) ? '00' : segundo;
	segundo = (segundo <= 9) ? '0'+segundo : segundo;
    dia  = data.getDate().toString();
    dia = (dia.length == 1) ? '0'+dia : dia;
    mes  = (data.getMonth()+1).toString();
    mes = (mes.length == 1) ? '0'+mes : mes;
    ano = data.getFullYear();
		    
	$.ajax({
		url: '/adm/fechamento/baixartudo',
		type: 'PUT',
	}).done(function(pedidos){
          
		var totalPedidos = pedidos.length, totalDinheiro = 0, totalPizzas = 0, totalProdutos = 0;
		
	    for(pedido of pedidos) {
	    	pedido.pizzas = JSON.parse(pedido.pizzas);
	    	pedido.produtos = JSON.parse(pedido.produtos);
	    	totalDinheiro += pedido.total;

	    	mostrarPizzas(pedido.pizzas); //construir html de pizzas para impressao
	    	mostrarProdutos(pedido.produtos); //construir html de produtos para impressao
	    	
	    	for(pizza of pedido.pizzas) {
	    		totalPizzas += pizza.qtd;
	    	}
	    	
	    	for(produto of pedido.produtos) {
	    		totalProdutos += produto.qtd;
	    	}
	    }
	    //buscar dados da empresa
		$.ajax({
			url: '/novoPedido/empresa',
			type: 'PUT'
		}).done(function(e){
			if(e.length != 0) {
				
				//dados da empresa
				var imprimirTxt = '<html><h2 align="center">' + e.nomeEstabelecimento + '</h2>'//nome do estabelecimento
							+ '<label>Empresa: ' + e.nomeEmpresa + '<br>'
							+ 'CNPJ: ' + e.cnpj + '<br>'
							+ 'Endereço: ' + e.endereco.rua + ', ' + e.endereco.n + ' - '
							+ e.endereco.bairro + ' - ' + e.endereco.cidade + '<br>'
							+ 'Email: ' + e.email + '<hr><br>';
				
				//calcular quantidades
				imprimirTxt += '<p>Total de pedidos: ' + totalPedidos + '<br>'
							+ 'Total de vendas: R$ ' + totalDinheiro.toFixed(2) + '<br>'
							+ 'Total de pizzas: ' + totalPizzas + '<br>'
							+ 'Total de produtos: ' + totalProdutos + '<hr><br>';
				
				imprimirTxt += linhaPizzas + '</table>'
						+ '<hr><br>' 
						+ linhaProdutos + '</table>';
				tela_impressao = window.open('about:blank');
				tela_impressao.document.write(imprimirTxt);
				tela_impressao.window.print();
				tela_impressao.window.close();
			}
		});
		
		/*data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = 'data:' + data ;
          a.download = "data.json";
          a.click();*/
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
		content: '<input type="text" placeholder="Digite o troco final do caixa" class="form-control preco" id="troco" value="0"/>',
		buttons:{
			confirm:{
				text:'Salvar',
				btnClass: 'btn-success',
				keys:['enter'],
				action: function(){
		
					var troco = this.$content.find('#troco').val();
					
					troco = troco.toString().replace(",",".");
					
					//buscar data do sistema
					$.ajax({
						url: '/adm/fechamento/data',
						type: 'PUT'
					}).done(function(e){
						dados.data = e.dia;
							
						//buscar id da data do sistema
						$.ajax({
							url: '/adm/fechamento/buscarIdData/' + dados.data,
							type: 'PUT'
						}).done(function(e){
							
							dados.id = e.id;
							dados.balcao = balcao + mesa + drive;
							dados.entregas = entrega;
							dados.totalLucro = Tvendas - parseFloat(Tfaturamento);
							dados.totalPedidos = Tpedidos;
							dados.totalVendas = Tvendas;
							dados.totalPizza = Tpizza;
							dados.totalProduto = Tproduto;
							dados.trocoFinal = troco;
							dados.trocoInicio = e.trocoInicio;
							
							$.ajax({
								url: '/adm/fechamento/finalizar/' + dados.id,
								type: 'PUT',
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(dados)
							}).done(function(e){

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
								$.alert("Erro, digite um valor válido");
								troco();
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
function mostrarPizzas(pizzas) {
	if(pizzas.length != 0 && cont1 == 0) {
		linhaPizzas = '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Sabor ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Obs ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Qtd ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Preço ---- </h5></th>'
					+ '</tr>';
		cont1++; //evita mostrar o head 2 vezes
	}
	if(pizzas.length != 0) {
		for(var i=0; i<pizzas.length; i++){
			linhaPizzas += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].sabor + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].obs + ' ---- </td>'
						 +	'<td align="center">' + pizzas[i].qtd + ' ---- </td>'
						 +  '<td align="center">R$ ' + pizzas[i].preco.toFixed(2) + ' ---- </td>'
					 +  '</tr>';
		}
	}
}


//---------------------------------------------------------------------------------------
function mostrarProdutos(produtos) {
	if(produtos.length != 0 && cont2 == 0) {
		linhaProdutos += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Obs ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Qtd ---- </h5></th>'
						+ '<th class="col-md-1"><h5>Preço ---- </h5></th>'
					+ '</tr>';
		cont2++; //evita mostrar o head 2 vezes
	}
	if(produtos.length != 0) {
		for(var i=0; i<produtos.length; i++){
			linhaProdutos += '<tr>'
						 +	'<td align="center">' + produtos[i].sabor + ' ---- </td>'
						 +	'<td align="center">' + produtos[i].obs + ' ---- </td>'
						 +	'<td align="center">' + produtos[i].qtd + ' ---- </td>'
						 +  '<td align="center">R$ ' + produtos[i].preco.toFixed(2) + ' ---- </td>'
					 +  '</tr>';
		}
	}
}