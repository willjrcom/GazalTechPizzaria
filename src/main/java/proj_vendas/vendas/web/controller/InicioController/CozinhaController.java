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
import proj_vendas.vendas.repository.Pedidos;

//@Component
//@RemoteProxy
@Controller
@RequestMapping("/cozinha")
public class CozinhaController{
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public ModelAndView Cozinha() {
		return new ModelAndView("cozinha");
	}
	
	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		return pedidos.findPedidoscozinha();
	}
	
	@RequestMapping(value = "/enviarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido enviarPedido(@ModelAttribute("id") Pedido pedido) {//falta enviar as outras variaveis
		pedido.setStatus("PRONTO");
		return pedidos.save(pedido);
	}
	/*
	@RemoteMethod
	public synchronized void init() {
		System.out.println("dwr ativado ----------------");
	}*/
}
