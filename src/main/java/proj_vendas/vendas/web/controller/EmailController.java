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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Email;

@RestController
@RequestMapping("/email")
public class EmailController {

	 @Autowired
	 private JavaMailSender javaMailSender;

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
       }catch(Exception e) {}
        return ResponseEntity.ok("200");
    }


    public void cliente(Email email) throws MessagingException {
		try {
			MimeMessage msg = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	
	        helper.setFrom("mestrespizzaacrobatica@gmail.com");
	        helper.setTo(email.getEmail());
	        helper.setSubject(email.getAssunto());
	        helper.setText(email.getTexto(), true);
	        helper.addAttachment("GazalTechPizzaria.png", new ClassPathResource("/static/img/logo.png"));
	        
	        javaMailSender.send(msg);
		}catch(Exception e) {}
	}

    
    public void empresa(Email email) throws MessagingException {
    	
    	try {
			MimeMessage msg = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	        
	        helper.setFrom("mestrespizzaacrobatica@gmail.com");
	        helper.setTo("williamjunior67@gmail.com");
	        helper.setSubject(email.getAssunto());
	        helper.setText(email.getTexto(), true);
	        
	        javaMailSender.send(msg);
    	}catch(Exception e) {}
    }
}

