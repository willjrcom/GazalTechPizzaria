package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;
	
	@RequestMapping("/**")
	public ModelAndView cadastroProduto() {
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping(value = "/cadastrar")
	@ResponseBody
	public Produto cadastrarProduto(@RequestBody Produto produto) {
		return produtos.save(produto);
	}
	
	@RequestMapping(value = "/editarProduto/{id}")
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/buscarCodigo/{codigo}/{id}")
	@ResponseBody
	public Produto buscarCodigo(@PathVariable String codigo, @ModelAttribute("id")Produto produto) {
		Produto busca = produtos.findByCodigoBusca(codigo);
		
		if(busca != null) {
			if(busca.getId() == produto.getId()) {
				Produto vazio = new Produto();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return produtos.findByCodigoBusca(codigo);
	}
}
