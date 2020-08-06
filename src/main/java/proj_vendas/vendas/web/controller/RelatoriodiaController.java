package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/relatoriodia")
public class RelatoriodiaController {
	
	@RequestMapping
	public ModelAndView relatorioDia() {
		ModelAndView mv = new ModelAndView("relatoriodia");
		return mv;
	}
}
