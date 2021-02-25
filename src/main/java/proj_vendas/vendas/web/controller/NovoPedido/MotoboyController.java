package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.LogMotoboy;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/motoboy")
public class MotoboyController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Dados dados;

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("motoboy");
		List<Funcionario> fun = funcionarios.findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(user.getCodEmpresa(), "MOTOBOY", user.getCodEmpresa(), "GERENTE", user.getCodEmpresa(), "ANALISTA");

		mv.addObject("todosFun", fun);
		
		if(fun.size() != 0) {
			mv.addObject("btnCadastrar", 0);
		}else {
			mv.addObject("btnCadastrar", 1);
		}
		
		return mv;
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByCodEmpresaAndDataAndEnvioAndStatus(user.getCodEmpresa(), user.getDia(), "ENTREGA", "PRONTO");
	}
	
	
	@RequestMapping(value = "/salvarLogMotoboy")
	@ResponseBody
	public LogMotoboy salvarLogMotoboys(@RequestBody LogMotoboy logMotoboy) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia()); // buscar dia nos dados
		liberarConquistas(dado.getEntrega(), user);
		
		List<LogMotoboy> logs = dado.getLogMotoboy();
		logs.add(logMotoboy);
		dado.setLogMotoboy(logs);
		dados.save(dado);
		return logMotoboy;
	}
	
	
	@RequestMapping(value = "/enviarMotoboy/{id}/{motoboy}")
	@ResponseBody
	public Pedido enviarPedido(@PathVariable long id, @PathVariable String motoboy) {
		Pedido pedido = pedidos.findById((long)id).get();
		pedido.setStatus("MOTOBOY");
		pedido.setMotoboy(motoboy);
		
		return pedidos.save(pedido);
	}
	
	
	private void liberarConquistas(int totalEntregas, Usuario user) {
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Conquista conquista = empresa.getConquista();
		
		conquista.setTotalEntregas(conquista.getTotalEntregas() + 1);
		
		if(totalEntregas >= 500000 && conquista.isE4() == false) {
			conquista.setE4(true);
		}else if(totalEntregas >= 100000 && conquista.isE3() == false) {
			conquista.setE3(true);
		}else if(totalEntregas >= 5000 && conquista.isE2() == false) {
			conquista.setE2(true);
		}else if(totalEntregas >= 100 && conquista.isE1() == false) {
			conquista.setE1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}
