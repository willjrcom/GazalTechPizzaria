package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.repository.Clientes;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@RequestMapping("/**")
	public ModelAndView CadastroCliente() {
		return new ModelAndView("cadastroCliente");
	}
	
	@RequestMapping(value = "/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Cliente buscarCpf(@PathVariable String cpf, @ModelAttribute("id")Cliente cliente) {
		Cliente busca = clientes.findByCpf(cpf);
		
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
	public Cliente buscarCelular(@PathVariable String celular, @ModelAttribute("id")Cliente cliente) {
		Cliente busca = clientes.findByCelular(celular);

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
		return clientes.save(cliente);
	}
	
	@RequestMapping(value = "/editarCliente/{id}")
	@ResponseBody
	public Optional<Cliente> buscarCliente(@PathVariable Long id) {
		return clientes.findById(id);
	}
}