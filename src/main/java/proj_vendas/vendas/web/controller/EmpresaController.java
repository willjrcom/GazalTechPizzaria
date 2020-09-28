package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.repository.Empresas;

@Controller
@RequestMapping("/empresa")
public class EmpresaController {
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView ("empresa");
	}
	
	@RequestMapping(value = "/atualizar", method = RequestMethod.PUT)
	@ResponseBody
	public Empresa salvar(@RequestBody Empresa empresa) {
		
		
		if(empresas.buscarId1() == null) {
			return empresas.save(empresa);
		}else {
			Empresa e1 = empresas.buscarId1();
			empresa.setId(e1.getId());
			return empresas.save(empresa);
		}
	}
	
	@RequestMapping(value = "/editar", method = RequestMethod.PUT)
	@ResponseBody
	public Empresa editar() {
		return empresas.buscarId1();
	}
}
