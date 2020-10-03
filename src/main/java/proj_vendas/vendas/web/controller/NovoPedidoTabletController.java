package proj_vendas.vendas.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedidoTablet")
public class NovoPedidoTabletController{
	
	@Autowired
	private Produtos produtos;
	
	@RequestMapping("/**")
	public ModelAndView tela() {
		return new ModelAndView("novoPedidoTablet");
	}
	
	@RequestMapping(value = "/todosProdutos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostrarTodos(){
		return produtos.findByDisponivel(true);
	}

	@RequestMapping(value = "/escolher/{setor}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostraropcao(@PathVariable String setor){
		if(setor.equals("TODOS") == true) {
			return produtos.findByDisponivel(true);
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
	
}
