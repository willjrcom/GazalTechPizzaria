package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/erro")
public class ErroController {
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("erro");
	}
	
	@RequestMapping(value = "/todos")
	@ResponseBody
	public List<Usuario> todos(){
		return usuarios.findByAtivo(true);
	}
}
