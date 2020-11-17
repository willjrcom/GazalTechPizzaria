package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/produtosCadastrados")
public class ProdutosCadastradosController {
	
	@Autowired
	private Produtos produtos;
	
	@RequestMapping
	public ModelAndView lerCadastros() {
		return new ModelAndView("produtosCadastrados");
	}
	
	@RequestMapping(value = "/buscar/{nome}")
	@ResponseBody
	public List<Produto> buscar(@PathVariable String nome) {
		return produtos.findByNomeProdutoContainingOrDescricaoContaining(nome, nome);
	}
	
	@RequestMapping(value = "/excluirProdutos/{id}")
	@ResponseBody
	public String excluirProdutos(@PathVariable long id) {
		produtos.deleteById(id);
		return "ok";
	}
}
