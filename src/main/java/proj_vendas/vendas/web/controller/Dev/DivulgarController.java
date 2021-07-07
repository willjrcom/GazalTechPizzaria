package proj_vendas.vendas.web.controller.Dev;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.empresa.Divulgar;
import proj_vendas.vendas.repository.Divulgacoes;

@Controller
@RequestMapping("dev")
public class DivulgarController {
	
	@Autowired
	private Divulgacoes divulgacoes;
	
	@GetMapping("/divulgar")
	public ModelAndView tela() {
		return new ModelAndView("divulgar");
	}

	@RequestMapping(value = "/divulgar/criar")
	@ResponseBody
	public Divulgar criarDivulgacao(@RequestBody Divulgar divulgar) {
		return divulgacoes.save(divulgar);
	}
	
	@RequestMapping(value = "/divulgar/mostrar")
	@ResponseBody
	public Optional<Divulgar> mostrar() {
		return divulgacoes.findById((long)1);
	}
}
