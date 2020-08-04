package proj_vendas.vendas.web.controller.CadastrosController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.TipoCargo;
import proj_vendas.vendas.model.TipoSexo;
import proj_vendas.vendas.repository.Funcionarios;

@Controller
@RequestMapping("/cadastroFuncionario")
public class CadastroFuncionarioController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@RequestMapping
	public ModelAndView CadastroFuncionario() {
		ModelAndView mv = new ModelAndView("cadastroFuncionario");
		mv.addObject("TipoCargo", TipoCargo.values());
		mv.addObject("TipoSexo", TipoSexo.values());
		mv.addObject(new Funcionario());
		return mv;
	}

	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView salvarFuncionario(@Validated Funcionario funcionario, Errors errors, RedirectAttributes atributes) {
		ModelAndView mv = new ModelAndView("redirect:/cadastroFuncionario");
		funcionarios.save(funcionario);
		//*if(errors.hasErrors()) {
			return mv;
		}
		
		
		/*
		ModelAndView mv2 = new ModelAndView("redirect:cadastroFuncionario");
		atributes.addFlashAttribute("mensagem", "Funcionario cadastrado com sucesso!");
		return mv2;
	}*/
	
	@RequestMapping("{id}")
	public ModelAndView alterar(@ModelAttribute("id") Funcionario funcionario) {
		ModelAndView mv = new ModelAndView("cadastroFuncionario");
		mv.addObject(funcionario);
		return mv;
	}
}