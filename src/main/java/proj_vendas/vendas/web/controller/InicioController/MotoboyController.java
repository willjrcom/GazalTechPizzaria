package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/motoboy")
public class MotoboyController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@RequestMapping
	public ModelAndView motoboy() {
		return new ModelAndView("motoboy");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndEnvioAndData("PRONTO", "ENTREGA", dia);
	}
	
	@RequestMapping(value = "/funcionarios")
	@ResponseBody
	public List<Funcionario> funcionarios() {
		return funcionarios.findAll();
	}
	
	@RequestMapping(value = "/enviarMotoboy/{id}")
	@ResponseBody
	public Pedido enviarPedido(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus("MOTOBOY");
		return pedidos.save(pedido);
	}
}
