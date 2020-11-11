package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/gazaltech")
public class GazaltechController {

	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("gazaltech");
	}
	
	@RequestMapping("/imprimir")
	public String imprimir() {
		return "sucesso no acesso";
	}
}
