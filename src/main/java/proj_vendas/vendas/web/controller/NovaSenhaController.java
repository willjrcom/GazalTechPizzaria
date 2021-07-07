package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/novaSenha")
public class NovaSenhaController {

	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView tela() {
		ModelAndView mv = new ModelAndView("novaSenha");
    	mv.addObject("email", "Nenhum email encontrado!");
    	return mv;
	}
	
	
	@RequestMapping("/auth/{codEmpresa}/{email}/{id}")
    public ModelAndView telaNovaSenha(@PathVariable int codEmpresa, @PathVariable String email, @PathVariable int id, ModelMap model) {
		Usuario usuario = null;
		
		try{
			usuario = usuarios.findByEmail(email);
			if(usuario.getCodEmpresa() == codEmpresa && usuario.getId() == id && usuario.getEmail().equals(email)) {
				model.addAttribute("email", email);
				
		    	return new ModelAndView("novaSenha");
			}else {
				return new ModelAndView("naoEncontrado");
			}
		}catch(Exception e) {
			return new ModelAndView("naoEncontrado");
		}
    }
	
	
	@RequestMapping("/criar")
	@ResponseBody
	public Usuario verificar(@RequestBody Usuario usuario){
		Usuario user = usuarios.findByEmail(usuario.getEmail());
		
		if(user != null) {
			user.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));		
			return usuarios.save(user);
		}else {
			return null;
		}
	}
}
