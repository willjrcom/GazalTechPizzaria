package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class HomeController {
	
	@GetMapping({"/index"})
	public ModelAndView tela() {
		return new ModelAndView("index");
	}
}
