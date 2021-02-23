package proj_vendas.vendas.web.controller.Cadastros;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
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
	
	@Autowired
	private Empresas empresas;
	
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
	public Cliente buscarCelular(@PathVariable Long celular, @PathVariable long id) {

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
			liberarConquistas(clientes.findByCodEmpresa(user.getCodEmpresa()).size(), user.getCodEmpresa());
		}
		
		cliente.setCodEmpresa(user.getCodEmpresa());
		return clientes.save(cliente);
	}
	
	@RequestMapping(value = "/editarCliente/{id}")
	@ResponseBody
	public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {
		Cliente cliente = clientes.findById(id).get();
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		if(cliente.getCodEmpresa() == user.getCodEmpresa()) {
			return ResponseEntity.ok(cliente);
		}
		return ResponseEntity.noContent().build();
	}
	
	private void liberarConquistas(int cadastros, int codEmpresa) {
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		Conquista conquista = empresa.getConquista();
		boolean conquistou = false;
		if(cadastros > 10000 && conquista.isC10000() == false) {
			conquista.setC10000(true);
			conquistou = true;
		}else if(cadastros > 5000 && conquista.isC5000() == false) {
			conquista.setC5000(true);
			conquistou = true;
		}else if(cadastros > 1000 && conquista.isC1000() == false) {
			conquista.setC1000(true);
			conquistou = true;
		}else if(cadastros > 100 && conquista.isC100() == false) {
			conquista.setC100(true);
			conquistou = true;
		}
		if(conquistou == true) {
			empresa.setConquista(conquista);
			empresas.save(empresa);
		}
	}
}