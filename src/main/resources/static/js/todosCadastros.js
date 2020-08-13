var Tclientes;
var Tfuncionarios;
var Tprodutos;
var Tpedidos;
var Tvendas = 0;
var Tfaturamento = 0;


//buscar total de clientes
$.ajax({
	url: '/cadastros/Tclientes',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	$("#Tclientes").text(e);
}).fail(function(){
	$.alert("Nenhum cliente encontrado!");
});


//buscar total de funcionarios
$.ajax({
	url: '/cadastros/Tfuncionarios',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	$("#Tfuncionarios").text(e);
}).fail(function(){
	$.alert("Nenhum funcionario encontrado!");
});


//buscar total de produtos
$.ajax({
	url: '/cadastros/Tprodutos',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	$("#Tprodutos").text(e);
}).fail(function(){
	$.alert("Nenhum produto encontrado!");
});


//buscar total de pedidos
$.ajax({
	url: '/cadastros/Tpedidos',
	type: 'PUT'
}).done(function(e){
	console.log(e);
	$("#Tpedidos").text(e);
}).fail(function(){
	$.alert("Nenhum pedido encontrado!");
});


//buscar total de pedidos
$.ajax({
	url: '/cadastros/Tvendas',
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