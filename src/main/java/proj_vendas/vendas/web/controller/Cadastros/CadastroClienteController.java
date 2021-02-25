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
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

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
			cliente.setDataCadastro(user.getDia());
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
		
		if(conquista.getTotalClientes() < clientes.findByCodEmpresa(codEmpresa).size()) {
			conquista.setTotalClientes(clientes.findByCodEmpresa(codEmpresa).size());
		}
		if(cadastros > 10000 && conquista.isC4() == false) {
			conquista.setC4(true);
		}else if(cadastros > 5000 && conquista.isC3() == false) {
			conquista.setC3(true);
		}else if(cadastros > 1000 && conquista.isC2() == false) {
			conquista.setC2(true);
		}else if(cadastros > 100 && conquista.isC1() == false) {
			conquista.setC1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}