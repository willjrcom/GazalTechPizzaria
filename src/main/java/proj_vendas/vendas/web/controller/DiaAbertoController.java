package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class DiaAbertoController {
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping("/diaAberto")
	public ModelAndView tela() {
		return new ModelAndView("diaAberto");
	}
	
	@RequestMapping(value = "/diaAberto/todosDias")
	@ResponseBody
	public ResponseEntity<List<Dado>> todos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return ResponseEntity.ok(dados.findByCodEmpresaAndTrocoFinalOrCodEmpresaAndTrocoInicio(user.getCodEmpresa(), 0, user.getCodEmpresa(), 0));
	}
}
