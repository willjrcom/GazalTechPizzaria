package proj_vendas.vendas.web.controller;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/novaSenha")
public class NovaSenhaController {

	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping("/auth/6sf465sd4f5d4g6v8d5f4gv6dx5f4g6rt4h6/8tygh4rt8d5t4r68ft4g68rrft4ge9r5gh43tf/f435t4h24gg55xd5f4g5ft4ert54/{email}")
    @ResponseBody
    public ModelAndView telaNovaSenha(@PathVariable String email) throws MessagingException {
    	ModelAndView mv = new ModelAndView("novaSenha");
    	mv.addObject(email, email);
    	return mv;
    }
	
	@RequestMapping("/criar")
	@ResponseBody
	public Usuario verificar(@RequestBody Usuario usuario){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		user.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));		
		return usuarios.save(user);
	}
}
