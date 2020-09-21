package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/novoPedidoTablet")
public class NovoPedidoTabletController{
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("novoPedidoTablet");
	}
}
