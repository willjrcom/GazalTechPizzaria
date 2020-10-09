package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/finalizar")
public class FinalizarController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private PedidoTemps temps;
	
	@RequestMapping
	public ModelAndView finalizar() {
		ModelAndView mv = new ModelAndView("finalizar");
		return mv;
	}

	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndDataAndEnvioNotOrStatusAndDataAndEnvio("PRONTO", dia, "ENTREGA", "MOTOBOY", dia, "ENTREGA");
	}

	@RequestMapping(value = "/finalizarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido enviarPedido(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus("FINALIZADO");
		Dia data = dias.buscarId1(); //buscar tabela dia de acesso
		PedidoTemp temp = temps.findByComandaAndData(pedido.getComanda(), data.getDia());
		temps.deleteById(temp.getId());
		return pedidos.save(pedido);
	}
}
