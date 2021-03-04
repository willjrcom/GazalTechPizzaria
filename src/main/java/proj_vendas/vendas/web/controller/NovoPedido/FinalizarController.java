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

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.LogMesa;
import proj_vendas.vendas.model.LogPizza;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
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

	@Autowired
	private Clientes clientes;

	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("finalizar");
		List<Funcionario> fun = funcionarios.findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(
				user.getCodEmpresa(), "ATENDIMENTO", user.getCodEmpresa(), "GERENTE", user.getCodEmpresa(), "ANALISTA");

		mv.addObject("todosFun", fun);

		if (fun.size() != 0) {
			mv.addObject("btnCadastrar", 0);
		} else {
			mv.addObject("btnCadastrar", 1);
		}

		return mv;
	}

	@RequestMapping(value = "/todosPedidos")
	@ResponseBody
	public List<Pedido> todosPedidos() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByCodEmpresaAndDataAndEnvioNotAndStatusOrCodEmpresaAndDataAndEnvioAndStatus(
				user.getCodEmpresa(), user.getDia(), "ENTREGA", "PRONTO", user.getCodEmpresa(), user.getDia(),
				"ENTREGA", "MOTOBOY");

	}

	@RequestMapping("/dados/{id}")
	@ResponseBody
	public Dado salvarDados(@RequestBody Dado pedidoDados, @PathVariable Long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = null;
		try {
			pedido = pedidos.findById(id).get();
		} catch (Exception e) {
		}
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());

		if (pedidoDados.getBalcao() == 1) {
			dado.setBalcao(dado.getBalcao() + 1);
			dado.setVenda_balcao(dado.getVenda_balcao() + pedido.getTotal());
		} else if (pedidoDados.getEntrega() == 1) {
			dado.setEntrega(dado.getEntrega() + 1);
			dado.setVenda_entrega(dado.getVenda_entrega() + pedido.getTotal());
			dado.setTaxa_entrega(dado.getTaxa_entrega() + pedido.getTaxa());
		} else if (pedidoDados.getMesa() == 1) {
			dado.setMesa(dado.getMesa() + 1);
			dado.setVenda_mesa(dado.getVenda_mesa() + pedido.getTotal());
		} else if (pedidoDados.getDrive() == 1) {
			dado.setDrive(dado.getDrive() + 1);
			dado.setVenda_drive(dado.getVenda_drive() + pedido.getTotal());
		}

		if (dado.getClientes() == null) {
			dado.setClientes(limitaString("PEDIDO", 20) + "     TOTAL");
		}

		dado.setClientes(dado.getClientes() + "#$" + limitaString(pedido.getNome(), 20) + "     " + pedido.getModoPagamento());

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
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = pedidos.findById((long) id).get();

		pedido.setStatus("FINALIZADO");
		pedido.setAc(ac);

		// se for cliente cadastrado
		if (pedido.getEnvio().equals("ENTREGA"))
			aumentarContPedidosCliente(user.getCodEmpresa(), pedido.getCelular());

		if (pedido.getEnvio().equals("MESA"))
			if (pedido.getNome().startsWith("m", 0) || pedido.getNome().startsWith("M", 0))
				top10Mesas(pedido.getNome());

		return pedidos.save(pedido);
	}

	private void aumentarContPedidosCliente(int codEmpresa, Long celular) {
		Cliente cliente = clientes.findByCodEmpresaAndCelular(codEmpresa, celular);// buscar cliente nos dados
		cliente.setContPedidos(cliente.getContPedidos() + 1);// adicionar contador de pedidos
		clientes.save(cliente);
	}

	@RequestMapping(value = "/top10Pizzas")
	@ResponseBody
	public void top10Pizzas(@RequestBody List<String> pizzas) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<LogPizza> top10Pizza = empresa.getLogPizza();
		int cont = 0;

		// para cada nova pizza
		for (int j = 0; j < pizzas.size(); j++) {
			cont = 0;
			// para cada pizza salva
			for (int i = 0; i < top10Pizza.size(); i++) {
				if (top10Pizza.get(i).getPizza().equals(pizzas.get(j))) {
					top10Pizza.get(i).setContador(top10Pizza.get(i).getContador() + 1);
					cont = 1;
				}
			}

			// se nao encontrar a pizza
			if (cont == 0) {
				LogPizza pizza = new LogPizza();
				pizza.setPizza(pizzas.get(j));
				pizza.setContador(1);
				top10Pizza.add(pizza);
			}
		}
		empresa.setLogPizza(top10Pizza);
		empresas.save(empresa);
	}

	private void top10Mesas(String mesas) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<LogMesa> top10Mesa = empresa.getLogMesa();

		for (int i = 0; i < top10Mesa.size(); i++) {
			if (top10Mesa.get(i).getMesa().equals(mesas)) {
				top10Mesa.get(i).setContador(top10Mesa.get(i).getContador() + 1);
				LogMesa mesa = new LogMesa();
				mesa.setMesa(mesas);
				mesa.setContador(1);
				top10Mesa.add(mesa);
				empresa.setLogMesa(top10Mesa);
				empresas.save(empresa);
				break;
			}
		}
	}

	public String limitaString(String texto, int limite) {

		String vazio = "                              ";
		if (texto.length() < limite)
			texto += vazio;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite);
	}

	private void liberarConquistas(float totalVendas, Usuario user) {
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Conquista conquista = empresa.getConquista();

		if (conquista.getTotalVendas() < totalVendas) {
			conquista.setTotalVendas(totalVendas);
		}
		if (totalVendas >= 20000 && conquista.isV4() == false) {
			conquista.setV4(true);
		} else if (totalVendas >= 10000 && conquista.isV3() == false) {
			conquista.setV3(true);
		} else if (totalVendas >= 5000 && conquista.isV2() == false) {
			conquista.setV2(true);
		} else if (totalVendas >= 1000 && conquista.isV1() == false) {
			conquista.setV1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}
