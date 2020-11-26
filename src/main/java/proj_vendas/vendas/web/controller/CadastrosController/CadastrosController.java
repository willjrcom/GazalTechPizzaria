package proj_vendas.vendas.web.controller.CadastrosController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

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
		return new ModelAndView("todosCadastros");
	}
	
	@RequestMapping(value = "/Tclientes")
	@ResponseBody
	public long totalClientes() {
		return clientes.count();
	}
	
	@RequestMapping(value = "/Tfuncionarios")
	@ResponseBody
	public long totalFuncionarios() {
		return funcionarios.count();
	}
	
	@RequestMapping(value = "/Tprodutos")
	@ResponseBody
	public long totalProdutos() {
		return produtos.count();
	}
}
