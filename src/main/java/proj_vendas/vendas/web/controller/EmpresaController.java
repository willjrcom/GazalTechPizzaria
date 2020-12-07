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
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class EmpresaController {
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private LogUsuarios logUsuarios;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/empresa")
	public ModelAndView tela() {
		return new ModelAndView ("empresa");
	}
	
	@RequestMapping(value = "/empresa/atualizar")
	@ResponseBody
	public Empresa salvar(@RequestBody Empresa empresa) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		
		log.setCodEmpresa(user.getCodEmpresa());
		log.setUsuario(user.getEmail());
		log.setAcao("Atualizar empresa");
		log.setData(hora.toString());
		
		logUsuarios.save(log); //salvar logUsuario
				
		if(empresas.findByCodEmpresa(user.getCodEmpresa()) == null) {
			empresa.setCodEmpresa(user.getCodEmpresa());
			return empresas.save(empresa);
		}else {
			Empresa e1 = empresas.findByCodEmpresa(user.getCodEmpresa());
			empresa.setId(e1.getId());
			return empresas.save(empresa);
		}
	}
	
	@RequestMapping(value = "/empresa/editar")
	@ResponseBody
	public Empresa editar() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return empresas.findByCodEmpresa(user.getCodEmpresa());
	}
}
