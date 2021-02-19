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

import proj_vendas.vendas.model.Usuario;
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
	
	
	@RequestMapping("/auth/6sf465sd4f5d4g6v8d5f4gv6dx5f4g6rt4h6/8tygh4rt8d5t4r68ft4g68rrft4ge9r5gh43tf/f435t4h24gg55xd5f4g5ft4ert54/{email}/{codEmpresa}/d53y54grd5fy4gr35tf4ygrt54fyg6rt54yh68rt5yfg")
    public String telaNovaSenha(@PathVariable String email, @PathVariable int codEmpresa, ModelMap model) {
		Usuario usuario = usuarios.findByEmail(email);
		if(usuario.getCodEmpresa() == codEmpresa) {
			model.addAttribute("email", email);
	    	return "novaSenha";
		}else {
			return "erro";
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
