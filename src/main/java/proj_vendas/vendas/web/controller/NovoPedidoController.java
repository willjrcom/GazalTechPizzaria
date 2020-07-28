package proj_vendas.vendas.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.TipoBorda;
import proj_vendas.vendas.model.TipoStatus;
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
		//String celular = filtro.getCelular() == null ? "%" : filtro.getCelular();
		ModelAndView mv = new ModelAndView("novoPedido");
		mv.addObject("TipoBorda", TipoBorda.values());
		return mv;
	}

	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView salvar(Pedido pedido) {
		pedidos.save(pedido);
		ModelAndView mv = new ModelAndView("novoPedido");
		return mv;
	}
	
	
	@RequestMapping(value = "/addProduto/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> adicionarProduto(@PathVariable long id) {
		return produtos.findById(id);
	}
	
	@RequestMapping(value = "/numeroCliente/{celular}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente buscarCliente(@PathVariable String celular) {
		return clientes.findByCelular(celular);
		
	}
	
	@RequestMapping(value = "/nomeProduto/{nome}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		return produtos.findByNomeProdutoContaining(nome);
	}
	
	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public Pedido novoPedido(@RequestBody Pedido pedido) {
		System.out.println(pedido.toString());
		pedido.setStatus(TipoStatus.COZINHA);
		return pedidos.save(pedido);
	}
}
