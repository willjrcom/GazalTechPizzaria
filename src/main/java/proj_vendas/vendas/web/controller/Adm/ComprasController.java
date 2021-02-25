package proj_vendas.vendas.web.controller.Adm;

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

import proj_vendas.vendas.model.Compra;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class ComprasController {

	@Autowired
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping("/compras")
	public ModelAndView tela() {
		return new ModelAndView("compras");
	}
	
	@RequestMapping(value = "/compras/dados")
	@ResponseBody
	public List<Compra> dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
		return dado.getCompra();
	}
	
	@RequestMapping("/compras/comprar")
	@ResponseBody
	public Compra comprar(@RequestBody Compra compra) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
		List<Compra> compras = dado.getCompra();
		compras.add(compra);
		dado.setCompra(compras);
		dados.save(dado);
		return compra;
	}
}
