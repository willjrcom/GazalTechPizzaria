package proj_vendas.vendas.web.controller.Cadastros;

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

import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Produto;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/f")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping("/cadastroProduto/**")
	public ModelAndView cadastroProduto() {
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping("/cadastroProduto/cadastrar")
	@ResponseBody
	public Produto cadastrarProduto(@RequestBody Produto produto) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		try {
			Conquista conquista = empresa.getConquista();
			if(conquista.isCadProduto() == false) {
				conquista.setCadProduto(true);
				empresa.setConquista(conquista);
			}
		}catch(Exception e) {}
		produto.setCodEmpresa((long)user.getCodEmpresa());
		
		return produtos.save(produto);
	}
	
	@RequestMapping("/cadastroProduto/editarProduto/{id}")
	@ResponseBody
	public ResponseEntity<Produto> buscarProduto(@PathVariable Long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Produto produto = produtos.findById(id).get();
		if(produto.getCodEmpresa() == user.getCodEmpresa()) {
			return ResponseEntity.ok(produto);
		}
		return ResponseEntity.noContent().build();
	}

	@RequestMapping("/cadastroProduto/buscarCodigo/{codigo}/{id}")
	@ResponseBody
	public Produto buscarCodigo(@PathVariable String codigo, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Produto busca = produtos.findByCodEmpresaAndCodigoBusca(user.getCodEmpresa(), codigo);
			
		if(busca != null && id != -2) {
			long produto = produtos.findById((long)id).get().getId();
			
			if(busca.getId() == produto) {
				Produto vazio = new Produto();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
}
