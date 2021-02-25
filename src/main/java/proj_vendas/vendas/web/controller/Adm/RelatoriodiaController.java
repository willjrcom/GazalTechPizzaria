package proj_vendas.vendas.web.controller.Adm;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("relatoriodia")
public class RelatoriodiaController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView relatorioDia() {
		return new ModelAndView("relatoriodia");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), user.getDia(), "FINALIZADO");
	}
}
