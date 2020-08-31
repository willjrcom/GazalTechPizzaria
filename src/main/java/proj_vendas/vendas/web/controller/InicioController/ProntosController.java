package proj_vendas.vendas.web.controller.InicioController;

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
@RequestMapping("/pronto")
public class ProntosController{
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView pronto() {
		return new ModelAndView("pronto");
	}
	
	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		return pedidos.findByStatusOrStatusOrStatus("COZINHA", "PRONTO", "MOTOBOY");
	}
}
