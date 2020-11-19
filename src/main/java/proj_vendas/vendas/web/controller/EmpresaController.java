package proj_vendas.vendas.web.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogUsuarios;

@Controller
@RequestMapping("adm")
public class EmpresaController {
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@GetMapping("/empresa")
	public ModelAndView tela() {
		return new ModelAndView ("empresa");
	}
	
	@RequestMapping(value = "/empresa/atualizar")
	@ResponseBody
	public Empresa salvar(@RequestBody Empresa empresa) {
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Atualizar empresa");
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
				
		if(empresas.buscarId1() == null) {
			return empresas.save(empresa);
		}else {
			Empresa e1 = empresas.buscarId1();
			empresa.setId(e1.getId());
			return empresas.save(empresa);
		}
	}
	
	@RequestMapping(value = "/empresa/editar")
	@ResponseBody
	public Empresa editar() {
		return empresas.buscarId1();
	}
}
