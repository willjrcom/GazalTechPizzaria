package proj_vendas.vendas.web.controller.InicioController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.PedidoTemps;

@Controller
@RequestMapping("/status")
public class StatusController{
	
	@Autowired
	private PedidoTemps temps;
	/*
	@Autowired
	private Dias dias;
	*/
	@RequestMapping
	public ModelAndView pronto() {
		return new ModelAndView("status");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		return temps.findAll(); //mostrar todos
		
		/*//mostrar todos do dia
		String dia = dias.buscarId1().getDia();
		return temps.findByDataAndStatusOrDataAndStatus(dia, "COZINHA", dia,"PRONTO");
		*/
	}
}
