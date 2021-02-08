package proj_vendas.vendas.web.controller.Empresa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Conquistas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class MetasController {

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Conquistas conquistas;
	
	@GetMapping("/metas")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		
		if(!user.getPerfil().equals("DEV")) {
			return new ModelAndView("pagConstrucao");
		}
		return new ModelAndView("metas");
	}
	
	@RequestMapping(value = "/metas/todas")
	@ResponseBody
	public Conquista dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		return conquistas.findByCodEmpresa(user.getCodEmpresa());
	}
}
