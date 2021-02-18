package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
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
	
	@RequestMapping
	@ResponseBody
	public ModelAndView tela(@RequestBody String email) {
		ModelAndView mv = new ModelAndView("novaSenha");
		mv.addObject("email", email);
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
