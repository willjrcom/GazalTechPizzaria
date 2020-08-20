package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/pedidosExcluidos")
public class PedidosExcluidosController {
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView lerCadastros() {
		ModelAndView mv = new ModelAndView("pedidosExcluidos");
		return mv;
	}

	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		return pedidos.findPedidosexcluido();
	}
}
