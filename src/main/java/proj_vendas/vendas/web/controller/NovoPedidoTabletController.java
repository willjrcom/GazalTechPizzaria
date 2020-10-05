package proj_vendas.vendas.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedidoTablet")
public class NovoPedidoTabletController{
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping("/**")
	public ModelAndView tela() {
		return new ModelAndView("novoPedidoTablet");
	}
	
	@RequestMapping(value = "/todosProdutos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostrarTodos(){
		return produtos.findByDisponivelAndSetorNot(true, "BORDA");
	}

	@RequestMapping(value = "/escolher/{setor}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostraropcao(@PathVariable String setor){
		if(setor.equals("TODOS") == true) {
			return produtos.findByDisponivelAndSetorNot(true, "BORDA");
		}
		return produtos.findBySetorAndDisponivel(setor, true);
	}

	@RequestMapping(value = "/produto/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id){
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> buscarBordas(){
		return produtos.findBySetorAndDisponivel("BORDA", true);
	}
	
	@RequestMapping(value = "/atualizar", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido atualizar(@RequestBody Pedido pedido) {
		Pedido antigo = pedidos.findByNomePedido(pedido.getNomePedido());
		if(antigo == null) {
			return new Pedido();
		}
		return antigo;
	}
	
	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT)
	@ResponseBody
	public String novoPedido(@RequestBody Pedido pedido) {
		
		Empresa empresa = empresas.buscarId1();
		if(empresa.getAuthentication() == null) {
			empresa.setAuthentication("nulo");
		}
		String authentication = "gazaltech";
		if(empresa.getAuthentication().equals(authentication) == true) {
			if(pedido.getId() == null) {//se o pedido ja existir
				Dia data = dias.buscarId1(); //buscar tabela dia de acesso
				Dado dado = dados.findByData(data.getDia()); //buscar dia nos dados
				
				pedido.setComanda((long)(dado.getComanda() + 1)); //salvar o numero do pedido
				dado.setComanda(dado.getComanda() + 1); //incrementar o n da comanda
				dados.save(dado); //autalizar n da comanda
			}
			pedidos.save(pedido); //salvar pedido
			return "200";
		}
		return "404";
	}
}
