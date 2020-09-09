
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum Funcinário encontrado!</td></tr>';

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosFuncionarios").html(linhaCinza);

$.ajax({
	url: "/pagamento/todosFuncionarios",
	type: 'PUT'
})
.done(function(e){
	console.log(e);

	for(var i = 0; i< e.length; i++){
		funcionarios.unshift({
			'id' : e[i].id,
			'nome' : e[i].nome,
			'celular' : e[i].celular,
			'salario': e[i].salario,
			'cargo': e[i].cargo,
		});
	}
	$("#todosFuncionarios").html("");
	linhaHtml = "";
	
	if(funcionarios.length == 0){
		$("#todosFuncionarios").html(pedidoVazio);
	}else{
		for(var i = 0; i<funcionarios.length; i++){
			linhaHtml += '<tr>';
			linhaHtml +=	'<td>' + funcionarios[i].id + '</td>';
			linhaHtml +=	'<td>' + funcionarios[i].nome + '</td>';
			linhaHtml +=	'<td>R$ ' + funcionarios[i].salario.toFixed(2) + '</td>';
			linhaHtml +=	'<td>' + funcionarios[i].cargo + '</td>';
			linhaHtml += '<td>' 
						+ '<a class="enviarPedido">'
						+ '<button type="button" title="finalizar" onclick="verFuncionario()" class="botao"'
						+ 'value="'+ funcionarios[i].id + '"><span class="oi oi-magnifying-glass"></span></button></a></td>';			
			linhaHtml += '</tr>';
			linhaHtml += linhaCinza;
		}
		
		$("#todosFuncionarios").html(linhaHtml);
	}
});	

function verFuncionario() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/pagamento/pagar/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
		if(funcionarios[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	linhaHtml = '<table>'
				+ '<tr>'
					+ '<th class="col-md-1"><h5>Salário</h5></th>'
					+ '<th class="col-md-1"><h5>Extra</h5></th>'
					+ '<th class="col-md-1"><h5>Gastos</h5></th>'
					+ '<th class="col-md-1"><h5>Total</h5></th>'
				+ '</tr>'
		
				+ '<tr>'
					+ '<td>R$ ' + funcionarios[idBusca].salario.toFixed(2) + '</td>'
					+ '<td>R$ 0.00 </td>'
					+ '<td>R$ 0.00 </td>'
					+ '<td>R$ ' + funcionarios[idBusca].salario.toFixed(2) + '</td>'
				+ '</tr>'
			+'</table>';
	
	linhaHtml += '<hr><label>Total pago: <button class="btn btn-link" onclick="aviso()"><span class="oi oi-question-mark"></span></button></label><br>'
				+'<input class="form-control" id="pagamento" name="pagamento" placeholder="Digite o total a ser pago"/>';
	
	$.alert({
		type: 'green',
	    typeAnimated: true,
	    title: 'Pedido: ' + funcionarios[idBusca].nome,
	    content: linhaHtml,
	    buttons: {
	        confirm: {
				text: 'Pagar',
	    		keys: ['enter'],
	            btnClass: 'btn-green'
			},
	        cancel:{
				text: 'Voltar',
	    		keys: ['esc'],
	            btnClass: 'btn-danger'
			}
		}
	});
};


//-------------------------------------------------------------------
function aviso() {
	$.alert({
		type:'blue',
		title:'Pagamento',
		content:'Este campo é utilizado para descontar o valor que foi pago ao funcionário.'
			+'<br><b>Pode ser usado para:</b>'
			+'<br>&nbsp- Pagamentos diarios.'
			+'<br>&nbsp- Pagamentos semanais.'
			+'<br>&nbsp- Pagamentos mensais.',
		buttons:{
			confirm:{
				text:'Voltar',
				btnClass:'btn-success',
				keys:['enter','esc']
			}
		}
	});
}