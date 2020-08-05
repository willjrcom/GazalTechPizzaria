package proj_vendas.vendas.web.controller.InicioController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.TipoStatus;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/verpedido")
public class VerpedidoController{
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView verPedido() {
		ModelAndView mv = new ModelAndView("verpedido");
		return mv;
	}
	/*
	@RequestMapping(value = "/excluirPedido/{id}", method = RequestMethod.PUT)
	public void excluirPedido(@PathVariable long id) {
		pedidos.deleteById(id);
	}*/
	@RequestMapping(value = "/excluirPedido/{id}", method = RequestMethod.PUT)
	public Pedido novoPedido(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus(TipoStatus.EXCLUIDO);
		return pedidos.save(pedido);
	}
}
