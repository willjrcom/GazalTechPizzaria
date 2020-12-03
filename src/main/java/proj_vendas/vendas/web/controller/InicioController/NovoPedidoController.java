package proj_vendas.vendas.web.controller.InicioController;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogMesa;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogMesas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedido")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dias dias;

	@Autowired
	private Dados dados;

	@Autowired
	private Empresas empresas;

	@Autowired
	private PedidoTemps temps;
	
	@Autowired
	private LogMesas mesas;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@RequestMapping("/**")
	public ModelAndView novoPedido() {
		return new ModelAndView("novoPedido");
	}

	@RequestMapping(value = "/numeroCliente/{celular}")
	@ResponseBody
	public Cliente buscarCliente(@PathVariable String celular) {
		return clientes.findByCelular(celular);
	}

	@RequestMapping(value = "/nomeProduto/{nome}")
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		List<Produto> produto = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, true, "BORDA");// busca apenas
																										// 1 item
		if (produto.size() >= 1) {
			return produto;
		} else {// buscar se esta indisponivel
			List<Produto> produtoIndisponivel = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, false,
					"BORDA");// busca apenas 1 item
			if (produtoIndisponivel.size() != 0) {
				produtoIndisponivel.get(0).setId((long) -1);// codigo -1: nao disponivel
				return produtoIndisponivel;
			}
		}
		return produtos.findByNomeProdutoContainingAndDisponivelAndSetorNot(nome, true, "BORDA");// busca qualquer item
																									// relacionado
	}

	@RequestMapping(value = "/addProduto/{id}")
	@ResponseBody
	public Optional<Produto> adicionarProduto(@PathVariable long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas")
	@ResponseBody
	public List<Produto> mostrarBordas() {
		return produtos.findAllBordas();
	}

	@RequestMapping(value = "/buscarBorda/{id}")
	@ResponseBody
	public Optional<Produto> buscarBorda(@PathVariable Long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> novoPedido(@RequestBody Pedido pedido) {

		LogUsuario usuario = new LogUsuario();
		Dia data = dias.buscarId1(); // buscar tabela dia de acesso
		
		if (pedido.getId() == null) {// se o pedido ja existir
			Dado dado = dados.findByData(data.getDia()); // buscar dia nos dados

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda
			
			if(pedido.getCelular() != null) {//se for cliente cadastrado
				Cliente cliente = clientes.findByCelular(pedido.getCelular());//buscar cliente nos dados
				cliente.setContPedidos(cliente.getContPedidos() + 1);//adicionar contador de pedidos
			}
			if(pedido.getEnvio().equals("MESA")) {
				LogMesa mesa = new LogMesa();
				mesa.setMesa(pedido.getNome());
				mesas.save(mesa);
			}
			dados.save(dado); // autalizar n da comanda

			usuario.setAcao("Criar pedido: " + pedido.getNome());
		}else {
			usuario.setAcao("Atualizar pedido: " + pedido.getNome());
		}
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		
		Date hora = new Date();
		usuario.setUsuario(((UserDetails)principal).getUsername());
		usuario.setData(hora.toString());
		
		usuarios.save(usuario); //salvar logUsuario
		return ResponseEntity.ok(pedidos.save(pedido)); // salvar pedido
	}

	@RequestMapping(value = "/editarPedido/{id}")
	@ResponseBody
	public Optional<Pedido> buscarPedido(@PathVariable Long id) {
		return pedidos.findById(id);
	}

	@RequestMapping(value = "/atualizar")
	@ResponseBody
	public Pedido atualizar(@RequestBody Pedido pedido) {
		Dia data = dias.buscarId1(); // buscar tabela dia de acesso

		Pedido antigo = pedidos.findByNomeAndDataAndStatusNotAndStatusNot(pedido.getNome(), data.getDia(), "FINALIZADO", "EXCLUIDO");
		if (antigo == null) {
			return new Pedido();
		}
		return antigo;
	}
	
	@RequestMapping(value = "/salvarTemp")
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		temps.save(temp);
	}

	@RequestMapping(value = "/excluirPedidosTemp/{comanda}")
	@ResponseBody
	public void excluirPedido(@PathVariable long comanda) {
		List<PedidoTemp> temp = temps.findByComanda(comanda);
		temps.deleteInBatch(temp);
	}

	@RequestMapping(value = "/data")
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}

	@RequestMapping(value = "/empresa")
	@ResponseBody
	public Empresa editar() {
		return empresas.buscarId1();
	}
}
