package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.repository.Funcionarios;

@Controller
@RequestMapping("/pagamento")
public class PagamentoController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@RequestMapping
	public ModelAndView menu() {
		ModelAndView mv = new ModelAndView("pagamento");
		return mv;
	}
	
	@RequestMapping(value = "/todosFuncionarios", method = RequestMethod.PUT)
	@ResponseBody
	public List<Funcionario> todos() {
		return funcionarios.findAll();
	}
}
