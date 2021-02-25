package proj_vendas.vendas.web.controller.Empresa;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cupom;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class CupomController {

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/cupom")
	public ModelAndView tela() {
		return new ModelAndView("cupom");
	}
	
	@RequestMapping(value = "/cupom/todosCupons")
	@ResponseBody
	public List<Cupom> dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getCupom();
	}
	
	@RequestMapping("/cupom/criar")
	@ResponseBody
	public Empresa criar(@RequestBody Cupom cupom) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		try {
			cupom.setValidade(cupom.getValidade().split("T")[0]);
		}catch(Exception e) {
			cupom.setValidade(cupom.getValidade());
		}
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<Cupom> cupons = empresa.getCupom();
		cupons.add(cupom);
		empresa.setCupom(cupons);
		return empresas.save(empresa);
	}
	
	
	@RequestMapping("/cupom/excluir/{id}")
	@ResponseBody
	public ResponseEntity<?> excluir(@PathVariable Long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<Cupom> cupom = empresa.getCupom();
		
		for(int i = 0; i < cupom.size(); i++) {
			if(cupom.get(i).getId() == id) {
				return ResponseEntity.ok(200);
			}
		}
		return ResponseEntity.noContent().build();
	}
}
