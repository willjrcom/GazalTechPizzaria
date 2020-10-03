package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/tutorial")
public class TutorialController{
	
	@RequestMapping
	public ModelAndView tutorial() {
		return new ModelAndView("tutorial");
	}
}