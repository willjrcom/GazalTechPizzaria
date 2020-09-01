package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;

@Controller
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@RequestMapping
	public ModelAndView menu() {
		return new ModelAndView("menu");
	}
	
	@RequestMapping(value = "/verificarData/{dia}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado alterarData(@PathVariable String dia) {
		return dados.findByData(dia);
	}
	
	@RequestMapping(value = "/acessarData/{dia}", method = RequestMethod.PUT)
	@ResponseBody
	public Dia acessarData(@PathVariable String dia) {
		Dia data = dias.buscarId1();
		data.setDia(dia);
		return dias.save(data);
	}
	
	@RequestMapping(value = "/criarData/{dia}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado criarData(@PathVariable String dia) {
		
		//alterar a tabela dados
		Dado dado = new Dado();
		dado.setData(dia);
		
		//alterar a tabela dia
		Dia data = dias.buscarId1();
		data.setDia(dia);
		dias.save(data);
		return dados.save(dado);
	}
}
