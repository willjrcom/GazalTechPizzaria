package proj_vendas.vendas.web.controller.Cadastros;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/produtosCadastrados")
public class ProdutosCadastradosController {
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView lerCadastros() {
		return new ModelAndView("produtosCadastrados");
	}
	
	@RequestMapping(value = "/buscar/{nome}")
	@ResponseBody
	public List<Produto> buscar(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return produtos.findByCodEmpresaAndNomeProdutoContainingOrCodEmpresaAndDescricaoContaining(user.getCodEmpresa(), nome, user.getCodEmpresa(), nome);
	}
	
	@RequestMapping(value = "/excluirProdutos/{id}")
	@ResponseBody
	public String excluirProdutos(@PathVariable long id) {
		produtos.deleteById(id);
		return "ok";
	}
}
