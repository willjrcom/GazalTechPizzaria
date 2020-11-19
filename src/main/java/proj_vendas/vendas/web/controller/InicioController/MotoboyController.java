package proj_vendas.vendas.web.controller.InicioController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Pedidos;

@Controller
@RequestMapping("/motoboy")
public class MotoboyController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@RequestMapping
	public ModelAndView motoboy() {
		return new ModelAndView("motoboy");
	}
	
	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndEnvioAndData("PRONTO", "ENTREGA", dia);
	}
	
	@RequestMapping(value = "/funcionarios")
	@ResponseBody
	public List<Funcionario> funcionarios() {
		return funcionarios.findAll();
	}
	
	@RequestMapping(value = "/enviarMotoboy/{id}")
	@ResponseBody
	public Pedido enviarPedido(@ModelAttribute("id") Pedido pedido) {
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Entregar pedido: " + pedido.getNome());
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
				
		pedido.setStatus("MOTOBOY");
		return pedidos.save(pedido);
	}
}
