package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.repository.Dados;

@Controller
@RequestMapping("adm")
public class EstatisticaController {

	@Autowired
	private Dados dados;
	
	@GetMapping("/estatistica")
	public ModelAndView tela() {
		return new ModelAndView("estatistica");
	}
	
	@RequestMapping(value = "/estatistica/todos")
	@ResponseBody
	public List<Dado> buscarTodos() {
		return dados.findAll();
	}
}
