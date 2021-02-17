package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/saidaForno")
public class SaidaFornoController{
	
	@Autowired
	private PedidoTemps temps;

	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView pronto() {
		return new ModelAndView("saidaForno");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		return temps.findByCodEmpresaAndSetor(user.getCodEmpresa(), 1); //mostrar todos
	}
}
