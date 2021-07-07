package proj_vendas.vendas.web.controller.Cadastros;

import java.util.List;

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

import proj_vendas.vendas.model.cadastros.Cliente;
import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Endereco;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Enderecos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/f")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;

	@Autowired
	private Enderecos enderecos;

	@GetMapping("/cadastroCliente/**")
	public ModelAndView CadastroCliente() {
		return new ModelAndView("cadastroCliente");
	}

	@RequestMapping("/cadastroCliente/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Cliente buscarCpf(@PathVariable String cpf, @PathVariable long id) {

		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		Cliente busca = clientes.findByCodEmpresaAndCpf(user.getCodEmpresa(), cpf);

		if (busca != null && id != -2) {
			long cliente = clientes.findById((long) id).get().getId();

			if (busca.getId() == cliente) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}

	@RequestMapping("/cadastroCliente/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Cliente buscarCelular(@PathVariable Long celular, @PathVariable long id) {

		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Cliente busca = clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);

		if (busca != null && id != -2) {
			long cliente = clientes.findById((long) id).get().getId();

			if (busca.getId() == cliente) {
				Cliente vazio = new Cliente();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}

	@RequestMapping("/cadastroCliente/cadastrar")
	@ResponseBody
	public Cliente cadastrarCliente(@RequestBody Cliente cliente) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());

		// set codEmpresa do cliente
		cliente.setCodEmpresa(user.getCodEmpresa());
		Endereco endereco = cliente.getEndereco();
		endereco.setCodEmpresa(user.getCodEmpresa());
		cliente.setEndereco(endereco);

		if (cliente.getId() == null) {
			cliente.setDataCadastro(user.getDia());
			liberarConquistas(clientes.findByCodEmpresa(user.getCodEmpresa()).size(), user.getCodEmpresa());

			List<Cliente> todosClientes = empresa.getCliente();
			todosClientes.add(cliente);
			empresa.setCliente(todosClientes);
			empresas.save(empresa);
		} else {
			clientes.save(cliente);
		}

		return cliente;
	}

	@RequestMapping("/cadastroCliente/editarCliente/{id}")
	@ResponseBody
	public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {
		Cliente cliente = clientes.findById(id).get();
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		if (cliente.getCodEmpresa() == user.getCodEmpresa()) {
			return ResponseEntity.ok(cliente);
		}
		return ResponseEntity.noContent().build();
	}

	@RequestMapping("/cadastroCliente/enderecos")
	@ResponseBody
	public List<String> buscarEndereco() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return enderecos.buscarEnderecos(user.getCodEmpresa());
	}

	private void liberarConquistas(int cadastros, Long codEmpresa) {
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		Conquista conquista = empresa.getConquista();

		if (conquista.getTotalClientes() < clientes.findByCodEmpresa(codEmpresa).size()) {
			conquista.setTotalClientes(clientes.findByCodEmpresa(codEmpresa).size());
		}
		if (cadastros > 10000 && conquista.isC4() == false) {
			conquista.setC4(true);
		} else if (cadastros > 5000 && conquista.isC3() == false) {
			conquista.setC3(true);
		} else if (cadastros > 1000 && conquista.isC2() == false) {
			conquista.setC2(true);
		} else if (cadastros > 100 && conquista.isC1() == false) {
			conquista.setC1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}