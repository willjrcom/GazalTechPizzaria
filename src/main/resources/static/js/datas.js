
var ano_atual = new Date();
ano_atual = ano_atual.getFullYear();

$("#ano-atual").html('<P>	&copy; ' + ano_atual + ' - WIHAAS' + '</P>');

window.setInterval(function(){
	var hora_atual = new Date();
	
	var segundos = hora_atual.getSeconds();
	var minutos = hora_atual. getMinutes();
	var horas = hora_atual.getHours();
	
	var ano = hora_atual.getFullYear();
	var mes = hora_atual.getMonth();
	var dia = hora_atual.getDate();
	
	function format_time (time) {
		if(time >= 0 && time <= 9){
			var formatted_time = time.toString();
			formatted_time = "0" + formatted_time;
		} else{
			var formatted_time = time.toString();
		}
		return formatted_time;
	}
	$("#dia-atual").html(format_time(dia) + '/' + format_time(mes) + '/' + format_time(ano));
	$("#hora-atual").html(format_time(horas) + ':' + format_time(minutos) + ':' + format_time(segundos));
},1000)
