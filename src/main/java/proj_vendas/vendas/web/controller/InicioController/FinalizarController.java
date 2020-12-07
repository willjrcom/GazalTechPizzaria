package proj_vendas.vendas.web.controller.InicioController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/finalizar")
public class FinalizarController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private LogUsuarios logUsuarios;

	@Autowired
	private Usuarios usuarios;

	@RequestMapping
	public ModelAndView finalizar() {
		return new ModelAndView("finalizar");
	}

	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		return pedidos.findByCodEmpresaAndStatusAndDataAndEnvioNotOrCodEmpresaAndStatusAndDataAndEnvio(user.getCodEmpresa(), "PRONTO", dia, "ENTREGA", user.getCodEmpresa(), "MOTOBOY", dia, "ENTREGA");
	}

	@RequestMapping(value = "/finalizarPedido/{id}/{ac}")
	@ResponseBody
	public Pedido enviarPedido(@PathVariable long id, @PathVariable String ac) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Pedido pedido = pedidos.findById((long)id).get();
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();

		log.setUsuario(user.getEmail());
		log.setAcao("Finalizar pedido: " + pedido.getNome());
		log.setData(hora.toString());
		log.setCodEmpresa(user.getCodEmpresa());
		
		logUsuarios.save(log); //salvar logUsuario
				
		pedido.setStatus("FINALIZADO");
		pedido.setAc(ac);
		return pedidos.save(pedido);
	}
}
