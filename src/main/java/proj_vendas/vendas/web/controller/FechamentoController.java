package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/fechamento")
public class FechamentoController {

	@Autowired
	private Clientes clientes;
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Produtos produtos;

	@Autowired
	private Pedidos pedidos;
	
	
	@RequestMapping
	public ModelAndView lerCadastros() {
		return new ModelAndView("fechamento");
	}
	
	@RequestMapping(value = "/Tclientes", method = RequestMethod.PUT)
	@ResponseBody
	public long totalClientes() {
		return clientes.count();
	}
	
	@RequestMapping(value = "/Tfuncionarios", method = RequestMethod.PUT)
	@ResponseBody
	public long totalFuncionarios() {
		return funcionarios.count();
	}
	
	@RequestMapping(value = "/Tprodutos", method = RequestMethod.PUT)
	@ResponseBody
	public long totalProdutos() {
		return produtos.count();
	}
	
	@RequestMapping(value = "/Tpedidos", method = RequestMethod.PUT)
	@ResponseBody
	public long totalPedidos() {
		return pedidos.count();
	}
	
	@RequestMapping(value = "/Tvendas", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> totalVendas() {
		return pedidos.findAll();
	}
	
	@RequestMapping(value = "/apagartudo", method = RequestMethod.PUT)
	@ResponseBody
	public String ApagarTudo() {
		pedidos.deleteAll();
		return "ok";
	}
}
