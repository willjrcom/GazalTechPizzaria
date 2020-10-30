package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.repository.Clientes;

@Controller
@RequestMapping("/clientesCadastrados")
public class ClientesCadastradosController {
	
	@Autowired
	private Clientes clientes;
	
	@RequestMapping
	public ModelAndView lerCadastros() {
		return new ModelAndView("clientesCadastrados");
	}
	
	@RequestMapping(value = "/buscar/{nome}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Cliente> buscar(@PathVariable String nome) {
		return clientes.findByNomeContainingOrCelularContainingOrEnderecoRuaContainingOrEnderecoNContainingOrEnderecoBairroContainingOrEnderecoCidadeContaining(nome,nome,nome,nome,nome,nome);
	}
	
	
	@RequestMapping(value = "/clientesCadastrados/excluirCliente/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public String excluirCliente(@PathVariable long id) {
		clientes.deleteById(id);
		return "ok";
	}
}
