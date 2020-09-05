//abrir menu
$("#menuButton").click(function(){

	var submenu = document.getElementById("menuPrincipal");
	
	if(submenu.style.display == 'block'){
		$("#menuPrincipal").hide('slow');
		$("#menuButton").removeClass("posicaoMenu");
		/*$(".dropdown").hide();
		$(".dropdown-content").hide();*/
	}else{
		$("#menuPrincipal").show('slow');
		$("#menuButton").addClass("posicaoMenu");
		/*$(".dropdown").show();
		$(".dropdown-content").show();*/
	}
});


//------------------------------------------------------------
function calendario() {
	$.alert({
		type:'blue',
		title: 'Calendário',
		content:'<input type="date"/>',
		buttons:{
			confirm:{
				text:'Obrigado!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//------------------------------------------------------------
function calculadora() {
	$.alert({
		type:'blue',
		title: 'Calendário',
		content:'1+1=2',
		buttons:{
			confirm:{
				text:'Obrigado!',
				btnClass:'btn-success',
				keys:['esc','enter']
			}
		}
	});
}


//---------------------------------------------------------------
google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Tempo', 80],
  ]);

  var options = {
    width: 228, height: 60,
    greenFrom: 0, greenTo: 33.3,
    yellowFrom:33.3, yellowTo: 66.6,
    redFrom: 66.6, redTo: 100,
    minorTicks: 2
  };

  var chart = new google.visualization.Gauge(document.getElementById('tempo'));

  chart.draw(data, options);

  setInterval(function() {
    data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
    chart.draw(data, options);
  }, 13000);
  setInterval(function() {
    data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
    chart.draw(data, options);
  }, 5000);
  setInterval(function() {
    data.setValue(2, 1, 60 + Math.round(20 * Math.random()));
    chart.draw(data, options);
  }, 26000);
}