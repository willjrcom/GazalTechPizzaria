package proj_vendas.vendas.web.controller;

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
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Salarios;

@Controller
@RequestMapping("adm")
public class PagamentoController {
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Salarios salarios;
	
	@GetMapping("/pagamento")
	public ModelAndView tela() {
		return new ModelAndView("pagamento");
	}
	
	@RequestMapping(value = "/pagamento/todosFuncionarios")
	@ResponseBody
	public List<Funcionario> todos() {
		return funcionarios.findAll();
	}
	
	@RequestMapping(value = "/pagamento/salvar")
	@ResponseBody
	public Salario salvar(@RequestBody Salario salario) {
		SimpleDateFormat format = new SimpleDateFormat ("hh:mm:ss dd/MM/yyyy");
		//log usuario
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado	
		salario.setUsuario(((UserDetails)principal).getUsername());
		salario.setLogData(format.format(new Date()).toString());
		
		//imprimir
		//ImprimirController imprimir = new ImprimirController();
		//imprimir.imprimirLogFuncionario(salario);
		
		return salarios.save(salario);
	}
	
	@RequestMapping(value = "/pagamento/buscar/{id}/{data}")
	@ResponseBody
	public List<Salario> buscar(@PathVariable Long id, @PathVariable String data){
		return salarios.findByIdFuncionarioAndData(id, data);
	}
}
