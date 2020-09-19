package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Salario;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Salarios;

@Controller
@RequestMapping("/pagamento")
public class PagamentoController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Salarios salarios;
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
	
	@RequestMapping(value = "/salvar", method = RequestMethod.PUT)
	@ResponseBody
	public Salario salvar(@RequestBody Salario salario) {
		return salarios.save(salario);
	}
	
	@RequestMapping(value = "/buscar/{id}/{data}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Salario> buscar(@PathVariable Long id, @PathVariable String data){
		return salarios.findByIdFuncionarioAndData(id, data);
	}
}
