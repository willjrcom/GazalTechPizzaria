package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.PedidoTemps;

@Controller
@RequestMapping("/cozinha")
public class CozinhaController{
	
	@Autowired
	private PedidoTemps temps;
	
	@RequestMapping
	public ModelAndView Cozinha() {
		return new ModelAndView("cozinha");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		return temps.findByStatus("COZINHA"); //mostrar todos temporarios
	}
	
	@RequestMapping(value = "/enviarPedido/{id}")
	@ResponseBody
	public PedidoTemp enviarPedido(@ModelAttribute("id") PedidoTemp pedido) {//falta enviar as outras variaveis
		pedido.setStatus("PRONTO");
		return temps.save(pedido);
	}
	/*
	@RemoteMethod
	public synchronized void init() {
		System.out.println("dwr ativado ----------------");
	}*/
}
