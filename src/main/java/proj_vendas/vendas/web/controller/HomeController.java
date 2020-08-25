package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.DiaAtual;
import proj_vendas.vendas.repository.DiaAtuais;

@Controller
public class HomeController {
	
	@Autowired
	private DiaAtuais diaAtuais;
	
	@GetMapping({"/index"})
	public ModelAndView home() {
		ModelAndView mv = new ModelAndView("index");
		return mv;
	}
	
	@RequestMapping(value = "/data", method = RequestMethod.PUT)
	@ResponseBody
	public DiaAtual editarPedido(@RequestBody DiaAtual data) {
		return diaAtuais.save(data);
	}
}
