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
}