package proj_vendas.vendas.web.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Email;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@RestController
@RequestMapping("/email")
public class EmailController {

	 @Autowired
	 private JavaMailSender javaMailSender;

	 @Autowired
	 private Usuarios usuarios;
	 
    @RequestMapping(path = "/enviar")
    @ResponseBody
    public ResponseEntity<String> sendMail(@RequestBody Email email) throws MessagingException {
    	
		SimpleDateFormat format = new SimpleDateFormat ("yyyy");
		try {
	    	if(email.getTexto().equals("-1")) {
	    		email.setTexto("<h3>Seu email está com pendencias em nosso sistema, por favor contate o suporte!</h3>"
	    					+ email.getEmail()
	        				+ "<br><p>Gazal Tech - " + format.format(new Date()).toString() + "</p>"
	        				+ "<label>Sistema Pizzaria Web</label>");
	    	}else {
	    		email.setTexto("<h1>Email enviado com sucesso!</h1>"
	        				+ "<br><p>Aguarde uma resposta da nossa equipe de suporte</p>"
	        				+ "<br><p>Gazal Tech - " + format.format(new Date()).toString() + "</p>"
	        				+ "<label>Sistema Pizzaria Web</label>");
	    	}
	    	//enviar email confirmacao
	    	cliente(email);
	    	
	    	//enviar mensagem a empresa
	        empresa(email);
       }catch(Exception e) {System.out.println(e);}
        return ResponseEntity.ok("200");
    }


    public void cliente(Email email) throws MessagingException {
		try {
			MimeMessage msg = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	
	        helper.setFrom("gazaltechsuporte@outlook.com");
	        helper.setTo(email.getEmail());
	        helper.setSubject(email.getAssunto());
	        helper.setText(email.getTexto(), true);
	        helper.addAttachment("GazalTechPizzaria.png", new ClassPathResource("/static/img/logo.png"));
	        
	        javaMailSender.send(msg);
		}catch(Exception e) {System.out.println(e);}
	}

    
    public void empresa(Email email) throws MessagingException {
    	
    	try {
			MimeMessage msg = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	        
	        helper.setFrom("gazaltechsuporte@outlook.com");
	        helper.setTo("gazaltech@outlook.com");
	        helper.setSubject(email.getAssunto());
	        helper.setText(email.getTexto(), true);
	        
	        javaMailSender.send(msg);
    	}catch(Exception e) {System.out.println(e);}
    }
    
    
    @RequestMapping(path = "/novaSenha/{email}")
    @ResponseBody
    public int novaSenha(@PathVariable String email) throws MessagingException {
    	
    	Usuario usuario = usuarios.findByEmail(email);
    	
    	if(usuario == null) {
    		return 500;
    	}
    	//enviar email de recuperação
    	try {
			MimeMessage msg = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(msg, true);

	        helper.setText(
	        		"Não responda esse email!"
	    			+ "<br><br>"
	    			+ "<label>Clique abaixo para redefinir sua senha</label>"
	    			+ "<a href=\"http://gazaltechpizzaria.azurewebsites.net"
	    				+ "/novaSenha/auth/6sf465sd4f5d4g6v8d5f4gv6dx5f4g6rt4h6/8tygh4rt8d5t4r68ft4g68rrft4ge9r5gh43tf/f435t4h24gg55xd5f4g5ft4ert54/" 
	    				+ email + "/" + usuario.getCodEmpresa() + "/d53y54grd5fy4gr35tf4ygrt54fyg6rt54yh68rt5yfg\">"
	    				+ "<p>Redefinir senha</p>"
	    			+ "</a>", true
	    	);
	        helper.setFrom("gazaltechsuporte@outlook.com");
	        helper.setTo(email);
	        helper.setSubject("Recuperação de senha - Gazaltech Pizzaria");
	        helper.addAttachment("GazalTechPizzaria.png", new ClassPathResource("/static/img/logo.png"));
	        
	        javaMailSender.send(msg);
	        return 200;
	        
		}catch(Exception e) {
			System.out.println(e);

	        return 404;
		}
    }
}

