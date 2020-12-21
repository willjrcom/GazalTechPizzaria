package proj_vendas.vendas.web.controller.Cadastros;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class CadastrosController {

	@Autowired
	private Clientes clientes;
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/cadastros")
	public ModelAndView lerCadastros() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("todosCadastros");
		mv.addObject("clientes", clientes.totalClientes(user.getCodEmpresa()));
		mv.addObject("funcionarios", funcionarios.totalFuncionarios(user.getCodEmpresa()));
		mv.addObject("produtos", produtos.totalProdutos(user.getCodEmpresa()));
		return mv;
	}
}
