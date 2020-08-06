package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/pedidosExcluidos")
public class PedidosExcluidosController {
	@RequestMapping
	public ModelAndView lerCadastros() {
		ModelAndView mv = new ModelAndView("pedidosExcluidos");
		return mv;
	}
}
