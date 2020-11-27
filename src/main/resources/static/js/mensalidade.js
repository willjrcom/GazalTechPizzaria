function gerarBoleto() {
	
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
		}
	
	$.ajax({
		url: "https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email=williamjunior67@gmail.com&token=a3664407-a416-4bb6-9288-be14b4810ebc6f73874e4aca8c0361c047e91ff7f78f904e-460c-4e94-8108-21c3bb545d27",
		type: "POST",
		dataType : 'jsonp',
		Accept: "application/json",
		contentType: "application/json",
		data: JSON.stringify(dados)
	}).done(function(e){
		console.log(e);
	});
}