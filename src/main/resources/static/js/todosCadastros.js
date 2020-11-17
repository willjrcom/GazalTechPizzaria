
//buscar total de clientes
$.ajax({
	url: '/cadastros/Tclientes',
	type: 'GET'
}).done(function(e){
	$("#Tclientes").text(e);
}).fail(function(){
	$.alert("Nenhum cliente encontrado!");
});


//buscar total de funcionarios
$.ajax({
	url: '/cadastros/Tfuncionarios',
	type: 'GET'
}).done(function(e){
	$("#Tfuncionarios").text(e);
}).fail(function(){
	$.alert("Nenhum funcionario encontrado!");
});


//buscar total de produtos
$.ajax({
	url: '/cadastros/Tprodutos',
	type: 'GET'
}).done(function(e){
	$("#Tprodutos").text(e);
}).fail(function(){
	$.alert("Nenhum produto encontrado!");
});
