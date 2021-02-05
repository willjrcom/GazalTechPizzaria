package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/redefinirSenha")
public class redefinirSenhaController {

	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("redefinirSenha");
	}
}
