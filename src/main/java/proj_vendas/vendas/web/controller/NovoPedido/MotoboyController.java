package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/motoboy")
public class MotoboyController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@Autowired
	private Dados dados;

	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView motoboy() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("motoboy");
		mv.addObject("todosFun", funcionarios.findByCodEmpresa(user.getCodEmpresa()));
		return mv;
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		return pedidos.findByCodEmpresaAndDataAndEnvioAndStatus(user.getCodEmpresa(), dia, "ENTREGA", "PRONTO");
	}
	
	@RequestMapping(value = "/logMotoboys")
	@ResponseBody
	public String logMotoboys() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dados.findByCodEmpresaAndData(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia()).getLogMotoboy();
	}
	
	@RequestMapping(value = "/salvarMotoboys")
	@ResponseBody
	public void salvarMotoboys(@RequestBody Pedido motoboys) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia()); // buscar dia nos dados
		dado.setLogMotoboy(motoboys.getPizzas());
		dados.save(dado);
	}
	
	@RequestMapping(value = "/enviarMotoboy/{id}/{motoboy}")
	@ResponseBody
	public Pedido enviarPedido(@PathVariable long id, @PathVariable String motoboy) {
		Pedido pedido = pedidos.findById((long)id).get();

		pedido.setStatus("MOTOBOY");
		pedido.setMotoboy(motoboy);
		
		return pedidos.save(pedido);
	}
}
