package proj_vendas.vendas.web.controller.Empresa;

import java.text.DecimalFormat;

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
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Conquista conquista = empresas.findByCodEmpresa(user.getCodEmpresa()).getConquista();
		ModelAndView mv = new ModelAndView("metas");

		DecimalFormat decimal = new DecimalFormat("0.00");

		mv.addObject("maiorTotalVendas", decimal.format(conquista.getTotalVendas()));
		mv.addObject("totalEntregas", conquista.getTotalEntregas());
		mv.addObject("totalDias", conquista.getTotalDias());
		mv.addObject("totalClientes", conquista.getTotalClientes());

		// vendas
		mv.addObject("v1000", conquista.isV1());
		mv.addObject("v5000", conquista.isV2());
		mv.addObject("v10000", conquista.isV3());
		mv.addObject("v20000", conquista.isV4());

		// cadastros
		mv.addObject("cadPedido", conquista.isCadPedido());
		mv.addObject("cadFuncionario", conquista.isCadFuncionario());
		mv.addObject("cadEmpresa", conquista.isCadEmpresa());
		mv.addObject("cadProduto", conquista.isCadProduto());

		// entregas
		mv.addObject("e100", conquista.isE1());
		mv.addObject("e5000", conquista.isE2());
		mv.addObject("e100000", conquista.isE3());
		mv.addObject("e500000", conquista.isE4());

		// clientes
		mv.addObject("c100", conquista.isC1());
		mv.addObject("c1000", conquista.isC2());
		mv.addObject("c5000", conquista.isC3());
		mv.addObject("c10000", conquista.isC4());

		// trabalhado
		mv.addObject("t30", conquista.isT1());
		mv.addObject("t180", conquista.isT2());
		mv.addObject("t365", conquista.isT3());
		mv.addObject("t730", conquista.isT4());

		// permissao
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}

	@RequestMapping(value = "/metas/todas")
	@ResponseBody
	public Conquista dados() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getConquista();
	}
}
