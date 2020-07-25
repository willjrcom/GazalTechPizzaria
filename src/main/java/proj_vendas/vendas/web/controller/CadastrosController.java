package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/cadastros")
public class CadastrosController {

	@Autowired
	private Clientes clientes;
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Produtos produtos;

	@RequestMapping
	public ModelAndView lerCadastros() {
		List<Cliente> todosClientes = clientes.findAll();
		List<Funcionario> todosFuncionarios = funcionarios.findAll();
		List<Produto> todosProdutos = produtos.findAll();
		ModelAndView mv = new ModelAndView("todosCadastros");
		mv.addObject("clientes", todosClientes);
		mv.addObject("funcionarios", todosFuncionarios);
		mv.addObject("produtos", todosProdutos);
		return mv;
	}
}
