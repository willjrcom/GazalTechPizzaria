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
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/finalizar")
public class FinalizarController {
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("finalizar");
		List<Funcionario> fun = funcionarios.findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(user.getCodEmpresa(), "ATENDIMENTO", user.getCodEmpresa(), "GERENTE", user.getCodEmpresa(), "ANALISTA");

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
		return pedidos.findByCodEmpresaAndDataAndEnvioNotAndStatusOrCodEmpresaAndDataAndEnvioAndStatus(user.getCodEmpresa(), user.getDia(), "ENTREGA", "PRONTO", user.getCodEmpresa(), user.getDia(), "ENTREGA", "MOTOBOY");

	}
	
	@RequestMapping("/dados/{id}")
	@ResponseBody
	public Dado salvarDados(@RequestBody Dado pedidoDados, @PathVariable Long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = null;
		try{
			pedido = pedidos.findById(id).get();
		}catch(Exception e) {}
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());

		if(pedidoDados.getBalcao() == 1) {
			dado.setBalcao(dado.getBalcao() + 1);
			dado.setVenda_balcao(dado.getVenda_balcao() + pedido.getTotal());
		}else if(pedidoDados.getEntrega() == 1){
			dado.setEntrega(dado.getEntrega() + 1);
			dado.setVenda_entrega(dado.getVenda_entrega() + pedido.getTotal());
			dado.setTaxa_entrega(dado.getTaxa_entrega() + pedido.getTaxa());
		}else if(pedidoDados.getMesa() == 1){
			dado.setMesa(dado.getMesa() + 1);
			dado.setVenda_mesa(dado.getVenda_mesa() + pedido.getTotal());
		}else if(pedidoDados.getDrive() == 1){
			dado.setDrive(dado.getDrive() + 1);
			dado.setVenda_drive(dado.getVenda_drive() + pedido.getTotal());
		}
		
		if(dado.getClientes() == null) {
			dado.setClientes(limitaString("PEDIDO", 20) + "     TOTAL");
		}
		
		if(pedidoDados.getEntrega() == 1){
			dado.setClientes(dado.getClientes() + "#$" + limitaString(pedido.getNome(), 20) + "     R$ " + (pedido.getTotal() + pedido.getTaxa()));
		}else {
			dado.setClientes(dado.getClientes() + "#$" + limitaString(pedido.getNome(), 20) + "     R$ " + pedido.getTotal());
		}
		
		dado.setTotalLucro(dado.getTotalLucro() + pedidoDados.getTotalLucro());
		dado.setTotalVendas(dado.getTotalVendas() + pedidoDados.getTotalVendas());
		dado.setTotalPizza(dado.getTotalPizza() + pedidoDados.getTotalPizza());
		dado.setTotalProduto(dado.getTotalProduto() + pedidoDados.getTotalProduto());
		dado.setTotalPedidos(dado.getTotalPedidos() + 1);

		liberarConquistas(dado.getTotalVendas(), user);
		
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
	

	public String limitaString(String texto, int limite) {
		
		String vazio = "                              ";
		if(texto.length() < limite) texto += vazio;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite);
	}
	
	
	private void liberarConquistas(float totalVendas, Usuario user) {
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Conquista conquista = empresa.getConquista();
		
		if(conquista.getTotalVendas() < totalVendas) {
			conquista.setTotalVendas(totalVendas);
		}
		if(totalVendas >= 20000 && conquista.isV4() == false) {
			conquista.setV4(true);
		}else if(totalVendas >= 10000 && conquista.isV3() == false) {
			conquista.setV3(true);
		}else if(totalVendas >= 5000 && conquista.isV2() == false) {
			conquista.setV2(true);
		}else if(totalVendas >= 1000 && conquista.isV1() == false) {
			conquista.setV1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}
