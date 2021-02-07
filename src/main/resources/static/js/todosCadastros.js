$(document).ready(() => $("#nomePagina").text("Cadastros"));

//cadastros------------------------------------------------------
function mostrarClientes(){
	if($("#topClientes").is(":visible") == false){
		carregarLoading('block');
		
		$.ajax({
			url: '/adm/cadastros/top10Clientes',
			type: "GET"
		}).done(lista => {
			const top10 = lista.replace("[", "").replace("]", "").split(",");
			var arrayClientes = [];
			var Cliente = {};
			var linhaClientesHtml = "";
			
			for(i = 0; i< top10.length; i++){
				Cliente = {};
				Cliente.nome = top10[i];
				Cliente.total = top10[i+1];
				arrayClientes.push(Cliente);
				i++;	
			}

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


var mesas = [];
	
//mesas------------------------------------------------------
function mostrarMesas(){
	if($("#topMesas").is(":visible") == false){
		carregarLoading("block");
		
		$.ajax({
			url: "/adm/cadastros/mesas",
			type: "GET"
		}).done(function(e){
			
			//remover caracteres
			for(mesa of e) {
				mesa.mesa = mesa.mesa.replace(/[^\d]+/g,'');//remover letras
				mesas.push(mesa.mesa);
			}
			
			//filtrar array top 5
			const novaMesas = mesas.reduce((unico, item) => {
			    return unico.includes(item) ? unico : [...unico, item]
			}, []);
			
			var top5 = [];
			
			//adicionar objetos top 5
			for(mesa of novaMesas) {
				top5.unshift({
					'mesa': mesa,
					'total': 0
				});
			}
		
			//calcular total de mesas
			for(mesa of mesas) {//todas mesas
				for(nova of novaMesas) {//filtro das mesas
					if(mesa == nova) {
						for(i = 0; i<top5.length; i++) {
							if(mesa == top5[i].mesa) {
								top5[i].total++;
							}
						}
					}
				}
			}
			
			//ordenar vetor decrescente
			top5.sort(function(a, b){
				return (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0);
			})
			
			//reduzir a 10 mesas
			if(top5.length > 10){
				top5 = top5.slice(0, 10);	
			}
			
			mesasHtml = '';
			if(top5.length == 0){
				mesasHtml = '<tr><td colspan="3" align="center"><label>Nenhuma mesa encontrada!</label></td><tr>';
				carregarLoading("none");
			}else{
				for([i, mesa] of top5.entries()) {
				mesasHtml += '<tr>' 
							+ `<td align="center">Top ${i+1}</td>`
							+ `<td align="center"><b>Mesa ${mesa.mesa}</b></td>`
							+ `<td align="center">${mesa.total} vezes</td>`
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


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
