
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
    	  url: '/estatistica/todos',
    	  type: 'PUT'
      }).done(function(e){
    	  objeto = e;

    	  objeto.sort(function (a, b) {
  			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
  					? 1 
  					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
  		  });
    	  
    	  for(var i = 0; i<objeto.length; i++) {
    		  if(objeto[i].totalVendas != 0) {
    			  dados.push([
    			              (objeto[i].data.split('-')[2] + '/' + objeto[i].data.split('-')[1]),
    			              objeto[i].totalVendas,
    			              objeto[i].totalLucro
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
    	  url: '/estatistica/todos',
    	  type: 'PUT'
      }).done(function(e){
    	  
    	  var objeto1 = e;

    	  objeto1.sort(function (a, b) {
    			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
    					? 1 
    					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
    	  });
    	  
    	  for(var i = 0; i<objeto1.length; i++) {
    		  if(objeto1[i].totalVendas != 0) {
    			  dados1.push([
    			              objeto1[i].data.split('-')[2] + '/' + objeto1[i].data.split('-')[1], 
    			              objeto1[i].balcao, 
    			              objeto1[i].entregas
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
      });

     
      //pizzas/produtos
      //------------------------------------------------------------------------------------------------
      var dados2 = [];
      var data2 = new google.visualization.DataTable();
      data2.addColumn('string', 'X');
      data2.addColumn('number', 'Pizza');
      data2.addColumn('number', 'Produto');

      
      $.ajax({
    	  url: '/estatistica/todos',
    	  type: 'PUT'
      }).done(function(e){
    	  
    	  var objeto2 = e;
    	  objeto2.sort(function (a, b) {
    			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
    					? 1 
    					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
    		  });
    	  
    	  for(var i = 0; i<objeto2.length; i++) {
    		  if(objeto2[i].totalVendas != 0) {
    			  dados2.push([
    			              objeto2[i].data.split('-')[2] + '/' + objeto2[i].data.split('-')[1], 
    			              objeto2[i].totalPizza, 
    			              objeto2[i].totalProduto
    			  ]);
    		  }
    	  }
    	  data2.addRows(dados2);
    	  var options = {
    		        hAxis: {
    		          title: 'Dia'
    		        },
    		        vAxis: {
    		          title: 'Total de Produtos'
    		        },
    		        backgroundColor: 'white'
    		      };

    		      var chart = new google.visualization.LineChart(document.getElementById('pizzaProduto'));
    		      chart.draw(data2, options);
      });
    }