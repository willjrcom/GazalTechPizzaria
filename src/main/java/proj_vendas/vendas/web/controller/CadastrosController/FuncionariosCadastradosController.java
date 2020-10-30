package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.repository.Funcionarios;

@Controller
@RequestMapping("adm")
public class FuncionariosCadastradosController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@GetMapping("/funcionariosCadastrados")
	public ModelAndView lerCadastros() {
		return new ModelAndView("funcionariosCadastrados");
	}
	
	@RequestMapping(value = "/funcionariosCadastrados/buscar/{nome}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Funcionario> buscar(@PathVariable String nome) {
		return funcionarios.findByNomeContainingOrCelularContainingOrCpfContainingOrEmailOrEnderecoRuaContainingOrEnderecoNContainingOrEnderecoBairroContaining(nome, nome, nome, nome, nome, nome, nome);
	}
	
	@RequestMapping(value = "/funcionariosCadastrados/excluirFuncionario/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public String excluirFuncionario(@PathVariable long id) {
		funcionarios.deleteById(id);
		return "ok";
	}
}
