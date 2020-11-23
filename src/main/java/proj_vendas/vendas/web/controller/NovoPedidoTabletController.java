package proj_vendas.vendas.web.controller;

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

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.LogMesa;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.LogMesas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedidoTablet")
public class NovoPedidoTabletController{
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@Autowired
	private LogMesas mesas;
	
	@RequestMapping("/**")
	public ModelAndView tela() {
		return new ModelAndView("novoPedidoTablet");
	}
	
	@RequestMapping(value = "/todosProdutos")
	@ResponseBody
	public List<Produto> mostrarTodos(){
		return produtos.findByDisponivelAndSetorNot(true, "BORDA");
	}

	@RequestMapping(value = "/escolher/{setor}")
	@ResponseBody
	public List<Produto> mostraropcao(@PathVariable String setor){
		if(setor.equals("TODOS") == true) {
			return produtos.findByDisponivelAndSetorNot(true, "BORDA");
		}
		return produtos.findBySetorAndDisponivel(setor, true);
	}

	@RequestMapping(value = "/produto/{id}")
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id){
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas")
	@ResponseBody
	public List<Produto> buscarBordas(){
		return produtos.findBySetorAndDisponivel("BORDA", true);
	}
	
	@RequestMapping(value = "/atualizar")
	@ResponseBody
	public Pedido atualizar(@RequestBody Pedido pedido) {
		Dia data = dias.buscarId1(); //buscar tabela dia de acesso
		
		Pedido antigo = pedidos.findByNomeAndDataAndStatusNotAndStatusNot(pedido.getNome(), data.getDia(), "FINALIZADO", "EXCLUIDO");
		if(antigo == null) {
			return new Pedido();
		}
		return antigo;
	}
	
	@RequestMapping(value = "/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> novoPedido(@RequestBody Pedido pedido) {
		System.out.println(pedido.getComanda());
		LogUsuario usuario = new LogUsuario();
		Dia data = dias.buscarId1(); // buscar tabela dia de acesso
		
		if (pedido.getId() == null) {// se o pedido ja existir
			Dado dado = dados.findByData(data.getDia()); // buscar dia nos dados

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda
			dados.save(dado); // atualizar n da comanda

			//log mesa
			LogMesa mesa = new LogMesa();
			mesa.setMesa(pedido.getNome());
			mesas.save(mesa);
			
			usuario.setAcao("Criar pedido: " + pedido.getNome());
		}else {
			usuario.setAcao("Atualizar pedido: " + pedido.getNome());
		}
		System.out.println(pedido.getComanda());
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		
		Date hora = new Date();
		usuario.setUsuario(((UserDetails)principal).getUsername());
		usuario.setData(hora.toString());
		
		usuarios.save(usuario); //salvar logUsuario
		return ResponseEntity.ok(pedidos.save(pedido)); //salvar pedido
	}
}
