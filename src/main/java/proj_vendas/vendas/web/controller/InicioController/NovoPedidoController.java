package proj_vendas.vendas.web.controller.InicioController;

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
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedido")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dias dias;
	
	@RequestMapping
	public ModelAndView novoPedido() {
		return new ModelAndView("novoPedido");
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
		if(nome.equals("todos")) {
			return produtos.findAll();
		}
		return produtos.findByNomeProdutoContainingOrCodigoBusca(nome,nome);
	}
	
	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public Pedido novoPedido(@RequestBody Pedido pedido) {
		return pedidos.save(pedido);
	}
	
	@RequestMapping(value = "/editar/{id}")
	public ModelAndView editarPedido(@ModelAttribute("id") Pedido pedido) {
		return new ModelAndView("novoPedido");
	}
	
	@RequestMapping(value = "/editarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Pedido> buscarPedido(@PathVariable Long id) {
		return pedidos.findById(id);
	}
	
	@RequestMapping(value = "/atualizarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido atualizarPedido(@RequestBody Pedido pedido) {
		return pedidos.save(pedido);
	}
	
	@RequestMapping(value = "/bordas", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostrarBordas() {
		return produtos.findAllProduto();
	}
	
	@RequestMapping(value = "/buscarBorda/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> buscarBorda(@PathVariable Long id) {
		return produtos.findById(id);
	}
	
	@RequestMapping(value = "/data", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
}
