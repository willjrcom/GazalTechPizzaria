package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.Date;
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
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.LogUsuarios;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dias dias;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@RequestMapping("/**")
	public ModelAndView CadastroCliente() {
		return new ModelAndView("cadastroCliente");
	}
	
	@RequestMapping(value = "/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Cliente buscarCpf(@PathVariable String cpf, @PathVariable long id) {
		Cliente busca = clientes.findByCpf(cpf);
		Cliente cliente = clientes.findById(id).get();
		
		if(busca != null) {
			if(busca.getId() == cliente.getId()) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return clientes.findByCpf(cpf);
	}

	@RequestMapping(value = "/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Cliente buscarCelular(@PathVariable String celular, @PathVariable long id) {
		Cliente busca = clientes.findByCelular(celular);
		Cliente cliente = clientes.findById(id).get();

		if(busca != null) {
			if(busca.getId() == cliente.getId()) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return clientes.findByCelular(celular);
	}
	
	@RequestMapping(value = "/cadastrar")
	@ResponseBody
	public Cliente cadastrarCliente(@RequestBody Cliente cliente) {
		if(cliente.getId() == null) {
			cliente.setDataCadastro(dias.buscarId1().getDia());
		}
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Cadastrar/atualizar cliente: " + cliente.getNome());
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
		return clientes.save(cliente);
	}
	
	@RequestMapping(value = "/editarCliente/{id}")
	@ResponseBody
	public Optional<Cliente> buscarCliente(@PathVariable Long id) {
		return clientes.findById(id);
	}
}