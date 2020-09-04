package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;
import proj_vendas.vendas.service.UsuarioService;

@Controller
public class HomeController {

	@Autowired
	private UsuarioService service;
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping({"/index"})
	public ModelAndView home() {
		Usuario usuario = usuarios.findByEmail("williamjunior67@gmail.com");
		if(usuario == null) {
			service.salvarUsuarioDev();
		}
		return new ModelAndView("index");
	}

	public UsuarioService getService() {
		return service;
	}

	public void setService(UsuarioService service) {
		this.service = service;
	}
}
