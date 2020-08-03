package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/verPedido")
public class VerPedidoController{
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView verPedido() {
		ModelAndView mv = new ModelAndView("verPedido");
		return mv;
	}
	
	@RequestMapping(value = "/excluirPedido/{id}", method = RequestMethod.PUT)
	public void excluirPedido(@PathVariable long id) {
		pedidos.deleteById(id);
	}
}
