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

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.repository.Funcionarios;

@Controller
@RequestMapping("/cadastroFuncionario")
public class CadastroFuncionarioController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@RequestMapping
	public ModelAndView CadastroFuncionario() {
		ModelAndView mv = new ModelAndView("cadastroFuncionario");
		return mv;
	}

	@RequestMapping(value = "/cadastrar", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public Funcionario cadastrarCliente(@RequestBody Funcionario funcionario) {
		return funcionarios.save(funcionario);
	}
		
	@RequestMapping(value = "/buscarCpf/{cpf}", method = RequestMethod.PUT)
	@ResponseBody
	public Funcionario buscarCpf(@PathVariable String cpf) {
		return funcionarios.findByCpf(cpf);
	}
	
	@RequestMapping(value = "/buscarCelular/{celular}", method = RequestMethod.PUT)
	@ResponseBody
	public Funcionario buscarCelular(@PathVariable String celular) {
		return funcionarios.findByCelular(celular);
	}
	

	@RequestMapping(value = "/editar/{id}")
	public ModelAndView editarCadastro(@ModelAttribute("id") Long id){
		return new ModelAndView("cadastroFuncionario");
	}
	
	@RequestMapping(value = "/editarFuncionario/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Funcionario> buscarFuncionario(@PathVariable Long id) {
		return funcionarios.findById(id);
	}
	
	@RequestMapping(value = "/atualizarCadastro/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Funcionario atualizarFuncionario(@RequestBody Funcionario funcionario){
		return funcionarios.save(funcionario);
	}
}