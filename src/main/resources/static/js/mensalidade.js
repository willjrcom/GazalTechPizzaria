var linhaHtml = '';
var pedidoVazio = '<tr><td colspan="3">Nenhuma mensalidade disponível!</td></tr>';
$(document).ready(() => $("#nomePagina").text("Mensalidade"));

/*
$.ajax({
	url: '/adm/mensalidade/cadastrar',
	type: 'POST',
	dataType : 'json',
	contentType: "application/json",
	data: JSON.stringify(pagamento)
}).done(pagamentos => {
});
*/
$.ajax({
	url: '/adm/mensalidade/mensalidades',
	type: 'GET'
}).done(pagamentos => {
	linhaHtml = '';

	for (pagamento of pagamentos) {
		linhaHtml += '<tr>'
			+ '<td>' + pagamento.data.split("T")[0] + '</td>'
			+ '<td>R$ ' + Number(pagamento.valor).toFixed(2) + '</td>'
			+ '<td>' + pagamento.log + '</td>'
			+ '</tr>';
	}

	$("#mensalidades").html(linhaHtml);
});
/*
var url1 = "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout"; //recorrente
var url2 = "https://ws.pagseguro.uol.com.br/recurring-payment/boletos"; //boleto
var url3 = "https://ws.pagseguro.uol.com.br/v2/sessions"; //check transparente
var email = "williamjunior67@gmail.com";
var token = "a3664407-a416-4bb6-9288-be14b4810ebc6f73874e4aca8c0361c047e91ff7f78f904e-460c-4e94-8108-21c3bb545d27";
var token_sandbox = "9D6A2DEF33C943D082F8A5C365E6200D";
var codPlano = "CEF744F7-3838-2243-3496-0FBE65D4777A";

$.ajax({
	url: url1 + "?email=" + email + "&token=" + token_sandbox,
	type: 'POST',
	AccessControlAllowOrigin: '<origin>',
	dataType: 'jsonp',
	contentType: 'application/x-www-form-urlencoded'
}).done(e => alert(e))
.fail(e => console.log(e))

var dados = {
	"reference": "GazalTech",
	"firstDueDate": "2020-11-29",
	"numberOfPayments": "1",
	"periodicity": "monthly",
	"amount": "19.87",
	"instructions": "juros de 1% ao dia e mora de 5,00",
	"description": "Mensalidade do sistema para pizzaria",
	"customer": {
		"document": {
			"type": "CPF",
			"value": "43637799855"
		},
		"name": "William Alfred Gazal Junior",
		"email": "williamjunior67@gmail.com",
		"phone": {
			"areaCode": "11",
			"number": "963849111"
		},
		"address": {
			"postalCode": "18086270",
			"street": "ibiti",
			"number": "100",
			"district": "Republica",
			"city": "Sao Paulo",
			"state": "SP"
		}
	}
}*/
