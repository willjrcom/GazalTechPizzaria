package proj_vendas.vendas.web.controller.NovoPedido;

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
import proj_vendas.vendas.model.Cupom;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogMesa;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Cupons;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogMesas;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

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
	private Usuarios usuarios;

	@Autowired
	private Cupons cupons;
	
	@RequestMapping("/**")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);//busca no banco de dados
		
		ModelAndView mv = new ModelAndView("novoPedido");
		mv.addObject("trocoInicial", dado.getTrocoInicio());
		return mv;
	}

	@RequestMapping(value = "/numeroCliente/{celular}")
	@ResponseBody
	public Cliente buscarNumeroCliente(@PathVariable Long celular) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);
	}

	@RequestMapping(value = "/nomeProduto/{nome}")
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		//buscar apenas codigo
		List<Produto> produto = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", true);// busca apenas 1 item
																	
		if (produto.size() >= 1) {
			return produto;
		} else {// buscar se esta indisponivel
			List<Produto> produtoIndisponivel = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", false);// busca produto indisponivel
			if(produtoIndisponivel.size() != 0) {
				produtoIndisponivel.get(0).setId((long) -1);// codigo -1: nao disponivel
				return produtoIndisponivel;
			}
		}
		return produtos.findByCodEmpresaAndNomeProdutoContainingAndSetorNot(user.getCodEmpresa(), nome, "BORDA");
	}

	@RequestMapping(value = "/addProduto/{id}")
	@ResponseBody
	public Optional<Produto> adicionarProduto(@PathVariable long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas")
	@ResponseBody
	public List<Produto> mostrarBordas() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return produtos.findByCodEmpresaAndSetorAndDisponivel(user.getCodEmpresa(), "BORDA", true);
	}

	@RequestMapping(value = "/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> salvarPedido(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		Dia data = dias.findByCodEmpresa(user.getCodEmpresa()); // buscar tabela dia de acesso
		
		pedido.setStatus("PRONTO");
		
		if (pedido.getId() == null) {// se o pedido nao existir
			Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data.getDia()); // buscar dia nos dados

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda
			
			try {
				if(pedido.getCelular() != 0) {//se for cliente cadastrado
					Cliente cliente = clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), pedido.getCelular());//buscar cliente nos dados
					cliente.setContPedidos(cliente.getContPedidos() + 1);//adicionar contador de pedidos
				}
			}catch(Exception e) {}
			
			if(pedido.getEnvio().equals("MESA")) {
				LogMesa mesa = new LogMesa();
				mesa.setMesa(pedido.getNome());
				mesa.setCodEmpresa(user.getCodEmpresa());
				mesas.save(mesa);
			}
			dados.save(dado); // atualizar n da comanda
		}
		
		pedido.setCodEmpresa(user.getCodEmpresa());
		
		return ResponseEntity.ok(pedidos.save(pedido)); // salvar pedido
	}

	@RequestMapping(value = "/editarPedido/{id}")
	@ResponseBody
	public Pedido editarPedido(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return pedidos.findByIdAndCodEmpresa(id, user.getCodEmpresa());
	}

	@RequestMapping(value = "/atualizar")
	@ResponseBody
	public Pedido atualizarPedido(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia(); // buscar tabela dia de acesso
		Pedido antigo = pedidos.findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(user.getCodEmpresa(), dia, pedido.getNome(), "FINALIZADO", "EXCLUIDO");
				
		if (antigo == null) {
			Pedido vazio = new Pedido();
			vazio.setData(dia);
			return vazio;
		}
		return antigo;
	}
	
	@RequestMapping(value = "/salvarTemp")
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		temp.setStatus("COZINHA");
		temp.setCodEmpresa(user.getCodEmpresa());
		temps.save(temp);
	}

	@RequestMapping(value = "/excluirPedidosTemp/{comanda}")
	@ResponseBody
	public void excluirPedidoTemp(@PathVariable long comanda) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndComanda(user.getCodEmpresa(), dia, comanda);
		temps.deleteInBatch(temp);
	}

	@RequestMapping(value = "/data")
	@ResponseBody
	public Dia data() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return dias.findByCodEmpresa(user.getCodEmpresa());
	}

	@RequestMapping(value = "/empresa")
	@ResponseBody
	public Empresa empresa() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return empresas.findByCodEmpresa(user.getCodEmpresa());
	}
	
	
	@RequestMapping("/mostrarCupons")
	@ResponseBody
	public List<Cupom> cupons(){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return cupons.findByCodEmpresa(user.getCodEmpresa());
	}
}
