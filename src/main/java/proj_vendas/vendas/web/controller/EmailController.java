package proj_vendas.vendas.web.controller;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
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
    public String sendMail(@RequestBody Email email) throws MessagingException {
       
        MimeMessage msg = javaMailSender.createMimeMessage();

        // true = multipart message
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
        
        helper.setTo(email.getEmail());
        helper.setFrom("mestrespizzaacrobatica@gmail.com");
        helper.setSubject(email.getAssunto());

        // default = text/plain
        //helper.setText("Check attachment for image!");

        // true = text/html
        helper.setText(email.getTexto(), true);

        // hard coded a file path
        //FileSystemResource file = new FileSystemResource(new File("path/android.png"));

        //helper.addAttachment("my_photo.png", new ClassPathResource("android.png"));
        javaMailSender.send(msg);
        
        return "200";
    }
}
