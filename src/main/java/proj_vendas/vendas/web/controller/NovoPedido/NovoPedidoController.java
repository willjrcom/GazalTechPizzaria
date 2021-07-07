package proj_vendas.vendas.web.controller.NovoPedido;

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

import proj_vendas.vendas.model.cadastros.Cliente;
import proj_vendas.vendas.model.cadastros.Cupom;
import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Produto;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.model.empresa.Dado;
import proj_vendas.vendas.model.empresa.Pedido;
import proj_vendas.vendas.model.empresa.PedidoTemp;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dados dados;

	@Autowired
	private Empresas empresas;

	@Autowired
	private PedidoTemps temps;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Funcionarios funcionarios;

	@GetMapping("/novoPedido/**")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("novoPedido");
		mv.addObject("trocoInicial",
				dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia()).getTrocoInicio());
		return mv;
	}

	@RequestMapping("/novoPedido/numeroCliente/{celular}")
	@ResponseBody
	public Cliente buscarNumeroCliente(@PathVariable Long celular) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);
	}

	@RequestMapping("/novoPedido/nomeProduto/{nome}")
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		
		// busca apenas 1 item
		// Buscar por codigo
		List<Produto> list_produtos = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", true);

		// Se existirem produtos disponiveis
		if (list_produtos.size() >= 1) {
			return list_produtos;
		}
		
		// Buscar por indisponivel
		List<Produto> produtoIndisponivel = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", false);
		
		// Se existirem produtos indisponiveis
		if (produtoIndisponivel.size() != 0) {
			produtoIndisponivel.get(0).setId((long) -1);// codigo -1: nao disponivel)
			produtoIndisponivel.get(0).setDescricao("Não disponível em estoque!");
			return produtoIndisponivel;
		}
		
		// Busca por nome
		return produtos.findByCodEmpresaAndNomeContainingAndSetorNot(user.getCodEmpresa(), nome, "BORDA");
	}

	@RequestMapping("/novoPedido/bordas")
	@ResponseBody
	public List<Produto> mostrarBordas() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return produtos.findByCodEmpresaAndSetorAndDisponivel(user.getCodEmpresa(), "BORDA", true);
	}

	@RequestMapping("/novoPedido/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> salvarPedido(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		SimpleDateFormat formatHora = new SimpleDateFormat("dd/MM/yyyy kk:mm");

		pedido.setCodEmpresa(user.getCodEmpresa());
		pedido.setStatus("PRONTO");

		// novo pedido
		if (pedido.getId() == null) {
			// setar hora
			pedido.setData(user.getDia());
			pedido.setHoraPedido(formatHora.format(new Date()));

			// buscar dia nos dados
			Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());

			// salvar o numero do pedido
			pedido.setComanda((long) (dado.getComanda() + 1));

			// incrementar o n da comanda nos dados
			dado.setComanda(dado.getComanda() + 1);
			dados.save(dado);

			// buscar empresa
			Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());

			// ativar conquista
			Conquista conquista = empresa.getConquista();
			liberarConquistas(conquista, empresa);

		}
		// validade
		SimpleDateFormat data = new SimpleDateFormat("yyyy-MM-");
		SimpleDateFormat diaString = new SimpleDateFormat("dd");
		SimpleDateFormat hora = new SimpleDateFormat("kk:mm");
		int diasInt = Integer.parseInt(diaString.format(new Date()));

		// permite 4 dias;
		diasInt += 4;

		if (diasInt < 10)
			pedido.setValidade(data.format(new Date()) + "0" + diasInt + " " + hora.format(new Date()));
		else
			pedido.setValidade(data.format(new Date()) + "" + diasInt + " " + hora.format(new Date()));

		// salvar pedido
		pedidos.save(pedido);

		return ResponseEntity.ok(pedido); // salvar pedido
	}

	@RequestMapping("/novoPedido/editarPedido/{id}")
	@ResponseBody
	public ResponseEntity<Pedido> editarPedido(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = pedidos.findById(id).get();

		if (pedido.getCodEmpresa() == user.getCodEmpresa())
			return ResponseEntity.ok(pedido);

		return ResponseEntity.noContent().build();
	}

	@RequestMapping("/novoPedido/atualizarPedido/{nome}")
	@ResponseBody
	public Pedido atualizarPedido(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		SimpleDateFormat formatData = new SimpleDateFormat("yyyy-MM-dd");
		Pedido pedidoAntigo = pedidos.findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(user.getCodEmpresa(),
				user.getDia(), nome, "FINALIZADO", "EXCLUIDO");

		// necessario enviar a data
		if (pedidoAntigo == null) {
			Pedido vazio = new Pedido();
			vazio.setData(formatData.format(new Date()));
			return vazio;
		}
		return pedidoAntigo;
	}

	@RequestMapping("/novoPedido/salvarTemp")
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		SimpleDateFormat data = new SimpleDateFormat("yyyy-MM-");
		SimpleDateFormat diaString = new SimpleDateFormat("dd");
		SimpleDateFormat hora = new SimpleDateFormat("kk:mm");
		int diasInt = Integer.parseInt(diaString.format(new Date()));

		// permite 1 dias;
		diasInt += 1;

		if (diasInt < 10)
			temp.setValidade(data.format(new Date()) + "0" + diasInt + " " + hora.format(new Date()));
		else
			temp.setValidade(data.format(new Date()) + "" + diasInt + " " + hora.format(new Date()));

		temp.setCodEmpresa(user.getCodEmpresa());
		temp.setData(user.getDia());
		temp.setStatus("COZINHA");

		temps.save(temp);
	}

	@RequestMapping("/novoPedido/excluirPedidosTemp/{comanda}")
	@ResponseBody
	public void excluirPedidoTemp(@PathVariable long comanda) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndComanda(user.getCodEmpresa(), user.getDia(), comanda);
		temps.deleteAllInBatch(temp);
	}

	@RequestMapping("/novoPedido/mostrarCupons")
	@ResponseBody
	public List<Cupom> cupons() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getCupom();
	}

	@RequestMapping("/novoPedido/autoComplete")
	@ResponseBody
	public List<String> autoComplete() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return produtos.nomesProdutos((long) user.getCodEmpresa());
	}

	@RequestMapping("/novoPedido/garcons")
	@ResponseBody
	public List<String> garcons() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return funcionarios.mostrarGarcons(user.getCodEmpresa());
	}

	private void liberarConquistas(Conquista conquista, Empresa empresa) {
		if (conquista.isCadPedido() == false) {
			conquista.setCadPedido(true);
			empresa.setConquista(conquista);
			empresas.save(empresa);
		}
	}

}
