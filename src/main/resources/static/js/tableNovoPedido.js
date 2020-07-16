
//Ajax
//------------------------------------------------------------------------------------------------------------------------
var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
    }
};

xhttp.open("GET", "/cadastroCliente/1");
xhttp.send();


//adicionar produtos
//------------------------------------------------------------------------------------------------------------------------
var tPizzas = 0;
var tPedido = 0;
var produtos = [];
var linhaHtml = "";
var linhaCinza = document.getElementById("linhaCinza").innerHTML;
var produtosSelect = document.getElementById("novoProduto").innerHTML;
var buttonRemove = '<button type="button" id="removerProduto" class="btn btn-danger">Remover</button>';

document.getElementById("Ttotal").innerHTML = 'Total de Pizzas: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$0,00 &nbsp;&nbsp;&nbsp;';

//------------------------------------------------------------------------------------------------------------------------
$("#enviarProduto").click(function() {
		
	var Sabor = document.getElementById("sabor").innerHTML;
	var Qtd = parseFloat(document.getElementById("qtd").value);
	var Borda = document.getElementById("borda").value;
	var Obs = document.getElementById("obs").value;
	var Preco = parseFloat(document.getElementById("preco").innerHTML);

	tPizzas += Qtd;
	tPedido += Preco;
	
	produtos.push(
		{
			'sabor' : Sabor,
			'qtd': Qtd,
			'borda': Borda,
			'obs': Obs,
			'preco': Preco
		}
	);
	
	document.getElementById("novoProduto").innerHTML = "";
	
	for(var i=0; i<produtos.length; i++){
		
		linhaHtml = "";
		linhaHtml += '<tr>';
		linhaHtml += 	'<td>' + produtos[i].sabor + '</td>';
		linhaHtml += 	'<td>' + produtos[i].qtd + '</td>';
		linhaHtml += 	'<td>' + produtos[i].borda + '</td>';
		linhaHtml += 	'<td>' + produtos[i].obs + '</td>';
		linhaHtml += 	'<td>' + produtos[i].preco + '</td>';
		linhaHtml += 	'<td>' + buttonRemove + '</td>';
		linhaHtml += '</tr>';
		document.getElementById("novoProduto").innerHTML += linhaHtml + '<tr>' + linhaCinza + '</tr>';
	}

	document.getElementById("Ttotal").innerHTML = 'Total de Pizzas:  ' + tPizzas + '<br><br>' + 'Total do Pedido:  R$' + tPedido + '&nbsp;&nbsp;&nbsp;';

});

//------------------------------------------------------------------------------------------------------------------------
$("#enviarPedido").click(function() {
	if(Object.keys(produtos).length === 0){
		alert("Nenhum produto adicionado!");
	}else{
		alert("Pedido enviado!");
		var pedido_json = JSON.stringify(produtos);
		//console.log(pedido_json);
		window.location.href = "/novoPedido"; 
	}
});
