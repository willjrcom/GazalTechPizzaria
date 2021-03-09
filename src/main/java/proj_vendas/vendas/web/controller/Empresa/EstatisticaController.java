package proj_vendas.vendas.web.controller.Empresa;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class EstatisticaController {

	@Autowired
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/estatistica")
	public ModelAndView tela() {
		return new ModelAndView("estatistica");
	}
	
	@RequestMapping(value = "/estatistica/todos")
	@ResponseBody
	public List<Dado> buscarTodos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return dados.findByCodEmpresa(user.getCodEmpresa());
	}
}
