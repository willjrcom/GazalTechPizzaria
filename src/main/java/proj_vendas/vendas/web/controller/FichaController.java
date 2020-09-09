package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/ficha")
public class FichaController {

	@RequestMapping
	public ModelAndView menu() {
		ModelAndView mv = new ModelAndView("ficha");
		return mv;
	}
}
