package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class HomeController {
	/*
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private UsuarioService service;
	*/
	
	@GetMapping({"/index"})
	public ModelAndView tela() {
		/*Usuario usuario = usuarios.findByEmail("williamjunior67@gmail.com");
		if(usuario == null) {
			service.salvarUsuarioDev();
		}*/
		return new ModelAndView("index");
	}
	/*
	public UsuarioService getService() {
		return service;
	}

	public void setService(UsuarioService service) {
		this.service = service;
	}*/
	
	/*
	@GetMapping({"/new-user"})
    public ModelAndView newUser() {
		String nome = "willjrcom";
		
        Usuario usuario = new Usuario();
        Usuario total = usuarios.findMeuEmail();
        System.out.println("----------------------------------------" +total.getEmail());
        
        if(nome.compareTo(total.getEmail()) == 0) {
        	return new ModelAndView("index");
        }else {
        	usuario.setEmail("willjrcom");
            usuario.setSenha(new BCryptPasswordEncoder().encode("toor"));
            usuarios.save(usuario);
        }
    	return new ModelAndView("index");
    }
    */
}
