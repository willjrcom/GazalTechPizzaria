package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.repository.Dados;

@Controller
@RequestMapping("adm")
public class ComprasController {

	@Autowired
	private Dados dados;
	
	@GetMapping("/compras")
	public ModelAndView tela() {
		return new ModelAndView("compras");
	}
	
	@RequestMapping("/compras/comprar")
	@ResponseBody
	public Dado comprar(@RequestBody Dado dado) {
		return dados.save(dado);
	}
}
