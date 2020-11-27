package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;

@Controller
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping
	public ModelAndView tela() {
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = empresas.buscarId1();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		mv.addObject("empresa", empresa.getNomeEstabelecimento());
		mv.addObject("contato", "Contato: " + empresa.getCelular());
		mv.addObject("usuario", "Usuário conectado: " + ((UserDetails)principal).getUsername());
		return mv;
	}
	
	@RequestMapping(value = "/verificarData/{dia}")
	@ResponseBody
	public Dado alterarData(@PathVariable String dia) {
		return dados.findByData(dia);
	}
	
	@RequestMapping(value = "/acessarData/{dia}")
	@ResponseBody
	public Dia acessarData(@PathVariable String dia) {
		Dia data = dias.buscarId1();
		data.setDia(dia);
		return dias.save(data);
	}
	
	@RequestMapping(value = "/criarData/{dia}")
	@ResponseBody
	public Dado criarData(@PathVariable String dia) {
		
		//alterar a tabela dados
		Dado dado = new Dado();
		dado.setData(dia);
		
		//alterar a tabela dia
		Dia data = dias.buscarId1();
		
		if(data == null) {
			data = new Dia();
		}
		data.setDia(dia);
		
		//salvar dados
		dias.save(data);
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/buscarIdData/{data}")
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		return dados.findByData(data);
	}
	
	@RequestMapping(value = "/troco/{id}")
	@ResponseBody
	public Dado alterarTroco(@RequestBody Dado dado) {
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/mostrarDia")
	@ResponseBody
	public Dia MostrarDia() {
		return dias.buscarId1();
	}
}
