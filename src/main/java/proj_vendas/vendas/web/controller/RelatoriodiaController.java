package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("adm")
public class RelatoriodiaController {
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@GetMapping("/relatoriodia")
	public ModelAndView relatorioDia() {
		return new ModelAndView("relatoriodia");
	}
	
	@RequestMapping(value = "/relatoriodia/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia);
	}
}
