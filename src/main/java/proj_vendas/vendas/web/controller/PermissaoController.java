package proj_vendas.vendas.web.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/permissao")
public class PermissaoController {
	
	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView tela(ModelMap model, HttpServletResponse resp) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		ModelAndView mv = new ModelAndView("permissao");
		
		if(user.getPerfil().equals("ADM")) {
			mv.addObject("perfil", "desenvolvedor");
		}else if(user.getPerfil().equals("USUARIO")){
			mv.addObject("perfil", "administrador");
		}
		if(resp.getStatus() == 403) {
			mv.addObject("tipo", "Acesso negado");
		}
		mv.addObject("status", resp.getStatus());
		return mv;
	}
}
