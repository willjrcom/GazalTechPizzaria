package proj_vendas.vendas.web.controller.InicioController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.TipoStatus;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/receber")
public class ReceberController {
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView receberEntregas() {
		ModelAndView mv = new ModelAndView("receber");
		return mv;
	}
	
	@RequestMapping(value = "/finalizar/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido finalizar(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus(TipoStatus.FINALIZADO);
		return pedidos.save(pedido);
	}
}