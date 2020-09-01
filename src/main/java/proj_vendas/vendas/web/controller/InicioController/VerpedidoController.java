package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/verpedido")
public class VerpedidoController{
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@RequestMapping
	public ModelAndView verPedido() {
		ModelAndView mv = new ModelAndView("verpedido");
		return mv;
	}
	
	@RequestMapping(value = "/excluirPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido novoPedido(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus("EXCLUIDO");
		return pedidos.save(pedido);
	}
	
	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByDataAndStatusOrDataAndStatusOrDataAndStatus(dia, "COZINHA", dia,"PRONTO", dia,"MOTOBOY");
	}
}
