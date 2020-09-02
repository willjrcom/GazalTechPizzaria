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
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
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

	@Autowired
	private Dias dias;
	
	@Autowired
	private Dados dados;
	
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
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia).size();
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
	
	@RequestMapping(value = "/baixartudo", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> baixarTudo() {
		return pedidos.findAll();
	}
	
	@RequestMapping(value = "/buscarIdData/{data}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		return dados.findByData(data);
	}
	
	@RequestMapping(value = "/finalizar/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado finalizarCaixa(@RequestBody Dado dado) {
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/data", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
}
