function enviarEmail(){
    var nome = $("#nome").val();
    var email = $("#email").val();
    var assunto = $("#opcao").val();
    var duvida = $("#duvida").val();
    var body = '<strong>Nome: </strong>'+nome+'<br />'+
               '<strong>Email: </strong>'+email+'<br />'+
               '<strong>Assunto: </strong>'+assunto+'<br />'+
               '<strong>Descição: </strong>'+duvida;

    $.ajax({
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        type: "GET",
        data: {
                'key':'e21763e87eb17a220f928fcec9de5432-us2',
                'message':{
                    'from_email':'williamjunior67@gmail.com',
                    'to':[
                        {
                            'email':'williamjunior67@gmail.com',
                            'name':'Seu Nome (ou nick)',
                            'type':'to'
                        }
                    ],
                    'subject':'Assunto',
                    'html':body
                }
            }
    });
}