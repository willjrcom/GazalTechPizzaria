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
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.LogMesas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

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
	private LogUsuarios logUsuarios;
	
	@Autowired
	private LogMesas mesas;
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping("/**")
	public ModelAndView tela() {
		return new ModelAndView("novoPedidoTablet");
	}
	
	@RequestMapping(value = "/todosProdutos")
	@ResponseBody
	public List<Produto> mostrarTodos(){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return produtos.findByCodEmpresaAndSetorNotAndDisponivel(user.getCodEmpresa(), "BORDA", true);
	}

	@RequestMapping(value = "/escolher/{setor}")
	@ResponseBody
	public List<Produto> mostraropcao(@PathVariable String setor){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		if(setor.equals("TODOS") == true) {
			return produtos.findByCodEmpresaAndSetorNotAndDisponivel(user.getCodEmpresa(), "BORDA", true);
		}
		return produtos.findByCodEmpresaAndSetorAndDisponivel(user.getCodEmpresa(), setor, true);
	}

	@RequestMapping(value = "/produto/{id}")
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id){
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas")
	@ResponseBody
	public List<Produto> buscarBordas(){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return produtos.findByCodEmpresaAndSetorAndDisponivel(user.getCodEmpresa(), "BORDA", true);
	}
	
	@RequestMapping(value = "/atualizar")
	@ResponseBody
	public Pedido atualizar(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dia data = dias.findByCodEmpresa(user.getCodEmpresa()); //buscar tabela dia de acesso
		
		Pedido antigo = pedidos.findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(user.getCodEmpresa(), data.getDia(), pedido.getNome(), "FINALIZADO", "EXCLUIDO");
		
		if(antigo == null) {
			return new Pedido();
		}
		return antigo;
	}
	
	@RequestMapping(value = "/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> novoPedido(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		LogUsuario usuario = new LogUsuario();
		Dia data = dias.findByCodEmpresa(user.getCodEmpresa()); // buscar tabela dia de acesso
		
		if (pedido.getId() == null) {// se o pedido ja existir
			Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data.getDia()); // buscar dia nos dados

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda
			dados.save(dado); // atualizar n da comanda

			//log mesa
			LogMesa mesa = new LogMesa();
			mesa.setMesa(pedido.getNome());
			mesa.setCodEmpresa(user.getCodEmpresa());
			mesas.save(mesa);
			
			usuario.setAcao("Criar pedido: " + pedido.getNome());
		}else {
			usuario.setAcao("Atualizar pedido: " + pedido.getNome());
		}
		
		Date hora = new Date();
		
		usuario.setUsuario(user.getEmail());
		usuario.setData(hora.toString());
		usuario.setCodEmpresa(user.getCodEmpresa());
		logUsuarios.save(usuario); //salvar logUsuario

		pedido.setCodEmpresa(user.getCodEmpresa());
		return ResponseEntity.ok(pedidos.save(pedido)); //salvar pedido
	}
}
