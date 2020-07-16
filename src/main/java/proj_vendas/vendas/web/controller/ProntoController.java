package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/motoboy")
public class ProntoController{
	
	@RequestMapping
	public ModelAndView motoboy() {
		ModelAndView mv = new ModelAndView("motoboy");
		return mv;
	}
}
