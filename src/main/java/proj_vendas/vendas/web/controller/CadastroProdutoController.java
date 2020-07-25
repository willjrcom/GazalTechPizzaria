package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.TipoProduto;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;
	
	@RequestMapping
	public ModelAndView cadastroProduto() {
		ModelAndView mv = new ModelAndView("cadastroProduto");
		mv.addObject("TipoProduto", TipoProduto.values());
		mv.addObject(new Produto());
		return mv;
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView salvarProduto(@Validated Produto produto, Errors errors, RedirectAttributes atributes) {
		ModelAndView mv = new ModelAndView("cadastroProduto");
		
		if(errors.hasErrors()) {
			return mv;
		}
		
		produtos.save(produto);
		ModelAndView mv2 = new ModelAndView("redirect:/cadastroProduto");
		atributes.addFlashAttribute("mensagem", "Produto cadastrado com sucesso!");
		return mv2;
	}
	
	@RequestMapping("{id}")
	public ModelAndView alterar(@ModelAttribute("id") Produto produto) {
		ModelAndView mv = new ModelAndView("cadastroProduto");
		mv.addObject(produto);
		return mv;
	}
}
