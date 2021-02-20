package proj_vendas.vendas.web.controller.Cadastros;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/clientesCadastrados")
public class ClientesCadastradosController {
	
	@Autowired
	private Clientes clientes;
	
	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("clientesCadastrados");
	}
	
	@RequestMapping(value = "/buscar/{nome}/{celular}")
	@ResponseBody
	public List<Cliente> buscar(@PathVariable String nome, @PathVariable Long celular) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		return clientes.findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(user.getCodEmpresa(), nome, user.getCodEmpresa(), celular);
	}
	
	@RequestMapping(value = "/excluirCliente/{id}")
	@ResponseBody
	public ResponseEntity<Integer> excluirCliente(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Cliente cliente = clientes.findById(id).get();
		if(cliente.getCodEmpresa() == user.getCodEmpresa()) {
			clientes.deleteById(id);
			return ResponseEntity.ok(200);
		}
		return ResponseEntity.noContent().build();
	}
}
