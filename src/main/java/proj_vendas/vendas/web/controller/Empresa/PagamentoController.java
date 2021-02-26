package proj_vendas.vendas.web.controller.Empresa;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
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

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Pagamento;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class PagamentoController {
	
	@Autowired
	private Funcionarios funcionarios;
	
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
	

	@RequestMapping(value = "/pagamento/empresa")
	@ResponseBody
	public Empresa empresa() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa());
	}
	
	
	@RequestMapping(value = "/pagamento/todosFuncionarios")
	@ResponseBody
	public List<Funcionario> todos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return funcionarios.findByCodEmpresa(user.getCodEmpresa());
	}
	
	@RequestMapping(value = "/pagamento/salvar/{id}")
	@ResponseBody
	public ResponseEntity<Pagamento> salvar(@RequestBody Pagamento pagamento, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		SimpleDateFormat format = new SimpleDateFormat ("hh:mm:ss dd/MM/yyyy");
		
		//log usuario	
		pagamento.setUsuario(user.getEmail());
		pagamento.setLogData(format.format(new Date()).toString());
		
		List<Funcionario> funcionario = funcionarios.findByCodEmpresa(user.getCodEmpresa());
		for(int i = 0; i < funcionario.size(); i++) {
			if(funcionario.get(i).getId() == id) {
				List<Pagamento> todosPagamentos = funcionario.get(i).getPagamento();
				todosPagamentos.add(pagamento);
				funcionario.get(i).setPagamento(todosPagamentos);
				funcionarios.save(funcionario.get(i));
				return ResponseEntity.ok(pagamento);
			}
		}
		
		return ResponseEntity.badRequest().build();
	}
	
	
	@RequestMapping(value = "/pagamento/buscar/{id}/{data}")
	@ResponseBody
	public List<Pagamento> buscar(@PathVariable Long id, @PathVariable String data){
		List<Pagamento> pagamento = funcionarios.findById(id).get().getPagamento();
		
		if(pagamento != null) {
			for(int j = 0; j < pagamento.size(); j++) {
				if(!pagamento.get(j).getData().equals(data)) {
					pagamento.remove(j);
				}
			}
			return pagamento;
		}else {
			pagamento = null;
			return pagamento;
		}
	}
}
