package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/index")
public class HomeController {
	
	@RequestMapping
	public ModelAndView home() {
		ModelAndView mv = new ModelAndView("index");
		return mv;
	}
}
