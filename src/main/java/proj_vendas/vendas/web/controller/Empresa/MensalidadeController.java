package proj_vendas.vendas.web.controller.Empresa;

import java.io.IOException;
import java.util.List;

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
import proj_vendas.vendas.model.Pagamento;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class MensalidadeController {
	
	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/mensalidade")
	public ModelAndView tela() throws IOException {
		return new ModelAndView ("mensalidade");
	}
	
	@RequestMapping(value = "/mensalidade/mensalidades")
	@ResponseBody
	public List<Pagamento> todos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getPagamento();
	}
	
	@RequestMapping(value = "/mensalidade/cadastrar")
	@ResponseBody
	public Empresa cadastrar(@RequestBody Pagamento pagamento) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		
		List<Pagamento> mensalidades = empresa.getPagamento();
		pagamento.setCodEmpresa(user.getCodEmpresa());
		mensalidades.add(pagamento);
		empresa.setPagamento(mensalidades);
		return empresas.save(empresa);
	}
}
