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

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.repository.Clientes;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@RequestMapping
	public ModelAndView CadastroCliente() {
		ModelAndView mv = new ModelAndView("cadastroCliente");
		mv.addObject(new Cliente());
		return mv;
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView salvarCliente(@Validated Cliente cliente, Errors errors, RedirectAttributes atributes) {		
		ModelAndView mv = new ModelAndView("cadastroCliente");
		
		if(errors.hasErrors()) {
			return mv;
		}
		
		clientes.save(cliente);
		ModelAndView mv2 = new ModelAndView("redirect:/cadastroCliente");
		atributes.addFlashAttribute("mensagem", "Cliente cadastrado com sucesso!");
		return mv2;
	}
	
	@RequestMapping(value = "/{id}")
	public ModelAndView alterar(@ModelAttribute("id") Cliente cliente) {
		ModelAndView mv = new ModelAndView("cadastroCliente");
		mv.addObject(cliente);
		return mv;
	}

}