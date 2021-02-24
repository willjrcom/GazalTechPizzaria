package proj_vendas.vendas.web.controller.Empresa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class MetasController {

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/metas")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		Conquista conquista = empresas.findByCodEmpresa(user.getCodEmpresa()).getConquista();
		ModelAndView mv = new ModelAndView("metas");

		//vendas
		mv.addObject("v1000", conquista.isV1000());
		mv.addObject("v5000", conquista.isV5000());
		mv.addObject("v10000", conquista.isV10000());
		mv.addObject("v20000", conquista.isV20000());
		
		//cadastros
		mv.addObject("cadPedido", conquista.isCadPedido());
		mv.addObject("cadFuncionario", conquista.isCadFuncionario());
		mv.addObject("cadEmpresa", conquista.isCadEmpresa());
		mv.addObject("cadProduto", conquista.isCadProduto());
		
		//entregas
		mv.addObject("e100", conquista.isE100());
		mv.addObject("e5000", conquista.isE5000());
		mv.addObject("e100000", conquista.isE100000());
		mv.addObject("e500000", conquista.isE500000());
		
		//clientes
		mv.addObject("c100", conquista.isC100());
		mv.addObject("c1000", conquista.isC1000());
		mv.addObject("c5000", conquista.isC5000());
		mv.addObject("c10000", conquista.isC10000());
		
		//trabalhado
		mv.addObject("t30", conquista.isT30());
		mv.addObject("t180", conquista.isT180());
		mv.addObject("t365", conquista.isT365());
		mv.addObject("t730", conquista.isT730());
		
		return mv;
	}
	
	
	@RequestMapping(value = "/metas/todas")
	@ResponseBody
	public Conquista dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getConquista();
	}
}
