$(document).ready(() => $("#nomePagina").text("Top 10"));

var mesas = [], arrayClientes = [], top5 = [];
var Cliente = {};
var linhaClientesHtml = '';

//cadastros------------------------------------------------------
function mostrarClientes(){
	if($("#topClientes").is(":visible") == false){
		carregarLoading('block');
		
		$.ajax({
			url: '/adm/top10/clientes',
			type: "GET"
		}).done(lista => {
			const top10Clientes = lista.replace("[", "").replace("]", "").split(",");
			
			arrayClientes = [];
			for(i = 0; i< top10Clientes.length; i++){
				Cliente = {};
				Cliente.nome = top10Clientes[i];
				Cliente.total = top10Clientes[i+1];
				arrayClientes.push(Cliente);
				i++;	
			}
			
			linhaClientesHtml = "";
			for(let [i, cliente] of arrayClientes.entries()){
				linhaClientesHtml += '<tr>'
									+ '<td class="sombra" align="center">Top ' + (i+1) + '</td>'
									+ '<td class="sombra" align="center"><b>' + cliente.nome.substring(0,20) + '</b></td>'
									+ '<td class="sombra" align="center">' + cliente.total + '</td>'
								+ '</tr>';
			}

			if(linhaClientesHtml == ""){
				$("#clientes").html('<tr><td colspan="3" class="sombra" align="center"><label>Nenhum cliente encontrado!</label></td><tr>');
			}else{
				$("#clientes").html(linhaClientesHtml);
			}
			
			carregarLoading("none");
			$("#topClientes").show("slow");
			$("#btnClientes").text("Ocultar Top 10 Clientes");
		});
	}else{
		$("#topClientes").hide("slow");
		$("#btnClientes").text("Mostrar Top 10 Clientes");
	}
}


	
//mesas------------------------------------------------------
function mostrarMesas(){
	if($("#topMesas").is(":visible") == false){
		carregarLoading("block");
		
		$.ajax({
			url: "/adm/top10/mesas",
			type: "GET"
		}).done(function(e){
			mesas = e;
			
			//remover caracteres
			for(mesa of mesas) {
				try{
					mesa.mesa = mesa.mesa.replace(/[^\d]+/g,'');
				}catch(e){}//remover letras
			}
			
			//ordenar vetor decrescente
			top5Mesas = mesas.sort((a, b) => (a.contador < b.contador) ? 1 : ((b.contador < a.contador) ? -1 : 0));
			
			//reduzir a 10 mesas
			if(top5Mesas.length > 10){
				top5Mesas = top5Mesas.slice(0, 10);	
			}
			
			mesasHtml = '';
			if(top5Mesas.length == 0){
				mesasHtml = '<tr><td colspan="3" align="center"><label>Nenhuma mesa encontrada!</label></td><tr>';
				carregarLoading("none");
			}else{
				for([i, mesa] of top5Mesas.entries()) {
				mesasHtml += '<tr>' 
							+ `<td align="center">Top ${i+1}</td>`
							+ `<td align="center"><b>Mesa ${mesa.mesa}</b></td>`
							+ `<td align="center">${mesa.contador} vezes</td>`
						+ '</tr>';
				}
			}
			
			carregarLoading("none");
			$("#topMesas").show("slow");
			$("#btnMesas").text("Ocultar Top 10 Mesas");
			$("#mesasTop").html(mesasHtml);
		});
	}else{
		$("#topMesas").hide("slow");
		$("#btnMesas").text("Mostrar Top 10 Mesas");
	}
}


//mesas------------------------------------------------------
function mostrarPizzas(){
	if($("#topPizzas").is(":visible") == false){
		carregarLoading("block");
		
		$.ajax({
			url: "/adm/top10/pizzas",
			type: "GET"
		}).done(function(e){
			top5Pizzas = e;
			console.log(e)
			//ordenar vetor decrescente
			top5Pizzas = top5Pizzas.sort((a, b) => (a.contador < b.contador) ? 1 : ((b.contador < a.contador) ? -1 : 0));
			
			//reduzir a 10 mesas
			if(top5Pizzas.length > 10){
				top5Pizzas = top5Pizzas.slice(0, 10);	
			}
			
			pizzasHtml = '';
			if(top5Pizzas.length == 0){
				pizzasHtml = '<tr><td colspan="3" align="center"><label>Nenhuma pizza encontrada!</label></td><tr>';
				carregarLoading("none");
			}else{
				for([i, pizza] of top5Pizzas.entries()) {
				pizzasHtml += '<tr>' 
							+ `<td align="center">Top ${i+1}</td>`
							+ `<td align="center"><b>${pizza.pizza}</b></td>`
							+ `<td align="center">${pizza.contador} vezes</td>`
						+ '</tr>';
				}
			}
			
			carregarLoading("none");
			$("#topPizzas").show("slow");
			$("#btnPizzas").text("Ocultar Top 10 Pizzas");
			$("#pizzasTop").html(pizzasHtml);
		});
	}else{
		$("#topPizzas").hide("slow");
		$("#btnPizzas").text("Mostrar Top 10 Mesas");
	}
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
