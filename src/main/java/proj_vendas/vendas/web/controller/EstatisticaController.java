package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.repository.Dados;

@Controller
@RequestMapping("/estatistica")
public class EstatisticaController {

	@Autowired
	private Dados dados;
	
	@RequestMapping
	public ModelAndView home() {
		return new ModelAndView("estatistica");
	}
	
	@RequestMapping(value = "/todos", method = RequestMethod.PUT)
	@ResponseBody
	public List<Dado> buscarTodos() {
		return dados.findAll();
	}
}
