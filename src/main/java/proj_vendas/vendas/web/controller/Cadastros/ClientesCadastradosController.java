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

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class ClientesCadastradosController {

	@Autowired
	private Clientes clientes;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;

	@GetMapping("/clientesCadastrados")
	public ModelAndView tela() {
		return new ModelAndView("clientesCadastrados");
	}

	@RequestMapping("/clientesCadastrados/buscar/{nome}/{celular}")
	@ResponseBody
	public List<Cliente> buscar(@PathVariable String nome, @PathVariable Long celular) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return clientes.findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(user.getCodEmpresa(), nome,
				user.getCodEmpresa(), celular);
	}

	@RequestMapping("/clientesCadastrados/excluirCliente/{id}")
	@ResponseBody
	public ResponseEntity<Integer> excluirCliente(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<Cliente> todosClientes = empresa.getCliente();

		for (int i = 0; i < todosClientes.size(); i++) {
			if (todosClientes.get(i).getId() == id) {
				todosClientes.remove(i);
				empresa.setCliente(todosClientes);
				empresas.save(empresa);
				clientes.deleteById(id);
				return ResponseEntity.ok(200);
			}
		}
		return ResponseEntity.noContent().build();
	}
}
