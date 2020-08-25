package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/preferencias")
public class PreferenciasController {
	
	@RequestMapping
	public ModelAndView menu() {
		ModelAndView mv = new ModelAndView("preferencias");
		return mv;
	}
}
