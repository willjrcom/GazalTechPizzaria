package proj_vendas.vendas.web.controller;

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

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/redefinirSenha")
public class redefinirSenhaController {

	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("redefinirSenha");
		
		mv.addObject("email", user.getEmail());
		return mv;
	}
	
	@RequestMapping("/verificar/{senha}")
	@ResponseBody
	public boolean verificar(@PathVariable String senha){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return Usuarios.isPassTrue(senha, user.getSenha());
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
