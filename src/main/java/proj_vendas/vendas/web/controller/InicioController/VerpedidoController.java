package proj_vendas.vendas.web.controller.InicioController;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/verpedido")
public class VerpedidoController{
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@Autowired
	private PedidoTemps temps;
	
	@RequestMapping
	public ModelAndView verPedido() {
		return new ModelAndView("verpedido");
	}
	
	@RequestMapping(value = "/excluirPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido novoPedido(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus("EXCLUIDO");
		List<PedidoTemp> temp = temps.findByNome(pedido.getNomePedido());
		temps.deleteInBatch(temp);
		return pedidos.save(pedido);
	}
	
	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByDataAndStatusNotAndStatusNot(dia, "FINALIZADO", "EXCLUIDO");
	}
	
	@RequestMapping("/autenticado")
	@ResponseBody
	public Collection<? extends GrantedAuthority> autenticado() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return ((UserDetails)principal).getAuthorities();
		
	}
}
