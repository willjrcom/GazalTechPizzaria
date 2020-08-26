package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
	@GetMapping({"/index"})
	public ModelAndView home() {
		ModelAndView mv = new ModelAndView("index");
		return mv;
	}
}
