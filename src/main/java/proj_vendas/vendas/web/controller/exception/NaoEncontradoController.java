package proj_vendas.vendas.web.controller.exception;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/naoEncontrado")
public class NaoEncontradoController {
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("naoEncontrado");
	}
}
