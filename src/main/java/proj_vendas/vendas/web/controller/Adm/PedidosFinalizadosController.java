package proj_vendas.vendas.web.controller.Adm;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Pedido;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class PedidosFinalizadosController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/pedidosFinalizados")
	public ModelAndView pedidosFinalizados() {
		return new ModelAndView("pedidosFinalizados");
	}
	
	@RequestMapping("/pedidosFinalizados/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), user.getDia(), "FINALIZADO");
	}
}
