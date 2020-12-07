package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class PedidosExcluidosController {
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/pedidosExcluidos")
	public ModelAndView lerCadastros() {
		return new ModelAndView("pedidosExcluidos");
	}

	@RequestMapping(value = "/pedidosExcluidos/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		return pedidos.findByCodEmpresaAndStatusAndData(user.getCodEmpresa(), "EXCLUIDO", dia);
	}
}
