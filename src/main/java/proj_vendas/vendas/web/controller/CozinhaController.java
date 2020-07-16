package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/cozinha")
public class CozinhaController{
	
	@RequestMapping
	public ModelAndView Cozinha() {
		ModelAndView mv = new ModelAndView("cozinha");
		return mv;
	}
}
