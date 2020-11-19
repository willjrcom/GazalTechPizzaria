package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.LogUsuarios;

@Controller
@RequestMapping("adm")
public class CadastroFuncionarioController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@GetMapping("/cadastroFuncionario/**")
	public ModelAndView CadastroFuncionario() {
		return new ModelAndView("cadastroFuncionario");
	}

	@RequestMapping(value = "/cadastroFuncionario/cadastrar")
	@ResponseBody
	public Funcionario cadastrarCliente(@RequestBody Funcionario funcionario) {
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Cadastrar/atualizar funcionário: " + funcionario.getNome());
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
		return funcionarios.save(funcionario);
	}
		
	@RequestMapping(value = "/cadastroFuncionario/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Funcionario buscarCpf(@PathVariable String cpf, @ModelAttribute("id")Funcionario funcionario) {
		Funcionario busca = funcionarios.findByCpf(cpf);
		
		if(busca != null) {
			if(busca.getId() == funcionario.getId()) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return funcionarios.findByCpf(cpf);
	}
	
	@RequestMapping(value = "/cadastroFuncionario/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Funcionario buscarCelular(@PathVariable String celular, @ModelAttribute("id")Funcionario funcionario) {
		Funcionario busca = funcionarios.findByCelular(celular);
	
		if(busca != null) {
			if(busca.getId() == funcionario.getId()) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return funcionarios.findByCelular(celular);
	}
	
	@RequestMapping(value = "/cadastroFuncionario/editarFuncionario/{id}")
	@ResponseBody
	public Optional<Funcionario> buscarFuncionario(@PathVariable Long id) {
		return funcionarios.findById(id);
	}
}