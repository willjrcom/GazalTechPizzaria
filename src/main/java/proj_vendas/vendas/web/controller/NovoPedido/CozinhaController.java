package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/cozinha")
public class CozinhaController{
	
	@Autowired
	private PedidoTemps temps;
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView Cozinha() {
		return new ModelAndView("cozinha");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return temps.findByCodEmpresaAndStatus(user.getCodEmpresa(), "COZINHA"); //mostrar todos temporarios
	}
	
	@RequestMapping(value = "/enviarPedido/{id}")
	@ResponseBody
	public PedidoTemp enviarPedido(@PathVariable long id) {//falta enviar as outras variaveis

		PedidoTemp pedido = temps.findById((long)id).get();
		pedido.setStatus("PRONTO");
		return temps.save(pedido);
	}
	/*
	@RemoteMethod
	public synchronized void init() {
		System.out.println("dwr ativado ----------------");
	}*/
}
