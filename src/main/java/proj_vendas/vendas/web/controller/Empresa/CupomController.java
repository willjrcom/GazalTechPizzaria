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
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Cupons;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class CupomController {

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Cupons cupons;
	
	@GetMapping("/cupom")
	public ModelAndView tela() {
		return new ModelAndView("cupom");
	}
	
	@RequestMapping(value = "/cupom/todosCupons")
	@ResponseBody
	public List<Cupom> dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		return cupons.findByCodEmpresa(user.getCodEmpresa());
	}
	
	@RequestMapping("/cupom/criar")
	@ResponseBody
	public Cupom criar(@RequestBody Cupom cupom) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		try {
			cupom.setValidade(cupom.getValidade().split("T")[0]);
		}catch(Exception e) {
			cupom.setValidade(cupom.getValidade());
		}
		
		cupom.setCodEmpresa(user.getCodEmpresa());
		return cupons.save(cupom);
	}
	
	
	@RequestMapping("/cupom/excluir/{id}")
	@ResponseBody
	public ResponseEntity<?> excluir(@PathVariable Long id) {
		cupons.deleteById(id);
		return ResponseEntity.ok(200);
	}
}
