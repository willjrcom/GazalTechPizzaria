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

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Funcionarios;
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
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Funcionarios funcionarios;
	
	@RequestMapping
	public ModelAndView finalizar() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("finalizar");
		mv.addObject("todosFun", funcionarios.findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(user.getCodEmpresa(), "ATENDIMENTO", user.getCodEmpresa(), "GERENTE", user.getCodEmpresa(), "ANALISTA"));
		return mv;
	}

	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		return pedidos.findByCodEmpresaAndDataAndEnvioNotAndStatusOrCodEmpresaAndDataAndEnvioAndStatus(user.getCodEmpresa(), dia, "ENTREGA", "PRONTO", user.getCodEmpresa(), dia, "ENTREGA", "MOTOBOY");

	}
	
	@RequestMapping("/dados")
	@ResponseBody
	public Dado salvarDados(@RequestBody Dado pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia());

		if(pedido.getBalcao() == 1) {
			dado.setBalcao(dado.getBalcao() + 1);
		}else if(pedido.getEntrega()== 1){
			dado.setEntrega(dado.getEntrega() + 1);
		}else if(pedido.getMesa() == 1){
			dado.setMesa(dado.getMesa() + 1);
		}else if(pedido.getDrive() == 1){
			dado.setDrive(dado.getDrive() + 1);
		}
		
		dado.setTotalLucro(dado.getTotalLucro() + pedido.getTotalLucro());
		dado.setTotalVendas(dado.getTotalVendas() + pedido.getTotalVendas());
		dado.setTotalPizza(dado.getTotalPizza() + pedido.getTotalPizza());
		dado.setTotalProduto(dado.getTotalProduto() + pedido.getTotalProduto());
		dado.setTotalPedidos(dado.getTotalPedidos() + 1);
		
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/finalizarPedido/{id}/{ac}")
	@ResponseBody
	public Pedido enviarPedido(@PathVariable long id, @PathVariable String ac) {
		Pedido pedido = pedidos.findById((long)id).get();

		pedido.setStatus("FINALIZADO");
		pedido.setAc(ac);
		
		return pedidos.save(pedido);
	}
}
