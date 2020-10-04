package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/receber")
public class ReceberController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Funcionarios funcionarios;

	@Autowired
	private Dias dias;
	
	@Autowired
	private PedidoTemps temps;
	
	@RequestMapping
	public ModelAndView receberEntregas() {
		return new ModelAndView("receber");
	}
	
	@RequestMapping(value = "/todosPedidos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndEnvioAndData("MOTOBOY", "ENTREGA", dia);
	}

	@RequestMapping(value = "/funcionarios", method = RequestMethod.PUT)
	@ResponseBody
	public List<Funcionario> funcionarios() {
		return funcionarios.findAll();
	}
	
	@RequestMapping(value = "/finalizar/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido finalizar(@ModelAttribute("id") Pedido pedido) {
		pedido.setStatus("FINALIZADO");
		PedidoTemp temp = temps.findByComanda(pedido.getComanda());
		temps.deleteById(temp.getId());
		return pedidos.save(pedido);
	}
}
