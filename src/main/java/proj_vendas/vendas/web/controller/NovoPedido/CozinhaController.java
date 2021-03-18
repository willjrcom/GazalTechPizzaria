package proj_vendas.vendas.web.controller.NovoPedido;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class CozinhaController{
	
	@Autowired
	private PedidoTemps temps;
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping("/cozinha")
	public ModelAndView Cozinha() {
		return new ModelAndView("cozinha");
	}
	
	@RequestMapping("/cozinha/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return temps.findByCodEmpresaAndStatus(user.getCodEmpresa(), "COZINHA"); //mostrar todos temporarios
	}
	
	@RequestMapping("/cozinha/enviarPedido/{id}")
	@ResponseBody
	public PedidoTemp enviarPedido(@PathVariable long id) {//falta enviar as outras variaveis
		SimpleDateFormat data = new SimpleDateFormat("yyyy-MM-dd kk");
		SimpleDateFormat minutoString = new SimpleDateFormat ("mm");
		int minutoInt = Integer.parseInt(minutoString.format(new Date()));
		
		//pedido temp do cliente
		PedidoTemp pedido = temps.findById(id).get();
		
		//permite 4 minutos;
		minutoInt += 4;
		
		if(minutoInt < 10)
			pedido.setValidade(data.format(new Date()) + ":0" + minutoInt);
		else
			pedido.setValidade(data.format(new Date()) + ":" + minutoInt);
		
		pedido.setStatus("PRONTO");
		return temps.save(pedido);
	}
	/*
	@RemoteMethod
	public synchronized void init() {
		System.out.println("dwr ativado ----------------");
	}*/
}
