package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/verPedido")
public class VerPedidoController{
	
	@RequestMapping
	public ModelAndView verPedido() {
		ModelAndView mv = new ModelAndView("verPedido");
		return mv;
	}
}
