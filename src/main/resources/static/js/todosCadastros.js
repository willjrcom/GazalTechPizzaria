
//buscar total de clientes
$.ajax({
	url: '/cadastros/Tclientes',
	type: 'PUT'
}).done(function(e){
	$("#Tclientes").text(e);
}).fail(function(){
	$.alert("Nenhum cliente encontrado!");
});


//buscar total de funcionarios
$.ajax({
	url: '/cadastros/Tfuncionarios',
	type: 'PUT'
}).done(function(e){
	$("#Tfuncionarios").text(e);
}).fail(function(){
	$.alert("Nenhum funcionario encontrado!");
});


//buscar total de produtos
$.ajax({
	url: '/cadastros/Tprodutos',
	type: 'PUT'
}).done(function(e){
	$("#Tprodutos").text(e);
}).fail(function(){
	$.alert("Nenhum produto encontrado!");
});
