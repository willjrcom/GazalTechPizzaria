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
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
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
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Empresas empresas;
	
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
		return produtos.findByNomeProdutoContainingAndDisponivelOrCodigoBuscaAndDisponivel(nome, true, nome, true);
	}
	
	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public String novoPedido(@RequestBody Pedido pedido) {
		
		Empresa empresa = empresas.buscarId1();
		if(empresa.getAuthentication() == null) {
			empresa.setAuthentication("nulo");
		}
		String authentication = "gazaltech";
		if(empresa.getAuthentication().equals(authentication) == true) {
			Dia data = dias.buscarId1(); //buscar tabela dia de acesso
			Dado dado = dados.findByData(data.getDia()); //buscar dia nos dados
			pedido.setComanda((long)(dado.getComanda() + 1)); //salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); //incrementar o n da comanda
			dados.save(dado); //autalizar n da comanda
			pedidos.save(pedido); //salvar pedido
			return "200";
		}
		return "404";
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
		return produtos.findAllBordas();
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
	
	@RequestMapping(value = "/{numero}")
	public ModelAndView editarCadastro(@ModelAttribute("celular") String celular){
		return new ModelAndView("novoPedido");
	}
}
