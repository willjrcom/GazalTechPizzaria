
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


//buscar total de pedidos
$.ajax({
	url: '/fechamento/Tvendas',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	for(var i = 0; i < e.length; i++) {
		e[i].produtos = JSON.parse(e[i].produtos);
		
		Tvendas += e[i].total;
		
		for(var j = 0; j < e[i].produtos.length; j++) {
			Tfaturamento += e[i].produtos[j].custo;
		}
		
		
		$("#Tvendas").text('R$ ' + Tvendas.toFixed(2));
		$("#Tfaturamento").text('R$ ' + (Tvendas - parseFloat(Tfaturamento)).toFixed(2));
	}
}).fail(function(){
	$.alert("Nenhum valor encontrado!");
});