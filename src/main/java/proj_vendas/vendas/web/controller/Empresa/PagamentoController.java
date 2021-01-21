package proj_vendas.vendas.web.controller.Empresa;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Salario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Salarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class PagamentoController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Salarios salarios;
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;
	
	@GetMapping("/pagamento")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		DecimalFormat decimal = new DecimalFormat("0.00");
		float horaExtra = empresas.findByCodEmpresa(user.getCodEmpresa()).getHoraExtra();
		
		ModelAndView mv = new ModelAndView("pagamento");
		mv.addObject("horaExtra", decimal.format(horaExtra));
		return mv;
	}

	@RequestMapping(value = "/pagamento/todosFuncionarios")
	@ResponseBody
	public List<Funcionario> todos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return funcionarios.findByCodEmpresa(user.getCodEmpresa());
	}
	
	@RequestMapping(value = "/pagamento/salvar")
	@ResponseBody
	public Salario salvar(@RequestBody Salario salario) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		SimpleDateFormat format = new SimpleDateFormat ("hh:mm:ss dd/MM/yyyy");
		
		//log usuario	
		salario.setUsuario(user.getEmail());
		salario.setCodEmpresa(user.getCodEmpresa());
		salario.setLogData(format.format(new Date()).toString());
		
		return salarios.save(salario);
	}
	
	@RequestMapping(value = "/pagamento/buscar/{id}/{data}")
	@ResponseBody
	public List<Salario> buscar(@PathVariable Long id, @PathVariable String data){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return salarios.findByCodEmpresaAndIdFuncionarioAndData(user.getCodEmpresa(), id, data);
	}
}
