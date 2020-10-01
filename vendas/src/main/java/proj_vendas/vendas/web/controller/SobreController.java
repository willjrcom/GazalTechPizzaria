package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/sobre")
public class SobreController{
	
	@RequestMapping
	public ModelAndView sobre() {
		ModelAndView mv = new ModelAndView("sobre");
		return mv;
	}
}
