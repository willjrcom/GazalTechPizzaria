
var Tpedidos;
var Tvendas = 0;
var Tfaturamento = 0;


//buscar total de pedidos
$.ajax({
	url: '/fechamento/Tpedidos',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	$("#Tpedidos").text(e);
}).fail(function(){
	$.alert("Nenhum pedido encontrado!");
});


//buscar total de vendas
$.ajax({
	url: '/fechamento/Tvendas',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	
	//para cada pedido
	console.log('total pedidos: ' + e.length);
	for(var i = 0; i < e.length; i++) {
		if(e[i].status == "FINALIZADO" ) {
			e[i].produtos = JSON.parse(e[i].produtos);
			e[i].pizzas = JSON.parse(e[i].pizzas);
			
			
			Tvendas += parseFloat(e[i].total);
			console.log('Tvendas: ' + Tvendas);
			//para cada produto
			for(var j = 0; j < e[i].produtos.length; j++) {
				Tfaturamento += parseFloat(e[i].produtos[j].custo);
			}
			//para cada pizza
			for(var j = 0; j < e[i].pizzas.length; j++) {
				Tfaturamento += parseFloat(e[i].pizzas[j].custo);
			}
		}
	}

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