$.ajax({
	url: '/adm/cadastros/top10',
	type: "GET"
}).done(lista => {
	$("#top10").text(lista);
	console.log(lista);
});
