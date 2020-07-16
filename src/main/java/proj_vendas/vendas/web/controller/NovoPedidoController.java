package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.TipoBorda;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.TituloFilter;

@Controller
@RequestMapping("/novoPedido")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@RequestMapping
	public ModelAndView novoPedido(@ModelAttribute("filtro") TituloFilter filtro) {
		String celular = filtro.getCelular() == null ? "%" : filtro.getCelular();
		//String nomeProduto = filtro.getNomeProduto() == null ? "%" : filtro.getNomeProduto();
		List<Cliente> todosClientes = clientes.findByCelular(celular);
		List<Produto> todosProdutos = produtos.findAll();
		ModelAndView mv = new ModelAndView("novoPedido");
		mv.addObject("produtos", todosProdutos);
		mv.addObject("clientes", todosClientes);
		mv.addObject("TipoBorda", TipoBorda.values());
		return mv;
	}

	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView salvar(Pedido pedido) {
		pedidos.save(pedido);
		ModelAndView mv = new ModelAndView("novoPedido");
		return mv;
	}
}
