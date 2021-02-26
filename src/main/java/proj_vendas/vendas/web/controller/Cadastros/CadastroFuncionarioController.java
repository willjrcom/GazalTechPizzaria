package proj_vendas.vendas.web.controller.Cadastros;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class CadastroFuncionarioController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/cadastroFuncionario/**")
	public ModelAndView CadastroFuncionario() {
		return new ModelAndView("cadastroFuncionario");
	}

	@RequestMapping(value = "/cadastroFuncionario/cadastrar")
	@ResponseBody
	public Funcionario cadastrarCliente(@RequestBody Funcionario funcionario) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		try {
			Conquista conquista = empresa.getConquista();
			if(conquista.isCadFuncionario() == false) {
				conquista.setCadFuncionario(true);
				empresa.setConquista(conquista);
			}
		}catch(Exception e) {}
		funcionario.setCodEmpresa(user.getCodEmpresa());
		
		if(funcionario.getId() != null) {
			Funcionario funcionarioCadastrado = funcionarios.findById(funcionario.getId()).get();
			funcionario.setPagamento(funcionarioCadastrado.getPagamento());
		}
		return funcionarios.save(funcionario);
	}
		
	@RequestMapping(value = "/cadastroFuncionario/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Funcionario buscarCpf(@PathVariable String cpf, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Funcionario busca = funcionarios.findByCodEmpresaAndCpf(user.getCodEmpresa(), cpf);
		
		if(busca != null && id != -2) {
			long funcionario = funcionarios.findById(id).get().getId();
			
			if(busca.getId() == funcionario) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
	
	@RequestMapping(value = "/cadastroFuncionario/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Funcionario buscarCelular(@PathVariable String celular, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Funcionario busca = funcionarios.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);
	
		if(busca != null && id != -2) {
			long funcionario = funcionarios.findById(id).get().getId();
			
			if(busca.getId() == funcionario) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
	
	@RequestMapping(value = "/cadastroFuncionario/editarFuncionario/{id}")
	@ResponseBody
	public ResponseEntity<Funcionario> buscarFuncionario(@PathVariable Long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Funcionario funcionario = funcionarios.findById(id).get();
		if(funcionario.getCodEmpresa() == user.getCodEmpresa()) {
			return ResponseEntity.ok(funcionario);
		}
		return ResponseEntity.noContent().build();
	}
}