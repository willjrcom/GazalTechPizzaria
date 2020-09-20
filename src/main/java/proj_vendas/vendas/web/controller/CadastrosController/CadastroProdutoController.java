package proj_vendas.vendas.web.controller.CadastrosController;

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

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;
	
	@RequestMapping
	public ModelAndView cadastroProduto() {
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping(value = "/cadastrar", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public Produto cadastrarProduto(@RequestBody Produto produto) {
		return produtos.save(produto);
	}
	
	@RequestMapping(value = "/editar/{id}")
	public ModelAndView editarCadastro(@ModelAttribute("id") Long id){
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping(value = "/editarProduto/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id) {
		return produtos.findById(id);
	}
	
	@RequestMapping(value = "/atualizarCadastro/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Produto atualizarProduto(@RequestBody Produto produto){
		return produtos.save(produto);
	}

	@RequestMapping(value = "/buscarCodigo/{codigo}", method = RequestMethod.PUT)
	@ResponseBody
	public Produto buscarCodigo(@PathVariable String codigo) {
		return produtos.findByCodigoBusca(codigo);
	}
}
