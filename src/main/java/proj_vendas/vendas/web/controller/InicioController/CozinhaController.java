package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
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
