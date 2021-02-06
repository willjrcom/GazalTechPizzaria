carregarLoading("block");

//vendas/lucro
//--------------------------------------------------------------------------------------------
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
  var dados = [];
  var objeto = {};
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'X');
  data.addColumn('number', 'Bruto');
  data.addColumn('number', 'Líquido');

  
  $.ajax({
	  url: '/adm/estatistica/todos',
	  type: 'GET'
  }).done(function(e){
	  objeto = e;

	  objeto.sort(function (a, b) {
		return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
				? 1 
				: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	  });
	  
	  for(obj of objeto) {
		  if(obj.totalVendas != 0) {
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
		        backgroundColor: 'white'
		      };

		      var chart = new google.visualization.LineChart(document.getElementById('totalVendas'));
		      chart.draw(data, options);
  });
  
  
  //balcao/entregas
  //------------------------------------------------------------------------------------------------
  var dados1 = [];
  var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'X');
  data1.addColumn('number', 'Balcão');
  data1.addColumn('number', 'Entrega');

  
  $.ajax({
	  url: '/adm/estatistica/todos',
	  type: 'GET'
  }).done(function(e){
	  
	  var objeto1 = e;

	  objeto1.sort(function (a, b) {
			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
					? 1 
					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	  });
	  
	  for(obj1 of objeto1) {
		  if(obj1.totalVendas != 0) {
			  dados1.push([
			              obj1.data.split('-')[2] + '/' + obj1.data.split('-')[1], 
			              obj1.balcao, 
			              obj1.entrega
			  ]);
		  }
	  }
	  data1.addRows(dados1);
	  var options = {
		        hAxis: {
		          title: 'Dia'
		        },
		        vAxis: {
		          title: 'Total de Pedidos R$'
		        },
		        backgroundColor: 'white'
		      };

		      var chart = new google.visualization.LineChart(document.getElementById('entregaBalcao'));
		      chart.draw(data1, options);
	carregarLoading("none");
  });
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
