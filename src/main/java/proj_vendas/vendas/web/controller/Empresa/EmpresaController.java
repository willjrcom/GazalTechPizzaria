package proj_vendas.vendas.web.controller.Empresa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class EmpresaController {

	@Autowired
	private Empresas empresas;

	@Autowired
	private Usuarios usuarios;

	@GetMapping("/empresa")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("empresa");
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}

	@RequestMapping(value = "/empresa/atualizar")
	@ResponseBody
	public Usuario salvar(@RequestBody Empresa empresa) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		empresa.setCodEmpresa(user.getCodEmpresa());

		try {
			Conquista conquista = empresa.getConquista();
			if (conquista.isCadEmpresa() == false) {
				conquista.setCadEmpresa(true);
				empresa.setConquista(conquista);
			}
		} catch (Exception e) {
		}

		user.setEmpresa(empresa);
		return usuarios.save(user);
	}

	@RequestMapping(value = "/empresa/editar")
	@ResponseBody
	public Empresa editar() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return empresas.findByCodEmpresa(user.getCodEmpresa());
	}
}
