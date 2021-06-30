package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class VerpedidoController{
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private PedidoTemps temps;

	@Autowired
	private Usuarios usuarios;

	@GetMapping("/verpedido")
	public ModelAndView tela() {
		return new ModelAndView("verpedido");
	}
	
	
	@RequestMapping("/verpedido/excluirPedido/{id}")
	@ResponseBody
	public ResponseEntity<Pedido> excluirPedido(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = pedidos.findById((long)id).get();
		if(pedido.getCodEmpresa() == user.getCodEmpresa()) {
			pedido.setStatus("EXCLUIDO");
			
			List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndComanda(user.getCodEmpresa(), user.getDia(), pedido.getComanda());
			temps.deleteAllInBatch(temp);
			
			return ResponseEntity.ok(pedidos.save(pedido));
		}
		return ResponseEntity.noContent().build();
	}
	
	
	@RequestMapping(value = "/verpedido/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByCodEmpresaAndDataAndStatusNotAndStatusNot(user.getCodEmpresa(), user.getDia(), "FINALIZADO", "EXCLUIDO");
	}
	
	
	@RequestMapping("/verpedido/autenticado")
	@ResponseBody
	public Collection<? extends GrantedAuthority> autenticado() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ((UserDetails)principal).getAuthorities();
	}
}
