package proj_vendas.vendas.web.controller.CadastrosController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.repository.Clientes;

@Controller
@RequestMapping("/cadastroCliente")
public class CadastroClienteController {

	@Autowired
	private Clientes clientes;

	@RequestMapping
	public ModelAndView CadastroCliente() {
		ModelAndView mv = new ModelAndView("cadastroCliente");
		return mv;
	}
	
	@RequestMapping(value = "/buscarCpf/{cpf}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente buscarCpf(@PathVariable String cpf) {
		return clientes.findByCpf(cpf);
	}

	@RequestMapping(value = "/buscarCelular/{celular}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente buscarCelular(@PathVariable String celular) {
		return clientes.findByCelular(celular);
	}
	
	@RequestMapping(value = "/cadastrar", method = RequestMethod.PUT, consumes = {"application/json"}, produces = {"application/json"})
	@ResponseBody
	public Cliente cadastrarCliente(@RequestBody Cliente cliente) {
		return clientes.save(cliente);
	}
	
	@RequestMapping(value = "/editar/{id}")
	public ModelAndView editarCadastro(@ModelAttribute("id") Long id){
		return new ModelAndView("cadastroCliente");
	}
	
	@RequestMapping(value = "/atualizarCadastro/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente atualizarCliente(@RequestBody Cliente cliente){
		return clientes.save(cliente);
	}
}