package proj_vendas.vendas.web.controller.Cadastros;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class FuncionariosCadastradosController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/funcionariosCadastrados")
	public ModelAndView lerCadastros() {
		return new ModelAndView("funcionariosCadastrados");
	}
	
	@RequestMapping(value = "/funcionariosCadastrados/buscar/{nome}")
	@ResponseBody
	public List<Funcionario> buscar(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return funcionarios.findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(user.getCodEmpresa(), nome, user.getCodEmpresa(), nome);
	}
	
	@RequestMapping(value = "/funcionariosCadastrados/excluirFuncionario/{id}")
	@ResponseBody
	public String excluirFuncionario(@PathVariable long id) {
		funcionarios.deleteById(id);
		return "ok";
	}
	

	@RequestMapping(value = "/funcionariosCadastrados/situacao/{id}/{obs}")
	@ResponseBody
	public ResponseEntity<?> situacao(@PathVariable long id, @PathVariable String obs) {
		Funcionario funcionario = funcionarios.findById(id).get();

		if(funcionario.isSituacao() == true) {
			funcionario.setSituacao(false);
		}else {
			funcionario.setSituacao(true);
		}
		
		if(!obs.equals("contratar")) {
			funcionario.setObs(obs);
		}
		
		funcionarios.save(funcionario);
		return ResponseEntity.ok("200");
	}
}
