package proj_vendas.vendas.web.controller.Cadastros;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dias dias;

	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping("/**")
	public ModelAndView CadastroCliente() {
		return new ModelAndView("cadastroCliente");
	}
	
	@RequestMapping(value = "/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Cliente buscarCpf(@PathVariable String cpf, @PathVariable long id) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Cliente busca = clientes.findByCodEmpresaAndCpf(user.getCodEmpresa(), cpf);
		
		if(busca != null && id != -2) {
			long cliente = clientes.findById((long)id).get().getId();
			
			if(busca.getId() == cliente) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}

	@RequestMapping(value = "/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Cliente buscarCelular(@PathVariable String celular, @PathVariable long id) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Cliente busca = clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);

		if(busca != null && id != -2) {
			long cliente = clientes.findById((long)id).get().getId();
			
			if(busca.getId() == cliente) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
	
	@RequestMapping(value = "/cadastrar")
	@ResponseBody
	public Cliente cadastrarCliente(@RequestBody Cliente cliente) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		if(cliente.getId() == null) {
			cliente.setDataCadastro(dias.findByCodEmpresa(user.getCodEmpresa()).getDia());
		}
		
		cliente.setCodEmpresa(user.getCodEmpresa());
		
		return clientes.save(cliente);
	}
	
	@RequestMapping(value = "/editarCliente/{id}")
	@ResponseBody
	public Optional<Cliente> buscarCliente(@PathVariable Long id) {
		return clientes.findById(id);
	}
}